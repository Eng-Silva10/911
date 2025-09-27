<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\Report;
use App\Models\SearchLog;

class DashboardController extends Controller
{
    public function stats()
    {
        $reportsCount = Report::where('status', 'pending')->count();
        $topSearches = SearchLog::orderBy('count', 'desc')->limit(5)->get();
        $newsCount = News::count();

        return response()->json([
            'reports_count' => $reportsCount,
            'top_searches' => $topSearches,
            'news_count' => $newsCount
        ]);
    }
}