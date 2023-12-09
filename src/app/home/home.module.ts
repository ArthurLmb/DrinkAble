import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { BullepopoverComponent } from '../bullepopover/bullepopover.component';
import { AdsComponent } from '../ads/ads.component';
import { MinuteurComponent } from '../minuteur/minuteur.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    AdsComponent,
    MinuteurComponent
  ],
  declarations: [HomePage, BullepopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
