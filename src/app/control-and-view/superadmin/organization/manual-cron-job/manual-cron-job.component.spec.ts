import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualCronJobComponent } from './manual-cron-job.component';

describe('ManualCronJobComponent', () => {
  let component: ManualCronJobComponent;
  let fixture: ComponentFixture<ManualCronJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualCronJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualCronJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
