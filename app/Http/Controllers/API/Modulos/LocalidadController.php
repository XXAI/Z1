<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use App\Models\Localidad;
use App\Models\RegionalizacionClues;
use App\Exports\DevReportExport;

class LocalidadController extends Controller
{
    public function index(Request $request)
    {
        try{
            $access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = Localidad::with("municipio.distrito", "poblacionInegi", "regionalizacion.catalogo_clues", "clues");
                
            if(!$access->is_admin){
                $objeto = $objeto->whereRaw("catalogo_localidad.catalogo_municipio_id in (select id from catalogo_municipio where catalogo_distrito_id in (".$access->distrito."))");
            }

            $objeto = $this->aplicarFiltros($objeto, $parametros);
            
            if(isset($parametros['page'])){
                //$objeto = $objeto->orderBy('descripcion');
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 14;
                $objeto = $objeto->paginate($resultadosPorPagina);
            }else{

                if(isset($parametros['reporte'])){
                    if(isset($parametros['export_excel']) && $parametros['export_excel']){
                        try{
                            ini_set('memory_limit', '-1');
                            
                            //$data = Localidad::getModel();
                            //$distritos = is_array($access->distritos) ? $access->distritos : $access->distrito;

                            $query_localidades = RegionalizacionClues::get()->pluck('catalogo_localidad_id');
                            $data = Localidad::whereNotIn('catalogo_localidad.id', $query_localidades)
                                    ->LeftJoin("catalogo_municipio", "catalogo_municipio.id", "catalogo_localidad.catalogo_municipio_id")
                                    ->LeftJoin("catalogo_distrito", "catalogo_distrito.id", "catalogo_municipio.catalogo_distrito_id")
                                    ->LeftJoin("catalogo_poblacion_inegi", "catalogo_poblacion_inegi.catalogo_localidad_id", "catalogo_localidad.id")
                                    ->LeftJoin("regionalizacion_clues", "regionalizacion_clues.catalogo_localidad_id", "catalogo_localidad.id")
                                    ->LeftJoin("catalogo_clues", "catalogo_clues.clues", "regionalizacion_clues.clues")
                                    ->select(
                                        "catalogo_localidad.clave_localidad as clave_localidad",
                                        "catalogo_localidad.descripcion as localidad",
                                        "catalogo_localidad.poblacion_real",
                                        "catalogo_municipio.clave_municipio as clave_municipio",
                                        "catalogo_municipio.descripcion as municipio",
                                        "catalogo_distrito.id as distrito_id",
                                        "regionalizacion_clues.clues",
                                        "catalogo_clues.descripcion as unidad",
                                        "catalogo_poblacion_inegi.anio as anio_poblacion_inegi",
                                        "catalogo_poblacion_inegi.cantidad as cantidad_poblacion_inegi",
                                        "regionalizacion_clues.distancia",
                                        "regionalizacion_clues.tiempo",
                                        "regionalizacion_clues.tipo_localidad_regionalizacion",
                                        "catalogo_clues.latitud",
                                        "catalogo_clues.longitud"
                                    )->whereNull("catalogo_clues.deleted_at")
                                     ->whereNull("catalogo_distrito.deleted_at")
                                     ->whereNull("regionalizacion_clues.deleted_at")
                                     ->whereNull("catalogo_localidad.deleted_at")
                                     ->whereNull("catalogo_municipio.deleted_at");


                            
                            // $arrayDistrito = explode(',', $access->distrito);
                            
                            if(!$access->is_admin){
                                $data = $data->whereIn("catalogo_distrito.id", $access->distritos);
                            }

                            $data = $data->orderBy("catalogo_distrito.id", "asc")
                            ->orderBy("catalogo_clues.clues", "asc")
                            ->orderBy("catalogo_localidad.id", "asc")
                            ->orderBy("catalogo_municipio.id", "asc");

                            $data = $data->get();
                            $columnas = array_keys(collect($data[0])->toArray());


                            if(isset($parametros['nombre_archivo']) && $parametros['nombre_archivo']){
                                $filename = $parametros['nombre_archivo'];
                            }else{
                                $filename = 'reporte';
                            }
                            return (new DevReportExport($data,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']*/
                        }catch(\Exception $e){
                            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
                        }
                    }
                }
                
            }

            return response()->json(['data'=>$objeto],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function aplicarFiltros($main_query, $parametros){
        //Filtros, busquedas, ordenamiento
        
        if(isset($parametros['municipio']) && $parametros['municipio']){
            $main_query = $main_query->where("catalogo_municipio_id", $parametros['municipio']);
        }

        if(isset($parametros['query']) && $parametros['query']){
            $main_query = $main_query->where(function($query)use($parametros){
                return $query->where('descripcion','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('clave_localidad','LIKE','%'.$parametros['query'].'%');
            });
        }
        
        if(isset($parametros['active_filter']) && $parametros['active_filter']){
            if(isset($parametros['municipio']) && $parametros['municipio']){
                $main_query = $main_query->where('catalogo_municipio_id',$parametros['municipio']);
            }

            if(isset($parametros['tipo']) && $parametros['tipo']){
                if($parametros['tipo'] == 1)
                {
                    $main_query = $main_query->whereRaw("catalogo_localidad.id in (select catalogo_localidad_id from catalogo_clues)");
                }
                
            }

            if(isset($parametros['regionalizado']) && $parametros['regionalizado']){
                if($parametros['regionalizado'] == 1)
                {
                    $main_query = $main_query->where(function($query)use($parametros){
                        return $query->//whereRaw("catalogo_localidad.id in (select catalogo_localidad_id from catalogo_clues)")
                                        WhereRaw('catalogo_localidad.id in (select catalogo_localidad_id from regionalizacion_clues where deleted_at is null)');
                    });
                }else if($parametros['regionalizado'] == 2)
                {
                    $main_query = $main_query->where(function($query)use($parametros){
                        return $query->whereRaw("catalogo_localidad.id not in (select catalogo_localidad_id from regionalizacion_clues where deleted_at is null)");
                                        //->WhereRaw('catalogo_localidad.id not in (select catalogo_localidad_id from regionalizacion_clues)');
                    });
                }
                
            }

            if(isset($parametros['orden']) && $parametros['orden']){
                if($parametros['orden'] == 1)
                {
                    $main_query = $main_query->orderBy("descripcion", "asc");
                }else if($parametros['orden'] == 2)
                {
                    $main_query = $main_query->orderBy("clave_localidad", "asc");
                }

            }
        }
        return $main_query;
    }

    public function show(Request $request, $id)
    {
        try{
            $params = $request->all();

            $objeto = Localidad::with("municipio.distrito", "poblacionInegi")->find($id);
            return response()->json(["data"=>$objeto],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    /**
     * sTORE the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        $reglas = [
            'municipio_id'               => 'required',
            'clave_localidad'            => 'required',
            'descripcion'                => 'required',
            'latitud'                    => 'required',
            'longitud'                   => 'required',
        ];
        
        
        DB::beginTransaction();
        
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = new Localidad();
            $object->catalogo_municipio_id =    $inputs['municipio_id'];
            $object->clave_localidad =          $inputs['clave_localidad'];
            $object->descripcion =              \Str::upper($inputs['descripcion']);
            $object->latitud =                  $inputs['latitud'];
            $object->longitud =                 $inputs['longitud'];
            
            $object->save();
            
            DB::commit();
            
        return response()->json(["data"=>$object/*, "r"=>$object_responsable/*, "d"=>$object_director*/],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }
    /**
     * sTORE the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        $reglas = [
            'municipio_id'               => 'required',
            'clave_localidad'                     => 'required',
            'descripcion'                         => 'required',
            'latitud'                         => 'required',
            'longitud'                         => 'required',
        ];
        
        DB::beginTransaction();

        $object = Localidad::find($id);
        if($object == null)
        {
            return response()->json(['error' => "El recurso no existe"], HttpResponse::HTTP_CONFLICT);
        }

        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            
            $object->catalogo_municipio_id =    $inputs['municipio_id'];
            $object->clave_localidad =          $inputs['clave_localidad'];
            $object->descripcion =              \Str::upper($inputs['descripcion']);
            $object->latitud =                  $inputs['latitud'];
            $object->longitud =                 $inputs['longitud'];

            $object->save();
            
            DB::commit();
            
        return response()->json(["data"=>$object/*, "r"=>$object_responsable/*, "d"=>$object_director*/],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function Destroy($id)
    {
        try{
            
            $object = Localidad::find($id);
            $object->delete();

            return response()->json(['data'=>"Registro Eliminado"], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        //$loggedUser->load('gruposUnidades.listaClues');
        $accessData = (object)[];
        $lista_clues = [];
        $distrito = [];
        $string_distrito = "";
        $distrito = $loggedUser->distrito->pluck("distrito_id");
        
        $accessData->lista_clues = $lista_clues;
        
        foreach ($distrito as $key => $value) {
           if($key > 0){ $string_distrito .=",";}
           $string_distrito .= $value;
        }
        $accessData->distrito = $string_distrito;
        $accessData->distritos = $distrito;
        
        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }
}
