import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestsfromEmployeesComponent } from './trade-requestsfrom-employees.component';

describe('TradeRequestsfromEmployeesComponent', () => {
  let component: TradeRequestsfromEmployeesComponent;
  let fixture: ComponentFixture<TradeRequestsfromEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestsfromEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestsfromEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
