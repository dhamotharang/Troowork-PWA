import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypeUpdateComponent } from './room-type-update.component';

describe('RoomTypeUpdateComponent', () => {
  let component: RoomTypeUpdateComponent;
  let fixture: ComponentFixture<RoomTypeUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomTypeUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTypeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
