import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIntervalTypeColorComponent } from './edit-interval-type-color.component';

describe('EditIntervalTypeColorComponent', () => {
  let component: EditIntervalTypeColorComponent;
  let fixture: ComponentFixture<EditIntervalTypeColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIntervalTypeColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIntervalTypeColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
