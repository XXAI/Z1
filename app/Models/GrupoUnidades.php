<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GrupoUnidades extends Model
{
    use SoftDeletes;
    protected $fillable = ['descripcion','cr_principal_id','total_elementos'];
    protected $table = 'grupos_unidades';

    public function crPrincipal(){
        return $this->belongsTo('App\Models\Cr','cr_principal_id','cr_id');
    }

    public function listaCR(){
        return $this->belongsToMany('App\Models\Cr', 'rel_clues_grupo_unidades', 'grupo_unidades_id', 'cr_id')->withPivot('clues');
    }

    public function listaUsuarios(){
        return $this->belongsToMany('App\Models\User', 'rel_grupo_unidades_usuario', 'grupo_unidades_id', 'user_id');
    }

    public function listaFirmantes(){
        return $this->hasMany('App\Models\Firmantes', 'grupo_unidades_id');
    }
}
