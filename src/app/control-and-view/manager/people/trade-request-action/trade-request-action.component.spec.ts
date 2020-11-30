import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestActionComponent } from './trade-request-action.component';

describe('TradeRequestActionComponent', () => {
  let component: TradeRequestActionComponent;
  let fixture: ComponentFixture<TradeRequestActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
