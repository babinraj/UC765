import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsBerichtComponent } from './cbs-bericht.component';

describe('CbsBerichtComponent', () => {
  let component: CbsBerichtComponent;
  let fixture: ComponentFixture<CbsBerichtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbsBerichtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsBerichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
