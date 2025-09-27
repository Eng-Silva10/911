<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && get_class($request->user()) === 'App\Models\Admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }
}