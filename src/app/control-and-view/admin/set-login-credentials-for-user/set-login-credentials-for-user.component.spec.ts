import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLoginCredentialsForUserComponent } from './set-login-credentials-for-user.component';

describe('SetLoginCredentialsForUserComponent', () => {
  let component: SetLoginCredentialsForUserComponent;
  let fixture: ComponentFixture<SetLoginCredentialsForUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetLoginCredentialsForUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetLoginCredentialsForUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
