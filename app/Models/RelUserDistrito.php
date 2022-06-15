<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelUserDistrito extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_user_distrito';

    public function distrito(){
        return $this->belongsTo('App\Models\Distrito');
    }
}
