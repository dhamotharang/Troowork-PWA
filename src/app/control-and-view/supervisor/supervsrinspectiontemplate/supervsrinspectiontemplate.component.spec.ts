import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervsrinspectiontemplateComponent } from './supervsrinspectiontemplate.component';

describe('SupervsrinspectiontemplateComponent', () => {
  let component: SupervsrinspectiontemplateComponent;
  let fixture: ComponentFixture<SupervsrinspectiontemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervsrinspectiontemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervsrinspectiontemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
