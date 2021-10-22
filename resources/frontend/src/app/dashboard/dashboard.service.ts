import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = `${environment.base_url}/dashboard-activo`;

  constructor(private http: HttpClient) { }

  obtenerDashboard():Observable<any> {
  //obtenerDashboard():any {
    return this.http.get<any>(this.url,{}).pipe(
      map( response => {
        return response;
      })
    );
    /*
    return {
      columns: 16,
      items:[
        {
          id:1,
          type:'data',
          colspan:4,
          rowspan:1,
          data:{
            icon:'assets/icons/no_face_nobody.svg',
            title:12346,
            subtitle:'Totales 1'
          }
        },
        {
          id:2,
          type:'data',
          colspan:4,
          rowspan:1,
          data:{
            icon:'assets/icons/no_face_nobody.svg',
            title:12346,
            subtitle:'Totales 2'
          }
        },
        {
          id:3,
          type:'data',
          colspan:4,
          rowspan:1,
          data:{
            icon:'assets/icons/no_face_nobody.svg',
            title:12346,
            subtitle:'Totales 3'
          }
        },
        {
          id:4,
          type:'data',
          colspan:4,
          rowspan:1,
          data:{
            icon:'assets/icons/no_face_nobody.svg',
            title:12346,
            subtitle:'Totales 4'
          }
        },
        {
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
            {
              title:'Element 3',
              subtitle: 3927849
            },
            {
              title:'Element 4',
              subtitle: 4689554
            },
            {
              title:'Element 5',
              subtitle: 4123458
            }
          ]
        },
        {
          id:5,
          type:'chart',
          colspan:12,
          rowspan:5,
          chart:{
            id:'main-chart',
            type:'column',
            height: (9 / 16 * 100) + '%',
            //width:0,
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
              {
                name:'Serie3',
                data: [54,65,32,54,54]
              },
              {
                name:'Serie4',
                data: [54,65,32,54,54]
              },
              {
                name:'Serie5',
                data: [54,65,32,54,54]
              }
            ]
          }
        }
        /*{
          id:6,
          type:'list',
          colspan:4,
          rowspan:3,
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
            {
              title:'Element 3',
              subtitle: 3927849
            }
          ]
        },*/
        /*{
          type:'chart',
          colspan:12,
          rowpan:6,
          chart:{
            id:'',
            type:'',
            height:0,
            width:0,
            title:'',
            categories:[],
            series:[]
          }
        },
        {
          id:6,
          type:'table',
          colspan:1,
          rowspan:1,
          title:'',
          displayedcolumns:[],
          dataset:[],
          pagination:{
            perpage:10
          }
        }
      ]
    };
    */
  }
}
