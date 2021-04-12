import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperblockBlockComponent } from './superblock-block.component';

describe('SuperblockBlockComponent', () => {
  let component: SuperblockBlockComponent;
  let fixture: ComponentFixture<SuperblockBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperblockBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperblockBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
