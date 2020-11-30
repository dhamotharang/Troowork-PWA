import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorWelcomeComponent } from './supervisor-welcome.component';

describe('SupervisorWelcomeComponent', () => {
  let component: SupervisorWelcomeComponent;
  let fixture: ComponentFixture<SupervisorWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
