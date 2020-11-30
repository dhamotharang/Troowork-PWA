import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchScheduleRoomComponent } from './batch-schedule-room.component';

describe('BatchScheduleRoomComponent', () => {
  let component: BatchScheduleRoomComponent;
  let fixture: ComponentFixture<BatchScheduleRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchScheduleRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchScheduleRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
