import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperblockComponent } from './superblock.component';

describe('SuperblockComponent', () => {
  let component: SuperblockComponent;
  let fixture: ComponentFixture<SuperblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperblockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
