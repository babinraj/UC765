import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeeschipTypeComponent } from './zeeschip-type.component';

describe('ZeeschipTypeComponent', () => {
  let component: ZeeschipTypeComponent;
  let fixture: ComponentFixture<ZeeschipTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeeschipTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeeschipTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
