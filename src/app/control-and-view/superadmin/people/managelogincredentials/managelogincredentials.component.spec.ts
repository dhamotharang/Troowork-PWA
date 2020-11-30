import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagelogincredentialsComponent } from './managelogincredentials.component';

describe('ManagelogincredentialsComponent', () => {
  let component: ManagelogincredentialsComponent;
  let fixture: ComponentFixture<ManagelogincredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagelogincredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagelogincredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
