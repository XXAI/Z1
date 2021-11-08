<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelRegionalizacionRh extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'regionalizacion_rh';

    public function clues(){
        return $this->hasOne('App\Models\Clues', 'clues', "clues");
    }
}
