import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorTypeEDitComponent } from './floor-type-edit.component';

describe('FloorTypeEDitComponent', () => {
  let component: FloorTypeEDitComponent;
  let fixture: ComponentFixture<FloorTypeEDitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorTypeEDitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorTypeEDitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
