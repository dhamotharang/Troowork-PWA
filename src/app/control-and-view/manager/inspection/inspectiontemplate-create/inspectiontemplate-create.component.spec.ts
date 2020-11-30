import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectiontemplateCreateComponent } from './inspectiontemplate-create.component';

describe('InspectiontemplateCreateComponent', () => {
  let component: InspectiontemplateCreateComponent;
  let fixture: ComponentFixture<InspectiontemplateCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectiontemplateCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectiontemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
