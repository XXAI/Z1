import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  url = `${environment.base_url}/grupos_unidades`;
  url_empleados = `${environment.base_url}/listado-empleados`;
  url_permisos            = `${environment.base_url}/getPermisos`;
  //url_cat_tipo_profesion = `${environment.base_url}/catalogo-tipo-profesion`;
  
  constructor(private http: HttpClient) { }

  getPermisos(payload:any):Observable<any> {
    return this.http.get<any>(this.url_permisos, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  obtenerListaGrupos(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  obtenerListaEmpleados(payload):Observable<any> {
    return this.http.get<any>(this.url_empleados,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verDatosGrupo(id:any):Observable<any> {
    return this.http.get<any>(this.url+'/'+id).pipe(
      map( response => {
        return response;
      })
    );
  }

  actualizarGrupo(id:any, form:any):Observable<any> {
    return this.http.put<any>(this.url +"/"+ id, form).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  crearGrupo(form:any):Observable<any> {
    return this.http.post<any>(this.url, form).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  eliminarGrupo(id:any):Observable<any> {
    return this.http.delete<any>(this.url +"/"+ id).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  /*obtenerCatalogoTipoProfesion():Observable<any>{
    return this.http.get<any>(this.url_cat_tipo_profesion).pipe(
      map( response => {
        return response;
      })
    );
  }*/
}
