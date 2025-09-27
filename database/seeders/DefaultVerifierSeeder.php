<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DefaultVerifierSeeder extends Seeder
{
    /**
     * تشغيل بذر قاعدة البيانات لإنشاء الموظف الافتراضي.
     * هذا يحل مشكلة المفتاح الخارجي (Foreign Key) عند استخدام employee_id = 1.
     *
     * @return void
     */
    public function run()
    {
        // القيمة التي تم تحديدها في ReportController.php
        $verifierId = 2;
        $verifierName = 'المُحقق الافتراضي';

        // تحقق مما إذا كان الموظف موجودًا بالفعل لتجنب التكرار
        $existingEmployee = DB::table('employees')
                            ->where('id', $verifierId)
                            ->first();

        // إذا لم يكن الموظف موجودًا، قم بإنشائه
        if (!$existingEmployee) {
            DB::table('employees')->insert([
                // ملاحظة: يُفترض أن العمود الرئيسي للموظف هو 'id' وليس 'employee_id'.
                // يرجى تعديل 'id' إلى 'employee_id' إذا كان هذا هو اسم العمود الصحيح في جدول employees.
                'id' => $verifierId, 
                'name' => $verifierName,
                'email' => 'default_verifier@sadq.com',
                'password' => Hash::make(time()), // كلمة مرور وهمية
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info("تم إنشاء الموظف الافتراضي: {$verifierName} بالمعرّف {$verifierId}");
        } else {
            $this->command->warn("الموظف الافتراضي بالمعرّف {$verifierId} موجود بالفعل. تخطي.");
        }
    }
}
