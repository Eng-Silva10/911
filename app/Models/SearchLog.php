<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SearchLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'keyword', // <= السطر ده مهم جداً
        'count',
        'last_search',
        // أي أعمدة تانية عايز تسمح بملئها جماعيًا
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_search' => 'datetime',
        // 'count' => 'integer', // ممكن كمان تحطه كده عشان يتأكد من النوع
    ];
}
