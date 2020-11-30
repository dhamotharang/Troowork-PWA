import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeDetailsAdminComponent } from './edit-employee-details-admin.component';

describe('EditEmployeeDetailsAdminComponent', () => {
  let component: EditEmployeeDetailsAdminComponent;
  let fixture: ComponentFixture<EditEmployeeDetailsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeDetailsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
