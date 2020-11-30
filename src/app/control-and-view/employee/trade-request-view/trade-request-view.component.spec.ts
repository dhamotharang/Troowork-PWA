import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestViewComponent } from './trade-request-view.component';

describe('TradeRequestViewComponent', () => {
  let component: TradeRequestViewComponent;
  let fixture: ComponentFixture<TradeRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
