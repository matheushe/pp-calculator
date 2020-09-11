import { Component } from "@angular/core";
import { DadosCalculoService } from "../dados-calculo.service";
import { ChartDataSets, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

import { Platform } from "@ionic/angular";
@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  public chartData: ChartDataSets[] = [
    { data: [], label: "Valores Obtidos" },
    { data: [], label: "Limite Inferior" },
    { data: [], label: "Limite Superior" },
  ];
  public chartType: ChartType = "line";
  public chartLabels: Label[];

  public sizes = { height : '0px'}

  public dadosCalculo: any = { calculo: false, dados: [] };

  constructor(
    private serviceDados: DadosCalculoService,
    private screenOrientation: ScreenOrientation,
    public platform: Platform
  ) {
    this.setHeight();
  }

  ionViewWillEnter() {
    console.log(window.innerHeight);
    if (this.platform.is("mobile")) {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }
    this.dadosCalculo = this.serviceDados.getDados();
    this.preencheGraph();
  }

  setHeight(){
    this.sizes.height = (window.innerHeight - 80) + 'px';
  }

  ionViewDidLeave() {
    if (this.platform.is("mobile")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  preencheGraph() {
    this.chartLabels = [];
    this.chartData[0].data = [];
    if (this.dadosCalculo.dados?.length > 0) {
      for (let index = 0; index < this.dadosCalculo.dados.length; index++) {
        const element = this.dadosCalculo.dados[index];
        this.chartLabels.push(`Medição ${index + 1}`);
        this.chartData[0].data.push(element);
        this.chartData[1].data.push(this.dadosCalculo.result.dados.lmin);
        this.chartData[2].data.push(this.dadosCalculo.result.dados.lmax);
      }
    }
  }
}
