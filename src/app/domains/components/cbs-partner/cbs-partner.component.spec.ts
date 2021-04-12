import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBSPartnerComponent } from './cbs-partner.component';

describe('CBSPartnerComponent', () => {
  let component: CBSPartnerComponent;
  let fixture: ComponentFixture<CBSPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CBSPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CBSPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
