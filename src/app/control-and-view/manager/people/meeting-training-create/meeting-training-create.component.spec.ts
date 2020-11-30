import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTrainingCreateComponent } from './meeting-training-create.component';

describe('MeetingTrainingCreateComponent', () => {
  let component: MeetingTrainingCreateComponent;
  let fixture: ComponentFixture<MeetingTrainingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingTrainingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingTrainingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
