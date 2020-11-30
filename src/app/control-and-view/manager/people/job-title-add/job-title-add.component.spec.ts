import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleAddComponent } from './job-title-add.component';

describe('JobTitleAddComponent', () => {
  let component: JobTitleAddComponent;
  let fixture: ComponentFixture<JobTitleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTitleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTitleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
