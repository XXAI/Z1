import { LOGOS } from "../../logos";
export class ReporteConstanciaDengue{
    getDocumentDefinition(reportData:any) {
        let contadorLineasHorizontalesV = 0;
        let fecha_hoy =  Date.now();
        let fecha_actual = new Date;
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
        let datos = {
          pageOrientation: 'landscape',
          pageSize: 'LETTER',
          /*pageSize: {
            width: 612,
            height: 396
          },*/
          background: [
            {
                image: LOGOS[2].CONSTANCIA_DENGUE,
                width: 795
            }],
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            
          },
          footer: function(currentPage, pageCount) { 
            return {
              
            }
          },
          content: [
            { text: "Al C. "+reportData.items.nombre, style: "nombramiento" , absolutePosition: {x:140, y:270} },
            { text: "Por su participación y aprobacion del curso en línea", style: "texto_base" , absolutePosition: {x:230, y:350} },
            { text: "\"Capacitación en el manejo clínico de dengue en el Estado de Chiapas\"", style: "texto_base" , absolutePosition: {x:160, y:370} },
            { text: "Tuxtla Gutiérrez, Chiapas a "+fecha_actual.getDate()+" de "+meses[fecha_actual.getMonth()]+" del "+fecha_actual.getFullYear(), style: "texto_base" , absolutePosition: {x:250, y:440} }
          ],
            styles: {
              cabecera: {
                fontSize: 5,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              nombramiento :
              {
                fontSize: 30,
                bold:true,
                color: "#404041",
              },
              texto_base :
              {
                fontSize: 15,
                bold:false,
                color: "#656566",
              },
              subcabecera:{
                fontSize: 5,
                bold:true,
                fillColor:"#DEDEDE",
                alignment:"center"
              },
              datos:
              {
                fontSize: 10
              },
              tabla_datos:
              {
                fontSize: 5
              
              },
              tabla_datos_sindicato:
              {
                fontSize: 5,
                color: "red"
              }
            }
        };
      
       
        //console.log('for(let i = 0; i < ; i++){');
        /*for(let i = 0; i < reportData.items.length; i++){
          let empleado = reportData.items[i];

          if(empleado.escolaridad_detalle.length > 0){
            empleado.profesion = empleado.escolaridad_detalle[0].profesion.descripcion;
            if(empleado.escolaridad_detalle[1] && empleado.escolaridad_detalle[1].tipo_estudio == 'LIC'){
              empleado.profesion = empleado.escolaridad_detalle[1].profesion.descripcion;
            }
            delete empleado.escolaridad_detalle;
          }else{
            empleado.profesion = '';
          }

          if(cr != empleado.cr_id){
            cr = empleado.cr_id;
            if(clues != empleado.clues){
              clues = empleado.clues;
              
              datos.content.push({
                //layout: 'lightHorizontalLines',
                table: {
                  headerRows:2,
                  dontBreakRows: true,
                  keepWithHeaderRows: 1,
                  widths: [ 43, 60, 110, 30, 100,'*', 50, 35, 29,'*', 80,'*' ],
                  margin: [0,0,0,0],
                  body: [
                    [{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
                    [{text: "RFC", style: 'cabecera'},
                      {text: "CURP", style: 'cabecera'},
                      {text: "NOMBRE", style: 'cabecera'},
                      {text: "CODIGO", style: 'cabecera'},
                      {text: "DESC. CODIGO", style: 'cabecera'},
                      {text: "PROFESIÓN", style: 'cabecera'},
                      //{text: "CLUE FÍSICA", style: 'cabecera'},
                      //{text: "CR FÍSICO", style: 'cabecera'},
                      {text: "TURNO", style: 'cabecera'},
                      {text: "H / ENTRADA", style: 'cabecera'},
                      {text: "H / SALIDA", style: 'cabecera'},
                      {text: "ÁREA DE SERVICIO", style: 'cabecera'},
                      {text: "FUNCIÓN", style: 'cabecera'},
                      {text: "OBSERVACIONES", style: 'cabecera'}]
                  ]
                }
              });

              indice_actual = datos.content.length -1;
            }
            datos.content[indice_actual].table.body.push(
              [{text: "["+empleado.cr_id+"] "+empleado.cr_descripcion, colSpan: 12, style: 'subcabecera'},{},{},{},{},{},{},{},{},{},{},{}],
            );
          }

          let area_servicio = empleado.area_servicio;
          let estilo_area = 'tabla_datos';
          let salto = "";
          if(area_servicio != "")
          {
            salto = "\n";
          }  
          if(empleado.empleado_comision != null)
          {
              for(let i = 0; i < empleado.empleado_comision.length; i++)
              {
                  if(empleado.empleado_comision[i].tipo_comision == "CS")
                  {
                    area_servicio = salto+"* COMISIONADO SINDICAL ("+empleado.empleado_comision[i].sindicato.descripcion+")";
                  }
              }
              
          }

          datos.content[indice_actual].table.body.push([
            //{ text: i+1, style: 'tabla_datos' }, 
            { text: empleado.rfc, style: 'tabla_datos' },
            { text: empleado.curp , style: 'tabla_datos'},
            { text: empleado.nombre + ' '+ empleado.apellido_paterno + ' '+ empleado.apellido_materno , style: 'tabla_datos'},
            { text: empleado.codigo_id , style: 'tabla_datos'},
            { text: empleado.codigo , style: 'tabla_datos'},
            { text: empleado.profesion , style: 'tabla_datos'},
            //{ text: empleado.clues , style: 'tabla_datos'},
            //{ text: empleado.cr_id , style: 'tabla_datos'},
            { text: empleado.turno , style: 'tabla_datos'},
            { text: empleado.hora_entrada , style: 'tabla_datos'},
            { text: empleado.hora_salida , style: 'tabla_datos'},
            { text: area_servicio , style: estilo_area},
            { text: empleado.funcion , style: 'tabla_datos'},
            { text: empleado.observaciones , style: 'tabla_datos'}
          ]);
        }*/

        
        return datos;
      }
}