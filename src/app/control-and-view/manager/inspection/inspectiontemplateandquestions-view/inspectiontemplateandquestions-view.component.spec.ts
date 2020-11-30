import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectiontemplateandquestionsViewComponent } from './inspectiontemplateandquestions-view.component';

describe('InspectiontemplateandquestionsViewComponent', () => {
  let component: InspectiontemplateandquestionsViewComponent;
  let fixture: ComponentFixture<InspectiontemplateandquestionsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectiontemplateandquestionsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectiontemplateandquestionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
