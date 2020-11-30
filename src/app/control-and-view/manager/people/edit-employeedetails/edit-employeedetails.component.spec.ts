import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeedetailsComponent } from './edit-employeedetails.component';

describe('EditEmployeedetailsComponent', () => {
  let component: EditEmployeedetailsComponent;
  let fixture: ComponentFixture<EditEmployeedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
