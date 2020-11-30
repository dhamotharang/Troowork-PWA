import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchScheduleComponent } from './create-batch-schedule.component';

describe('CreateBatchScheduleComponent', () => {
  let component: CreateBatchScheduleComponent;
  let fixture: ComponentFixture<CreateBatchScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBatchScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
