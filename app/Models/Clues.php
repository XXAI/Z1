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


    public function catalogo_localidad(){
        return $this->belongsTo('App\Models\Localidad','catalogo_localidad_id','id');
    }

    public function catalogo_microrregion(){
        return $this->belongsTo('App\Models\Microrregion','catalogo_microrregion_id','id');
    }

    // public function cr(){
    //     return $this->hasMany('App\Models\Cr','clues','clues');
    // }

    // public function responsable(){
    //     return $this->hasOne('App\Models\Empleado','id','responsable_id');
    // }
}
