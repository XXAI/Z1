import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectorCrDialogComponent } from './selector-cr-dialog.component';

describe('SelectorCrDialogComponent', () => {
  let component: SelectorCrDialogComponent;
  let fixture: ComponentFixture<SelectorCrDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorCrDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorCrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
