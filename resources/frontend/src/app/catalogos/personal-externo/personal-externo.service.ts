import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PersonalExternoService {

  url                     = `${environment.base_url}/trabajador-externo`;
  url_catalogos           = `${environment.base_url}/catalogos`;
  url_catalogos_externo   = `${environment.base_url}/catalogo-personal-externo`;
  url_grupo_externo       = `${environment.base_url}/catalogo-grupo-personal`;
  url_clues               = `${environment.base_url}/catalogo-clues`;
  url_localidad           = `${environment.base_url}/catalogo-localidad`;
  url_localidad_regionalizado = `${environment.base_url}/catalogo-localidad-regionalizado`;
  url_permisos            = `${environment.base_url}/getPermisos`;

  constructor(private http: HttpClient) { }

  getPermisos(payload:any):Observable<any> {
    return this.http.get<any>(this.url_permisos, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  
  getCatalogos():Observable<any> {
    return this.http.get<any>(this.url_catalogos,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getCatalogo():Observable<any> {
    return this.http.get<any>(this.url_catalogos_externo,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
  getTipo(id):Observable<any> {
    return this.http.get<any>(this.url_grupo_externo+"/"+id,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getTrabajador(params):Observable<any> {
    return this.http.get<any>(this.url,{params}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getTrabajadorEdit(id:any):Observable<any> {
    return this.http.get<any>(this.url+"/"+id,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  buscarClues(obj:any):Observable<any> {
    return this.http.get<any>(this.url_clues,{params: obj}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  buscarLocalidad(obj:any):Observable<any> {
    return this.http.get<any>(this.url_localidad_regionalizado,{params: obj}).pipe(
      map( response => {
        return response;
      })
    );
  }


  saveTrabajador(payload:any):Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  editTrabajador(id:number, payload:any):Observable<any> {
    return this.http.put<any>(this.url+"/"+id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  eliminarTrabajador(id):Observable<any> {
    return this.http.delete<any>(this.url+"/"+id).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  /*getTrabajador(id:any):Observable<any> {
    return this.http.get<any>(this.url+"/"+id,{}).pipe(
      map( response => {
        return response;
      })
    );
  }*/
}
