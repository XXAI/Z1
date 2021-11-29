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
        return $this->belongsto('App\Models\municipio','catalogo_municipio_id');
    }

    public function regionalizacion(){
        return $this->belongsTo('App\Models\RegionalizacionClues', "id", "catalogo_localidad_id");
    }
}
