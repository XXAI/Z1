<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use App\Models\Localidad;

class LocalidadController extends Controller
{
    public function index(Request $request)
    {
        try{
            //$access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = Localidad::with("municipio.distrito");

            /*if(!$access->is_admin){
                $clues = $objeto->whereIn('clues', $access->lista_clues);
            }*/
            
            if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('clave_localidad','LIKE','%'.$parametros['query'].'%');
                });
            }
            
            if(isset($parametros['page'])){
                $objeto = $objeto->orderBy('descripcion');
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
            $params = $request->all();

            $objeto = Localidad::with("municipio.distrito")->find($id);
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
            'tipo_localidad'             => 'required',
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
            $object->tipo_localidad =           $inputs['tipo_localidad'];
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
            'tipo_localidad'                         => 'required',
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
            $object->tipo_localidad =           $inputs['tipo_localidad'];
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
}
