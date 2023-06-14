<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\User;


class PermisosController extends Controller
{

    public function getPermisos(Request $request)
    {
        try{
            $loggedUser = auth()->userOrFail();
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);
            $permisos_aplicacion = [];
            $resultado['admin'] = false; 
            if(!$loggedUser->is_superuser){
                foreach ($permisos->roles as $key => $value) {
                    
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'CY2Glu2SG6h9A522EXSu6kDSkdw09bSU')
                        {
                            $permisos_aplicacion[] = "permiso_visor";
                        }
                        if($value2->id == 'qTDSf7RjLNAivN2O0qEEBaDoGSs230B9')
                        {
                            $permisos_aplicacion[] = "permiso_guardar_clues";
                        }
                    }
                }
                    
                foreach ($permisos->permissions as $key2 => $value2) {
                    if($value2->id == 'CY2Glu2SG6h9A522EXSu6kDSkdw09bSU')
                    {
                        $permisos_aplicacion[] = "permiso_visor";
                    }
                    if($value2->id == 'qTDSf7RjLNAivN2O0qEEBaDoGSs230B9')
                    {
                        $permisos_aplicacion[] = "permiso_guardar_clues";
                    }
                }
                
            }else
            {
                $resultado['admin'] = true; 
            }
            
            $resultado['permisos'] = $permisos_aplicacion; 
            return response()->json(['data'=>$resultado],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        return $loggedUser;
    }
}
