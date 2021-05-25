import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLayerComponent } from './export-layer.component';

describe('ExportLayerComponent', () => {
  let component: ExportLayerComponent;
  let fixture: ComponentFixture<ExportLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
