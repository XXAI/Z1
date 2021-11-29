<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trabajador extends Model
{
    use SoftDeletes;
    protected $fillable = ['rfc', 'curp', 'nombre', 'apellido_paterno', 'apellido_materno', 'sexo_id', 'edad', 'catalogo_lengua_id'];
    protected $table = 'trabajador';

    public function sexo(){
        return $this->belongsTo('App\Models\Sexo');
    }
    
    public function lengua(){
        return $this->belongsTo('App\Models\Lengua');
    }
    
    public function ur(){
        return $this->belongsTo('App\Models\UR', "ur", "ur");
    }

    public function personal_salud(){
        return $this->hasOne('App\Models\TipoTrabajador', 'id', 'tipo_personal_id')->where("tipo", "1");
    }

    public function personal_externo(){
        return $this->hasOne('App\Models\TipoTrabajador')->where("tipo", "2");
    }
    
    public function rel_rh(){
        return $this->hasOne('App\Models\RelRegionalizacionRh');
    }

    public function rel_clues(){
        return $this->hasOne('App\Models\RegionalizacionClues', "clues", "clues");
    }
}
