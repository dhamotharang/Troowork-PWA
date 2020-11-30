import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTypeComponent } from './work-order-type.component';

describe('WorkOrderTypeComponent', () => {
  let component: WorkOrderTypeComponent;
  let fixture: ComponentFixture<WorkOrderTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
