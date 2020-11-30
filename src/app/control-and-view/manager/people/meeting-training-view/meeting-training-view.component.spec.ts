import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTrainingViewComponent } from './meeting-training-view.component';

describe('MeetingTrainingViewComponent', () => {
  let component: MeetingTrainingViewComponent;
  let fixture: ComponentFixture<MeetingTrainingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingTrainingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingTrainingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
