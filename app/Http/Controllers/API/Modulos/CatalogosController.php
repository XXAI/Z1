<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Models\Distrito;
use App\Models\Municipio;
use App\Models\Localidad;
use App\Models\UR;
use App\Models\Sexo;
use App\Models\Lengua;
use App\Models\Clues;

class CatalogosController extends Controller
{
    public function index(Request $request)
    {
        try{
            $params = $request->all();
            
            $distrito = Distrito::orderBy("id")->get();
            $ur = UR::orderBy("descripcion")->get();
            $sexo = Sexo::orderBy("id")->get();
            $lengua = Lengua::orderBy("id")->get();
            
            $catalogos = [
                "distrito" => $distrito,
                "ur" => $ur,
                "sexo" => $sexo,
                "lengua" => $lengua
            ];

            return response()->json($catalogos,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function catalogoMunicipio(Request $request, $id)
    {
        try{
            $params = $request->all();
            //return response()->json($params,HttpResponse::HTTP_OK);
            $municipio = Municipio::where("catalogo_distrito_id", $id)->orderBy("id")->get();
            
            return response()->json($municipio,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function catalogoLocalidad(Request $request)
    {
        try{
            $params = $request->all();
            //return response()->json($params,HttpResponse::HTTP_OK);
            $obj = Localidad::where("catalogo_municipio_id", $params['municipio_id'])->orderBy("id")->get();
            
            return response()->json($obj,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function catalogoClues(Request $request)
    {
        try{
            $params = $request->all();
            $obj = Clues::where('descripcion','LIKE','%'.$params['query'].'%')->orderBy("descripcion")->get();
            
            return response()->json($obj,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
