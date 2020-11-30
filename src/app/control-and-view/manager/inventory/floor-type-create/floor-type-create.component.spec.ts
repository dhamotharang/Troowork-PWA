import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorTypeCreateComponent } from './floor-type-create.component';

describe('FloorTypeCreateComponent', () => {
  let component: FloorTypeCreateComponent;
  let fixture: ComponentFixture<FloorTypeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorTypeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
