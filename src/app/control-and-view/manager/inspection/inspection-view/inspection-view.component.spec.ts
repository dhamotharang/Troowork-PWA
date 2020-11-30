import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionViewComponent } from './inspection-view.component';

describe('InspectionViewComponent', () => {
  let component: InspectionViewComponent;
  let fixture: ComponentFixture<InspectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
