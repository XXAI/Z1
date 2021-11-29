import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'regionalizacion/clues', component: ListaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CluesRoutingModule { }
