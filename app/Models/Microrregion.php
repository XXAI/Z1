<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Microrregion extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_microregion';
    protected $primaryKey = 'id';
    public $incrementing = false;

    public function tipo_unidad(){
        return $this->belongsTo('App\Models\TipoUnidad','catalogo_tipo_unidad_id','id');
    }

}
