import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorProfileComponent } from './supervisor-profile.component';

describe('SupervisorProfileComponent', () => {
  let component: SupervisorProfileComponent;
  let fixture: ComponentFixture<SupervisorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
