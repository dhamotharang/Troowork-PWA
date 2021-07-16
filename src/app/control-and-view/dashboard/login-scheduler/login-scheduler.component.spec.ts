import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSchedulerComponent } from './login-scheduler.component';

describe('LoginSchedulerComponent', () => {
  let component: LoginSchedulerComponent;
  let fixture: ComponentFixture<LoginSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
