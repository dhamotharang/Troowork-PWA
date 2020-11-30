import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypeCreateComponent } from './equipment-type-create.component';

describe('EquipmentTypeCreateComponent', () => {
  let component: EquipmentTypeCreateComponent;
  let fixture: ComponentFixture<EquipmentTypeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
