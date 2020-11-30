import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionAuditReportComponent } from './inspection-audit-report.component';

describe('InspectionAuditReportComponent', () => {
  let component: InspectionAuditReportComponent;
  let fixture: ComponentFixture<InspectionAuditReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionAuditReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionAuditReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
