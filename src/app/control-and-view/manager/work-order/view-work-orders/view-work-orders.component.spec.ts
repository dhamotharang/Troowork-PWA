import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkOrdersComponent } from './view-work-orders.component';

describe('ViewWorkOrdersComponent', () => {
  let component: ViewWorkOrdersComponent;
  let fixture: ComponentFixture<ViewWorkOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWorkOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorkOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
