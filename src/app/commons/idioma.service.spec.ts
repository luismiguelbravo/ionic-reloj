import { TestBed } from '@angular/core/testing';

import { IdiomaService } from './idioma.service';

describe('IdiomaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdiomaService = TestBed.get(IdiomaService);
    expect(service).toBeTruthy();
  });
});
