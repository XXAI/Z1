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
            $access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = TrabajadorExterno::join("regionalizacion_rh", "regionalizacion_rh.trabajador_id", "=", "trabajador_externo.id")
                                ->join("catalogo_localidad", "regionalizacion_rh.catalogo_localidad_id", "catalogo_localidad.id")
                                ->join("catalogo_municipio", "catalogo_municipio.id", "catalogo_localidad.catalogo_municipio_id")
                                ->join("catalogo_tipo_trabajador", "trabajador_externo.tipo_personal_id", "catalogo_tipo_trabajador.id")
                                    ->where("regionalizacion_rh.tipo_trabajador_id", 2)->whereNull("trabajador_externo.deleted_at")
                                    ->select("trabajador_externo.id", 
                                    "trabajador_externo.rfc", 
                                    "trabajador_externo.curp", 
                                    "trabajador_externo.nombre", 
                                    "trabajador_externo.apellido_paterno", 
                                    "trabajador_externo.apellido_materno", 
                                    "catalogo_localidad.clave_localidad",
                                    "catalogo_localidad.descripcion as localidad", 
                                    "catalogo_municipio.clave_municipio", 
                                    "catalogo_municipio.descripcion as municipio", 
                                    "catalogo_tipo_trabajador.abreviatura as abreviatura", 
                                    "catalogo_tipo_trabajador.descripcion as tipo_trabajador",
                                    DB::RAW("(select clues from regionalizacion_clues where catalogo_localidad_id = regionalizacion_rh.catalogo_localidad_id) as clues"),
                                    DB::RAW("(select descripcion from catalogo_clues where clues =(select clues from regionalizacion_clues where catalogo_localidad_id = regionalizacion_rh.catalogo_localidad_id)) as nombre_unidad")
                                );

            if(!$access->is_admin){
                $objeto = $objeto->whereRaw("regionalizacion_rh.catalogo_localidad_id in (select catalogo_localidad_id from regionalizacion_clues where clues in (select clues from catalogo_clues where distrito_id in (".$access->distrito.")))")
                            ->orWhereRaw(" catalogo_localidad.id in (select catalogo_localidad_id from catalogo_clues where distrito_id in (". $access->distrito."))");
            }
           
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

            $objeto = TrabajadorExterno::with("lengua", "sexo", "rel_regionalizacion_rh.localidad.municipio")->find($id);
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
            'tipo_personal'    => 'required',
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
            $object->catalogo_lengua_id     = $inputs['catalogo_lengua_id'];
            $object->tipo_personal_id       = $inputs['tipo_personal'];
            
            $object->save();
            $relacion = new RelRegionalizacionRh();
            $relacion->catalogo_localidad_id = $inputs['localidad_id']['id'];
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
            'tipo_personal'    => 'required',
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
            $object->tipo_personal_id       = $inputs['tipo_personal'];
            
            $object->save();
            
            $object = TrabajadorExterno::find($id)->rel_regionalizacion_rh()->update(['catalogo_localidad_id' =>$inputs['localidad_id']['id']]);

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
        
        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }
}
