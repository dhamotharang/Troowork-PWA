import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerinspectiontemplateComponent } from './managerinspectiontemplate.component';

describe('ManagerinspectiontemplateComponent', () => {
  let component: ManagerinspectiontemplateComponent;
  let fixture: ComponentFixture<ManagerinspectiontemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerinspectiontemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerinspectiontemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
