import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  url                     = `${environment.base_url}/trabajador-salud`;
  url_catalogos           = `${environment.base_url}/catalogos`;
  url_clues               = `${environment.base_url}/catalogo-clues`;

  constructor(private http: HttpClient) { }

  getCatalogos():Observable<any> {
    return this.http.get<any>(this.url_catalogos,{}).pipe(
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

  /*getCatalogosMunicipio(distrito:any):Observable<any> {
    return this.http.get<any>(this.url_catalogosMunicipio+"/"+distrito,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  */
  
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
