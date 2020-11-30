import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackManageComponent } from './feedback-manage.component';

describe('FeedbackManageComponent', () => {
  let component: FeedbackManageComponent;
  let fixture: ComponentFixture<FeedbackManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
