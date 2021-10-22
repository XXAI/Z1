import { LOGOS } from "../../logos";
export class ReporteTrabajadorActivo{
    getDocumentDefinition(reportData:any) {
        let contadorLineasHorizontalesV = 0;
        let fecha_hoy =  Date.now();
        let datos = {
          pageOrientation: 'landscape',
          pageSize: 'LEGAL',
          /*pageSize: {
            width: 612,
            height: 396
          },*/
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            margin: [30, 20, 30, 0],
            columns: [
                {
                    image: LOGOS[0].LOGO_FEDERAL,
                    width: 80
                },
                {
                    margin: [10, 0, 0, 0],
                    text: 'SECRETARÍA DE SALUD\n'+reportData.config.title,
                    bold: true,
                    fontSize: 12,
                    alignment: 'center'
                },
                {
                  image: LOGOS[1].LOGO_ESTATAL,
                  width: 60
              }
            ]
          },
          footer: function(currentPage, pageCount) { 
            //return 'Página ' + currentPage.toString() + ' de ' + pageCount; 
            return {
              margin: [30, 20, 30, 0],
              columns: [
                  {
                      text:'http://sirh.saludchiapas.gob.mx/',
                      alignment:'left',
                      fontSize: 8,
                  },
                  {
                      margin: [10, 0, 0, 0],
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 8,
                      alignment: 'center'
                  },
                  {
                    text:fecha_hoy.toString(),
                    alignment:'right',
                    fontSize: 8,
                }
              ]
            }
          },
          content: [
            
            ],
            styles: {
              cabecera: {
                fontSize: 5,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
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
      
        let clues = '';
        let cr = '';
        let indice_actual;

        for(let i = 0; i < reportData.items.length; i++){
          let trabajador = reportData.items[i];
          /*if(trabajador.escolaridad_detalle.length > 0){
            trabajador.profesion = trabajador.escolaridad_detalle[0].profesion.descripcion;
            if(trabajador.escolaridad_detalle[1] && trabajador.escolaridad_detalle[1].tipo_estudio == 'LIC'){
              trabajador.profesion = trabajador.escolaridad_detalle[1].profesion.descripcion;
            }
            delete trabajador.escolaridad_detalle;
          }else{
            trabajador.profesion = '';
          }*/

          if(cr != trabajador.cr_fisico_id){
            cr = trabajador.cr_fisico_id;
            if(clues != trabajador.clues_adscripcion_fisica){
              clues = trabajador.clues_adscripcion_fisica;
              
              datos.content.push({
                //layout: 'lightHorizontalLines',
                table: {
                  headerRows:2,
                  dontBreakRows: true,
                  keepWithHeaderRows: 1,
                  widths: [ 43, 60, 110, 60, 30, 100, 100,100, 80,'*' ],
                  margin: [0,0,0,0],
                  body: [
                    [{text: "["+trabajador.clues_adscripcion_fisica+"] "+trabajador.nombre_unidad, colSpan: 10, style: 'cabecera'},{},{},{},{},{},{},{},{},{}],
                    [{text: "RFC", style: 'cabecera'},
                      {text: "CURP", style: 'cabecera'},
                      {text: "NOMBRE", style: 'cabecera'},
                      {text: "TIPO DE TRABAJADOR", style: 'cabecera'},
                      {text: "CODIGO", style: 'cabecera'},
                      {text: "DESC. CODIGO", style: 'cabecera'},
                      {text: "TURNO /  ENTRADA - SALIDA", style: 'cabecera'},
                      {text: "ÁREA DE SERVICIO", style: 'cabecera'},
                      {text: "FUNCIÓN", style: 'cabecera'},
                      {text: "OBSERVACIONES", style: 'cabecera'}]
                  ]
                }
              });

              indice_actual = datos.content.length -1;
            }
            datos.content[indice_actual].table.body.push(
              [{text: "["+trabajador.cr_fisico_id+"] "+trabajador.cr, colSpan: 10, style: 'subcabecera'},{},{},{},{},{},{},{},{},{}],
            );
          }

          /*let area_servicio = trabajador.area_servicio;
          let estilo_area = 'tabla_datos';
          let salto = "";
          if(area_servicio != "")
          {
            salto = "\n";
          }  
          if(trabajador.trabajador_comision != null)
          {
              for(let i = 0; i < trabajador.trabajador_comision.length; i++)
              {
                  if(trabajador.trabajador_comision[i].tipo_comision == "CS")
                  {
                    area_servicio = salto+"* COMISIONADO SINDICAL ("+trabajador.trabajador_comision[i].sindicato.descripcion+")";
                  }
              }
          }*/
          let comision_sindical = "";
          if(trabajador.comision != null)
          {
            comision_sindical = "* Comisión Sindical";
          }
          let jornada_horario = "";
          if(trabajador.jornada != null)
          {
            jornada_horario += trabajador.jornada;
          }
          if(trabajador.horario != null)
          {
            jornada_horario += " "+trabajador.horario;
          }
          datos.content[indice_actual].table.body.push([
            { text: trabajador.rfc, style: 'tabla_datos' },
            { text: trabajador.curp , style: 'tabla_datos'},
            { text: trabajador.nombre  , style: 'tabla_datos'},
            { text: trabajador.ur , style: 'tabla_datos'},
            { text: trabajador.codigo , style: 'tabla_datos'},
            { text: trabajador.descripcion_codigo , style: 'tabla_datos'},
            { text: jornada_horario , style: 'tabla_datos'},
            { text: trabajador.rama_trabajo , style: 'tabla_datos'},
            { text: trabajador.grupo , style: 'tabla_datos'},
            { text: trabajador.observacion +"\n"+comision_sindical , style: 'tabla_datos'}
          ]);
        }

        if(reportData.config.showSigns){
          
          
          //Se agregan los firmantes a la hoja
          let num_firmantes = reportData.firmantes.length;
          if(num_firmantes > 0)
          {
            let espacios:any[] = [];
            let arreglo_firmantes:any[] = [];
            let arreglo_espacios:any[] = [];
            let obj_espacios:any = { text: " \n"};
            for(let i = 0; i < num_firmantes; i++){
              
              if(i!=0)
              {
                arreglo_firmantes.push("");
                if(num_firmantes > 4)
                  espacios.push(5);
                else  
                  espacios.push("*");
                arreglo_espacios.push({text: "",rowSpan: 2});
              }
              
              if(num_firmantes > 4)
                espacios.push("*");
              else if(num_firmantes >1 && num_firmantes <5)
                espacios.push(200);
              else if(num_firmantes == 1)
                espacios.push("*");
              

              arreglo_espacios.push(obj_espacios);
              let firmante = reportData.firmantes[i].trabajador;
              arreglo_firmantes.push({text: firmante.nombre+" "+firmante.apellido_paterno+" "+firmante.apellido_materno+ "\n"+reportData.firmantes[i].cargo, style: 'datos'});
            }
            datos.content.push(
              {
                table: {
                    dontBreakRows: true,
                    widths: espacios ,
                    body: [  arreglo_espacios, arreglo_firmantes ]
                },
                layout: {
                    hLineWidth: function(i, node) {
                        if (i === 0 || i == 2){
                            return 0;
                        }
                        return 0.5;
                    },
                    vLineWidth: function(i, node) { 
                      return 0;
                    },
                },
                margin: [0,20,0,0], ///left-top-right-bottom
                alignment: "center"
              }
            );
          }
          //Finaliza los firmantes
        }

        return datos;
      }
}