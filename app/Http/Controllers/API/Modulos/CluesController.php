<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Clues;


class CluesController extends Controller
{
    public function index(Request $request)
    {
        try{
            $access = $this->getUserAccessData();
            $parametros = $request->all();

            $clues = Clues::whereNull("deleted_at");

            if(!$access->is_admin){
                $clues = $clues->whereIn('clues', $access->lista_clues)->with('catalogo_localidad', 'catalogo_microrregion');
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
            $clues = Clues::where("clues", "=", $id)->with('catalogo_localidad', 'catalogo_microrregion');
            
            if(!$access->is_admin){
                $clues = $clues->whereIn('clues', $access->lista_clues)->with('catalogo_localidad', 'catalogo_microrregion');
            }

            $clues = $clues->with('catalogo_localidad', 'catalogo_microrregion')->first();

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

        $object = $request->all();

        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            'microrregion_id'             => 'required',
            'localidad_id'                => 'required',
            
        ];

        
        $object = Clues::where("clues", "=", $id)->first();
        //return response()->json($object,HttpResponse::HTTP_OK);
        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $object->clues                          =    $inputs['clues'];
            $object->descripcion                    =    $inputs['descripcion'];
            $object->direccion                      =    $inputs['direccion'];
            $object->cp                             =    $inputs['cp'];
            $object->telefono                       =    $inputs['telefono'];
            $object->nucleos_camas                  =    $inputs['nucleos_camas'];
            $object->inicio_operacion               =    $inputs['inicio_operacion'];
            $object->fecha_operacion                =    $inputs['fecha_operacion'];
            $object->latitud                        =    $inputs['latitud'];
            $object->longitud                       =    $inputs['longitud'];
            $object->catalogo_microrregion_id       =    $inputs['microrregion_id'];
            $object->catalogo_localidad_id          =    $inputs['localidad_id'];


            //return response()->json($object,HttpResponse::HTTP_OK);

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
        
        //$loggedUser->load('perfilCr');
        $loggedUser->load('gruposUnidades.listaCR');
        
        $lista_cr = [];
        $lista_clues = [];
        
        foreach ($loggedUser->gruposUnidades as $grupo) {
            $lista_unidades = $grupo->listaCR->pluck('clues','cr')->toArray();
            
            $lista_clues += $lista_clues + array_values($lista_unidades);
            $lista_cr += $lista_cr + array_keys($lista_unidades);
        }

        $accessData = (object)[];
        $accessData->lista_clues = $lista_clues;
        $accessData->lista_cr = $lista_cr;

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
            $clues = Clues::where("clues","=",$id)->with('catalogo_localidad', 'catalogo_microrregion')->first();

            if(!$clues){
                throw new Exception("No se encontro la Clues que esta buscado", 1);
            }
            
            return response()->json(['data'=>$clues],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
