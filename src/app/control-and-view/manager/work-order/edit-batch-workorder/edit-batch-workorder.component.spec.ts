import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBatchWorkorderComponent } from './edit-batch-workorder.component';

describe('EditBatchWorkorderComponent', () => {
  let component: EditBatchWorkorderComponent;
  let fixture: ComponentFixture<EditBatchWorkorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBatchWorkorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBatchWorkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
