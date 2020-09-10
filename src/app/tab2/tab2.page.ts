import { Component } from '@angular/core';
import { DadosCalculoService } from '../dados-calculo.service';
import { ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public chartData : ChartDataSets[] = [{data : [], label : ''}];
  public chartType : ChartType = 'line';
  public chartLabel : Label[];

  constructor(private serviceDados : DadosCalculoService, private screenOrientation: ScreenOrientation) {
    console.log(this.screenOrientation.type);
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    console.log(this.screenOrientation.type);
  }

  ionViewWillEnter(){
    console.log(this.serviceDados.getDados());
  }



}
