import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTrainingEditComponent } from './meeting-training-edit.component';

describe('MeetingTrainingEditComponent', () => {
  let component: MeetingTrainingEditComponent;
  let fixture: ComponentFixture<MeetingTrainingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingTrainingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingTrainingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
