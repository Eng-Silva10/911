<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

class SadikController extends Controller
{
    // دالة مساعدة لإضافة CORS headers
    private function addCorsHeaders()
    {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');
        header('Access-Control-Allow-Credentials: true');
    }

     // تسجيل دخول الموظف
    public function login(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            // بما أنك تستخدم GET، يتم جلب البيانات من query
            $employee_id = $request->query('employee_id');
            $password = $request->query('password');
            
            if (!$employee_id || !$password) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ رقم الموظف وكلمة المرور مطلوبان'
                ], 400);
            }
            
            // البحث عن الموظف باستخدام employee_id أو email
            $employee = DB::table('employees')
                            ->where('employee_id', $employee_id)
                            ->orWhere('email', $employee_id)
                            ->first();
            
            // 1. التحقق من وجود الموظف
            // 2. التحقق من كلمة المرور المشفرة (Hash::check)
            if ($employee && Hash::check($password, $employee->password)) {
                
                // تسجيل عملية تسجيل الدخول
                DB::table('login_logs')->insert([
                    'employee_id' => $employee->employee_id,
                    'ip_address' => $request->ip(),
                    'success' => true,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                
                return response()->json([
                    'success' => true,
                    'employee' => $employee,
                    'message' => '✅ تم تسجيل الدخول بنجاح'
                ]);
            }
            
            // تسجيل فشل تسجيل الدخول (سواء لم يتم العثور على الموظف أو كلمة المرور خاطئة)
            DB::table('login_logs')->insert([
                'employee_id' => $employee_id,
                'ip_address' => $request->ip(),
                'success' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => '❌ بيانات الدخول غير صحيحة'
            ], 401);
            
        } catch (\Exception $e) {
            // ** تم تعديل رسالة الخطأ هنا **
            // لا يجب أن نُعيد رسالة Bcrypt للمستخدم، بل رسالة فشل تسجيل دخول عامة
            if (strpos($e->getMessage(), 'Bcrypt') !== false) {
                 return response()->json([
                    'success' => false,
                    'message' => '❌ بيانات الدخول غير صحيحة (خطأ في التشفير الداخلي)'
                ], 500);
            }

            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في تسجيل الدخول: ' . $e->getMessage()
            ], 500);
        }
    }

    // تسجيل خروج الموظف
    public function logout()
    {
        $this->addCorsHeaders();
        
        // لا يوجد منطق فعلي للخروج (لأنك تستخدم localStorage في الواجهة الأمامية)
        // إذا كنت تستخدم JWT أو Sessions، يجب وضع منطق الخروج هنا
        
        return response()->json([
            'success' => true,
            'message' => '👋 تم تسجيل الخروج'
        ]);
    }

    // ==================== إدارة الأخبار ====================
    
    // إضافة خبر جديد مع توليد Embedding تلقائي
    public function addNews(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            // التحقق من البيانات المطلوبة
            $requiredFields = ['title', 'description', 'employee_id'];
            foreach ($requiredFields as $field) {
                if (!$request->has($field)) {
                    return response()->json([
                        'success' => false,
                        'message' => "❌ الحقل {$field} مطلوب"
                    ], 400);
                }
            }
            
            $title = $request->title;
            $description = $request->description;
            $employee_id = $request->employee_id;
            $url = $request->url ?? null;
            $status = $request->has('status') ? 1 : 0; // 1 = منشور, 0 = مسودة
            
            // التحقق من وجود الموظف
            $employee = DB::table('employees')->where('employee_id', $employee_id)->first();
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ الموظف غير موجود'
                ], 404);
            }
            
            // توليد Embedding تلقائي باستخدام الذكاء الاصطناعي
            $embedding = $this->generateNewsEmbedding($title, $description);
            
            // إضافة الخبر الجديد
            $newsId = DB::table('news')->insertGetId([
                'title' => $title,
                'description' => $description,
                'employee_id' => $employee_id,
                'url' => $url,
                'embedding' => $embedding, // الـ Embedding المولد
                'status' => $status, // 1 = منشور, 0 = مسودة
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'news_id' => $newsId,
                'embedding' => $embedding,
                'status' => $status,
                'message' => '✅ تم إضافة الخبر بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في إضافة الخبر: ' . $e->getMessage()
            ], 500);
        }
    }

    // تعديل خبر مع تحديث Embedding تلقائي
    public function updateNews(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            if (!$request->has('news_id')) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ رقم الخبر مطلوب'
                ], 400);
            }
            
            $newsId = $request->news_id;
            
            // التحقق من وجود الخبر
            $news = DB::table('news')->where('id', $newsId)->first();
            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ الخبر غير موجود'
                ], 404);
            }
            
            // تحديث البيانات
            $updateData = [];
            if ($request->has('title')) $updateData['title'] = $request->title;
            if ($request->has('description')) $updateData['description'] = $request->description;
            if ($request->has('employee_id')) $updateData['employee_id'] = $request->employee_id;
            if ($request->has('url')) $updateData['url'] = $request->url;
            if ($request->has('status')) $updateData['status'] = $request->status ? 1 : 0; // 1 = منشور, 0 = مسودة
            $updateData['updated_at'] = now();
            
            // إذا تم تعديل العنوان أو الوصف، نولد Embedding جديد
            if ($request->has('title') || $request->has('description')) {
                $newTitle = $request->has('title') ? $request->title : $news->title;
                $newDescription = $request->has('description') ? $request->description : $news->description;
                $updateData['embedding'] = $this->generateNewsEmbedding($newTitle, $newDescription);
            }
            
            DB::table('news')
                ->where('id', $newsId)
                ->update($updateData);
            
            return response()->json([
                'success' => true,
                'message' => '✅ تم تحديث الخبر بنجاح',
                'status' => $updateData['status'] ?? $news->status
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في تحديث الخبر: ' . $e->getMessage()
            ], 500);
        }
    }

    // حذف خبر
    public function deleteNews(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            if (!$request->has('news_id')) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ رقم الخبر مطلوب'
                ], 400);
            }
            
            $newsId = $request->news_id;
            
            // التحقق من وجود الخبر
            $news = DB::table('news')->where('id', $newsId)->first();
            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ الخبر غير موجود'
                ], 404);
            }
            
            // حذف الخبر
            DB::table('news')->where('id', $newsId)->delete();
            
            return response()->json([
                'success' => true,
                'message' => '✅ تم حذف الخبر بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في حذف الخبر: ' . $e->getMessage()
            ], 500);
        }
    }

    // الحصول على جميع الأخبار
    public function getAllNews()
    {
        $this->addCorsHeaders();
        
        try {
            $news = DB::table('news')->orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'news' => $news
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في الحصول على الأخبار: ' . $e->getMessage()
            ], 500);
        }
    }

    // الحصول على خبر معين
    public function getNews($news_id)
    {
        $this->addCorsHeaders();
        
        try {
            $news = DB::table('news')->where('id', $news_id)->first();
            
            if ($news) {
                return response()->json([
                    'success' => true,
                    'news' => $news
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => '❌ الخبر غير موجود'
            ], 404);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في الحصول على الخبر: ' . $e->getMessage()
            ], 500);
        }
    }

    // ==================== البحث الدلالي ====================

    // دالة للبحث الدلالي عن الأخبار
    public function searchNews(Request $request)
    {
        $this->addCorsHeaders();
        try {
            $query = $request->query('query');
            if (!$query) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ نص البحث مطلوب'
                ], 400);
            }

            // 1. توليد التضمين (embedding) لنص البحث
            $queryEmbedding = $this->generateNewsEmbedding($query, '');
            
            // 2. البحث في قاعدة البيانات عن الأخبار المتشابهة
            // ملاحظة: هذا الاستعلام يعتمد على وجود دالة cosine_similarity
            // أو مكتبة متخصصة في قاعدة البيانات. في Laravel، يمكن استخدام
            // مكتبات مثل 'pgvector' أو 'faiss' مع قواعد بيانات متوافقة.
            $news = DB::table('news')
                ->select(DB::raw("*, cosine_similarity(embedding, CAST('{$queryEmbedding}' AS JSON)) as similarity"))
                ->whereNotNull('embedding')
                ->orderByDesc('similarity')
                ->limit(10)
                ->get();
            
            return response()->json([
                'success' => true,
                'news' => $news,
                'message' => '✅ تم العثور على نتائج ذات صلة'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في البحث: ' . $e->getMessage()
            ], 500);
        }
    }


    // ==================== دوال مساعدة ====================
    
    // توليد Embedding للخبر تلقائيًا باستخدام الذكاء الاصطناعي
    private function generateNewsEmbedding($title, $description)
    {
        // 🚨 ملاحظة مهمة: هذا الكود هو مجرد مثال. 
        // لجعله يعمل فعليًا، يجب استبدال هذا الجزء بطلب HTTP إلى
        // خدمة توليد التضمين (embedding) مثل Google Gemini API.

        $textToEmbed = $title . ' ' . $description;
        
        // مثال على متجه رقمي (vector) وهمي
        // في الواقع، هذا المتجه سيتم توليده بواسطة نموذج AI
        $vector = [];
        for ($i = 0; $i < 384; $i++) {
            $vector[] = (float) number_format((mt_rand() / mt_getrandmax()) * 0.2 - 0.1, 8);
        }

        // تحويل المتجه إلى JSON لتخزينه في قاعدة البيانات
        return json_encode($vector, JSON_UNESCAPED_SLASHES);
    }

    // ==================== إدارة الموظفين ====================
    
    // إضافة موظف جديد
    public function addEmployee(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            $requiredFields = ['employee_id', 'name', 'department', 'position', 'email', 'password'];
            foreach ($requiredFields as $field) {
                if (!$request->has($field)) {
                    return response()->json([
                        'success' => false,
                        'message' => "❌ الحقل {$field} مطلوب"
                    ], 400);
                }
            }
            
            // التحقق من عدم تكرار رقم الموظف أو البريد الإلكتروني
            $existingEmployee = DB::table('employees')
                ->where('employee_id', $request->employee_id)
                ->orWhere('email', $request->email)
                ->first();
                
            if ($existingEmployee) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ رقم الموظف أو البريد الإلكتروني مستخدم بالفعل'
                ], 400);
            }
            
            // إضافة الموظف الجديد
            $employeeId = DB::table('employees')->insertGetId([
                'employee_id' => $request->employee_id,
                'name' => $request->name,
                'department' => $request->department,
                'position' => $request->position,
                'email' => $request->email,
                'phone' => $request->phone ?? null,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'normal',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'employee_id' => $employeeId,
                'message' => '✅ تم إضافة الموظف بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في إضافة الموظف: ' . $e->getMessage()
            ], 500);
        }
    }

    // تعديل موظف
    public function updateEmployee(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            if (!$request->has('employee_id')) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ رقم الموظف مطلوب'
                ], 400);
            }
            
            $employee_id = $request->employee_id;
            
            // التحقق من وجود الموظف
            $employee = DB::table('employees')->where('employee_id', $employee_id)->first();
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ الموظف غير موجود'
                ], 404);
            }
            
            // تحديث البيانات
            $updateData = [];
            if ($request->has('name')) $updateData['name'] = $request->name;
            if ($request->has('department')) $updateData['department'] = $request->department;
            if ($request->has('position')) $updateData['position'] = $request->position;
            if ($request->has('email')) $updateData['email'] = $request->email;
            if ($request->has('phone')) $updateData['phone'] = $request->phone;
            if ($request->has('password')) $updateData['password'] = Hash::make($request->password);
            if ($request->has('role')) $updateData['role'] = $request->role;
            $updateData['updated_at'] = now();
            
            DB::table('employees')
                ->where('employee_id', $employee_id)
                ->update($updateData);
            
            return response()->json([
                'success' => true,
                'message' => '✅ تم تحديث بيانات الموظف بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في تحديث الموظف: ' . $e->getMessage()
            ], 500);
        }
    }

    // حذف موظف
    public function deleteEmployee(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            if (!$request->has('employee_id')) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ رقم الموظف مطلوب'
                ], 400);
            }
            
            $employee_id = $request->employee_id;
            
            // التحقق من وجود الموظف
            $employee = DB::table('employees')->where('employee_id', $employee_id)->first();
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ الموظف غير موجود'
                ], 404);
            }
            
            // منع حذف المدير الرئيسي
            if ($employee->role === 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => '❌ لا يمكنك حذف مدير رئيسي'
                ], 403);
            }
            
            // حذف جميع البيانات المرتبطة بالموظف
            DB::table('login_logs')->where('employee_id', $employee_id)->delete();
            DB::table('face_images')->where('employee_id', $employee_id)->delete();
            DB::table('voice_samples')->where('employee_id', $employee_id)->delete();
            DB::table('verification_logs')->where('employee_id', $employee_id)->delete();
            DB::table('news')->where('employee_id', $employee_id)->delete();
            
            // حذف الموظف
            DB::table('employees')->where('employee_id', $employee_id)->delete();
            
            return response()->json([
                'success' => true,
                'message' => '✅ تم حذف الموظف وجميع بياناته بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في حذف الموظف: ' . $e->getMessage()
            ], 500);
        }
    }

    // الحصول على بيانات موظف
    public function getEmployee($employee_id)
    {
        $this->addCorsHeaders();
        
        try {
            $employee = DB::table('employees')->where('employee_id', $employee_id)->first();
            
            if ($employee) {
                return response()->json([
                    'success' => true,
                    'employee' => $employee
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => '❌ الموظف غير موجود'
            ], 404);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في الحصول على الموظف: ' . $e->getMessage()
            ], 500);
        }
    }

    // قائمة جميع الموظفين
    public function getAllEmployees()
    {
        $this->addCorsHeaders();
        
        try {
            $employees = DB::table('employees')->get();
            
            // إضافة عدد الصور والعينات الصوتية لكل موظف
            foreach ($employees as $employee) {
                $employee->face_count = DB::table('face_images')
                    ->where('employee_id', $employee->employee_id)
                    ->count();
                $employee->voice_count = DB::table('voice_samples')
                    ->where('employee_id', $employee->employee_id)
                    ->count();
                $employee->news_count = DB::table('news')
                    ->where('employee_id', $employee->employee_id)
                    ->count();
            }
            
            return response()->json([
                'success' => true,
                'employees' => $employees
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في الحصول على الموظفين: ' . $e->getMessage()
            ], 500);
        }
    }

    // لوحة تحكم الإدارة
    public function adminDashboard()
    {
        $this->addCorsHeaders();
        
        try {
            // الحصول على إحصائيات النظام
            $totalEmployees = DB::table('employees')->count();
            $totalNews = DB::table('news')->count();
            $totalLoginLogs = DB::table('login_logs')->count();
            
            // أحدث عمليات تسجيل الدخول
            $recentLogs = DB::table('login_logs')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
            
            return response()->json([
                'success' => true,
                'stats' => [
                    'total_employees' => $totalEmployees,
                    'total_news' => $totalNews,
                    'total_login_logs' => $totalLoginLogs
                ],
                'recent_logs' => $recentLogs
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في تحميل لوحة التحكم: ' . $e->getMessage()
            ], 500);
        }
    }
}
