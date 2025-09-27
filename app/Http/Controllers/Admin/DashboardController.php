<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'مرحباً بك في لوحة التحكم',
            'admin' => $request->user(),
            'stats' => [
                'users' => 1250,
                'orders' => 340,
                'revenue' => 45000,
            ]
        ]);
    }
}