import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderCancelReportComponent } from './workorder-cancel-report.component';

describe('WorkorderCancelReportComponent', () => {
  let component: WorkorderCancelReportComponent;
  let fixture: ComponentFixture<WorkorderCancelReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderCancelReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderCancelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
