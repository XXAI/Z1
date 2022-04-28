import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
  
export class LocalidadService {

  url                     = `${environment.base_url}/localidad`;
  url_catalogos           = `${environment.base_url}/catalogos`;
  url_catalogo_municipio  = `${environment.base_url}/catalogo_municipio`;
  
  constructor(private http: HttpClient) { }

  getCatalogos():Observable<any> {
    return this.http.get<any>(this.url_catalogos,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getLocaliadList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getLocalidad(id:any):Observable<any>{
    return this.http.get<any>(this.url +"/"+ id, {}).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  saveLocalidad(payload) {
    return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  updateLocalidad(id:any, form:any):Observable<any> {
    return this.http.put<any>(this.url +"/"+ id, form).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  deleteLocalidad(id:any):Observable<any> {
    return this.http.delete<any>(this.url +"/"+ id).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  catalogoMunicipio():Observable<any> {
    return this.http.get<any>(this.url_catalogo_municipio,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
