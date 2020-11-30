import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderInProgressReportComponent } from './workorder-in-progress-report.component';

describe('WorkorderInProgressReportComponent', () => {
  let component: WorkorderInProgressReportComponent;
  let fixture: ComponentFixture<WorkorderInProgressReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderInProgressReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderInProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
