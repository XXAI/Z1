<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Municipio extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_municipio';

    public function distrito(){
        return $this->belongsto('App\Models\Distrito','catalogo_distrito_id');
    }
}
