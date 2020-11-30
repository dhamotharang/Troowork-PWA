import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateinspectionComponent } from './createinspection.component';

describe('CreateinspectionComponent', () => {
  let component: CreateinspectionComponent;
  let fixture: ComponentFixture<CreateinspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateinspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateinspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
