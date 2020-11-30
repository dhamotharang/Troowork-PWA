import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingusernameandpswrdaftremplcreatebymanComponent } from './settingusernameandpswrdaftremplcreatebyman.component';

describe('SettingusernameandpswrdaftremplcreatebymanComponent', () => {
  let component: SettingusernameandpswrdaftremplcreatebymanComponent;
  let fixture: ComponentFixture<SettingusernameandpswrdaftremplcreatebymanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingusernameandpswrdaftremplcreatebymanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingusernameandpswrdaftremplcreatebymanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
