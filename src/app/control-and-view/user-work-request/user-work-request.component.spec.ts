import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkRequestComponent } from './user-work-request.component';

describe('UserWorkRequestComponent', () => {
  let component: UserWorkRequestComponent;
  let fixture: ComponentFixture<UserWorkRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWorkRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWorkRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
