import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  url_municipio             = `${environment.base_url}/catalogo-municipio`;
  url_microrregion          = `${environment.base_url}/catalogo-microrregion`;
  url_catalogo              = `${environment.base_url}/catalogo-mapa`;
  url_mapa                  = `${environment.base_url}/get-data-mapa`;
  url_regionalizacion       = `${environment.base_url}/get-data-regionalizacion`;
  url_permisos              = `${environment.base_url}/getPermisos`;

  constructor(private http: HttpClient) { }

  getMunicipios(obj:any):Observable<any> {
    return this.http.get<any>(this.url_municipio+"/"+obj,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
  getMicroregion(obj:any):Observable<any> {
    return this.http.get<any>(this.url_microrregion+"/"+obj,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
  getCatalogo():Observable<any> {
    return this.http.get<any>(this.url_catalogo,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getUnidades(obj:any):Observable<any> {
    return this.http.get<any>(this.url_mapa,{params:obj}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  getRegionalizacionLocalidades(clues:string):Observable<any> {
    return this.http.get<any>(this.url_regionalizacion+"/"+clues,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getPermisos(payload:any):Observable<any> {
    return this.http.get<any>(this.url_permisos, payload).pipe(
      map( (response: any) => {        
        return response;
      }
    ));
  }
}
