<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Hash;
use Validator;
use DB;

use App\Models\User;
use App\Models\Trabajador;

class RegistroController extends Controller
{
    public function register(Request $request){
        try{
            $validation_rules = [
                'rfc' => 'required',
                'correo_electronico'        => 'required|email',
                'contrasenia' => 'required'                
            ];
        
            $validation_eror_messages = [
                'rfc.required' => 'El rfc es obligatorio',
                'correo_electronico.required' => 'El correo es obligatorio',
                'correo_electronico.email' => 'El correo no es valido',
                'contrasenia.required' => 'la contraseña es obligatoria'
            ];

            $parametros = $request->all();

            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                DB::beginTransaction();

                $trabajador = Trabajador::where("rfc", "=", $parametros['rfc'])->first();
                $trabajador->correo_electronico = $parametros['correo_electronico'];
                $trabajador->save();
                $usuario = new User();
                $usuario->name = $trabajador->apellido_paterno." ".$trabajador->apellido_materno." ".$trabajador->nombre;
                $usuario->email = $parametros['correo_electronico'];
                /*if($trabajador->correo_electronico != null)
                {
                    $usuario->email = $trabajador->correo_electronico;
                }else{
                    $usuario->email = "saludchiapas@hotmail.com"; 
                }*/
                $usuario->username = strtoupper($trabajador->rfc);
                $usuario->password = Hash::make($parametros['contrasenia']);
                $usuario->is_superuser = 0;
                $usuario->avatar = 'assets/avatars/50-king.svg';
                
                $usuario->save();

                $roles = [4];
                
                $usuario->roles()->sync($roles);
                
                
                DB::commit();

                return response()->json(['data'=>$usuario],HttpResponse::HTTP_OK);
            }else{
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }

        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
