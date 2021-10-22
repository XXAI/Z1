import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { CluesModule } from './clues/clues.module';
import { GruposModule } from './grupos/grupos.module';
import { ColoniasModule } from './colonias/colonias.module';
import { LocalidadModule } from './localidad/localidad.module';
import { MicroregionModule } from './microregion/microregion.module';
import { PersonalExternoModule } from './personal-externo/personal-externo.module';
import { PersonalSaludModule } from './personal-salud/personal-salud.module';
import { CatalogosComponent } from './catalogos.component';
//import { ListaComponent } from './colonias/lista/lista.component';
//import { FormularioComponent } from './colonias/formulario/formulario.component';


@NgModule({
  declarations: [CatalogosComponent/*, ListaComponent, FormularioComponent*/],
  imports: [
    CommonModule,
    CatalogosRoutingModule,
  ],
  exports:[
    CluesModule,
    GruposModule,
    ColoniasModule,
    LocalidadModule,
    MicroregionModule,
    PersonalExternoModule,
    PersonalSaludModule
  ]
})
export class CatalogosModule { }
