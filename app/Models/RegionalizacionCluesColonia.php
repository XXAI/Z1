<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegionalizacionCluesColonia extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'regionalizacion_clues_colonia';
    protected $primaryKey = 'id';
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
}
