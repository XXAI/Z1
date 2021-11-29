<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableTrabajadorExternoTipo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_tipo_trabajador', function (Blueprint $table) {
            $table->smallInteger('tipo')->after('abreviatura');
        });

        Schema::table('trabajador_externo', function (Blueprint $table) {
            $table->smallInteger('tipo_personal_id')->after('apellido_paterno');
        });

        Schema::table('trabajador', function (Blueprint $table) {
            $table->smallInteger('tipo_personal_id')->after('apellido_paterno');
        });

        Schema::table('catalogo_colonia', function (Blueprint $table) {
            $table->smallInteger('longitud')->after('descripcion');
            $table->smallInteger('latitud')->after('descripcion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('catalogo_tipo_trabajador', function (Blueprint $table) {
            $table->dropColumn('tipo');
        });
        Schema::table('trabajador_externo', function (Blueprint $table) {
            $table->dropColumn('tipo_personal_id');
        });
        
        Schema::table('trabajador', function (Blueprint $table) {
            $table->dropColumn('tipo_personal_id');
        });

        Schema::table('catalogo_colonia', function (Blueprint $table) {
            $table->dropColumn('longitud');
            $table->dropColumn('latitud');
        });
    }
}
