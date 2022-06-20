<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableCluesJurisdiccion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->smallInteger('distrito_id')->after('clues');
        });

        Schema::table('regionalizacion_clues', function (Blueprint $table) {
            $table->time('tiempo')->change();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->dropColumn('distrito_id');
        });

        Schema::table('regionalizacion_clues', function (Blueprint $table) {
            $table->decimal("tiempo", 15,2)->change();
        });
    }
}
