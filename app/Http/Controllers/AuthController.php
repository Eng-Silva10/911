<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SadikController extends Controller
{
    // دالة مساعدة لإضافة CORS headers
    private function addCorsHeaders()
    {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');
        header('Access-Control-Allow-Credentials: true');
    }

    // تسجيل دخول الموظف
    public function login(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            $employee_id = $request->query('employee_id');
            $password = $request->query('password');
            
            if (!$employee_id || !$password) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ رقم الموظف وكلمة المرور مطلوبان'
                ], 400);
            }
            
            $employee = DB::table('employees')->where('employee_id', $employee_id)->first();
            
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
            
            // تسجيل فشل تسجيل الدخول
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
        
        return response()->json([
            'success' => true,
            'message' => '👋 تم تسجيل الخروج'
        ]);
    }

    // إضافة موظف جديد (للإدارة العليا فقط)
    public function addEmployee(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            // التحقق من صلاحيات المستخدم
            $currentUserRole = $request->query('current_user_role') ?? 'normal';
            
            // السماح فقط للمديرين الرئيسيين
            if ($currentUserRole !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => '❌ ممنوع الدخول لهذه الوحة - صلاحيات غير كافية'
                ], 403);
            }
            
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

    // تعديل موظف (للإدارة العليا فقط)
    public function updateEmployee(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            // التحقق من صلاحيات المستخدم
            $currentUserRole = $request->query('current_user_role') ?? 'normal';
            
            // السماح فقط للمديرين الرئيسيين
            if ($currentUserRole !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => '❌ ممنوع الدخول لهذه الوحة - صلاحيات غير كافية'
                ], 403);
            }
            
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
            
            // منع تعديل المديرين الرئيسيين إلا بواسطة مديرين رئيسيين
            if ($employee->role === 'super_admin' && $currentUserRole !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => '❌ لا يمكنك تعديل مدير رئيسي'
                ], 403);
            }
            
            // تحديث البيانات
            $updateData = [];
            if ($request->has('name')) $updateData['name'] = $request->name;
            if ($request->has('department')) $updateData['department'] = $request->department;
            if ($request->has('position')) $updateData['position'] = $request->position;
            if ($request->has('email')) $updateData['email'] = $request->email;
            if ($request->has('phone')) $updateData['phone'] = $request->phone;
            if ($request->has('password')) $updateData['password'] = Hash::make($request->password);
            if ($request->has('role')) {
                // السماح بتغيير الرتبة فقط للمديرين الرئيسيين
                if ($currentUserRole === 'super_admin') {
                    $updateData['role'] = $request->role;
                }
            }
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

    // حذف موظف (للإدارة العليا فقط)
    public function deleteEmployee(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            // التحقق من صلاحيات المستخدم
            $currentUserRole = $request->query('current_user_role') ?? 'normal';
            
            // السماح فقط للمديرين الرئيسيين
            if ($currentUserRole !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => '❌ ممنوع الدخول لهذه الوحة - صلاحيات غير كافية'
                ], 403);
            }
            
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
            if ($employee->role === 'super_admin' && $currentUserRole !== 'super_admin') {
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
            // التحقق من صلاحيات المستخدم
            $currentUserRole = request()->query('current_user_role') ?? 'normal';
            
            // السماح فقط للمديرين الرئيسيين
            if ($currentUserRole !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => '❌ ممنوع الدخول لهذه الوحة - صلاحيات غير كافية'
                ], 403);
            }
            
            // الحصول على إحصائيات النظام
            $totalEmployees = DB::table('employees')->count();
            $totalFaceImages = DB::table('face_images')->count();
            $totalVoiceSamples = DB::table('voice_samples')->count();
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
                    'total_face_images' => $totalFaceImages,
                    'total_voice_samples' => $totalVoiceSamples,
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