import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    ChartsModule
  ],
  providers : [
    ScreenOrientation
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
