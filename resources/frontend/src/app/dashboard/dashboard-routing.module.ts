import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { VisorComponent } from './visor/visor.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

const routes: Routes = [
  { path: 'dashboard', component: VisorComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/configuracion', component: ConfiguracionComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
