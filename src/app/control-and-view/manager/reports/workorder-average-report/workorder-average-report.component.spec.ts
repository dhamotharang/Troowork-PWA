import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderAverageReportComponent } from './workorder-average-report.component';

describe('WorkorderAverageReportComponent', () => {
  let component: WorkorderAverageReportComponent;
  let fixture: ComponentFixture<WorkorderAverageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderAverageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderAverageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
