import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBatchWorkComponent } from './edit-batch-work.component';

describe('EditBatchWorkComponent', () => {
  let component: EditBatchWorkComponent;
  let fixture: ComponentFixture<EditBatchWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBatchWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBatchWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
