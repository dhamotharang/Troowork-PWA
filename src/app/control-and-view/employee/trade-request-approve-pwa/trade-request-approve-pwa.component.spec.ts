import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestApprovePWAComponent } from './trade-request-approve-pwa.component';

describe('TradeRequestApprovePWAComponent', () => {
  let component: TradeRequestApprovePWAComponent;
  let fixture: ComponentFixture<TradeRequestApprovePWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestApprovePWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestApprovePWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
