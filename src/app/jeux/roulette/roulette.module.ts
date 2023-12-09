import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoulettePageRoutingModule } from './roulette-routing.module';

import { RoulettePage } from './roulette.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoulettePageRoutingModule
  ],
  declarations: [RoulettePage]
})
export class RoulettePageModule {}
