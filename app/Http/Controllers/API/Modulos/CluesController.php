<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Clues;
use App\Models\Municipio;


class CluesController extends Controller
{
    public function index(Request $request)
    {
        try{
            $access = $this->getUserAccessData();
            //return $access;
            $parametros = $request->all();
            //return response()->json(['data'=>$access->lista_clues, "consulta"=>"hola"],HttpResponse::HTTP_OK);
            $clues = Clues::with('catalogo_localidad.municipio', 'catalogo_microrregion','distrito');
            
            if(!$access->is_admin){
                $clues = $clues->whereIn('distrito_id', $access->distrito);
            }
            
            if(isset($parametros['query'])){
                $clues = $clues->where(function($query)use($parametros){
                    return $query->where('clues','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }
            
            if(isset($parametros['page'])){
                $clues = $clues->orderBy('clues')->with('catalogo_localidad', 'catalogo_microrregion');
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $clues = $clues->paginate($resultadosPorPagina);
            }

            return response()->json(['data'=>$clues],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
    public function show($id)
    {
        try{
            $access = $this->getUserAccessData();
            $clues = Clues::where("clues", "=", $id)->with('catalogo_localidad', 'catalogo_microrregion', 'distrito');
            
            if(!$access->is_admin){
                $clues = $clues->whereIn('distrito_id', $access->distrito);
            }

            $clues = $clues->first();

            return response()->json(['data'=>$clues],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            'catalogo_microrregion_id'             => 'required',
            'catalogo_localidad'                => 'required',
            'descripcion'                => 'required',
            //'direccion'                => 'required',
            'cp'                => 'required',
            'telefono'                => 'required',
            'nucleos_camas'                => 'required',
            'latitud'                => 'required',
            'longitud'                => 'required',
        ];

        
        $object = Clues::find($id);
        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "Error en campos requeridos"], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            if($inputs['catalogo_localidad']['id'] != $object->catalogo_localidad_id)
            {
                $relacion = RelRegionalizacionClues::where("clues",$id)->where('tipo_localidad_regionalizacion','SEDE')->first();
                if($relacion)
                {
                    $relacion->delete();
                }
                $object = new RegionalizacionClues();
                $object->catalogo_localidad_id =    $inputs['localidad_id']['id'];
                $object->catalogo_tipo_camino_id =  1;
                $object->distancia =                0;
                $object->tiempo =                   0;
                $object->clues =                    $id;
                $object->save();
                DB::commit();
            }

            //$object->clues                          =    $inputs['clues'];
            $object->descripcion                    =    $inputs['descripcion'];
            $object->direccion                      =    $inputs['direccion'];
            $object->cp                             =    $inputs['cp'];
            $object->telefono                       =    $inputs['telefono'];
            $object->nucleos_camas                  =    $inputs['nucleos_camas'];
            //$object->inicio_operacion               =    $inputs['inicio_operacion'];
            //$object->fecha_operacion                =    $inputs['fecha_operacion'];
            $object->latitud                        =    $inputs['latitud'];
            $object->longitud                       =    $inputs['longitud'];
            $object->catalogo_microrregion_id       =    $inputs['catalogo_microrregion_id'];
            $object->catalogo_localidad_id          =    $inputs['catalogo_localidad']['id'];

            $object->update();
    
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
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

    public function infoClue($id){
        try{
            //$params = $request->all();
            //$access = $this->getUserAccessData();
            $clues = Clues::where("clues","=",$id)->with('catalogo_localidad', 'catalogo_microrregion', 'regionalizaciones.catalogo_localidad', 'regionalizaciones.catalogo_clues', 'regionalizaciones.catalogo_tipo_camino')->first();
            
            if(!$clues){
                throw new Exception("No se encontro la Clues que esta buscado", 1);
            }
            
            return response()->json(['data'=>$clues],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
