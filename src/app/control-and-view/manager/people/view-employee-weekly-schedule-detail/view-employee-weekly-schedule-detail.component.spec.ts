import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeWeeklyScheduleDetailComponent } from './view-employee-weekly-schedule-detail.component';

describe('ViewEmployeeWeeklyScheduleDetailComponent', () => {
  let component: ViewEmployeeWeeklyScheduleDetailComponent;
  let fixture: ComponentFixture<ViewEmployeeWeeklyScheduleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeWeeklyScheduleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeWeeklyScheduleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
