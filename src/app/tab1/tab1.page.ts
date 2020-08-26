import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  public pecas: any = [];
  constructor(private alertController: AlertController) {}

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
            console.log(this.pecas);
          },
        },
      ],
    });

    await alert.present();
  }

  addObtido(peca, carac) {
    console.log(this.pecas[peca]);

    this.pecas[peca].carac[carac]["obtido"].push({ valor: 0 });
  }

  removeObtido(peca, carac, index) {
    console.log(index);

    console.log(this.pecas[peca].carac[carac].obtido);

    this.pecas[peca].carac[carac].obtido.splice(index, 1);
  }

  calcula(peca, carac) {
    console.log(this.pecas[peca].carac[carac]);
    let valores = this.converteObtidos(this.pecas[peca].carac[carac].obtido);
    let variancia = this.calculaVariancia(this.pecas[peca].carac[carac].obtido);
    
    let desvio = this.calculaDesvioPadrao(valores);
    let pp = this.calculaPP(this.pecas[peca].carac[carac].lmin, this.pecas[peca].carac[carac].lmax, desvio);
    
    let mediaObtidos = this.calculaMedia(valores);
    let mediaVaria = this.calculaMedia(variancia);

    console.log("Media Obtido " + mediaObtidos);
    console.log("Desvio Padrao " + desvio);
    console.log("Media Variancia " + mediaVaria);
    console.log("PP " + pp);
  }

  calculaVariancia(arrayOb) {
    let newArr = [];

    let ant = 0.0;
    let primeiro = true;

    arrayOb.forEach((element) => {
      if (!primeiro) {
        let diff = ant - element.valor;

        if (diff < 0) {
          diff = diff * -1;
        }

        newArr.push(diff);
      }
      primeiro = false;
      ant = element.valor;
    });

    return newArr;
  }

  calculaDesvioPadrao(arrOb) {
    let media = arrOb.reduce((total, valor) => total + valor / arrOb.length, 0);
    let variancia = arrOb.reduce(
      (total, valor) => total + Math.pow(media - valor, 2) / arrOb.length,
      0
    );
    return Math.sqrt(variancia);
  }

  converteObtidos(arrayOb) {
    let newArr = [];
    arrayOb.forEach((element) => {
      newArr.push(element.valor);
    });

    return newArr;
  }

  calculaMedia(arrOb) {
    return arrOb.reduce((a, b) => a + b) / arrOb.length;
  }

  calculaPP(lmin, lmax, desvio) {

     return (lmax - lmin) / 6 * desvio;
  }
}
