<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableTipoPersonalExterno extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_grupo_personal', function (Blueprint $table) {
            $table->smallIncrements("id");
            $table->string("descripcion", 150);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('catalogo_localidad', function (Blueprint $table) {
            $table->smallInteger("poblacion_real")->default(0)->unsigned()->after('longitud');
        });

        Schema::table('catalogo_tipo_trabajador', function (Blueprint $table) {
            $table->smallInteger("catalogo_grupo_personal_id")->unsigned()->after('tipo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_grupo_personal');
        Schema::table('catalogo_localidad', function (Blueprint $table) {
            $table->dropColumn('poblacion_real');
        });
        Schema::table('catalogo_tipo_trabajador', function (Blueprint $table) {
            $table->dropColumn('catalogo_grupo_personal_id');
        });
    }
}
