import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorChangePasswordComponent } from './supervisor-change-password.component';

describe('SupervisorChangePasswordComponent', () => {
  let component: SupervisorChangePasswordComponent;
  let fixture: ComponentFixture<SupervisorChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
