import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoginsComponent } from './manage-logins.component';

describe('ManageLoginsComponent', () => {
  let component: ManageLoginsComponent;
  let fixture: ComponentFixture<ManageLoginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLoginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLoginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
