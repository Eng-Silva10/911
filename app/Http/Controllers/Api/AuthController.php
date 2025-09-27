<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // دالة مساعدة لإضافة CORS headers
    private function addCorsHeaders()
    {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');
        header('Access-Control-Allow-Credentials: true');
    }

    public function login(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            $credentials = $request->only('email', 'password');
            
            if (Auth::attempt($credentials)) {
                $user = Auth::user();
                $token = $user->createToken('authToken')->plainTextToken;
                
                return response()->json([
                    'success' => true,
                    'token' => $token,
                    'user' => $user,
                    'message' => '✅ تم تسجيل الدخول بنجاح'
                ]);
            }
            
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

    public function logout(Request $request)
    {
        $this->addCorsHeaders();
        
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => '✅ تم تسجيل الخروج بنجاح'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ خطأ في تسجيل الخروج: ' . $e->getMessage()
            ], 500);
        }
    }
}