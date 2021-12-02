<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\GrupoUnidades;

class GrupoUnidadesController extends Controller
{
    public function index(Request $request)
    {
        try{
            $parametros = $request->all();
            $grupos = GrupoUnidades::with('crPrincipal');

            /*if(isset($parametros['lista-cr']) && $parametros['lista-cr']){
                $grupos = $grupos->with('listaCr');
            }*/

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $grupos = $grupos->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $grupos = $grupos->paginate($resultadosPorPagina);
            } else {
                $grupos = $grupos->get();
            }

            return response()->json(['data'=>$grupos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
    public function show($id)
    {
        try{
            $grupo = GrupoUnidades::with('listaCR')->find($id);
            return response()->json(['data'=>$grupo],HttpResponse::HTTP_OK);
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
            'required'           => "required",
        ];

        $reglas = [
            'descripcion'        => 'required',
            //'tipo_profesion_id'  => 'required',
        ];

        $object = GrupoUnidades::find($id);
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
            
            $object->descripcion            = $inputs['descripcion'];
            $object->finalizado             = $inputs['finalizado'];

            $object->save();
    
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

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
    public function store(Request $request)
    {
        try{
            $validation_rules = [
                'descripcion' => 'required',
            ];
        
            $validation_eror_messages = [
                'descripcion.required' => 'El nombre es requerido',
            ];

            $parametros = $request->all(); 
            
            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                DB::beginTransaction();

                $parametros['total_elementos'] = count($parametros['lista_cr']);

                $grupo = GrupoUnidad::create($parametros);

                $lista_cr = array_map(function($n){ return [$n['cr']=>['clues'=>$n['clues']]]; },$parametros['lista_cr']);

                if($grupo){
                    $grupo->listaCR()->sync($lista_cr);
                    $grupo->save();
                    DB::commit();
                    return response()->json(['data'=>$grupo], HttpResponse::HTTP_OK);
                }else{
                    DB::rollback();
                    return response()->json(['error'=>'No se pudo crear el Grupo'], HttpResponse::HTTP_CONFLICT);
                }
            }else{
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function finalizarCaptura($grupoID = null){
        DB::beginTransaction();
        try {
            
            if(!$grupoID){
                $loggedUser = auth()->userOrFail();
                $loggedUser->load('gruposUnidades');
    
                foreach ($loggedUser->gruposUnidades as $grupo) {
                    $grupo->finalizado = 1;
                    $grupo->save();
                }

            }else{
                $grupo = GrupoUnidades::find($grupoID);
                $grupo->finalizado = 1;
                $grupo->save();
            }

            DB::commit();
            return response()->json(['finalizado'=>true,'grupos'=>($grupoID)?$grupo:$loggedUser->gruposUnidades],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function habilitarCaptura($grupoID = null){
        DB::beginTransaction();
        try {
            
            if(!$grupoID){
                $loggedUser = auth()->userOrFail();
                $loggedUser->load('gruposUnidades');
    
                foreach ($loggedUser->gruposUnidades as $grupo) {
                    $grupo->finalizado = 0;
                    $grupo->save();
                }

            }else{
                $grupo = GrupoUnidades::find($grupoID);
                $grupo->finalizado = 0;
                $grupo->save();
            }

            DB::commit();
            return response()->json(['finalizado'=>true,'grupos'=>($grupoID)?$grupo:$loggedUser->gruposUnidades],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }
}
