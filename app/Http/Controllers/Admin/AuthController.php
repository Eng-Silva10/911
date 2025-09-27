<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // تحقق من البيانات
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // ابحث عن الإداري
        $admin = Admin::where('username', $request->username)->first();

        // تحقق من كلمة المرور
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة'
            ], 401);
        }

        // إنشاء Token
        $token = $admin->createToken('admin-token')->plainTextToken;

        // رد مع التوكن
        return response()->json([
            'token' => $token,
            'admin' => $admin,
            'message' => 'تم تسجيل الدخول بنجاح'
        ]);
    }

    public function logout(Request $request)
    {
        // حذف التوكن
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'تم تسجيل الخروج بنجاح']);
    }
}