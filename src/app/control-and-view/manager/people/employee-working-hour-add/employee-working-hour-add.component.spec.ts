import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWorkingHourAddComponent } from './employee-working-hour-add.component';

describe('EmployeeWorkingHourAddComponent', () => {
  let component: EmployeeWorkingHourAddComponent;
  let fixture: ComponentFixture<EmployeeWorkingHourAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeWorkingHourAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWorkingHourAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
