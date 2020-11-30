import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchScheduleAssignmentReportComponent } from './batch-schedule-assignment-report.component';

describe('BatchScheduleAssignmentReportComponent', () => {
  let component: BatchScheduleAssignmentReportComponent;
  let fixture: ComponentFixture<BatchScheduleAssignmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchScheduleAssignmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchScheduleAssignmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
