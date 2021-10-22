import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { NgxCaptchaModule } from 'ngx-captcha';

import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    UpdatePasswordComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AuthRoutingModule,
    NgxCaptchaModule
  ]
})
export class AuthModule { }
