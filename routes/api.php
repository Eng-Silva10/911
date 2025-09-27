<?php

use App\Http\Controllers\SearchController;
use App\Http\Controllers\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// مسار البحث
Route::get('/search', [SearchController::class, 'search']);

// مسار إرسال البلاغ
Route::post('/reports', [ReportController::class, 'store']);

