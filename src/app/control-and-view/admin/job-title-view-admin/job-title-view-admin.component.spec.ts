import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleViewAdminComponent } from './job-title-view-admin.component';

describe('JobTitleViewAdminComponent', () => {
  let component: JobTitleViewAdminComponent;
  let fixture: ComponentFixture<JobTitleViewAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTitleViewAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTitleViewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
