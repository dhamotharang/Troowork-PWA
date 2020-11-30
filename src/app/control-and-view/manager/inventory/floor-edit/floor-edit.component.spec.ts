import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorEditComponent } from './floor-edit.component';

describe('FloorEditComponent', () => {
  let component: FloorEditComponent;
  let fixture: ComponentFixture<FloorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
