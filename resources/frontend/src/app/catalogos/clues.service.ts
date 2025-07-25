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
  url_info_clue           = `${environment.base_url}/ver-info-clue/`;
  url_clue_catalogo       = `${environment.base_url}/busqueda-clues`;

  url_permisos            = `${environment.base_url}/getPermisos`;

  url_catalogos   =  `${environment.base_url}/obtener-catalogos`;


  constructor(private http: HttpClient) { }

  getCluesList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
 
  deleteClues(payload):Observable<any> {
  return this.http.delete<any>(this.url + "/" + payload).pipe(
      map( response => {
        return response;
      })
    );
  }

  verInfoClue(id:any,payload:any):Observable<any>{
    return this.http.get<any>(this.url_info_clue + id, {params:payload}).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  obtenerCatalogos(payload:any = null) {
    return this.http.get<any>(this.url_obtener_catalogos,{params:payload}).pipe(
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

  guardarClues(form:any):Observable<any> {
    return this.http.post<any>(this.url , form).pipe(
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

  buscarClue(payload):Observable<any>{
    return this.http.get<any>(this.url_clue_catalogo,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  // obtenerLocalidades(payload):Observable<any> {
  //   return this.http.get<any>(this.url_localidad,{params:payload}).pipe(
  //     map( response => {
  //       return response;
  //     })
  //   );
  // }

  obtenerLocalidades(payload) {
    return this.http.post<any>(this.url_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  
  getPermisos(payload:any):Observable<any> {
    return this.http.get<any>(this.url_permisos, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
}
