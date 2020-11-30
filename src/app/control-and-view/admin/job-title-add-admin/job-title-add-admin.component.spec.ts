import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleAddAdminComponent } from './job-title-add-admin.component';

describe('JobTitleAddAdminComponent', () => {
  let component: JobTitleAddAdminComponent;
  let fixture: ComponentFixture<JobTitleAddAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTitleAddAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTitleAddAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
