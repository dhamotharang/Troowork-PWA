import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionDetailedReportComponent } from './inspection-detailed-report.component';

describe('InspectionDetailedReportComponent', () => {
  let component: InspectionDetailedReportComponent;
  let fixture: ComponentFixture<InspectionDetailedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionDetailedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
