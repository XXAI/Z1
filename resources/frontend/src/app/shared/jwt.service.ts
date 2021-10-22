import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class User {
  name: String;
  email: String;
  password: String;
  password_confirmation: String
}

@Injectable({
  providedIn: 'root'
})

export class JwtService {

  url_updatePassword = `${environment.base_url}/update-password`;
  url_resetPassword  = `${environment.base_url}/req-password-reset`;

  constructor(private http: HttpClient) { }

  // req-password-reset
  reqPasswordReset(data) {
    return this.http.post(this.url_resetPassword, data)
  }

  // update password
  updatePassword(data) {
    return this.http.post(this.url_updatePassword, data)
  }

}
