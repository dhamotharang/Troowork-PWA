import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewshiftComponent } from './viewshift.component';

describe('ViewshiftComponent', () => {
  let component: ViewshiftComponent;
  let fixture: ComponentFixture<ViewshiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewshiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
