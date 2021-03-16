import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeedbackTemplateComponent } from './edit-feedback-template.component';

describe('EditFeedbackTemplateComponent', () => {
  let component: EditFeedbackTemplateComponent;
  let fixture: ComponentFixture<EditFeedbackTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFeedbackTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFeedbackTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
