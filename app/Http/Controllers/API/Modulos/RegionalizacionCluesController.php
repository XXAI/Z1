<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use App\Models\TrabajadorExterno;
use App\Models\RegionalizacionClues;
use App\Models\Clues;
use App\Models\Localidad;

class RegionalizacionCluesController extends Controller
{
    public function index(Request $request)
    {
        try{
            //$access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = Clues::with("regionalizaciones", "catalogo_microrregion");

            /*if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->where('clave_colonia','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }*/
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $objeto = $objeto->paginate($resultadosPorPagina);
            }

            return response()->json(['data'=>$objeto],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show(Request $request, $id)
    {
        try{
            $parametros = $request->all();
            
            $objeto = Clues::with("regionalizaciones.catalogo_tipo_camino", "regionalizaciones.catalogo_localidad.municipio", "regionalizaciones.catalogo_clues");

            if(isset($parametros['query']) && $parametros['query'] =! ''){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->whereRaw(" clues in (select clues from regionalizacion_clues where catalogo_localidad_id in (select id from catalogo_localidad where descripcion LIKE '%".$parametros['query']."%'))");
                });
            }

            $objeto = $objeto->find($id);
            return response()->json(["data"=>$objeto],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function filtroLocalidades(Request $request, $id)
    {
        try{
            $parametros = $request->all();
            
            $objeto = Localidad::with("regionalizacion.catalogo_tipo_camino","regionalizacion.catalogo_clues", "municipio")
                        ->whereRaw(" catalogo_localidad.id in (select catalogo_localidad_id from regionalizacion_clues where clues='".$id."')");
                        //->join("regionalizacion_clues", "catalogo_localidad.id", "regionalizacion_clues.catalogo_localidad_id")
                        //                    ->where("regionalizacion_clues.clues", $id);

            if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $objeto = $objeto->paginate($resultadosPorPagina);
            }

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
            'localidad_id'     => 'required',
            'catalogo_tipo_camino_id'   => 'required',
            'distancia'                 => 'required',
            'tiempo'                    => 'required',
            'clues'                     => 'required'
        ];
        
        
        DB::beginTransaction();
        
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = new RegionalizacionClues();
            $object->catalogo_localidad_id =    $inputs['localidad_id']['id'];
            $object->catalogo_tipo_camino_id =  $inputs['catalogo_tipo_camino_id'];
            $object->distancia =                $inputs['distancia'];
            $object->tiempo =                   $inputs['tiempo'];
            $object->clues =                    $inputs['clues'];
            $object->save();
            DB::commit();
            
        return response()->json(["data"=>$object],HttpResponse::HTTP_OK);

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
            'localidad_id'     => 'required',
            'catalogo_tipo_camino_id'   => 'required',
            'distancia'                 => 'required',
            'tiempo'                    => 'required',
            'clues'                     => 'required'
        ];
        
        DB::beginTransaction();

        $object = RegionalizacionClues::find($id);
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
            
            $object->catalogo_localidad_id =    $inputs['localidad_id']['id'];
            $object->catalogo_tipo_camino_id =  $inputs['catalogo_tipo_camino_id'];
            $object->distancia =                $inputs['distancia'];
            $object->tiempo =                   $inputs['tiempo'];
            $object->clues =                    $inputs['clues']['clues'];
            $object->save();
            DB::commit();
            
        return response()->json(["data"=> $object],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function Destroy($id)
    {
        try{
            
            $object = RegionalizacionClues::find($id);
            $object->delete();

            return response()->json(['data'=>"Registro Eliminado"], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
