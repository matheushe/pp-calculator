import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DadosCalculoService {

  private dadosCalculados : any = {calculo : false}

  constructor() { }

  setDados(dados)
  {
    this.dadosCalculados = dados;
    return true;
  }

  getDados()
  {
    if(this.dadosCalculados.calculo){
      return this.dadosCalculados;
    }else {
      return false;
    }
  }
}
