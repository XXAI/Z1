<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Clues extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_clues';
    protected $primaryKey = 'clues';
    public $incrementing = false;
    protected $hidden = ["created_at", "updated_at", "deleted_at"];


    public function catalogo_localidad(){
        return $this->belongsTo('App\Models\Localidad','catalogo_localidad_id','id');
    }

    public function catalogo_microrregion(){
        return $this->belongsTo('App\Models\Microrregion','catalogo_microrregion_id','id');
    }

    public function regionalizaciones(){
        return $this->hasMany('App\Models\RegionalizacionClues', 'clues');
    }

    public function regionalizaciones_personal(){
        return $this->hasMany('App\Models\RelRegionalizacionRh', 'clues')->where("tipo_trabajador_id", "1");
    }

}
