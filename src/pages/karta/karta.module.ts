import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KartaPage } from './karta';

@NgModule({
  declarations: [
    KartaPage,
  ],
  imports: [
    IonicPageModule.forChild(KartaPage),
  ],
})
export class KartaPageModule {}
