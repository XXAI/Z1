import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CluesModule } from './clues/clues.module';
import { PersonalModule } from './personal/personal.module';
import { RegionalizacionRoutingModule } from './regionalizacion-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CluesModule,
    PersonalModule,
    RegionalizacionRoutingModule
  ],
  exports:[   
    CluesModule,
  ]
})
export class RegionalizacionModule { }
