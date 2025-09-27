<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // تحديث جدول الموظفين لإضافة عمود IP
        if (Schema::hasTable('employees')) {
            Schema::table('employees', function (Blueprint $table) {
                if (!Schema::hasColumn('employees', 'ip_address')) {
                    $table->string('ip_address')->nullable()->after('role');
                }
                if (!Schema::hasColumn('employees', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('ip_address');
                }
            });
        } else {
            Schema::create('employees', function (Blueprint $table) {
                $table->id();
                $table->string('employee_id')->unique();
                $table->string('name');
                $table->string('department');
                $table->string('position');
                $table->string('email')->unique();
                $table->string('phone')->nullable();
                $table->string('password');
                $table->string('role')->default('normal');
                $table->string('ip_address')->nullable(); // عمود IP
                $table->boolean('is_active')->default(true); // حالة الحساب
                $table->timestamps();
            });
        }

        // جدول سجل تسجيل الدخول
        if (!Schema::hasTable('login_logs')) {
            Schema::create('login_logs', function (Blueprint $table) {
                $table->id();
                $table->string('employee_id');
                $table->string('ip_address');
                $table->boolean('success');
                $table->timestamps();
            });
        }

        // جدول الأخبار
        if (!Schema::hasTable('news')) {
            Schema::create('news', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description');
                $table->string('url')->nullable();
                $table->text('embedding')->nullable();
                $table->boolean('status')->default(true);
                $table->string('employee_id');
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('news');
        Schema::dropIfExists('login_logs');
        Schema::dropIfExists('employees');
    }
};