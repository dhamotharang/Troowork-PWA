import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMasterShiftsComponent } from './create-master-shifts.component';

describe('CreateMasterShiftsComponent', () => {
  let component: CreateMasterShiftsComponent;
  let fixture: ComponentFixture<CreateMasterShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMasterShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMasterShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
