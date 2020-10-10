import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FanComponent } from './components/fan/fan.component';
import { BomComponent } from './components/bom/bom.component';
import { BeltComponent } from './components/fan/belt/belt.component';
import { CoilComponent } from './components/coil/coil.component';


const routes: Routes = [
  { path: 'fan', component: FanComponent},
  { path: 'bom', component: BomComponent},
  { path: 'coil', component: CoilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
