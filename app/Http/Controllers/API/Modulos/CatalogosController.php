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
use App\Models\TipoTrabajador;
use App\Models\TipoCamino;
use App\Models\TipoLocalidad;
use App\Models\Microrregion;

class CatalogosController extends Controller
{
    public function index(Request $request)
    {
        try{
            $access = $this->getUserAccessData();
            $params = $request->all();
            
            $distrito           = Distrito::orderBy("id");
            $ur                 = UR::orderBy("descripcion");
            $sexo               = Sexo::orderBy("id");
            $lengua             = Lengua::orderBy("id");
            $personalSalud      = TipoTrabajador::where("tipo", 1)->orderBy("id");
            $personalExterno    = TipoTrabajador::where("tipo", 2)->orderBy("id");
            $municipio          = Municipio::orderBy("descripcion");
            $camino             = TipoCamino::orderBy("descripcion");
            $tipoLocalidad      = TipoLocalidad::orderBy("descripcion");
            $microrregion      = Microrregion::orderBy("descripcion");
            
            if(!$access->is_admin){
                $distrito = $distrito->whereRaw('id in ('. $access->distrito.')');
                $municipio = $municipio->whereRaw('catalogo_distrito_id in ('. $access->distrito.')');
                //$personalSalud = $personalSalud->whereRaw('id in ', $access->distrito);
            }

            $distrito           = $distrito->get();
            $ur                 = $ur->get();
            $sexo               = $sexo->get();
            $lengua             = $lengua->get();
            $personalSalud      = $personalSalud->get();
            $personalExterno    = $personalExterno->get();
            $municipio          = $municipio->get();
            $camino             = $camino->get();
            $tipoLocalidad      = $tipoLocalidad->get();  
            $microrregion       = $microrregion->get();  

            $catalogos = [
                "distrito"          => $distrito,
                "ur"                => $ur,
                "sexo"              => $sexo,
                "perosonalSalud"    => $personalSalud,
                "personalExterno"   => $personalExterno,
                'lengua'            => $lengua,
                'municipio'         => $municipio,
                'camino'            => $camino,
                'tipoLocalidad'     => $tipoLocalidad,
                'microrregion'      => $microrregion,
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
    
    public function getMunicipioAutocomplete(Request $request)
    {
        try{
            $municipio = Municipio::orderBy("descripcion")->get();
            
            return response()->json($municipio,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function catalogoLocalidad(Request $request)
    {
        try{
            $params = $request->all();
            $access = $this->getUserAccessData();

            $obj = Localidad::where("catalogo_municipio_id", $params['municipio_id'])->where('descripcion','LIKE','%'.$params['query'].'%');
            if(!$access->is_admin){
                $obj = $obj->where(function($obj)use($params, $access){
                    return $obj->whereRaw(" catalogo_localidad.id in (select catalogo_localidad_id from catalogo_clues where distrito_id in (".$access->distrito."))")
                                ->orWhereRaw("catalogo_localidad.id in (select catalogo_localidad_id from regionalizacion_clues where clues in (select catalogo_localidad_id from catalogo_clues where distrito_id in (".$access->distrito.")))");
                });
            }
            $obj = $obj->limit(5);
            $obj = $obj->get();
            return response()->json($obj,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function catalogoClues(Request $request)
    {
        try{
            $params = $request->all();
            $access = $this->getUserAccessData();
            $obj = Clues::with("catalogo_localidad.municipio", "distrito")->where('descripcion','LIKE','%'.$params['query'].'%')->orderBy("descripcion");
            if(!$access->is_admin){
                $obj = $obj->whereRaw("distrito_id in (".$access->distrito.")");
            }
            $obj = $obj->get();
            return response()->json($obj,HttpResponse::HTTP_OK);
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
        $accessData->arreglo_distrito = $distrito;
        
        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }
}
