import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruposRoutingModule } from './grupos-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../../esp-paginator-intl';
import { SelectorCrDialogComponent } from '../../utils/selector-cr-dialog/selector-cr-dialog.component';

@NgModule({
  declarations: [ListaComponent, FormularioComponent],
  imports: [
    CommonModule,
    SharedModule,
    GruposRoutingModule
  ],
  entryComponents:[
    FormularioComponent,
    SelectorCrDialogComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class GruposModule { }
