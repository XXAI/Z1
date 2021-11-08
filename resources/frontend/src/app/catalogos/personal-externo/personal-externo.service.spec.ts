import { TestBed } from '@angular/core/testing';

import { PersonalExternoService } from './personal-externo.service';

describe('PersonalExternoService', () => {
  let service: PersonalExternoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalExternoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
