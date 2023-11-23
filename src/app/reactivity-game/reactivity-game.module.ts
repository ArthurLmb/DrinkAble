import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReactivityGamePageRoutingModule } from './reactivity-game-routing.module';

import { ReactivityGamePage } from './reactivity-game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactivityGamePageRoutingModule
  ],
  declarations: [ReactivityGamePage]
})
export class ReactivityGamePageModule {}
