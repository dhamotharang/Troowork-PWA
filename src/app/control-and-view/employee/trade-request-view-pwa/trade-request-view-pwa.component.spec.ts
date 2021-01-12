import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestViewPWAComponent } from './trade-request-view-pwa.component';

describe('TradeRequestViewPWAComponent', () => {
  let component: TradeRequestViewPWAComponent;
  let fixture: ComponentFixture<TradeRequestViewPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestViewPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestViewPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
