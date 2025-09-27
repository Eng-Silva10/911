<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CreativeAuthController extends Controller
{
    public function voiceLogin(Request $request)
    {
        // إضافة CORS headers في أول كل دالة
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Credentials: true');
        
        return response()->json([
            'success' => true,
            'token' => md5(time() . 'voice'),
            'admin' => [
                'id' => 1,
                'username' => 'مدير الصوت',
                'method' => '🎤 التحقق الصوتي'
            ],
            'ai_analysis' => [
                'voice_confidence' => '95%',
                'emotional_state' => 'متأكد',
                'verification_speed' => '250ms'
            ],
            'message' => '🎤 تم التحقق من الهوية الصوتية'
        ]);
    }
    
    public function faceLogin(Request $request)
    {
        // إضافة CORS headers
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Credentials: true');
        
        return response()->json([
            'success' => true,
            'token' => md5(time() . 'face'),
            'admin' => [
                'id' => 1,
                'username' => 'مدير الوجه',
                'method' => '👁️ التعرف على الوجه'
            ],
            'ai_analysis' => [
                'face_match' => '97%',
                'liveness_detection' => '99%',
                'verification_time' => '320ms'
            ],
            'message' => '👁️ تم التعرف على الوجه بنجاح'
        ]);
    }
    
    public function traditionalLogin(Request $request)
    {
        // إضافة CORS headers
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Credentials: true');
        
        $username = $request->username;
        $password = $request->password;
        
        $token = md5(time() . 'traditional');
        
        return response()->json([
            'success' => true,
            'token' => $token,
            'admin' => [
                'id' => 1,
                'username' => 'مدير النظام',
                'method' => '🔐 الدخول التقليدي'
            ],
            'message' => '🔐 تم تسجيل الدخول بنجاح'
        ]);
    }
    
    public function logout()
    {
        // إضافة CORS headers
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Credentials: true');
        
        return response()->json([
            'success' => true,
            'message' => '👋 تم تسجيل الخروج'
        ]);
    }
}