<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SadikController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NewsController as ApiNewsController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\ReportController;

Route::get('/api/search', [SearchController::class, 'search']);
Route::get('/api/reports', [ReportController::class, 'store']);
// ==================== نظام صادق ====================
Route::get('/sadik/login', [SadikController::class, 'login']);
Route::get('/sadik/logout', [SadikController::class, 'logout']);
Route::get('/sadik/add-employee', [SadikController::class, 'addEmployee']);
Route::get('/sadik/update-employee', [SadikController::class, 'updateEmployee']);
Route::get('/sadik/delete-employee', [SadikController::class, 'deleteEmployee']);
Route::get('/sadik/employee/{employee_id}', [SadikController::class, 'getEmployee']);
Route::get('/sadik/employees', [SadikController::class, 'getAllEmployees']);
Route::get('/sadik/admin-dashboard', [SadikController::class, 'adminDashboard']);

// لوحة التحكم الإدارية
Route::get('/admin/reports', [ReportController::class, 'index']); // عرض البلاغات
Route::get('/admin/reports/{id}/status', [ReportController::class, 'updateStatus']); // تحديث الحالة
// ==================== نظام الأخبار ====================
Route::get('/sadik/add-news', [SadikController::class, 'addNews']);
Route::get('/sadik/update-news', [SadikController::class, 'updateNews']);
Route::get('/sadik/delete-news', [SadikController::class, 'deleteNews']);
Route::get('/sadik/news', [SadikController::class, 'getAllNews']);
Route::get('/sadik/news/{news_id}', [SadikController::class, 'getNews']);