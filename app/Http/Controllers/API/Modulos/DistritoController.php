<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Distrito;

class DistritoController extends Controller
{
    public function index(Request $request)
    {
        try{
            $parametros = $request->all();
            $distrito = Distrito::whereNull("deleted_at");

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $distrito = $distrito->where(function($query)use($parametros){
                    return $distrito->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $distrito = $distrito->paginate($resultadosPorPagina);
            } else {
                $distrito = $distrito->get();
            }

            return response()->json(['data'=>$distrito],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
