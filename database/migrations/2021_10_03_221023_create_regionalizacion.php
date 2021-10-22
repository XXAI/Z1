<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRegionalizacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('regionalizacion_clues', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("clues", 15);
            $table->smallInteger("catalogo_localidad_id");
            $table->smallInteger("catalogo_tipo_camino_id");
            $table->smallInteger("catalogo_tipo_regionalizacion_id");
            $table->decimal("distancia", 15,2);
            $table->time("tiempo");
            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::create('regionalizacion_rh', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("clues", 15);
            $table->smallInteger("catalogo_localidad_id");
            $table->smallInteger("tipo_trabajador_id");
            $table->smallInteger("trabajador_id");
            $table->boolean("responsable_id");
            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::create('regionalizacion_clues_colonia', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("clues", 15);
            $table->smallInteger("catalogo_localidad_id");
            $table->smallInteger("catalogo_colonia_id");
            $table->text("poligono_area");
            
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
        Schema::dropIfExists('regionalizacion_clues');
        Schema::dropIfExists('regionalizacion_rh');
        Schema::dropIfExists('regionalizacion_clues_colonia');
    }
}
