import { TestBed } from '@angular/core/testing';

import { DadosCalculoService } from './dados-calculo.service';

describe('DadosCalculoService', () => {
  let service: DadosCalculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadosCalculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
