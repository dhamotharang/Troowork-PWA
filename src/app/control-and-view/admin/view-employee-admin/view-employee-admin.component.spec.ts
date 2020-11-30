import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeAdminComponent } from './view-employee-admin.component';

describe('ViewEmployeeAdminComponent', () => {
  let component: ViewEmployeeAdminComponent;
  let fixture: ComponentFixture<ViewEmployeeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
