import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchWorkorderComponent } from './create-batch-workorder.component';

describe('CreateBatchWorkorderComponent', () => {
  let component: CreateBatchWorkorderComponent;
  let fixture: ComponentFixture<CreateBatchWorkorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBatchWorkorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchWorkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
