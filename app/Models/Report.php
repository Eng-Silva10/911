<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'title',
        'news_link',
        'description',
        'status',
        'ip_address',
        'user_agent',
        'device_info',
        'browser_info',
        'os_info'
    ];
}