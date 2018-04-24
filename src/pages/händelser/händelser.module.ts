import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HändelserPage } from './händelser';

@NgModule({
  declarations: [
    HändelserPage,
  ],
  imports: [
    IonicPageModule.forChild(HändelserPage),
  ],
})
export class HändelserPageModule {}
