<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // التحقق من صحة البيانات
        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'news_link' => 'nullable|url|max:500',
            'description' => 'required|string|max:2000',
        ]);

        // حفظ البلاغ في قاعدة البيانات
        $report = Report::create([
            'title' => $validated['title'],
            'news_link' => $validated['news_link'] ?? null,
            'description' => $validated['description'],
            'status' => 'pending' // الوضع الافتراضي
        ]);

        return response()->json([
            'message' => 'تم إرسال بلاغك بنجاح! سيقوم فريق التحقق بمراجعته.',
            'report_id' => $report->id
        ], 201);
    }
}