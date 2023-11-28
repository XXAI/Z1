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


    public function municipio(){
        return $this->belongsto('App\Models\Municipio','catalogo_municipio_id');
    }

    public function regionalizacion(){
        return $this->hasMany('App\Models\RegionalizacionClues', "catalogo_localidad_id");
    }

    public function clues(){
        return $this->hasMany('App\Models\Clues',  "catalogo_localidad_id");
    }

    public function poblacionInegi(){
        return $this->hasMany('App\Models\PoblacionInegi','catalogo_localidad_id')->orderBy("anio", "desc");
    }
}
