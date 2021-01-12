import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestPWAComponent } from './trade-request-pwa.component';

describe('TradeRequestPWAComponent', () => {
  let component: TradeRequestPWAComponent;
  let fixture: ComponentFixture<TradeRequestPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
