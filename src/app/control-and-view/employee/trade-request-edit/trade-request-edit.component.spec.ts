import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRequestEditComponent } from './trade-request-edit.component';

describe('TradeRequestEditComponent', () => {
  let component: TradeRequestEditComponent;
  let fixture: ComponentFixture<TradeRequestEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeRequestEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeRequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
