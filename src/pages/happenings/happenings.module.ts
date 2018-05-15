import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HappeningsPage } from './happenings';

@NgModule({
  declarations: [
    HappeningsPage,
  ],
  imports: [
    IonicPageModule.forChild(HappeningsPage),
  ],
})
export class HappeningsPageModule {}
