import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTemplateAssignComponent } from './feedback-template-assign.component';

describe('FeedbackTemplateAssignComponent', () => {
  let component: FeedbackTemplateAssignComponent;
  let fixture: ComponentFixture<FeedbackTemplateAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackTemplateAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackTemplateAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
