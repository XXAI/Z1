<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Localidad extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_localidad';
    protected $primaryKey = 'id';
    public $incrementing = false;

}
