import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColoniasService {

  url_catalogos           = `${environment.base_url}/catalogos`;
  url_catalogosMunicipio  = `${environment.base_url}/catalogo-municipio`;
  url_catalogosLocalidad  = `${environment.base_url}/catalogo-localidad`;
  url                     = `${environment.base_url}/colonias`;
  constructor(private http: HttpClient) { }

  getCatalogos():Observable<any> {
    return this.http.get<any>(this.url_catalogos,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getColonias(params):Observable<any> {
    return this.http.get<any>(this.url,{params}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getCatalogosMunicipio(distrito:any):Observable<any> {
    return this.http.get<any>(this.url_catalogosMunicipio+"/"+distrito,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  buscarLocalidad(obj:any):Observable<any> {
    return this.http.get<any>(this.url_catalogosLocalidad,{params: obj}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  saveColonias(payload:any):Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
  editColonias(id:number, payload:any):Observable<any> {
    return this.http.put<any>(this.url+"/"+id, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }

  eliminarColonia(id):Observable<any> {
    return this.http.delete<any>(this.url+"/"+id).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  getColonia(id:any):Observable<any> {
    return this.http.get<any>(this.url+"/"+id,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
}
