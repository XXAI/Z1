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
use App\Models\Trabajador;
use App\Models\RelRegionalizacionRh;


class RegionalizacionCluesPersonalController extends Controller
{

    public function index(Request $request)
    {
        try{
            //$access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = Trabajador::with("rel_rh.clues", "personal_salud", "ur")->whereRaw("trabajador.id in (select trabajador_id from regionalizacion_rh where tipo_trabajador_id=1 and deleted_at is null)");

            if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->whereRaw(' concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
                });
            }
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $objeto = $objeto->paginate($resultadosPorPagina);
            }

            $objeto_externo = TrabajadorExterno::with("rel_rh.localidad.municipio", "personal_externo")->whereRaw("trabajador_externo.id in (select trabajador_id from regionalizacion_rh where tipo_trabajador_id=2 and deleted_at is null)");

            if(isset($parametros['query'])){
                $objeto_externo = $objeto_externo->where(function($query)use($parametros){
                    return $query->whereRaw(' concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
                });
            }
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $objeto_externo = $objeto_externo->paginate($resultadosPorPagina);
            }

            return response()->json(['salud'=>$objeto, 'externo'=>$objeto_externo ],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function show(Request $request, $id)
    {
        try{
            //$access = $this->getUserAccessData();
            $parametros = $request->all();
            if($parametros['tipo'] == 1)
            {
                $objeto = Trabajador::with("rel_rh.clues")->find($id);
            }else{
                $objeto = TrabajadorExterno::with("rel_rh.localidad.municipio")->find($id);
            }
            
            return response()->json(['data'=>$objeto],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function buscarPersonal(Request $request)
    {
        try{
            $parametros = $request->all();
            
            if($parametros['tipo'] == 1)
            {
                $objeto = Trabajador::
                whereRaw("trabajador.id not in (select trabajador_id from regionalizacion_rh where tipo_trabajador_id=".$parametros['tipo']."  and deleted_at is null)");
            
            }else if($parametros['tipo'] == 2)
            {
                $objeto = TrabajadorExterno::whereRaw("trabajador_externo.id not in (select trabajador_id from regionalizacion_rh where tipo_trabajador_id=".$parametros['tipo']." and deleted_at is null)");
            }

            $objeto = $objeto->where(function($query)use($parametros){
                return $query->whereRaw('concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
            });
            
            $objeto = $objeto->get();
            return response()->json($objeto,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function transferirPersonal(Request $request)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        $reglas = [
            'clues'              => 'required',
            'clues_anterior'     => 'required',
            'trabajador_id'      => 'required',
        ];
        
        DB::beginTransaction();
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = RelRegionalizacionRh::where("clues", $inputs['clues_anterior'])->where("trabajador_id", $inputs['trabajador_id']);
            $object->delete();
            
            $nuevo = new RelRegionalizacionRh();
            $nuevo->clues               = $inputs['clues']['clues'];
            $nuevo->tipo_trabajador_id  = 1;
            $nuevo->trabajador_id       = $inputs['trabajador_id'];
            $nuevo->save();
            DB::commit();
            
        return response()->json(["data"=>$nuevo],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }
    /*
    public function filtroSalud(Request $request)
    {
        try{
            $parametros = $request->all();
            
            $objeto = Trabajador::with("ur", "rel_clues.catalogo_clues")
                        ->whereRaw(" trabajador.id in (select trabajador_id from regionalizacion_rh where tipo_trabajador_id= 1 and deleted_at is null)");


            if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->whereRaw('concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                    ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                    ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
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

    public function filtroExterno(Request $request, $id)
    {
        try{
            $parametros = $request->all();
            
            $objeto = TrabajadorExterno::with("personal_externo", "rel_rh.localidad.municipio")
                        ->whereRaw("trabajador_externo.id in 
                        (select trabajador_id from regionalizacion_rh where tipo_trabajador_id=2 and deleted_at is null and catalogo_localidad_id in 
                        (select catalogo_localidad_id from regionalizacion_clues where clues='".$id."' and deleted_at is null))");


            if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->whereRaw('concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                    ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                    ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
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
    */
   
    public function store(Request $request)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        if($inputs['tipo_trabajador_id'] == 1)
        {
            $reglas = [
                'clues'              => 'required'
            ];
        }else if($inputs['tipo_trabajador_id'] == 2){
            $reglas = [
                'localidad_id'              => 'required',
            ];
        }
          DB::beginTransaction();
        
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = new RelRegionalizacionRh();
            $object->tipo_trabajador_id          = $inputs['tipo_trabajador_id'];
            if($inputs['tipo_trabajador_id'] == 1)
            {
                $object->trabajador_id  = $inputs['personal_id']['id'];
                $object->clues          = $inputs['clues']['clues'];
                
            }else if($inputs['tipo_trabajador_id'] == 2){
                $object->trabajador_id          = $inputs['personal_id']['id'];
                $object->catalogo_localidad_id  = $inputs['localidad_id']['id'];
            }
            $object->save();
            DB::commit();
            
        return response()->json(["data"=>$object],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    
    public function update(Request $request, $id)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        
        if($inputs['tipo_trabajador_id'] == 1)
        {
            $reglas = [
                'clues'              => 'required'
            ];
        }else if($inputs['tipo_trabajador_id'] == 2){
            $reglas = [
                'localidad_id'              => 'required',
            ];
        }
        
        DB::beginTransaction();

        $object = RelRegionalizacionRh::where("trabajador_id", $id)->where("tipo_trabajador_id", $inputs['tipo_trabajador_id'])->first();
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
            if($inputs['tipo_trabajador_id'] == 1)
            {
                $object->clues =                    $inputs['clues']['clues'];
            }else if($inputs['tipo_trabajador_id'] == 2){
                $object->catalogo_localidad_id =    $inputs['localidad_id']['id'];
            }

            $object->save();
            DB::commit();
            
        return response()->json(["data"=> $object],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function Destroy(Request $request, $id)
    {
        try{
            
            $params = $request->all();
            $object = RelRegionalizacionRh::where("tipo_trabajador_id", $params['tipo_personal'])->where("trabajador_id", $id);
            $object->delete();

            return response()->json(['data'=>"Registro Eliminado"], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
}
