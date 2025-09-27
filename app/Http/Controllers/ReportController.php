<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\News; // نموذج الأخبار الجديد
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http; // تم استخدامه لنداء API
// تمت إزالة استخدام Auth لأنه لم يعد مطلوبًا بعد حذف التحقق من تسجيل الدخول.

class ReportController extends Controller
{
    // === هام جداً: يجب تغيير هذه القيمة إلى ID موظف صالح وموجود في جدول employees ===
    // هذا لحل خطأ المفتاح الخارجي (FOREIGN KEY constraint) عند إضافة الخبر.
    // يرجى التحقق من جدول employees واختيار ID موظف موجود فعليًا (مثل 5 أو 10 أو غير ذلك).
    private const DEFAULT_VERIFIER_ID = 2; 
    private const DEFAULT_VERIFIER_NAME = 'المُحقق الافتراضي';

    /**
     * عرض جميع البلاغات (لوحة التحكم الإدارية)
     */
    public function index()
    {
        $reports = Report::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'reports' => $reports
        ]);
    }

    /**
     * حفظ بلاغ جديد من المستخدم
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:500',
                'news_link' => 'nullable|url|max:500',
                'description' => 'required|string|max:2000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'البيانات غير صالحة',
                    'redirect_to_contact' => false
                ], 422);
            }

            $data = $validator->validated();

            // التحقق من التكرار
            $existing = Report::where('title', $data['title'])
                ->when($data['news_link'] ?? null, function ($query, $link) {
                    return $query->orWhere('news_link', $link);
                })
                ->exists();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'تم الإبلاغ عن هذا الخبر مسبقًا. شكرًا لك!',
                    'redirect_to_contact' => false
                ], 409);
            }

            // جمع معلومات الجهاز
            $deviceInfo = $this->getDeviceInfo($request);

            // حفظ البلاغ
            $report = Report::create(array_merge($data, [
                // تأكد أن 'pending' قيمة صالحة لعمود status في جدول reports
                'status' => 'pending',
                'ip_address' => $deviceInfo['ip'],
                'user_agent' => $deviceInfo['user_agent'],
                'device_info' => $deviceInfo['device'],
                'browser_info' => $deviceInfo['browser'],
                'os_info' => $deviceInfo['os'],
            ]));

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال بلاغك بنجاح! سيقوم فريق التحقق بمراجعته.'
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Report submission error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'عذرًا، حدث خطأ في الخادم. يُرجى المحاولة لاحقًا أو التواصل مع الدعم.',
                'redirect_to_contact' => true
            ], 500);
        }
    }

    /**
     * تحديث حالة البلاغ (من لوحة التحكم)
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            // التحقق من صحة المدخلات
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:verified,rejected',
                'title' => 'required|string|max:500',
                'description' => 'required|string|max:2000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'البيانات غير صالحة'
                ], 422);
            }

            // ** 1. تم إزالة التحقق من تسجيل الدخول بناءً على طلبك **
            // يتم استخدام موظف نظام افتراضي لتجنب فشل قيود المفتاح الخارجي
            $employeeId = self::DEFAULT_VERIFIER_ID; 
            $employeeName = self::DEFAULT_VERIFIER_NAME; 

            // ----------------------------------------------------

            $report = Report::findOrFail($id);

            // تحديث البلاغ
            $report->update([
                'status' => $request->status,
                'title' => $request->title,
                'description' => $request->description,
            ]);

            // إذا كان البلاغ "صحيح" (verified)، أضفه كخبر رسمي
            if ($request->status === 'verified') {
                $this->addVerifiedReportAsNews($report, $employeeId, $employeeName);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة البلاغ بنجاح.',
                'report' => $report
            ]);

        } catch (\Exception $e) {
            // نستخدم Server Error للكشف عن المشكلة
            \Log::error('Update report status error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * إضافة بلاغ مُحقَّق كخبر رسمي في جدول الأخبار
     * تم تعديل الدالة لتقبل ID واسم الموظف
     */
    private function addVerifiedReportAsNews(Report $report, $employeeId, $employeeName)
    {
        try {
            // توليد التضمين (Embedding) باستخدام نموذج Gemini AI
            $embedding = $this->generateEmbedding($report->title . ' ' . $report->description);

            News::create([
                'title' => $report->title,
                'description' => $report->description,
                'url' => $report->news_link ?? null,
                'status' => 1, // منشور
                'embedding' => $embedding, // قد تكون null في حالة فشل الاتصال بـ API
                'author' => $employeeName, // اسم الموظف الافتراضي/الحقيقي
                'employee_id' => $employeeId // ID الموظف الذي يجب أن يكون صالحًا
            ]);

        } catch (\Exception $e) {
            \Log::warning('Failed to add verified report as news: ' . $e->getMessage());
            
            // في حالة فشل أي شيء (بما في ذلك التضمين)، نُضيف الخبر بدون embedding
            // ونحتفظ بـ ID واسم الموظف
            News::create([
                'title' => $report->title,
                'description' => $report->description,
                'url' => $report->news_link ?? null,
                'status' => 1,
                'embedding' => null,
                'author' => $employeeName,
                'employee_id' => $employeeId
            ]);
        }
    }

    /**
     * توليد تضمين نصي باستخدام خدمة Gemini API
     * ملاحظة: يتطلب وجود GEMINI_API_KEY في ملف .env
     */
    private function generateEmbedding(string $text): ?string
    {
        $apiKey = env('GEMINI_API_KEY');
        if (empty($apiKey)) {
            \Log::warning('GEMINI_API_KEY is missing in .env. Cannot generate embedding.');
            return null;
        }

        // استخدام نموذج التضمين القياسي
        $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={$apiKey}";
        
        try {
            // تنفيذ الطلب إلى Gemini API
            $response = Http::post($apiUrl, [
                'model' => 'text-embedding-004',
                'content' => [
                    'parts' => [
                        ['text' => $text]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // ** تم تصحيح خطأ بناء الجملة هنا **
                $embeddingVector = null;
                if (isset($data['embedding'][0]['values'])) {
                    $embeddingVector = $data['embedding'][0]['values'];
                }
                // ------------------------------------

                if ($embeddingVector) {
                    // التضمين هو array of floats، نحوله إلى JSON string ليتم حفظه في DB
                    return json_encode($embeddingVector);
                }
            }
            
            // تسجيل خطأ في حالة فشل استجابة API
            \Log::error('Gemini Embedding failed: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            // تسجيل خطأ في حالة فشل الاتصال بالخدمة
            \Log::error('Gemini API call failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * استخراج معلومات الجهاز من طلب HTTP
     */
    private function getDeviceInfo(Request $request)
    {
        $userAgent = $request->userAgent() ?? '';
        $ipAddress = $request->ip();

        // كشف نظام التشغيل
        $os = 'Unknown';
        if (strpos($userAgent, 'Windows') !== false) $os = 'Windows';
        elseif (strpos($userAgent, 'Mac') !== false) $os = 'macOS';
        elseif (strpos($userAgent, 'Linux') !== false) $os = 'Linux';
        elseif (strpos($userAgent, 'Android') !== false) $os = 'Android';
        elseif (strpos($userAgent, 'iPhone') !== false || strpos($userAgent, 'iPad') !== false) $os = 'iOS';

        // كشف المتصفح
        $browser = 'Unknown';
        if (strpos($userAgent, 'Chrome') !== false) $browser = 'Chrome';
        elseif (strpos($userAgent, 'Firefox') !== false) $browser = 'Firefox';
        elseif (strpos($userAgent, 'Safari') !== false) $browser = 'Safari';
        elseif (strpos($userAgent, 'Edge') !== false) $browser = 'Edge';
        elseif (strpos($userAgent, 'Opera') !== false || strpos($userAgent, 'OPR') !== false) $browser = 'Opera';

        // تحديد نوع الجهاز
        $device = 'Desktop';
        if (strpos($userAgent, 'Mobile') !== false || strpos($userAgent, 'Android') !== false || strpos($userAgent, 'iPhone') !== false) {
            $device = 'Mobile';
        } elseif (strpos($userAgent, 'Tablet') !== false || strpos($userAgent, 'iPad') !== false) {
            $device = 'Tablet';
        }

        return [
            'ip' => $ipAddress,
            'user_agent' => $userAgent,
            'device' => $device,
            'browser' => $browser,
            'os' => $os,
        ];
    }
}
