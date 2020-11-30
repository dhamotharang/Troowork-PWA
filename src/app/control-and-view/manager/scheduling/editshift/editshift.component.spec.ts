import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditshiftComponent } from './editshift.component';

describe('EditshiftComponent', () => {
  let component: EditshiftComponent;
  let fixture: ComponentFixture<EditshiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditshiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
