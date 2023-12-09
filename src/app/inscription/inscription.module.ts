import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaskitoModule } from '@maskito/angular';


import { IonicModule } from '@ionic/angular';

import { InscriptionPageRoutingModule } from './inscription-routing.module';

import { InscriptionPage } from './inscription.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaskitoModule,
    IonicModule,
    InscriptionPageRoutingModule
  ],
  declarations: [InscriptionPage]
})
export class InscriptionPageModule {}
