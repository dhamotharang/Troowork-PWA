import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistReportComponent } from './picklist-report.component';

describe('PicklistReportComponent', () => {
  let component: PicklistReportComponent;
  let fixture: ComponentFixture<PicklistReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicklistReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
