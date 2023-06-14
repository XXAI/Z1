import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { EditarComponent } from './editar/editar.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'catalogos/clues', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'catalogos/clues/editar/:id', component: EditarComponent, canActivate: [AuthGuard] },
  { path: 'catalogos/clues/nuevo', component: NuevoComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CluesRoutingModule { }