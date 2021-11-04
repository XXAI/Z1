import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponentClue } from './details-clue.component';

describe('DetailsComponentClue', () => {
  let component: DetailsComponentClue;
  let fixture: ComponentFixture<DetailsComponentClue>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsComponentClue ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponentClue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
