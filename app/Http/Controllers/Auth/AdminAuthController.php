<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('username', $request->username)->first();

        // التحقق من وجود المدير وكلمة المرور
        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'username' => ['بيانات الاعتماد المقدمة غير صحيحة.'],
            ]);
        }

        // التحقق من الـ IP (طبقة أمان إضافية)
        if ($admin->allowed_ip && $admin->allowed_ip !== $request->ip()) {
             return response()->json(['message' => 'الوصول من هذا الجهاز غير مسموح به.'], 403);
        }

        // إنشاء توكن للمستخدم للوصول للـ API
        $token = $admin->createToken('admin-auth-token')->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح!',
            'token' => $token,
            'admin' => $admin->only(['id', 'username'])
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'تم تسجيل الخروج بنجاح.']);
    }
}