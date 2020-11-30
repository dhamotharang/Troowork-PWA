import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionCreateComponent } from './inspection-create.component';

describe('InspectionCreateComponent', () => {
  let component: InspectionCreateComponent;
  let fixture: ComponentFixture<InspectionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
