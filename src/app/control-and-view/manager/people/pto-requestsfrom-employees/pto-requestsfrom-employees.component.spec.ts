import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestsfromEmployeesComponent } from './pto-requestsfrom-employees.component';

describe('PtoRequestsfromEmployeesComponent', () => {
  let component: PtoRequestsfromEmployeesComponent;
  let fixture: ComponentFixture<PtoRequestsfromEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestsfromEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestsfromEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
