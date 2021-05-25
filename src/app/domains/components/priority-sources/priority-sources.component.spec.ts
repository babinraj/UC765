import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioritySourcesComponent } from './priority-sources.component';

describe('PrioritySourcesComponent', () => {
  let component: PrioritySourcesComponent;
  let fixture: ComponentFixture<PrioritySourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrioritySourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrioritySourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
