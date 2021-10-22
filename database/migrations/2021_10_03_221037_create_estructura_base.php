<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstructuraBase extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trabajador', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->smallInteger("catalogo_lengua_id");
            $table->string('rfc', 15)->index()->unique();
            $table->string('curp', 50)->index()->unique();
            $table->string('nombre', 255)->index();
            $table->string('apellido_paterno', 255)->index()->nullable();
            $table->string('apellido_materno', 255)->index()->nullable();
            $table->smallInteger('edad')->unsigned()->nullable();
            $table->mediumInteger('sexo_id')->unsigned()->nullable();
            $table->string("ur", 15);
            
            $table->mediumInteger('idioma_id')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('trabajador_externo', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->smallInteger("catalogo_lengua_id");
            $table->string('rfc', 15)->index()->unique();
            $table->string('curp', 50)->index()->unique();
            $table->string('nombre', 255)->index();
            $table->string('apellido_paterno', 255)->index()->nullable();
            $table->string('apellido_materno', 255)->index()->nullable();
            $table->smallInteger('edad')->unsigned()->nullable();
            $table->mediumInteger('sexo_id')->unsigned()->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trabajador');
        Schema::dropIfExists('trabajador_externo');
    }
}
