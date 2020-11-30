import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartReportComponent } from './barchart-report.component';

describe('BarchartReportComponent', () => {
  let component: BarchartReportComponent;
  let fixture: ComponentFixture<BarchartReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarchartReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarchartReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
