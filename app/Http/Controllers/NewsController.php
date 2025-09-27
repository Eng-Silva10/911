<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Handle user login by checking against the 'admins' table.
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $admin = DB::table('admins')->where('username', $request->username)->first();

        // Verify user exists and password is correct using Hash::check
        if ($admin && Hash::check($request->password, $admin->password)) {
            // In a real application, create a session or return a token (e.g., Sanctum)
            return response()->json(['success' => true, 'message' => 'Login successful.']);
        }

        return response()->json(['success' => false, 'message' => 'بيانات الدخول غير صحيحة'], 401);
    }

    /**
     * Handle user logout.
     */
    public function logout()
    {
        // In a real application, you would invalidate the session or token
        return response()->json(['success' => true, 'message' => 'Logout successful.']);
    }

    /**
     * Fetch all data needed for the main dashboard view.
     */
    public function dashboard()
    {
        $news = DB::table('news')->orderBy('created_at', 'desc')->get();
        $search_logs = DB::table('search_logs')->orderBy('count', 'desc')->limit(5)->get();
        // Assuming 'reports' are news items with 'pending' status
        $reports_count = DB::table('news')->where('status', 'pending')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'news' => $news,
                'search_logs' => $search_logs,
                'reports_count' => $reports_count,
            ]
        ]);
    }

    /**
     * Fetch all reports (news with 'pending' status).
     */
    public function getReports()
    {
        $reports = DB::table('news')->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'reports' => $reports]);
    }

    /**
     * Store a new news item in the database.
     */
    public function addNews(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'news_link' => 'nullable|url',
            'status' => 'required|in:true,false,pending',
        ]);

        $id = DB::table('news')->insertGetId($validated + ['created_at' => now(), 'updated_at' => now()]);

        return response()->json(['success' => true, 'message' => 'تم إضافة الخبر بنجاح', 'id' => $id], 201);
    }

    /**
     * Update an existing news item.
     */
    public function updateNews(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'news_link' => 'nullable|url',
            'status' => 'required|in:true,false,pending',
        ]);

        $affected = DB::table('news')->where('id', $id)->update($validated + ['updated_at' => now()]);

        if ($affected > 0) {
            return response()->json(['success' => true, 'message' => 'تم تحديث الخبر بنجاح']);
        }
        return response()->json(['success' => false, 'message' => 'الخبر غير موجود أو لم يتم تغيير أي بيانات'], 404);
    }

    /**
     * Delete a news item.
     */
    public function deleteNews($id)
    {
        $deleted = DB::table('news')->where('id', $id)->delete();
        if ($deleted > 0) {
            return response()->json(['success' => true, 'message' => 'تم حذف الخبر بنجاح']);
        }
        return response()->json(['success' => false, 'message' => 'الخبر غير موجود'], 404);
    }
}

