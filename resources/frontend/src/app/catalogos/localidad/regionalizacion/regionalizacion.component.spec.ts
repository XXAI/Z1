import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalizacionComponent } from './regionalizacion.component';

describe('RegionalizacionComponent', () => {
  let component: RegionalizacionComponent;
  let fixture: ComponentFixture<RegionalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionalizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
