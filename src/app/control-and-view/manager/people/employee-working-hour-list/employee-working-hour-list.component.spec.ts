import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWorkingHourListComponent } from './employee-working-hour-list.component';

describe('EmployeeWorkingHourListComponent', () => {
  let component: EmployeeWorkingHourListComponent;
  let fixture: ComponentFixture<EmployeeWorkingHourListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeWorkingHourListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWorkingHourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
