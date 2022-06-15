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
    }
}
