import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { GuessGuard } from './guess.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuessGuard] },
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'update-password', component: UpdatePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
  providers: [GuessGuard]
})
export class AuthRoutingModule { }
