import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWelcomeComponent } from './employee-welcome.component';

describe('EmployeeWelcomeComponent', () => {
  let component: EmployeeWelcomeComponent;
  let fixture: ComponentFixture<EmployeeWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
