import { TestBed } from '@angular/core/testing';

import { CluesService } from './clues.service';

describe('CluesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CluesService = TestBed.get(CluesService);
    expect(service).toBeTruthy();
  });
});
