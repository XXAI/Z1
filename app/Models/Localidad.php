<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Localidad extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_localidad';

    public function municipio(){
        return $this->belongsto('App\Models\municipio','catalogo_municipio_id');
    }
}
