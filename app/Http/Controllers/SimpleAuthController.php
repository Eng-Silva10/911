<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SimpleAuthController extends Controller
{
    public function login(Request $request)
    {
        $username = $request->username;
        $password = $request->password;
        
        // البحث عن المستخدم
        $admin = DB::table('admins')->where('username', $username)->first();
        
        if ($admin && $password === '123456') {
            $token = md5(time() . $admin->id . rand(1, 1000));
            
            $response = response()->json([
                'success' => true,
                'token' => $token,
                'admin' => [
                    'id' => $admin->id,
                    'username' => $admin->username
                ],
                'message' => 'تم تسجيل الدخول'
            ]);
            
            // إضافة CORS headers
            $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            
            return $response;
        }
        
        $response = response()->json([
            'success' => false,
            'message' => 'اسم المستخدم أو كلمة المرور خطأ'
        ], 401);
        
        // إضافة CORS headers
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        
        return $response;
    }
    
    public function logout()
    {
        $response = response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج'
        ]);
        
        // إضافة CORS headers
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        
        return $response;
    }
}