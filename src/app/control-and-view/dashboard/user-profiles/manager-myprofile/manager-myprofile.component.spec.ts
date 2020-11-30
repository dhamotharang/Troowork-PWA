import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerMyprofileComponent } from './manager-myprofile.component';

describe('ManagerMyprofileComponent', () => {
  let component: ManagerMyprofileComponent;
  let fixture: ComponentFixture<ManagerMyprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerMyprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerMyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
