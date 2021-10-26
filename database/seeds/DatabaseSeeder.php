<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::create([
            'name' => 'Usuario Root',
            'username' => 'root',
            'password' => Hash::make('ssa.simoss#'),
            'email' => 'root@localhost',
            'is_superuser' => 1,
            'avatar' => '/assets/avatars/50-king.svg'
        ]);

        //Carga de archivos CSV
        $lista_csv = [
            'permissions',
            'roles',
            'role_user',
            'permission_role',
            'catalogo_localidad',
            'catalogo_municipio',
            
            'catalogo_distrito',
            'catalogo_lengua',
            'catalogo_localidad',
            'catalogo_microregion',
            'catalogo_municipio',
            'catalogo_poblacion_inegi',
            'catalogo_sexo',
            'catalogo_tipo_camino',
            'catalogo_tipo_unidad',
            'catalogo_ur',
            'trabajador',
            'catalogo_clues'
        ];

        //DB::beginTransaction();

        //DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        foreach($lista_csv as $csv){
            $archivo_csv = storage_path().'/app/seeds/'.$csv.'.csv';

            $query = sprintf("
                LOAD DATA local INFILE '%s' 
                INTO TABLE $csv 
                FIELDS TERMINATED BY ',' 
                OPTIONALLY ENCLOSED BY '\"' 
                ESCAPED BY '\"' 
                LINES TERMINATED BY '\\n' 
                IGNORE 1 LINES", addslashes($archivo_csv));
            echo $query;
            DB::connection()->getpdo()->exec($query);
        }

	    }
}
