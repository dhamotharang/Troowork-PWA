import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuickOrderComponent } from './create-quick-order.component';

describe('CreateQuickOrderComponent', () => {
  let component: CreateQuickOrderComponent;
  let fixture: ComponentFixture<CreateQuickOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuickOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuickOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
