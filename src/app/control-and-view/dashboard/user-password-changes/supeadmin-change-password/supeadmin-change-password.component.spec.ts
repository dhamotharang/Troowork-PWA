import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupeadminChangePasswordComponent } from './supeadmin-change-password.component';

describe('SupeadminChangePasswordComponent', () => {
  let component: SupeadminChangePasswordComponent;
  let fixture: ComponentFixture<SupeadminChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupeadminChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupeadminChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
