import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaRoutingModule } from './mapa-routing.module';
import { GeneralComponent } from './general/general.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from 'src/app/shared/shared.module';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    GeneralComponent
  ],
  imports: [
    CommonModule,
    MapaRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDs6qDgnfMwaHCrOhA0tCvaUPgANTD0Urw'
    })
  ]
})
export class MapaModule { }
