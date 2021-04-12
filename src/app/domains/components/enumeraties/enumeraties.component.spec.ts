import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumeratiesComponent } from './enumeraties.component';

describe('EnumeratiesComponent', () => {
  let component: EnumeratiesComponent;
  let fixture: ComponentFixture<EnumeratiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnumeratiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumeratiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
