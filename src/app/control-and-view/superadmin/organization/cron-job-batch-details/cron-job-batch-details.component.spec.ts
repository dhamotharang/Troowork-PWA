import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronJobBatchDetailsComponent } from './cron-job-batch-details.component';

describe('CronJobBatchDetailsComponent', () => {
  let component: CronJobBatchDetailsComponent;
  let fixture: ComponentFixture<CronJobBatchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronJobBatchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronJobBatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
