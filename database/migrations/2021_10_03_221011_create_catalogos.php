<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_distrito', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("clave_distrito", 5);
            $table->string("descripcion", 150);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_municipio', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->smallInteger("catalogo_distrito_id");
            $table->string("clave_municipio", 3);
            $table->string("descripcion", 150);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_localidad', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->smallInteger("catalogo_municipio_id");
            $table->string("clave_localidad", 4);
            $table->string("tipo_localidad", 1);
            $table->string("descripcion", 100);
            $table->decimal("latitud", 15,6);
            $table->decimal("longitud", 15,6);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_colonia', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->smallInteger("catalogo_localidad_id");
            $table->string("clave_colonia", 5);
            $table->string("descripcion", 100);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_clues', function (Blueprint $table) {
            $table->string("clues", 15)->primary()->index();
            $table->smallInteger("catalogo_microrregion_id");
            //$table->smallInteger("catalogo_municipio_id");
            $table->smallInteger("catalogo_localidad_id");
            //$table->smallInteger("catalogo_distrito_id");
            $table->string("descripcion", 100);
            $table->string("direccion", 100);
            $table->string("telefono", 50);
            $table->string("cp", 10);
            $table->smallInteger("nucleos_camas");
            $table->date("inicio_operacion");
            $table->date("fecha_operacion");
            $table->decimal("latitud", 15,6);
            $table->decimal("longitud", 15,6);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_tipo_unidad', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("abreviatura", 100);
            $table->string("descripcion", 200);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_microregion', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->smallInteger("catalogo_tipo_unidad_id");
            $table->string("clave_microregion", 100);
            $table->string("tipo", 100);
            $table->string("descripcion_tipo", 200);
            $table->string("descripcion", 100);
            $table->timestamps();
            $table->softDeletes();
        }); 
        Schema::create('catalogo_ur', function (Blueprint $table) {
            $table->string("ur", 15)->primary()->index();
            $table->string("descripcion", 100);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_lengua', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("descripcion", 100);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_sexo', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("descripcion", 100);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_tipo_trabajador', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("descripcion", 200);
            $table->string("abreviatura", 100);
            $table->timestamps();
            $table->softDeletes();
        });

        
        Schema::create('catalogo_poblacion_inegi', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->smallInteger("anio");
            $table->smallInteger("catalogo_localidad_id");
            $table->smallInteger("cantidad");
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('catalogo_tipo_camino', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("descripcion", 100);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalogo_tipo_localidad_microregion', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("descripcion", 100);
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
        Schema::dropIfExists('catalogo_distrito');
        Schema::dropIfExists('catalogo_municipio');
        Schema::dropIfExists('catalogo_localidad');
        Schema::dropIfExists('catalogo_colonia');
        Schema::dropIfExists('catalogo_clues');
        Schema::dropIfExists('catalogo_tipo_unidad');
        Schema::dropIfExists('catalogo_microregion');
        Schema::dropIfExists('catalogo_ur');
        Schema::dropIfExists('catalogo_lengua');
        Schema::dropIfExists('catalogo_sexo');
        Schema::dropIfExists('catalogo_tipo_trabajador');
        Schema::dropIfExists('catalogo_poblacion_inegi');
        Schema::dropIfExists('catalogo_tipo_camino');
        Schema::dropIfExists('catalogo_tipo_localidad_microregion');
    }
}
