import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssignmentScheduleForReportComponent } from './edit-assignment-schedule-for-report.component';

describe('EditAssignmentScheduleForReportComponent', () => {
  let component: EditAssignmentScheduleForReportComponent;
  let fixture: ComponentFixture<EditAssignmentScheduleForReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssignmentScheduleForReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssignmentScheduleForReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
