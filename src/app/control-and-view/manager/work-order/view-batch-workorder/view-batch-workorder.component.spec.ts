import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBatchWorkorderComponent } from './view-batch-workorder.component';

describe('ViewBatchWorkorderComponent', () => {
  let component: ViewBatchWorkorderComponent;
  let fixture: ComponentFixture<ViewBatchWorkorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBatchWorkorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBatchWorkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
