import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEmployeeLeaveComponent } from './manual-employee-leave.component';

describe('ManualEmployeeLeaveComponent', () => {
  let component: ManualEmployeeLeaveComponent;
  let fixture: ComponentFixture<ManualEmployeeLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualEmployeeLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualEmployeeLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
