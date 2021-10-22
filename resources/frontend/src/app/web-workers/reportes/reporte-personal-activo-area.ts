import { LOGOS } from "../../logos";
export class ReportePersonalActivoArea{
    getDocumentDefinition(reportData:any) {
        //console.log(reportData);
        let contadorLineasHorizontalesV = 0;
        let fecha_hoy =  Date.now();
      console.log(LOGOS);
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
              }
            }
        };
      
        //console.log(datos.content[0].table.body);
        //console.log(data);
        let clues = '';
        let cr = '';
        let indice_actual;//(datos.content.length -1);

        datos.content.push({
          //layout: 'lightHorizontalLines',
          table: {
            widths: [ '*', '*', 30, 30, 50, 50, 50, 100,'*', '*', '*', '*', '*' ],
            margin: [0,0,0,0],
            body: [
              [{text: "Número de Trabajadores "+ reportData.items.length, colSpan: 13, style: 'tabla_datos'},{},{},{},{},{},{},{},{},{},{},{},{}]
            ]
          }
          
        });

        //console.log('for(let i = 0; i < ; i++){');
        for(let i = 0; i < reportData.items.length; i++){
          let empleado = reportData.items[i];

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
                  widths: [ 100, 100, 30, 30, 50, 50, 50, '*',50, 50, 50, 50 , 60],
                  margin: [0,0,0,0],
                  body: [
                    [{text: "["+empleado.clues+"] "+empleado.nombre_unidad, colSpan: 13, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{},{}],
                    [ {text: "NOMBRE", style: 'cabecera'},
                      {text: "AREA", style: 'cabecera'},
                      {text: "MEDICO", style: 'cabecera'},
                      {text: "ENFERMERA", style: 'cabecera'},
                      {text: "PARAMEDICO", style: 'cabecera'},
                      {text: "ADMINISTRATIVOS", style: 'cabecera'},
                      {text: "FUNCIÓN", style: 'cabecera'},
                      {text: "ACTIVIDADES", style: 'cabecera'},
                      {text: "TIPO DE TRABAJADOR", style: 'cabecera'},
                      {text: "UR", style: 'cabecera'},
                      {text: "PROGRAMA", style: 'cabecera'},
                      {text: "TIPO DE CONTRATO (FUENTE)", style: 'cabecera'},
                      {text: "TURNO / HORARIO", style: 'cabecera'}]
                  ]
                }
              });

              indice_actual = datos.content.length -1;
            }
            datos.content[indice_actual].table.body.push(
              [{text: "["+empleado.cr_id+"] "+empleado.cr_descripcion, colSpan: 13, style: 'subcabecera'},{},{},{},{},{},{},{},{},{},{},{},{}],
            );
          }

          datos.content[indice_actual].table.body.push([  
            { text: empleado.nombre + ' '+ empleado.apellido_paterno + ' '+ empleado.apellido_materno , style: 'tabla_datos'},
            { text: empleado.cr_descripcion , style: 'tabla_datos'},
            { text: empleado.medico , style: 'tabla_datos'},
            { text: empleado.enfermera , style: 'tabla_datos'},
            { text: empleado.paramedico , style: 'tabla_datos'},
            { text: empleado.administrativo , style: 'tabla_datos'},
            { text: empleado.grupo , style: 'tabla_datos'},
            { text: empleado.actividades , style: 'tabla_datos'},
            { text: empleado.tipo_trabajador , style: 'tabla_datos'},
            { text: empleado.ur , style: 'tabla_datos'},
            { text: empleado.programa , style: 'tabla_datos'},
            { text: empleado.llave , style: 'tabla_datos'},
            { text: empleado.turno+": "+empleado.hora_entrada.substr(0, 5)+" - "+empleado.hora_salida.substr(0, 5) , style: 'tabla_datos'},
            
          ]);
        }



        return datos;
      }
}