import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestApproveComponent } from './trade-request-approve.component';

describe('TradeRequestApproveComponent', () => {
  let component: TradeRequestApproveComponent;
  let fixture: ComponentFixture<TradeRequestApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
