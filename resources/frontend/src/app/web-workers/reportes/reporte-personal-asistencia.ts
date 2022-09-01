import { LOGOS } from "../../logos";
import { ICONS } from "../../icons";

export class ReportePersonalAsistencia{
    getDocumentDefinition(reportData:any) {
        //console.log(reportData);
        let contadorLineasHorizontalesV = 0;
        let fecha_hoy =  Date.now();

        let daysLabels: any = {
          1:"LUNES", 
          2:"MARTES", 
          3:"MIERCOLES", 
          4:"JUEVES", 
          5:"VIERNES", 
          6:"SABADO", 
          7:"DOMINGO"
        };
        
        let datos = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
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
                    text: 'SECRETARÍA DE SALUD\nREPORTE DE DEL ' + reportData.data.fecha_inicial + ' AL ' + reportData.data.fecha_final,
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
            /*layout: {
                  paddingTop: function(i, node) { return 0; },
                  paddingBottom: function(i, node) { return 0; },
                  paddingLeft: function(i, node) { return 0; },
                  paddingRight: function(i, node) { return 0; },
                  hLineWidth: function(i, node) {
                      if (i < 3) { return 0; } else {
                          return 0.25
                      }
                      return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
                  },
                  vLineWidth: function(i, node) {
                      if (i == 0) {
                          contadorLineasHorizontalesV += 1
                      }
                      if (contadorLineasHorizontalesV > 5) {
                          return 0.5
                      } else {
                          return 0
                      }
                  },
              }
              
            }*/
            ],
            styles: {
              cabecera: {
                fontSize: 5,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center",
                columnGap: 3
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
              tabla_datos_centrado:
              {
                fontSize: 5,
                alignment:"center"
              }
            }
        };
      
        //console.log(datos.content[0].table.body);
        //console.log(data);

        datos.content.push({
          //layout: 'lightHorizontalLines',
          table: {
            widths: [ 43, '*', 43, 50, 43, 60,20,30],
            margin: [0,0,0,0],
            body: [
              [ 
                {text: "Nombre: ", style: 'cabecera'},
                {text: reportData.data.nombre , style:'tabla_datos'},
                {text:'RFC:', style:"cabecera"},
                {text: reportData.data.rfc , style:'tabla_datos'},
                {text:'CURP:', style:'cabecera'},
                {text: reportData.data.curp , style:'tabla_datos'},
                {text:'Estatus:', style:'cabecera'},
                {text: reportData.data.estatus , style:'tabla_datos'}
              ],
              [ 
                {text: "Lugar: ", style: 'cabecera'},
                {text: reportData.data.lugar , style:'tabla_datos'},
                {text:'Turno:', style:"cabecera"},
                {text: reportData.data.turno , style:'tabla_datos'},
                {text:'Horario:', style:'cabecera'},
                {text: reportData.data.horario , style:'tabla_datos'},
                {text:'ID:', style:'cabecera'},
                {text: reportData.data.id , style:'tabla_datos'}
              ]
            ]
          }
        });

        let resumen_conteo = {
          falta:            reportData.data.resumen.Falta,
          dia_economico:    reportData.data.resumen.Día_Económico,
          onomastico:       reportData.data.resumen.Onomástico,
          omision_entrada:  reportData.data.resumen.Omisión_Entrada,
          omision_salida:   reportData.data.resumen.Omisión_Salida,
          pase_salida:      reportData.data.resumen.Pase_Salida,
          retardo_mayor:    reportData.data.resumen.Retardo_Mayor,
          retardo_menor:    reportData.data.resumen.Retardo_Menor,
          vacaciones: 0
        }

        for(let i in reportData.data.resumen){
          if(i.includes('Vacaciones')){
            resumen_conteo.vacaciones += reportData.data.resumen[i];
          }
        }

        datos.content.push({
          layout: 'noBorders',
          table: {
            widths: ['*'],
            margin: [0,0,0,0],
            body: [ [ { text: "" } ] ]
          }
        });

        datos.content.push({
          //layout: 'headerLineOnly',
          table: {
            widths: [ '*', '*', '*', '*', '*'],
            margin: [0,0,0,0],
            body: [
              [{text:'RESUMEN',style:'cabecera',colSpan:5},{},{},{},{}],
              [ 
                {text:'Faltas: '+resumen_conteo.falta, style: 'tabla_datos'},
                {text:'Días Económicos: '+resumen_conteo.dia_economico, style:"tabla_datos"},
                {text:'Onomástico: '+resumen_conteo.onomastico, style:'tabla_datos'},
                {text:'Omisión de Entrada: '+resumen_conteo.omision_entrada, style:'tabla_datos'},
                {text:'Omisión de Salida: '+resumen_conteo.omision_salida, style:'tabla_datos'},
              ],
              [ 
                {text:'Pase de Salida (Horas): '+resumen_conteo.pase_salida, style: 'tabla_datos'},
                {text:'Retardo Mayor: '+resumen_conteo.retardo_mayor, style:"tabla_datos"},
                {text:'Retardo Menor: '+resumen_conteo.retardo_menor, style:'tabla_datos'},
                {text:'Vacaciones: '+resumen_conteo.vacaciones, style:'tabla_datos'},
                {text:'', style:'tabla_datos'},
              ]
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
            widths: [ '*'],
            margin: [0,0,0,0],
            body: [
              [ 
                {text: "Lista de Entradas y Salidas", fontSize: 8, alignment: 'center'},
              ]
            ]
          }
        });

        //console.log('for(let i = 0; i < ; i++){');
        //for(let i = 0; i < reportData.items.length; i++){
        datos.content.push({
          //layout: 'lightHorizontalLines',
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 43, 60, '*', '*', '*', '*', 30],
            margin: [0,0,0,0],
            body: [
              [
                {text: "Día", style: 'subcabecera'},
                {text: "Fecha", style: 'subcabecera'},
                {text: "Hora Entrada", style: 'subcabecera'},
                {text: "Hora Entrada Fuera de Horario", style: 'subcabecera'},
                {text: "Hora Salida", style: 'subcabecera'},
                {text: "Hora Salida Fuera de Horario", style: 'subcabecera'},
                {text: "Justificado", style: 'subcabecera'},
              ]
            ]
          }
        });

        for (let i in reportData.items) {
          let item = reportData.items[i];

          if(item.checado_entrada != 'SIN REGISTRO'){
            item.checado_entrada_fuera = '';
          }

          if(item.checado_salida != 'SIN REGISTRO'){
            item.checado_salida_fuera = '';
          }

          let icono = '';
          if(item.validacion){
            icono = ICONS.BLUE_CHECK;
          }else{
            icono = ICONS.RED_X;
          }

          datos.content[(datos.content.length-1)].table.body.push([
            { text: daysLabels[item.numero_dia] , style: 'tabla_datos'},
            { text: item.fecha , style: 'tabla_datos_centrado'},
            { text: item.checado_entrada , style: 'tabla_datos_centrado'},
            { text: item.checado_entrada_fuera , style: 'tabla_datos_centrado'},
            { text: item.checado_salida , style: 'tabla_datos_centrado'},
            { text: item.checado_salida_fuera , style: 'tabla_datos_centrado'},
            { image: icono, width:8, style: 'tabla_datos_centrado'}            
          ]);
        }

        return datos;
      }
}