import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeesofGroupComponent } from './view-employeesof-group.component';

describe('ViewEmployeesofGroupComponent', () => {
  let component: ViewEmployeesofGroupComponent;
  let fixture: ComponentFixture<ViewEmployeesofGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeesofGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeesofGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
