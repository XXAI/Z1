<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Microrregion extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_microrregion';
    protected $primaryKey = 'id';
    public $incrementing = false;

}
