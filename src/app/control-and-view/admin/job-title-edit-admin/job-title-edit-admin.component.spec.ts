import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleEditAdminComponent } from './job-title-edit-admin.component';

describe('JobTitleEditAdminComponent', () => {
  let component: JobTitleEditAdminComponent;
  let fixture: ComponentFixture<JobTitleEditAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTitleEditAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTitleEditAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
