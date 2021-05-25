import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinnenvaartschipTypeComponent } from './binnenvaartschip-type.component';

describe('BinnenvaartschipTypeComponent', () => {
  let component: BinnenvaartschipTypeComponent;
  let fixture: ComponentFixture<BinnenvaartschipTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinnenvaartschipTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinnenvaartschipTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
