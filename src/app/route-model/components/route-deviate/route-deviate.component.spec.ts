import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDeviateComponent } from './route-deviate.component';

describe('RouteDeviateComponent', () => {
  let component: RouteDeviateComponent;
  let fixture: ComponentFixture<RouteDeviateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteDeviateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteDeviateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
