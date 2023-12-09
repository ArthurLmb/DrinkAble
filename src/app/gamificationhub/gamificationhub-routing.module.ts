import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamificationhubPage } from './gamificationhub.page';

const routes: Routes = [
  {
    path: '',
    component: GamificationhubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamificationhubPageRoutingModule {}
