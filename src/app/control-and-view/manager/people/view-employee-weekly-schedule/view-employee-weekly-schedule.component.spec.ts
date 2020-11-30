import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeWeeklyScheduleComponent } from './view-employee-weekly-schedule.component';

describe('ViewEmployeeWeeklyScheduleComponent', () => {
  let component: ViewEmployeeWeeklyScheduleComponent;
  let fixture: ComponentFixture<ViewEmployeeWeeklyScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeWeeklyScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeWeeklyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
