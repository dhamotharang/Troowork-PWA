import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchWorkComponent } from './create-batch-work.component';

describe('CreateBatchWorkComponent', () => {
  let component: CreateBatchWorkComponent;
  let fixture: ComponentFixture<CreateBatchWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBatchWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
