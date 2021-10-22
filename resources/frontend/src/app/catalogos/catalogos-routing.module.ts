import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogosComponent } from './catalogos.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'catalogos', component: CatalogosComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
