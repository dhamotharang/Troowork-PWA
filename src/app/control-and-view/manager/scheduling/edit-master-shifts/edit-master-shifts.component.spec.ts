import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMasterShiftsComponent } from './edit-master-shifts.component';

describe('EditMasterShiftsComponent', () => {
  let component: EditMasterShiftsComponent;
  let fixture: ComponentFixture<EditMasterShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMasterShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMasterShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
