import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPWAComponent } from './login-pwa.component';

describe('LoginPWAComponent', () => {
  let component: LoginPWAComponent;
  let fixture: ComponentFixture<LoginPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
