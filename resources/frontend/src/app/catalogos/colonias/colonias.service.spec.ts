import { TestBed } from '@angular/core/testing';

import { ColoniasService } from './colonias.service';

describe('ColoniasService', () => {
  let service: ColoniasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColoniasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
