import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CluesService {

  url                     = `${environment.base_url}/clues`;
  url_obtener_catalogos   =  `${environment.base_url}/catalogos`;
  url_responsable         = `${environment.base_url}/busqueda-responsable`;

  constructor(private http: HttpClient) { }

  getCluesList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_obtener_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  actualizarClues(id:any, form:any):Observable<any> {
    return this.http.put<any>(this.url +"/"+ id, form).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  obtenerDatosClues(id:any, payload:any):Observable<any> {
    return this.http.get<any>(this.url +"/"+ id, {params:payload}).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  buscarResponsable(payload):Observable<any>{
    return this.http.get<any>(this.url_responsable,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };
}
