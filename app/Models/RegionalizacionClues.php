<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegionalizacionClues extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'regionalizacion_clues';
    protected $primaryKey = 'id';
    // public $incrementing = false;
    protected $hidden = ["created_at", "updated_at", "deleted_at"];


    public function catalogo_clues(){
        return $this->belongsTo('App\Models\Clues','clues', 'clues');
    }

    public function catalogo_localidad(){
        return $this->belongsTo('App\Models\Localidad','catalogo_localidad_id','id');
    }

    public function catalogo_tipo_camino(){
        return $this->belongsTo('App\Models\TipoCamino','catalogo_tipo_camino_id','id');
    }


    // public function cr(){
    //     return $this->hasMany('App\Models\Cr','clues','clues');
    // }

    // public function responsable(){
    //     return $this->hasOne('App\Models\Empleado','id','responsable_id');
    // }
}