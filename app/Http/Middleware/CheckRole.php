<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  // الأدوار المطلوبة
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $currentUserId   = $request->query('current_user_id');
        $currentUserRole = $request->query('current_user_role');

        if (!$currentUserId || !$currentUserRole) {
            return response()->json([
                'success' => false,
                'message' => '❌ الحساب غير مصرح أو لم يتم إرسال بيانات المستخدم'
            ], 401);
        }

        // تحقق من أن الرتبة ضمن المسموح بها
        if (!in_array($currentUserRole, $roles)) {
            return response()->json([
                'success' => false,
                'message' => '❌ لا تملك الصلاحية اللازمة لهذا الإجراء'
            ], 403);
        }

        return $next($request);
    }
}
