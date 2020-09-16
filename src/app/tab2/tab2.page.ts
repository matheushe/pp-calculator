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
	public cartaX: ChartDataSets[] = [
		{ data: [], label: "Valores Obtidos", fill: false, lineTension: 0, radius: 5, borderColor: 'rgba(21,101,192 ,1)', pointBackgroundColor: 'rgba(13,71,161 ,1)' },
		{ data: [], label: "LSC", fill: false, radius: 0, borderColor: 'rgba(198,40,40 ,1)', pointBackgroundColor: 'rgba(183,28,28 ,1)' },
		{ data: [], label: "LM", fill: false, radius: 0, borderColor: 'rgba(85,139,47 ,1)', pointBackgroundColor: 'rgba(51,105,30 ,1)' },
		{ data: [], label: "LIC", fill: false, radius: 0, borderColor: 'rgba(198,40,40 ,1)', pointBackgroundColor: 'rgba(183,28,28 ,1)' }
	];


	public cartaAM: ChartDataSets[] = [
		{ data: [], label: "Valores Obtidos", fill: false, lineTension: 0, radius: 5, borderColor: 'rgba(21,101,192 ,1)', pointBackgroundColor: 'rgba(13,71,161 ,1)' },
		{ data: [], label: "LSC", fill: false, radius: 0, borderColor: 'rgba(198,40,40 ,1)', pointBackgroundColor: 'rgba(183,28,28 ,1)' },
		{ data: [], label: "LM", fill: false, radius: 0, borderColor: 'rgba(85,139,47 ,1)', pointBackgroundColor: 'rgba(51,105,30 ,1)' },
		{ data: [], label: "LIC", fill: false, radius: 0, borderColor: 'rgba(198,40,40 ,1)', pointBackgroundColor: 'rgba(183,28,28 ,1)' }
	];


	public chartType: ChartType = "line";
	public labelsAM: Label[];
	public labelsX: Label[];

	public dadosCalculo: any = { calculo: false, dados: [] };

	constructor(
		private serviceDados: DadosCalculoService,
		private screenOrientation: ScreenOrientation,
		public platform: Platform
	) { }

	ionViewWillEnter() {
		if (this.platform.is("mobile")) {
			this.screenOrientation.unlock();
		}

		if (this.serviceDados.getDados()) {
			localStorage.setItem('Dados', JSON.stringify(this.serviceDados.getDados()));
		}

		let dados = localStorage.getItem('Dados');

		if (dados) {
			this.dadosCalculo = JSON.parse(dados);
			console.log(this.dadosCalculo);

			this.preencheCartaX();
			this.preencheCartaAM();
		}
	}

	preencheCartaX() {
		this.labelsX = [];
		this.cartaX[0].data = [];
		this.cartaX[1].data = [];
		this.cartaX[2].data = [];
		this.cartaX[3].data = [];

		if (this.dadosCalculo.obtidos?.length > 0) {
			for (let index = 0; index < this.dadosCalculo.obtidos.length; index++) {
				const element = this.dadosCalculo.obtidos[index];

				this.labelsX.push(`${index + 1}`);

				this.cartaX[0].data.push(element);
				this.cartaX[1].data.push(this.dadosCalculo.resultados.dados.cartax.lic);
				this.cartaX[2].data.push(this.dadosCalculo.resultados.dados.cartax.lm);
				this.cartaX[3].data.push(this.dadosCalculo.resultados.dados.cartax.lsc);
			}
		}
	}

	preencheCartaAM() {
		this.labelsAM = [];
		this.cartaAM[0].data = [];
		this.cartaAM[1].data = [];
		this.cartaAM[2].data = [];
		this.cartaAM[3].data = [];

		if (this.dadosCalculo.resultados.dados.valoreVariancia.variancia?.length > 0) {
			this.labelsAM.push('');
			this.cartaAM[0].data.push(NaN);
			this.cartaAM[1].data.push(this.dadosCalculo.resultados.dados.cartaam.lic);
			this.cartaAM[2].data.push(this.dadosCalculo.resultados.dados.cartaam.lm);
			this.cartaAM[3].data.push(this.dadosCalculo.resultados.dados.cartaam.lsc);

			for (let index = 0; index < this.dadosCalculo.resultados.dados.valoreVariancia.variancia.length; index++) {
				const element = this.dadosCalculo.resultados.dados.valoreVariancia.variancia[index];

				this.labelsAM.push('');

				this.cartaAM[0].data.push(element);
				this.cartaAM[1].data.push(this.dadosCalculo.resultados.dados.cartaam.lic);
				this.cartaAM[2].data.push(this.dadosCalculo.resultados.dados.cartaam.lm);
				this.cartaAM[3].data.push(this.dadosCalculo.resultados.dados.cartaam.lsc);
			}
		}
	}
}
