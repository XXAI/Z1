<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dashboard extends Model
{
    use SoftDeletes;
    protected $fillable = ['nombre','descripcion','columnas'];
    protected $table = 'dashboard';

    public function elementos(){
        return $this->hasMany('App\Models\DashboardElemento','dashboard_id');
    }

    public function elementosVisibles(){
        return $this->hasMany('App\Models\DashboardElemento','dashboard_id')->where('visible',1)->orderBy('orden');
    }
}