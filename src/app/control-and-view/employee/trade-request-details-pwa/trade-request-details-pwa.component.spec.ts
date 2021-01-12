import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestDetailsPWAComponent } from './trade-request-details-pwa.component';

describe('TradeRequestDetailsPWAComponent', () => {
  let component: TradeRequestDetailsPWAComponent;
  let fixture: ComponentFixture<TradeRequestDetailsPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestDetailsPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestDetailsPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
