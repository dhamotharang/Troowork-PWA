import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuickWorkOrderComponent } from './create-quick-work-order.component';

describe('CreateQuickWorkOrderComponent', () => {
  let component: CreateQuickWorkOrderComponent;
  let fixture: ComponentFixture<CreateQuickWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuickWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuickWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
