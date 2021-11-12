<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoCamino extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_tipo_camino';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}