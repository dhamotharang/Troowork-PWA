import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestEditPWAComponent } from './trade-request-edit-pwa.component';

describe('TradeRequestEditPWAComponent', () => {
  let component: TradeRequestEditPWAComponent;
  let fixture: ComponentFixture<TradeRequestEditPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestEditPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestEditPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
