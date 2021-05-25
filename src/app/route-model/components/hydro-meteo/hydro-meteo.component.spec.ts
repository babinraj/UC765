import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HydroMeteoComponent } from './hydro-meteo.component';

describe('HydroMeteoComponent', () => {
  let component: HydroMeteoComponent;
  let fixture: ComponentFixture<HydroMeteoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HydroMeteoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HydroMeteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
