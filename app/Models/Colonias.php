<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Colonias extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_colonia';
    
    public function localidad(){
        return $this->belongsto('App\Models\Localidad','catalogo_localidad_id');
    }
}
