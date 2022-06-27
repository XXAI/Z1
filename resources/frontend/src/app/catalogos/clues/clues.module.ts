import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { CluesRoutingModule } from './clues-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../../esp-paginator-intl';

import { DetailsComponentClue } from './details-clue/details-clue.component'
import { RegionesDialogComponent } from './regiones-dialog/regiones-dialog.component';
import { EditarComponent } from './editar/editar.component';
import { ListaComponent } from './lista/lista.component';


@NgModule({
  declarations: [
    ListaComponent,
    EditarComponent,
    DetailsComponentClue,
    RegionesDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CluesRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyARYKzaXSeSg_CeqzNVLTz2xtPX-EzQZnY'
    })
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class CluesModule { }
