import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUserLoginSuperComponent } from './set-user-login-super.component';

describe('SetUserLoginSuperComponent', () => {
  let component: SetUserLoginSuperComponent;
  let fixture: ComponentFixture<SetUserLoginSuperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetUserLoginSuperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUserLoginSuperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
