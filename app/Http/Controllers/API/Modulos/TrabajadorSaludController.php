<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use App\Models\Trabajador;
use App\Models\RelRegionalizacionRh;

class TrabajadorSaludController extends Controller
{
    public function index(Request $request)
    {
        try{
            //$access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = Trabajador::join("regionalizacion_rh", "regionalizacion_rh.trabajador_id", "=", "trabajador.id")
                                ->join("catalogo_clues", "catalogo_clues.clues", "regionalizacion_rh.clues")
                                    ->where("regionalizacion_rh.tipo_trabajador_id", 1)
                                    ->whereNull("trabajador.deleted_at")
                                    ->whereNull("regionalizacion_rh.deleted_at")
                                    ->select("trabajador.id", "rfc", "curp", "nombre", "apellido_paterno", "apellido_materno", "regionalizacion_rh.clues", "catalogo_clues.descripcion");

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

            $objeto = Trabajador::with("lengua", "sexo", "ur", "rel_rh.clues")->find($id);
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
            'ur'                    => 'required',
        ];
        
        
        DB::beginTransaction();
        
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = new Trabajador();
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
            $relacion->tipo_trabajador_id = 1;
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

        $object = Trabajador::find($id);
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
            
            /*if($inputs['clues']['clues'] != null)
            {*/
                $relacion = Trabajador::find($id)->rel_rh()->update(['clues' =>$inputs['clues']['clues']]);
            /*}else{
                //$relacion = Trabajador::find($id)->rel_clues()->update(['clues' =>"hola"]);
            }*/
                        
            DB::commit();
            
        return response()->json(["data"=> $relacion],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function Destroy($id)
    {
        try{
            
            $object = Trabajador::with("rel_rh")->find($id);
            $relacion = RelRegionalizacionRh::find($object->rel_rh->id);
            $relacion->delete();

            return response()->json(['data'=>$object], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}