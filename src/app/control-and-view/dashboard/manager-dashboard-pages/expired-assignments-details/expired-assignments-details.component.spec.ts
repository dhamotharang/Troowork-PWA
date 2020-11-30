import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredAssignmentsDetailsComponent } from './expired-assignments-details.component';

describe('ExpiredAssignmentsDetailsComponent', () => {
  let component: ExpiredAssignmentsDetailsComponent;
  let fixture: ComponentFixture<ExpiredAssignmentsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredAssignmentsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredAssignmentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
