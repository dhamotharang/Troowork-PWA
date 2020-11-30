import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWorkingHourEmpListViewComponent } from './employee-working-hour-emp-list-view.component';

describe('EmployeeWorkingHourEmpListViewComponent', () => {
  let component: EmployeeWorkingHourEmpListViewComponent;
  let fixture: ComponentFixture<EmployeeWorkingHourEmpListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeWorkingHourEmpListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWorkingHourEmpListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
