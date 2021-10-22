<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DashboardElemento extends Model
{
    use SoftDeletes;
    protected $fillable = ['dashboard_id','tipo','colspan','rowspan','icono','titulo','subtitulo','query','divisor','tipo_grafica','tipo_serie','categorias','series','alto','ancho'];
    protected $table = 'dashboard_elementos';
}
