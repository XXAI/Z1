<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableGrupoUnidades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grupos_unidades', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('descripcion');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rel_clues_grupo_unidades', function (Blueprint $table) {
            $table->smallInteger('grupo_unidades_id')->unsigned();
            $table->string('clues', 14)->index();
            
            $table->primary(array('grupo_unidades_id', 'clues'));

            $table->foreign('grupo_unidades_id')->references('id')->on('grupos_unidades');
            $table->foreign('clues')->references('clues')->on('catalogo_clues');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rel_grupo_unidades_usuario', function (Blueprint $table) {
            $table->smallInteger('grupo_unidades_id')->unsigned();
            $table->smallInteger('user_id')->unsigned();

            $table->primary(array('grupo_unidades_id', 'user_id'));
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('grupo_unidades_id')->references('id')->on('grupos_unidades');
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
        Schema::dropIfExists('rel_grupo_unidades_usuario');
        Schema::dropIfExists('rel_clues_grupo_unidades');
        Schema::dropIfExists('grupos_unidades');
    }
}
