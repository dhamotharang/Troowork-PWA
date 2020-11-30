import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestComponent } from './trade-request.component';

describe('TradeRequestComponent', () => {
  let component: TradeRequestComponent;
  let fixture: ComponentFixture<TradeRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
