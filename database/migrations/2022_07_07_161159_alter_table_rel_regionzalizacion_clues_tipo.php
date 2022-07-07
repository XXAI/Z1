<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableRelRegionzalizacionCluesTipo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('regionalizacion_clues', function (Blueprint $table) {
            $table->enum('tipo_localidad_regionalizacion',['SEDE','AREA DE INFLUENCIA','ACCIÓN INTENSIVA'])->default('AREA DE INFLUENCIA')->after('tiempo');
        });

        Schema::table('catalogo_localidad', function (Blueprint $table) {
           $table->dropColumn('tipo_localidad');
        }); 
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('regionalizacion_clues', function (Blueprint $table) {
            $table->dropColumn('tipo_localidad_regionalizacion');
        });

        Schema::table('catalogo_localidad', function (Blueprint $table) {
            $table->string('tipo_localidad',1)->after("clave_localidad");
         }); 

    }
}
