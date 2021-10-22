<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Dashboard;

class DashboardController extends Controller{
    
    public function activeDashboard(){
        try{
            $dashboard_raw = Dashboard::with('elementosVisibles')->where('activo',1)->first();
            $my_dashboard = [
                'columns'=> $dashboard_raw->columnas,
                'items' => []
            ];

            for ($i = 0; $i < count($dashboard_raw->elementosVisibles) ; $i++) { 
                $elemento = $dashboard_raw->elementosVisibles[$i];

                if (preg_match('/\b(DELETE|DROP|TRUNCATE|ALTER|UPDATE)\b/',strtoupper($elemento->query)) != 0){
                    return response()->json(['error' => 'Query para elemento del Dashboard no valida'], HttpResponse::HTTP_CONFLICT);
                }

                switch ($elemento->tipo) {
                    case 'data':
                        /*
                        ##########Estructura para el tipo data:
                        id:4,
                        type:'data',
                        colspan:4,
                        rowspan:1,
                        data:{
                            icon:'assets/icons/no_face_nobody.svg',
                            title:12346,
                            subtitle:'Totales Ejemplo'
                        }
                        */
                        $query = $elemento->query;
                        $resultado = DB::select($query);
                        $resultado = $resultado[0];

                        if(strpos($elemento->titulo,'||') !== FALSE){
                            foreach ($resultado as $key => $value) {
                                $elemento->titulo = str_replace('||'.$key.'||',$value,$elemento->titulo);
                            }
                        }

                        if(strpos($elemento->subtitulo,'||') !== FALSE){
                            foreach ($resultado as $key => $value) {
                                $elemento->subtitulo = str_replace('||'.$key.'||',$value,$elemento->subtitulo);
                            }
                        }

                        $nuevo_elemento = [
                            'id' => $elemento->id,
                            'type' => 'data',
                            'colspan' => $elemento->colspan,
                            'rowspan' => $elemento->rowspan,
                            'data' => [
                                'icon' => $elemento->icono,
                                'title' => $elemento->titulo,
                                'subtitle' => $elemento->subtitulo
                            ]
                        ];
                        break;
                    case 'list':
                        /*
                        ##########Estructura para el tipo list:
                        id:5,
                        type:'list',
                        colspan:4,
                        rowspan:5,
                        divider: true,
                        data: [
                            {
                                title:'Element 1',
                                subtitle: 3454456
                            },
                            {
                                title:'Element 2',
                                subtitle: 9874550
                            },
                            .
                            .
                            .
                        ]
                        */
                        $query = $elemento->query;
                        $resultado = DB::select($query);                        
                        $data = [];
                        if($elemento->tipo_serie == 'ColAsData'){ //ColAsData, RowAsData
                            $resultado = $resultado[0]->toArray();
                            $series = explode(',',$elemento->series);
                            foreach ($series as $key) {
                                $data[] = [
                                    'title' => $key,
                                    'subtitle' => $resultado[$key]
                                ];
                            }
                        }else if($elemento->tipo_serie == 'RowAsData'){
                            foreach($resultado as $row){
                                $data_title = $elemento->titulo;
                                $data_subtitle = $elemento->subtitulo;
                                foreach($row as $key => $value){
                                    if(strpos($data_title,'||') !== FALSE){
                                        $data_title = str_replace('||'.$key.'||',$value,$data_title);
                                    }
                                    if(strpos($data_subtitle,'||') !== FALSE){
                                        $data_subtitle = str_replace('||'.$key.'||',$value,$data_subtitle);
                                    }
                                }
                                $data[] = [
                                    'title' => $data_title,
                                    'subtitle' => $data_subtitle
                                ];
                            }
                        }
                        
                        $nuevo_elemento = [
                            'id' => $elemento->id,
                            'type' => 'list',
                            'colspan' => $elemento->colspan,
                            'rowspan' => $elemento->rowspan,
                            'divider' => $elemento->divisor,
                            'data' => $data
                        ];
                        break;
                    case 'chart':
                        /*
                        ##########Estructura para el tipo chart:
                        id:5,
                        type:'chart',
                        colspan:12,
                        rowspan:5,
                        chart:{
                            id:'main-chart',
                            type:'column',
                            height: (9 / 16 * 100) + '%',
                            width:0,
                            title:'Grafica Principal',
                            lefttitle:'Cantidades para los datos',
                            categories:['datos1','datos2','datos3','datos4','datos5'],
                            series:[
                            {
                                name:'Serie1',
                                data: [54,65,32,54,54]
                            },
                            {
                                name:'Serie2',
                                data: [54,65,32,54,54]
                            },
                            .
                            .
                            .
                            ]
                        }
                        */
                    default:
                        # code...
                        break;
                }
                $my_dashboard['items'][] = $nuevo_elemento;
            }
            

            return response()->json(['data'=>$my_dashboard,'raw_data'=>$dashboard_raw],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}