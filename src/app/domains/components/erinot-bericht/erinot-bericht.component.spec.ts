import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErinotBerichtComponent } from './erinot-bericht.component';

describe('ErinotBerichtComponent', () => {
  let component: ErinotBerichtComponent;
  let fixture: ComponentFixture<ErinotBerichtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErinotBerichtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErinotBerichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
