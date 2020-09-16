import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";
import { DadosCalculoService } from "../dados-calculo.service";
@Component({
	selector: "app-tab1",
	templateUrl: "tab1.page.html",
	styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
	public peca: any = {
		peca: "Peça",
		desc: "",
		lmin: null,
		lmax: null,
		obtido: [],
	};
	public resultado: any = { resultado: false, dados: {} };

	constructor(
		private alertController: AlertController,
		private toast: ToastController,
		private serviceDados: DadosCalculoService
	) { }

	async addObtido() {
		let alert = await this.alertController.create({
			header: "Valor Obtido",
			inputs: [
				{
					name: "valor",
					type: "number",
					placeholder: "Digite o valor obtido",
				},
			],
			buttons: [
				{
					text: "Cancelar",
					role: "cancel",
					cssClass: "secondary",
				},
				{
					text: "Adicionar",
					handler: (value) => {
						this.peca.obtido.push({ valor: parseFloat(value.valor) });
					},
				},
			],
		});

		await alert.present();
	}

	async alteraPeca() {
		let alert = await this.alertController.create({
			header: "Informar Peça",
			inputs: [
				{
					name: "peca",
					type: "text",
					placeholder: "Digite a identificação da peça",
				},
			],
			buttons: [
				{
					text: "Cancelar",
					role: "cancel",
					cssClass: "secondary",
				},
				{
					text: "Salvar",
					handler: (value) => {
						this.peca.peca = value.peca;
					},
				},
			],
		});

		await alert.present();
	}

	removeObtido(index) {
		this.peca.obtido.splice(index, 1);
	}

	async validaDados() {
		if (this.peca.lmin == null && this.peca.lmax == null) {
			let error = await this.toast.create({
				message:
					"Por favor informe pelo menos um dos limites. (limite inferior ou limite superior)",
				duration: 2000,
				color: "danger",
			});

			error.present();
			return false;
		} else if (this.peca.obtido.length <= 2) {
			let error = await this.toast.create({
				message:
					"Por favor informe pelo menos 3 valores para continuar com o calculo",
				duration: 2000,
				color: "danger",
			});

			error.present();
			return false;
		}

		return true;
	}

	async calcula() {
		if (await this.validaDados()) {
			let obtidos = this.converteObtidos(this.peca.obtido);
			let variancia = this.calculaVariancia(this.peca.obtido);

			let mediaObtidos = this.calculaMedia(obtidos);
			let mediaVaria = this.calculaMedia(variancia);
			let desvio = this.calculaDesvioPadrao(obtidos);

			let cartaX = { lsc: this.calculaXLSC(mediaObtidos, mediaVaria), lic: this.calculaXLIC(mediaObtidos, mediaVaria) };
			let cartaAM = { lsc: this.calculaAMLSC(mediaVaria), lic: 0 };

			let ppmin = null;
			if (this.peca.lmin != null) {
				ppmin = this.calculaPPMin(this.peca.lmin, mediaObtidos, desvio);
			}

			let ppmax = null;
			if (this.peca.lmax != null) {
				ppmax = this.calculaPPMax(this.peca.lmax, mediaObtidos, desvio);
			}

			let pp = null;
			if (ppmax != null && ppmin != null) {
				pp = this.calculaPP(this.peca.lmax, this.peca.lmin, desvio);
			}

			let ppk = this.calculaPPK(ppmin, ppmax);

			this.resultado = {
				resultado: true,
				dados: {
					limites: {
						lmin: this.peca.lmin != null ? this.peca.lmin.toFixed(2) : "*",
						lmax: this.peca.lmax != null ? this.peca.lmax.toFixed(2) : "*"
					},

					resultado: {
						pp: pp != null ? pp.toFixed(2) : "*",
						ppmin: ppmin != null ? ppmin.toFixed(2) : "*",
						ppmax: ppmax != null ? ppmax.toFixed(2) : "*",
						ppk: ppk.toFixed(2)
					},

					dados: {
						mediaObtidos: mediaObtidos.toFixed(2),
						desvio: desvio.toFixed(2),
						mediaVariancia: mediaVaria.toFixed(2)
					},

					valoreVariancia: {
						variancia
					},

					cartax: {
						lsc: cartaX.lsc != null ? cartaX.lsc.toFixed(2) : "*",
						lm: mediaObtidos.toFixed(2),
						lic: cartaX.lic != null ? cartaX.lic.toFixed(2) : "*"
					},

					cartaam: {
						lsc: cartaAM.lsc != null ? cartaAM.lsc.toFixed(2) : "*",
						lm: mediaVaria.toFixed(2),
						lic: cartaAM.lic != null ? cartaAM.lic.toFixed(2) : "*"
					}
				},
			};

			let fim = await this.toast.create({
				message: "Calculado com Sucesso!",
				duration: 2000,
				color: "success",
			});

			fim.present();

			this.serviceDados.setDados({
				detalhes : this.peca,
				calculo: true,
				obtidos: obtidos,
				resultados: this.resultado,
			});
		}
	}

	calculaVariancia(arrayOb) {
		let newArr = [];

		let ant = 0;
		let primeiro = true;

		arrayOb.forEach((element) => {
			if (!primeiro) {
				let diff = ant - element.valor;

				diff = Math.abs(diff);

				newArr.push(diff);
			}
			primeiro = false;
			ant = element.valor;
		});

		return newArr;
	}

	converteObtidos(arrayOb) {
		let newArr = [];
		arrayOb.forEach((element) => {
			newArr.push(element.valor);
		});
		return newArr;
	}

	calculaMedia(arrOb) {
		let calculo = arrOb.reduce((a, b) => a + b) / arrOb.length;
		return Math.abs(calculo);
	}

	calculaDesvioPadrao(arrOb) {
		let media = arrOb.reduce((total, valor) => total + valor / arrOb.length, 0);

		let variancia = arrOb.reduce(
			(total, valor) => total + Math.pow(media - valor, 2) / (arrOb.length - 1), 0
		);
		return Math.sqrt(variancia);
	}

	calculaPP(lmax, lmin, desvio) {
		let calculo = (lmax - lmin) / (6 * desvio);
		return Math.abs(calculo);
	}

	calculaPPMin(lmax, media, desvio) {
		let calculo = (lmax - media) / (3 * desvio);
		return Math.abs(calculo);
	}

	calculaPPMax(lmin, media, desvio) {
		let calculo = (lmin - media) / (3 * desvio);
		return Math.abs(calculo);
	}

	calculaPPK(lmin, lmax) {
		if (lmin == null) {
			return lmax;
		} else if (lmax == null) {
			return lmin;
		} else {
			if (lmin < lmax) {
				return lmin;
			} else {
				return lmax;
			}
		}
	}

	/**
	 * Calculo das Cartas
	 */
	//Limite superior da Carta X
	calculaXLSC(lm: number, desvio: number) {
		return lm + 3 * (desvio / 1.128);
	}

	//Limite inferior da Carta X
	calculaXLIC(lm: number, desvio: number) {
		return lm - 3 * (desvio / 1.128);
	}

	//Limite superior da Carta AM
	calculaAMLSC(desvio: number) {
		return 3.267 * desvio;
	}

}
