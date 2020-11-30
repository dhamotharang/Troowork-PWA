import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMasterShiftsComponent } from './view-master-shifts.component';

describe('ViewMasterShiftsComponent', () => {
  let component: ViewMasterShiftsComponent;
  let fixture: ComponentFixture<ViewMasterShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMasterShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMasterShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
