import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  public pecas: any = [];
  public result: any = { resultado: false, dados: {} };
  constructor(private alertController: AlertController) { }

  public addCarac(index) {
    let novo = { desc: "", lmin: 0, lmax: 0, obtido: [{ valor: 0 }] };

    this.pecas[index].carac.push(novo);
  }

  async addPeca() {
    const alert = await this.alertController.create({
      header: "Adicionar Peça",
      inputs: [
        {
          name: "nomePeca",
          type: "text",
          placeholder: "Digite o Nome da Peça",
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
            let novo = {
              peca: value.nomePeca,
              carac: [{ desc: "", lmin: 0, lmax: 0, obtido: [{ valor: 0 }] }],
            };

            this.pecas.push(novo);
            // console.log(this.pecas);
          },
        },
      ],
    });

    await alert.present();
  }

  addObtido(peca, carac) {
    // console.log(this.pecas[peca]);

    this.pecas[peca].carac[carac]["obtido"].push({ valor: 0 });
  }

  removeObtido(peca, carac, index) {
    // console.log(peca);
    // console.log(carac);
    // console.log(index);

    console.log(this.pecas[peca].carac[carac].obtido[index]);

    this.pecas[peca].carac[carac].obtido.splice(index, 1);
  }

  calcula(peca, carac) {

    let obtidos = this.converteObtidos(this.pecas[peca].carac[carac].obtido);
    let variancia = this.calculaVariancia(this.pecas[peca].carac[carac].obtido);

    let mediaObtidos = this.calculaMedia(obtidos);
    let mediaVaria = this.calculaMedia(variancia);
    let desvio = this.calculaDesvioPadrao(obtidos);

    let pp = this.calculaPP(this.pecas[peca].carac[carac].lmax, this.pecas[peca].carac[carac].lmin, desvio);
    let ppmin = this.calculaPPMin(this.pecas[peca].carac[carac].lmax, mediaObtidos, desvio);
    let ppmax = this.calculaPPMax(this.pecas[peca].carac[carac].lmin, mediaObtidos, desvio);

    let ppk = this.calculaPPK(ppmin, ppmax);

    // console.log("Media Obtido " + mediaObtidos);
    // console.log("Desvio Padrao " + desvio);
    // console.log("Media Variancia " + mediaVaria);

    // console.log('********** PP **********');
    // console.log("PP " + pp);
    // console.log("PP Min " + ppmin);
    // console.log("PP Max " + ppmax);
    // console.log('---------- PP ----------');
    // console.log('********** PPK **********');
    // console.log("PPK " + ppk);
    // console.log('---------- PPK ----------');

    this.result = {
      resultado: true, dados: {
        mediaObtidos: (Math.round((mediaObtidos + Number.EPSILON) * 100) / 100),
        desvio: (Math.round((desvio + Number.EPSILON) * 100) / 100),
        mediaVariancia: (Math.round((mediaVaria + Number.EPSILON) * 100) / 100),
        pp: (Math.round((pp + Number.EPSILON) * 100) / 100),
        ppmin: (Math.round((ppmin + Number.EPSILON) * 100) / 100),
        ppmax: (Math.round((ppmax + Number.EPSILON) * 100) / 100),
        ppk: (Math.round((ppk + Number.EPSILON) * 100) / 100)
      }
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
    let calculo = ((lmax - lmin) / (6 * desvio));
    return Math.abs(calculo);
  }

  calculaPPMin(lmax, media, desvio) {
    let calculo = ((lmax - media) / (3 * desvio));
    return Math.abs(calculo);
  }

  calculaPPMax(lmin, media, desvio) {
    let calculo = ((lmin - media) / (3 * desvio));
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
