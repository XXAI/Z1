<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelRegionalizacionRh extends Model
{
    use SoftDeletes;
    protected $fillable = ['id', 'clues', 'catalogo_localidad_id', 'tipo_trabajador_id', 'trabajador_id', 'responsable_id'];
    protected $table = 'regionalizacion_rh';

    public function clues(){
        return $this->hasOne('App\Models\Clues', 'clues', "clues");
    }
    
    public function unidad(){
        return $this->hasOne('App\Models\Clues', 'clues', "clues");
    }

    public function localidad(){
        return $this->belongsTo('App\Models\Localidad','catalogo_localidad_id','id');
    }

    public function trabajadores(){
        return $this->belongsTo('App\Models\Trabajador','trabajador_id','id')->with('sexo', 'lengua', 'personal_salud', 'ur');
    }
    
}
