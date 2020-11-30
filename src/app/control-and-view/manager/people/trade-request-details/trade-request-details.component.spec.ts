import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestDetailsComponent } from './trade-request-details.component';

describe('TradeRequestDetailsComponent', () => {
  let component: TradeRequestDetailsComponent;
  let fixture: ComponentFixture<TradeRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
