import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordsComponent } from './reset-passwords.component';

describe('ResetPasswordsComponent', () => {
  let component: ResetPasswordsComponent;
  let fixture: ComponentFixture<ResetPasswordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
