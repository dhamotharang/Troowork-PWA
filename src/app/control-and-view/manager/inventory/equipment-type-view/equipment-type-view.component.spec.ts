import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypeViewComponent } from './equipment-type-view.component';

describe('EquipmentTypeViewComponent', () => {
  let component: EquipmentTypeViewComponent;
  let fixture: ComponentFixture<EquipmentTypeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
