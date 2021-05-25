import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteSegmentComponent } from './route-segment.component';

describe('RouteSegmentComponent', () => {
  let component: RouteSegmentComponent;
  let fixture: ComponentFixture<RouteSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteSegmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
