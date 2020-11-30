import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchWorkOrderReportComponent } from './batch-work-order-report.component';

describe('BatchWorkOrderReportComponent', () => {
  let component: BatchWorkOrderReportComponent;
  let fixture: ComponentFixture<BatchWorkOrderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchWorkOrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchWorkOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
