import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsLocationComponent } from './cbs-location.component';

describe('CbsLocationComponent', () => {
  let component: CbsLocationComponent;
  let fixture: ComponentFixture<CbsLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbsLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
