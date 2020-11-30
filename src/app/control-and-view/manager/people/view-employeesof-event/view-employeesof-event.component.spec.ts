import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeesofEventComponent } from './view-employeesof-event.component';

describe('ViewEmployeesofEventComponent', () => {
  let component: ViewEmployeesofEventComponent;
  let fixture: ComponentFixture<ViewEmployeesofEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeesofEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeesofEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
