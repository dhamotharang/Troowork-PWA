import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypeViewComponent } from './room-type-view.component';

describe('RoomTypeViewComponent', () => {
  let component: RoomTypeViewComponent;
  let fixture: ComponentFixture<RoomTypeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomTypeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
