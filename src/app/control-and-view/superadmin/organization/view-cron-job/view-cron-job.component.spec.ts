import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCronJobComponent } from './view-cron-job.component';

describe('ViewCronJobComponent', () => {
  let component: ViewCronJobComponent;
  let fixture: ComponentFixture<ViewCronJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCronJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCronJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
