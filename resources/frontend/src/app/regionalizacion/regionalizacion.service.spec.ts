import { TestBed } from '@angular/core/testing';

import { RegionalizacionService } from './regionalizacion.service';

describe('RegionalizacionService', () => {
  let service: RegionalizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionalizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
