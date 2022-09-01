<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. Thes
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('logout',   'API\Auth\AuthController@logout');
    Route::get('perfil',   'API\Auth\AuthController@me');
});

Route::post('signin',   'API\Auth\AuthController@login');
Route::post('register',   'API\Admin\RegistroController@register');
Route::post('refresh',  'API\Auth\AuthController@refresh');

Route::post('req-password-reset', 'Reset\ResetPwdReqController@reqForgotPassword');
Route::post('update-password', 'Reset\UpdatePwdController@updatePassword');

Route::group(['middleware'=>'auth'],function($router){
    Route::apiResource('user',          'API\Admin\UserController');
    Route::apiResource('permission',    'API\Admin\PermissionController');
    Route::apiResource('role',          'API\Admin\RoleController');
    
    /**
     * Rutas para el Modulo de Dashboard
     */
    Route::apiResource('dashboard',                 'API\Modulos\DashboardController');
    Route::get('dashboard-activo',                  'API\Modulos\DashboardController@activeDashboard');
    Route::post('catalogos',                        'API\Modulos\SearchCatalogsController@getCatalogs');

    Route::apiResource('grupos_unidades',           'API\Modulos\GrupoUnidadesController');
    Route::apiResource('distritos',                 'API\Modulos\DistritoController');
    
    /* Apis del sistema */
    Route::apiResource('clues',                     'API\Modulos\CluesController');
    Route::get('ver-info-clue/{id}',                'API\Modulos\CluesController@infoClue');
    Route::apiResource('profile',                   'API\ProfileController')->only([ 'show', 'update']);
    Route::apiResource('clues',                 'API\Modulos\CluesController');
    Route::apiResource('catalogos',             'API\Modulos\CatalogosController');
    Route::apiResource('colonias',              'API\Modulos\ColoniasController');
    Route::apiResource('trabajador-salud',      'API\Modulos\TrabajadorSaludController');
    Route::apiResource('trabajador-externo',    'API\Modulos\TrabajadorExternoController');
    Route::get('catalogo-municipio/{id}',       'API\Modulos\CatalogosController@catalogoMunicipio');
    Route::get('catalogo-microrregion/{id}',       'API\Modulos\CatalogosController@catalogoMicrorregion');
    
    Route::get('catalogo-localidad',            'API\Modulos\CatalogosController@catalogoLocalidad');
    Route::get('catalogo-localidad-regionalizado',            'API\Modulos\CatalogosController@catalogoLocalidadRegionalizadas');
    Route::get('catalogo-clues',                'API\Modulos\CatalogosController@catalogoClues');
    Route::apiResource('profile',               'API\ProfileController')->only([ 'show', 'update']);
    Route::apiResource('clues',         'API\Modulos\CluesController');
    Route::get('ver-info-clue/{id}',    'API\Modulos\CluesController@infoClue');
    Route::get('busqueda-clues',    'API\Modulos\SearchCatalogsController@getCluesAutocomplete');
    Route::get('catalogo_municipio',    'API\Modulos\CatalogosController@getMunicipioAutocomplete');
    Route::get('catalogo-mapa',    'API\Modulos\CatalogosController@getCatalogoMapa');
    
    Route::apiResource('profile',       'API\ProfileController')->only([ 'show', 'update']);
    
    Route::apiResource('reginalizacion-clues',          'API\Modulos\RegionalizacionCluesController');
    Route::get('regionalizacion-localidades/{id}',      'API\Modulos\RegionalizacionCluesController@localidades');
    Route::get('regionalizacion-localidades-filtro/{id}','API\Modulos\RegionalizacionCluesController@filtroLocalidades');
    Route::get('get-data-mapa',                         'API\Modulos\RegionalizacionCluesController@getMapa');
    Route::get('get-data-regionalizacion/{id}',              'API\Modulos\RegionalizacionCluesController@getLocalidades');
    
    
    Route::apiResource('reginalizacion-clues-personal',  'API\Modulos\RegionalizacionCluesPersonalController');
    Route::get('catalogo-personal-externo',              'API\Modulos\RegionalizacionCluesPersonalController@getExterno');
    Route::get('catalogo-grupo-personal/{id}',           'API\Modulos\CatalogosController@getTipoGrupo');
    Route::apiResource('localidad',                      'API\Modulos\LocalidadController');
    Route::get('regionalizacion-salud-filtro/{id}',      'API\Modulos\RegionalizacionCluesPersonalController@filtroSalud');
    Route::get('regionalizacion-externo-filtro/{id}',    'API\Modulos\RegionalizacionCluesPersonalController@filtroExterno');
    Route::get('delete-personal/{id}',                   'API\Modulos\RegionalizacionCluesPersonalController@deletePersonal');
    Route::get('buscador-personal',                      'API\Modulos\RegionalizacionCluesPersonalController@buscarPersonal');
    Route::post('transferir-personal',                    'API\Modulos\RegionalizacionCluesPersonalController@transferirPersonal');
});

Route::middleware('auth')->get('/avatar-images', function (Request $request) {
    $avatars_path = public_path() . config('ng-client.path') . '/assets/avatars';
    $image_files = glob( $avatars_path . '/*', GLOB_MARK );

    $root_path = public_path() . config('ng-client.path');

    $clean_path = function($value)use($root_path) {
        return str_replace($root_path,'',$value);
    };
    
    $avatars = array_map($clean_path, $image_files);

    return response()->json(['images'=>$avatars], HttpResponse::HTTP_OK);
});