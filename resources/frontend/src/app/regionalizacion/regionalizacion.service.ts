import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegionalizacionService {

  url                       = `${environment.base_url}/reginalizacion-clues`;
  url_obtener_catalogos     = `${environment.base_url}/catalogos`;
  url_localidades           = `${environment.base_url}/regionalizacion-localidades`;
  url_localidad             = `${environment.base_url}/catalogo-localidad`;
  url_localidad_filtro      = `${environment.base_url}/regionalizacion-localidades-filtro`;

  url_personal              = `${environment.base_url}/reginalizacion-clues-personal`;
  url_buscador_personal     = `${environment.base_url}/buscador-personal`;
  url_clues                 = `${environment.base_url}/catalogo-clues`;
  url_salud_filtro          = `${environment.base_url}/regionalizacion-salud-filtro`;
  url_personal_delete       = `${environment.base_url}/delete-personal`;
  url_externo_filtro        = `${environment.base_url}/regionalizacion-externo-filtro`;

  constructor(private http: HttpClient) { }

  getCatalogos():Observable<any> {
    return this.http.get<any>(this.url_obtener_catalogos,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getLocalidadesList(id:any, params:any):Observable<any>{
    return this.http.get<any>(this.url +"/"+ id, {params}).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  getFilterLocalidadesList(id:any, params:any):Observable<any>{
    return this.http.get<any>(this.url_localidad_filtro +"/"+ id, {params}).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  buscarLocalidad(obj:any):Observable<any> {
    return this.http.get<any>(this.url_localidad,{params: obj}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getCluesList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  save(payload:any):Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  edit(id:number, payload:any):Observable<any> {
    return this.http.put<any>(this.url+"/"+id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  eliminar(id):Observable<any> {
    return this.http.delete<any>(this.url+"/"+id).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  /// Regionalizacion Personal
  getCluesPersonalList(payload):Observable<any> {
    return this.http.get<any>(this.url_personal,{params: payload}).pipe(
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
  
  buscarPersonal(params:any):Observable<any> {
    return this.http.get<any>(this.url_buscador_personal, {params}).pipe(
      map( response => {
        return response;
      })
    );
  }

  buscarTrabajador(id, params:any):Observable<any> {
    return this.http.get<any>(this.url_personal+"/"+id, {params}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getPersonalList(params:any):Observable<any>{
    return this.http.get<any>(this.url_personal, {params}).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }
  
  getFilterPersonalExternoList(id:any, params:any):Observable<any>{
    return this.http.get<any>(this.url_externo_filtro +"/"+ id, {params}).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  eliminarPersonal(id, params):Observable<any> {
    return this.http.delete<any>(this.url_personal+"/"+id, {params}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  savePersonal(payload:any, ):Observable<any> {
    return this.http.post<any>(this.url_personal, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  editPersonal(id:number, payload:any):Observable<any> {
    return this.http.put<any>(this.url_personal+"/"+id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
}
