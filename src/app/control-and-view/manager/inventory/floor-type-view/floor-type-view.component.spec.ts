import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorTypeViewComponent } from './floor-type-view.component';

describe('FloorTypeViewComponent', () => {
  let component: FloorTypeViewComponent;
  let fixture: ComponentFixture<FloorTypeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorTypeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
