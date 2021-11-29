import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionalizacionComponent } from './regionalizacion.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'regionalizacion', component: RegionalizacionComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionalizacionRoutingModule { }
