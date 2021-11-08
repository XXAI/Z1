<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use App\Models\TrabajadorExterno;
use App\Models\RelRegionalizacionRh;

class TrabajadorExternoController extends Controller
{
    public function index(Request $request)
    {
        try{
            //$access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = TrabajadorExterno::join("regionalizacion_rh", "regionalizacion_rh.trabajador_id", "=", "trabajador_externo.id")
                                ->join("catalogo_clues", "catalogo_clues.clues", "regionalizacion_rh.clues")
                                    ->where("regionalizacion_rh.tipo_trabajador_id", 2)->whereNull("trabajador_externo.deleted_at")
                                    ->select("trabajador_externo.id", "rfc", "curp", "nombre", "apellido_paterno", "apellido_materno", "regionalizacion_rh.clues", "catalogo_clues.descripcion");

           
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
            $params = $request->all();

            $objeto = TrabajadorExterno::with("lengua", "sexo", "UR", "rel_regionalizacion_rh.clues")->find($id);
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
            'rfc'                   => 'required',
            'curp'                  => 'required',
            'nombre'                => 'required',
            'edad'                  => 'required',
            'sexo_id'               => 'required',
            'catalogo_lengua_id'    => 'required',
            'ur'    => 'required',
        ];
        
        
        DB::beginTransaction();
        
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = new TrabajadorExterno();
            $object->rfc =                  \Str::upper($inputs['rfc']);
            $object->curp =                  \Str::upper($inputs['curp']);
            $object->nombre =               \Str::upper($inputs['nombre']);
            $object->apellido_paterno =     \Str::upper($inputs['apellido_paterno']);
            $object->apellido_materno =     \Str::upper($inputs['apellido_materno']);
            $object->edad             =     $inputs['edad'];
            $object->sexo_id          =     $inputs['sexo_id'];
            $object->catalogo_lengua_id          =     $inputs['catalogo_lengua_id'];
            $object->ur                      =     $inputs['ur'];
            
            $object->save();
            $relacion = new RelRegionalizacionRh();
            $relacion->clues = $inputs['clues']['clues'];
            $relacion->trabajador_id = $object->id;
            $relacion->tipo_trabajador_id = 2;
            $relacion->save();
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
            'rfc'                   => 'required',
            'curp'                  => 'required',
            'nombre'                => 'required',
            'edad'                  => 'required',
            'sexo_id'               => 'required',
            'catalogo_lengua_id'    => 'required',
            'ur'    => 'required',
        ];
        
        DB::beginTransaction();

        $object = TrabajadorExterno::find($id);
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
            
            $object->rfc =                  \Str::upper($inputs['rfc']);
            $object->curp =                 \Str::upper($inputs['curp']);
            $object->nombre =               \Str::upper($inputs['nombre']);
            $object->apellido_paterno =     \Str::upper($inputs['apellido_paterno']);
            $object->apellido_materno =     \Str::upper($inputs['apellido_materno']);
            $object->edad             =     $inputs['edad'];
            $object->sexo_id          =     $inputs['sexo_id'];
            $object->catalogo_lengua_id          =     $inputs['catalogo_lengua_id'];
            $object->ur                      =     $inputs['ur'];
            
            $object->save();
            
            $object = TrabajadorExterno::find($id)->rel_regionalizacion_rh()->update(['clues' =>$inputs['clues']['clues']]);
            //$relacion = RelRegionalizacionRh::where("trabajador_id", "=",$object->id);
            //$relacion->clues = $inputs['clues']['clues'];
            //$relacion->save();

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
            
            $object = TrabajadorExterno::find($id);
            $object->delete();

            return response()->json(['data'=>"Registro Eliminado"], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
