import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewworkordersforemployeeComponent } from './viewworkordersforemployee.component';

describe('ViewworkordersforemployeeComponent', () => {
  let component: ViewworkordersforemployeeComponent;
  let fixture: ComponentFixture<ViewworkordersforemployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewworkordersforemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewworkordersforemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
