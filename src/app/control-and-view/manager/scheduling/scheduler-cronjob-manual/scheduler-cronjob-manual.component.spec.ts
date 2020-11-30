import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerCronjobManualComponent } from './scheduler-cronjob-manual.component';

describe('SchedulerCronjobManualComponent', () => {
  let component: SchedulerCronjobManualComponent;
  let fixture: ComponentFixture<SchedulerCronjobManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerCronjobManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerCronjobManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
