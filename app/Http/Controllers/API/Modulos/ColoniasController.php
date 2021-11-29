<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use App\Models\Colonias;

class ColoniasController extends Controller
{
    public function index(Request $request)
    {
        try{
            //$access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = Colonias::with("localidad.municipio.distrito")->whereNull("deleted_at");

            /*if(!$access->is_admin){
                $clues = $objeto->whereIn('clues', $access->lista_clues);
            }*/
            
            /*if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->where('clave_colonia','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }*/
            
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

            $objeto = Colonias::with("localidad.municipio.distrito")->find($id);
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
        $inputs['catalogo_localidad_id'] = $inputs['localidad_id']['id'];
        //$inputs = $inputs['params'];
        $reglas = [
            'catalogo_localidad_id'               => 'required',
            'clave_colonia'                     => 'required',
            'colonia'                         => 'required',
            'latitud'                         => 'required',
            'longitud'                         => 'required',
        ];
        
        
        DB::beginTransaction();
        
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = new Colonias();
            $object->catalogo_localidad_id =    $inputs['catalogo_localidad_id'];
            $object->clave_colonia =          \Str::upper($inputs['clave_colonia']);
            $object->descripcion =              \Str::upper($inputs['colonia']);
            $object->latitud =              \Str::upper($inputs['latitud']);
            $object->longitud =              \Str::upper($inputs['longitud']);
            
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
        $inputs['catalogo_localidad_id'] = $inputs['localidad_id']['id'];
        $reglas = [
            'catalogo_localidad_id'               => 'required',
            'clave_colonia'                     => 'required',
            'colonia'                         => 'required',
            'latitud'                         => 'required',
            'longitud'                         => 'required',
        ];
        
        DB::beginTransaction();

        $object = Colonias::find($id);
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
            
            $object->catalogo_localidad_id =    $inputs['catalogo_localidad_id'];
            $object->clave_colonia =          \Str::upper($inputs['clave_colonia']);
            $object->descripcion =              \Str::upper($inputs['colonia']);
            $object->latitud =              \Str::upper($inputs['latitud']);
            $object->longitud =              \Str::upper($inputs['longitud']);
            
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
            
            $object = Colonias::find($id);
            $object->delete();

            return response()->json(['data'=>"Registro Eliminado"], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
