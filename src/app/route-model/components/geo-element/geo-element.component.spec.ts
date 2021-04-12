import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoElementComponent } from './geo-element.component';

describe('GeoElementComponent', () => {
  let component: GeoElementComponent;
  let fixture: ComponentFixture<GeoElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
