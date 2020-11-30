import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatebuildingComponent } from './createbuilding.component';

describe('CreatebuildingComponent', () => {
  let component: CreatebuildingComponent;
  let fixture: ComponentFixture<CreatebuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatebuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatebuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
