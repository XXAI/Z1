<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PoblacionInegi extends Model
{
    use SoftDeletes;
    protected $fillable = ['id', 'anio', 'catalogo_localidad_id', 'cantidad'];
    protected $table = 'catalogo_poblacion_inegi';
    
}
