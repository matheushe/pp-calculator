import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";
@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  public peca: any = { desc: "", lmin: null, lmax: null, obtido: [] };
  public result: any = { resultado: false, dados: {} };

  constructor(
    private alertController: AlertController,
    private toast: ToastController
  ) {}

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

  removeObtido(index) {
    this.peca.obtido.splice(index, 1);
  }

  async validaDados() {
    if (this.peca.lmin == null || this.peca.lmin == null) {
      let error = await this.toast.create({
        message:
          "Por favor verifique os valores de limite inferior e limite superior",
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

      let pp = this.calculaPP(this.peca.lmax, this.peca.lmin, desvio);
      let ppmin = this.calculaPPMin(this.peca.lmax, mediaObtidos, desvio);
      let ppmax = this.calculaPPMax(this.peca.lmin, mediaObtidos, desvio);

      let ppk = this.calculaPPK(ppmin, ppmax);

      this.result = {
        resultado: true,
        dados: {
          mediaObtidos: Math.round((mediaObtidos + Number.EPSILON) * 100) / 100,
          desvio: Math.round((desvio + Number.EPSILON) * 100) / 100,
          mediaVariancia: Math.round((mediaVaria + Number.EPSILON) * 100) / 100,
          pp: Math.round((pp + Number.EPSILON) * 100) / 100,
          ppmin: Math.round((ppmin + Number.EPSILON) * 100) / 100,
          ppmax: Math.round((ppmax + Number.EPSILON) * 100) / 100,
          ppk: Math.round((ppk + Number.EPSILON) * 100) / 100,
        },
	  };
	  
	  let fim = await this.toast.create({
        message:
          "Calculado com Sucesso!",
        duration: 2000,
        color: "success",
      });

      fim.present();
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
      (total, valor) => total + Math.pow(media - valor, 2) / (arrOb.length - 1),
      0
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
    if (lmin < lmax) {
      return lmin;
    } else {
      return lmax;
    }
  }
}
