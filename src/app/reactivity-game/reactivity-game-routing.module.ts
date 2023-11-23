import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReactivityGamePage } from './reactivity-game.page';

const routes: Routes = [
  {
    path: '',
    component: ReactivityGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReactivityGamePageRoutingModule {}
