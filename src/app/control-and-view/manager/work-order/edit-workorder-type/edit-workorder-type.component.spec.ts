import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkorderTypeComponent } from './edit-workorder-type.component';

describe('EditWorkorderTypeComponent', () => {
  let component: EditWorkorderTypeComponent;
  let fixture: ComponentFixture<EditWorkorderTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWorkorderTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkorderTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
