import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypeEditComponent } from './equipment-type-edit.component';

describe('EquipmentTypeEditComponent', () => {
  let component: EquipmentTypeEditComponent;
  let fixture: ComponentFixture<EquipmentTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
