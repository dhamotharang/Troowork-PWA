import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewinspectionmanagerComponent } from './viewinspectionmanager.component';

describe('ViewinspectionmanagerComponent', () => {
  let component: ViewinspectionmanagerComponent;
  let fixture: ComponentFixture<ViewinspectionmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewinspectionmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewinspectionmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
