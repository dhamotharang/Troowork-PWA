import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoginCredentialsComponent } from './manage-login-credentials.component';

describe('ManageLoginCredentialsComponent', () => {
  let component: ManageLoginCredentialsComponent;
  let fixture: ComponentFixture<ManageLoginCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLoginCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLoginCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
