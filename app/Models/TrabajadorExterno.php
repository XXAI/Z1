<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrabajadorExterno extends Model
{
    use SoftDeletes;
    protected $fillable = ['rfc', 'curp', 'nombre', 'apellido_paterno', 'apellido_materno', 'sexo_id', 'edad', 'catalogo_lengua_id'];
    protected $table = 'trabajador_externo';

    public function sexo(){
        return $this->belongsTo('App\Models\Sexo');
    }
    
    public function lengua(){
        return $this->belongsTo('App\Models\Lengua');
    }
    
    public function rel_regionalizacion_rh(){
        return $this->hasOne('App\Models\RelRegionalizacionRh','trabajador_id', "id")->where("tipo_trabajador_id", "2");
    }

    public function tipoTrabajador(){
        return $this->hasOne('App\Models\TipoTrabajador', "id","tipo_personal_id")->where("tipo", "2");
    }

    public function rel_rh(){
        return $this->hasOne('App\Models\RelRegionalizacionRh', "trabajador_id", "id")->where("tipo_trabajador_id", "2");
    }
}
