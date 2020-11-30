import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkOrderComponent } from './view-work-order.component';

describe('ViewWorkOrderComponent', () => {
  let component: ViewWorkOrderComponent;
  let fixture: ComponentFixture<ViewWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
