<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelUserDistrito extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_user_distrito', function (Blueprint $table) {
            $table->smallInteger('distrito_id')->unsigned();
            $table->smallInteger('user_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->primary(array('distrito_id', 'user_id'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_user_distrito');
    }
}
