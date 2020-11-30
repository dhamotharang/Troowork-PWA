import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectiontemplatedetailEditComponent } from './inspectiontemplatedetail-edit.component';

describe('InspectiontemplatedetailEditComponent', () => {
  let component: InspectiontemplatedetailEditComponent;
  let fixture: ComponentFixture<InspectiontemplatedetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectiontemplatedetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectiontemplatedetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
