<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Models\Microrregion;
use App\Models\Localidad;
use App\Models\TipoCamino;




class SearchCatalogsController extends Controller
{
    public function getProfesionAutocomplete(Request $request)
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $profesiones = Profesion::select('id', 'descripcion');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $profesiones = $profesiones->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['filter']) && $parametros['filter']){
                switch ($parametros['filter']) {
                    case 'LIC':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[1,2]);
                        break;
                    case 'MA':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[3]);
                        break;
                    case 'DOC':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[6]);
                        break;
                    case 'DIP':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[4]);
                        break;
                    case 'ESP':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[5]);
                        break;
                    case 'TEC':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[8]);
                        break;
                    default:
                        # code...
                        break;
                }
            }
            
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $profesiones = $profesiones->paginate($resultadosPorPagina);
            } else {
                $profesiones = $profesiones->get();
            }

            return response()->json(['data'=>$profesiones],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getCodigoAutocomplete(Request $request)
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $codigos = Codigo::select('codigo', 'descripcion', 'grupo_funcion_id')->with('grupoFuncion');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $codigos = $codigos->where(function($query)use($parametros){
                    return $query->where('codigo','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }
            
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $codigos = $codigos->paginate($resultadosPorPagina);
            } else {
                $codigos = $codigos->get();
            }

            return response()->json(['data'=>$codigos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    

    public function getCluesAutocomplete(Request $request)
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $unidades = Clues::select('id', 'descripcion');
            //$access = $this->getUserAccessData();
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $unidades = $unidades->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('clues','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(!$access->is_admin)
            {
                $unidades = $unidades->whereIn("cr", $access->lista_cr);
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $unidades = $unidades->paginate($resultadosPorPagina);
            } else {

                $unidades = $unidades->get();
            }

            return response()->json(['data'=>$unidades],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getCatalogs(Request $request)
    {
        try {
            $listado_catalogos = [
                
                'microrregiones'      => Microrregion::getModel(),
                'localidades'         => Localidad::getModel(),
                'tipos_caminos'       => TipoCamino::getModel(),

            ];

            //$parametros = Input::all();
            $parametros = $request->all();

            $catalogos = [];
            for ($i = 0; $i < count($parametros); $i++) {
                $catalogo = $parametros[$i]; //podemos agregar filtros y ordenamiento

                if (isset($listado_catalogos[$catalogo['nombre']])) {
                    $modelo = $listado_catalogos[$catalogo['nombre']];
                    //podemos agregar filtros y ordenamiento
                    if (isset($catalogo['orden']) && $catalogo['orden']) { //hacer arrays
                        $modelo = $modelo->orderBy($catalogo['orden']);
                    }
                    //throw new \Exception(isset($catalogo['filtro_id']), 1);
                    if (isset($catalogo['filtro_id']) && $catalogo['filtro_id']) {  //hacer arrays

                        $modelo = $modelo->where($catalogo['filtro_id']['campo'], $catalogo['filtro_id']['valor']);
                    }

                    if (isset($catalogo['filtro_secundario_id']) && $catalogo['filtro_secundario_id']) {  //hacer arrays

                        $modelo = $modelo->where($catalogo['filtro_secundario_id']['campo'], $catalogo['filtro_secundario_id']['valor']);
                    }

                    $catalogos[$catalogo['nombre']] = $modelo->get(); //por el momento bastara con esto
                } else {
                    $catalogos[$catalogo['nombre']] = '404';
                }
            }

            return response()->json(['data' => $catalogos], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        
        $loggedUser->load('gruposUnidades.listaCR', 'gruposUnidades.listaFirmantes');
        
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
}
