import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectiontemplateEditComponent } from './inspectiontemplate-edit.component';

describe('InspectiontemplateEditComponent', () => {
  let component: InspectiontemplateEditComponent;
  let fixture: ComponentFixture<InspectiontemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectiontemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectiontemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
