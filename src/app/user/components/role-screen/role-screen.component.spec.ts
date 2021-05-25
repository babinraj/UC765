import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleScreenComponent } from './role-screen.component';

describe('RoleScreenComponent', () => {
  let component: RoleScreenComponent;
  let fixture: ComponentFixture<RoleScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
