import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIntervalTypesComponent } from './view-interval-types.component';

describe('ViewIntervalTypesComponent', () => {
  let component: ViewIntervalTypesComponent;
  let fixture: ComponentFixture<ViewIntervalTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewIntervalTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIntervalTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
