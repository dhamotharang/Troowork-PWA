import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesDowntimeReportComponent } from './employees-downtime-report.component';

describe('EmployeesDowntimeReportComponent', () => {
  let component: EmployeesDowntimeReportComponent;
  let fixture: ComponentFixture<EmployeesDowntimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesDowntimeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesDowntimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
