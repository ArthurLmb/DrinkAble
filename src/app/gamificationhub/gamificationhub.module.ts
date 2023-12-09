import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamificationhubPageRoutingModule } from './gamificationhub-routing.module';

import { GamificationhubPage } from './gamificationhub.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamificationhubPageRoutingModule
  ],
  declarations: [GamificationhubPage]
})
export class GamificationhubPageModule {}
