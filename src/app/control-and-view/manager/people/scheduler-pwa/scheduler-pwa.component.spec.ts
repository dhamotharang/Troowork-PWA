import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerPWAComponent } from './scheduler-pwa.component';

describe('SchedulerPWAComponent', () => {
  let component: SchedulerPWAComponent;
  let fixture: ComponentFixture<SchedulerPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
