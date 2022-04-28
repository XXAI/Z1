import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalidadRoutingModule } from './localidad-routing.module';

import { ListaComponent } from './lista/lista.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../../esp-paginator-intl';
import { FormularioComponent } from './formulario/formulario.component';
import { RegionalizacionComponent } from './regionalizacion/regionalizacion.component';

@NgModule({
  declarations: [ListaComponent, FormularioComponent, RegionalizacionComponent],
  imports: [
    CommonModule,
    SharedModule,
    LocalidadRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class LocalidadModule { }
