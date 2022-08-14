<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use App\Models\TrabajadorExterno;
use App\Models\RegionalizacionClues;
use App\Models\Microrregion;
use App\Models\Clues;
use App\Models\Localidad;

class RegionalizacionCluesController extends Controller
{
    public function index(Request $request)
    {
        try{
            $access = $this->getUserAccessData();
            $parametros = $request->all();
            $objeto = Clues::select(
                "clues",
                "descripcion",
                DB::RAW("(select descripcion from catalogo_microregion where id=catalogo_clues.catalogo_microrregion_id) as categoria"),
                DB::RAW("(select descripcion_tipo from catalogo_microregion where id=catalogo_clues.catalogo_microrregion_id) as microregion"),
                DB::RAW("(select count(*) from regionalizacion_clues where clues=catalogo_clues.clues and deleted_at is null) as cantidad_localidades"),
                DB::RAW("(select clave_localidad from catalogo_localidad where id=catalogo_clues.catalogo_localidad_id) as clave_localidad"),
                DB::RAW("(select descripcion from catalogo_localidad where id=catalogo_clues.catalogo_localidad_id) as localidad"),
                DB::RAW("(select clave_municipio from catalogo_municipio where id =(select catalogo_municipio_id from catalogo_localidad where id=catalogo_clues.catalogo_localidad_id)) as clave_municipio"),
                DB::RAW("(select descripcion from catalogo_municipio where id =(select catalogo_municipio_id from catalogo_localidad where id=catalogo_clues.catalogo_localidad_id)) as municipio"),
                "latitud",
                "longitud"
            );

            

            if(!$access->is_admin){
                $objeto = $objeto->whereIn('distrito_id', $access->distrito);
            }

            if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->where('clues','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('descripcion','LIKE','%'.$parametros['query'].'%');
                });
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
            
            /*$objeto = Localidad::with("regionalizacion.catalogo_tipo_camino","regionalizacion.catalogo_clues", "municipio")
                        ->whereRaw(" catalogo_localidad.id in (select catalogo_localidad_id from regionalizacion_clues where clues='".$id."')");
                        //->join("regionalizacion_clues", "catalogo_localidad.id", "regionalizacion_clues.catalogo_localidad_id")
                        //                    ->where("regionalizacion_clues.clues", $id);
            */

            $objeto = RegionalizacionClues::with("catalogo_localidad.municipio", "catalogo_tipo_camino", "catalogo_clues")->where("clues", $id)->orderBy("tipo_localidad_regionalizacion",'ASC');

            if(isset($parametros['query'])){
                $objeto = $objeto->where(function($query)use($parametros){
                    return $query->whereRaw("regionalizacion_clues.catalogo_localidad_id in (select id from catalogo_localidad where descripcion LIKE '%".$parametros['query']."%')");
                });
            }
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $objeto = $objeto->paginate($resultadosPorPagina);
            }

            $clues = Clues::with("catalogo_localidad","catalogo_microrregion")->find($id);

            return response()->json(["data"=>$objeto, "clues"=>$clues],HttpResponse::HTTP_OK);
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
            'clues'                     => 'required',
            'poblacion_real'            => 'required'
        ];
        
        
        DB::beginTransaction();
        
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = new RegionalizacionClues();
            $object->catalogo_localidad_id          = $inputs['localidad_id']['id'];
            $object->catalogo_tipo_camino_id        = $inputs['catalogo_tipo_camino_id'];
            $object->distancia                      = $inputs['distancia'];
            $object->tiempo                         = $inputs['tiempo'];
            $object->clues                          = $inputs['clues'];
            $object->tipo_localidad_regionalizacion = $inputs['tipo_localidad_regionalizacion'];
            $object->save();

            $localidad = Localidad::find($inputs['localidad_id']['id']);
            if($localidad)
            {
                $localidad->poblacion_real = $inputs['poblacion_real'];
                $localidad->save();
            }
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
            'clues'                     => 'required',
            'poblacion_real'            => 'required'
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
            $object->clues =                    $inputs['clues'];
            $object->tipo_localidad_regionalizacion = $inputs['tipo_localidad_regionalizacion'];
            $object->save();
            
            $localidad = Localidad::find($inputs['localidad_id']['id']);
            if($localidad)
            {
                $localidad->poblacion_real = $inputs['poblacion_real'];
                $localidad->save();
            }
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
    public function getLocalidades($id)
    {
        try{
            $object = Localidad::Join("regionalizacion_clues", "regionalizacion_clues.catalogo_localidad_id", "catalogo_localidad.id")
            ->whereNull("regionalizacion_clues.deleted_at")
            ->where("regionalizacion_clues.tipo_localidad_regionalizacion","!=", "'SEDE'")
            ->whereRAW("regionalizacion_clues.clues='".$id."'")
            ->get();

            $personal_salud = DB::Table("regionalizacion_rh")->join("trabajador", "trabajador.id", "regionalizacion_rh.trabajador_id")
                                               ->join("catalogo_tipo_trabajador", "trabajador.tipo_personal_id", "catalogo_tipo_trabajador.id")
                                               ->whereRaw("regionalizacion_rh.clues = '".$id."'")
                                               ->where("regionalizacion_rh.tipo_trabajador_id",1)
                                               ->groupBy("trabajador.tipo_personal_id")
                                               ->select("catalogo_tipo_trabajador.abreviatura","catalogo_tipo_trabajador.descripcion",DB::RAW("count(*) as cantidad"))
                                               ->get();

            $externo = DB::Table("regionalizacion_rh")->join("trabajador_externo", "trabajador_externo.id", "regionalizacion_rh.trabajador_id")
                                                ->join("regionalizacion_clues", "regionalizacion_clues.catalogo_localidad_id", "regionalizacion_rh.catalogo_localidad_id")
                                               ->join("catalogo_tipo_trabajador", "trabajador_externo.tipo_personal_id", "catalogo_tipo_trabajador.id")
                                               ->whereRaw("regionalizacion_clues.clues = '".$id."'")
                                               ->where("regionalizacion_rh.tipo_trabajador_id",2)
                                               ->groupBy("trabajador_externo.tipo_personal_id")
                                               ->select("catalogo_tipo_trabajador.abreviatura","catalogo_tipo_trabajador.descripcion",DB::RAW("count(*) as cantidad"))
                                               ->get();
            return response()->json(['localidades'=>$object, "salud"=>$personal_salud, "externo"=>$externo], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        
        $loggedUser->load('gruposUnidades.listaClues');
        $accessData = (object)[];
        $lista_clues = [];
        $distrito = [];
        foreach ($loggedUser->gruposUnidades as $grupo) {
            $lista_unidades = $grupo->listaClues->pluck('clues')->toArray();
            $lista_clues += $lista_clues + array_values($lista_unidades);
        }
        
        $distrito = $loggedUser->distrito->pluck("distrito_id");
        
        $accessData->lista_clues = $lista_clues;
        $accessData->distrito = $distrito;
        
        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }

    public function getMapa(Request $request)
    {
        try{
            $inputs = $request->all();
            $objeto = Clues::with("catalogo_localidad", "catalogo_microrregion.tipo_unidad")->whereNull("deleted_at");
            $localidadesReg = Localidad::whereNull("deleted_at");
            $localidadesNoReg = Localidad::whereNull("deleted_at");
           
                
            if($inputs['jurisdiccion_id']!=0 && $inputs['jurisdiccion_id']!="")
            {
                $objeto = $objeto->where("distrito_id",$inputs['jurisdiccion_id']);
            }

            if($inputs['municipio_id']!=0 && $inputs['municipio_id']!="")
            {
                $objeto = $objeto->whereRaw("catalogo_localidad_id in (select id from catalogo_localidad where catalogo_municipio_id =".$inputs['municipio_id'].")");
            }

            
            
            if($inputs['tipo']!=0 && $inputs['tipo']!="")
            {
                if($inputs['microrregion']!=0 && $inputs['microrregion']!="")
                {
                    $objeto = $objeto->where("catalogo_microrregion_id",$inputs['microrregion']);
                }else
                {
                    $objeto = $objeto->whereRaw("catalogo_microrregion_id in (select id from catalogo_microregion where catalogo_tipo_unidad_id =".$inputs['tipo'].")");
                }
            }

            if($inputs['clues']!="")
            {
                $objeto = $objeto->where("clues",$inputs['clues']);
            }

            if($inputs['localidad']!="")
            {
                $objeto = $objeto->whereRaw("catalogo_localidad_id in (select id from catalogo_localidad where descripcion like '".$inputs['localidad']."' and deleted_at is null)");
            }

            $objeto = $objeto->get();
            
            if($inputs['regionalizacion'] != 0)
            {
                
                if($inputs['localidad']!="")
                {
                    $localidadesReg = $localidadesReg->where("descripcion",$inputs['localidad']);
                    $localidadesNoReg = $localidadesNoReg->where("descripcion",$inputs['localidad']);
                }

                if($inputs['jurisdiccion_id']!=0 && $inputs['jurisdiccion_id']!="")
                {
                    if($inputs['municipio_id']!=0 && $inputs['municipio_id']!="")
                    {
                        $localidadesReg = $localidadesReg->where("catalogo_municipio_id",$inputs['municipio_id']);
                        $localidadesNoReg = $localidadesNoReg->where("catalogo_municipio_id",$inputs['municipio_id']);
                    }else{
                        $localidadesReg = $localidadesReg->whereRaw("catalogo_municipio_id in (select id from catalogo_municipio where catalogo_distrito_id =".$inputs['jurisdiccion_id'].")");
                        $localidadesNoReg = $localidadesNoReg->whereRaw("catalogo_municipio_id in (select id from catalogo_municipio where catalogo_distrito_id =".$inputs['jurisdiccion_id'].")");
                    }
                }
                if($inputs['regionalizacion'] == 1)
                {
                    $localidadesReg = $localidadesReg->whereRaw("id in (select catalogo_localidad_id from regionalizacion_clues where deleted_at is null)");
                    $localidadesReg = $localidadesReg->get();
                }else if($inputs['regionalizacion'] == 2){
                    $localidadesNoReg = $localidadesNoReg->whereRaw("id not in (select catalogo_localidad_id from regionalizacion_clues where deleted_at is null)");
                    $localidadesNoReg = $localidadesNoReg->get();
                }

                
                    
            }

            return response()->json(['clues'=>$objeto, "localidadesReg"=>$localidadesReg, "localidadesNoReg"=>$localidadesNoReg], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        
    }
}
