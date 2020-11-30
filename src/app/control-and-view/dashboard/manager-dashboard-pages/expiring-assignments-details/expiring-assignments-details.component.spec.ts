import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiringAssignmentsDetailsComponent } from './expiring-assignments-details.component';

describe('ExpiringAssignmentsDetailsComponent', () => {
  let component: ExpiringAssignmentsDetailsComponent;
  let fixture: ComponentFixture<ExpiringAssignmentsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiringAssignmentsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiringAssignmentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
