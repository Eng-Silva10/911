<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Employee extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'employee_id',
        'name',
        'department',
        'position',
        'email',
        'phone',
        'password',
        'role',
        'ip_address',
        'is_active'
    ];

    protected $hidden = [
        'password',
    ];

    protected $ casts = [
        'password' => 'hashed',
        'is_active' => 'boolean'
    ];
}