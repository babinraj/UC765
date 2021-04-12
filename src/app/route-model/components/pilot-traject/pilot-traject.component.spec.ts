import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotTrajectComponent } from './pilot-traject.component';

describe('PilotTrajectComponent', () => {
  let component: PilotTrajectComponent;
  let fixture: ComponentFixture<PilotTrajectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilotTrajectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotTrajectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
