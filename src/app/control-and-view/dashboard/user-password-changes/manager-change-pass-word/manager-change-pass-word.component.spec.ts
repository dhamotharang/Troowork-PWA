import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerChangePassWordComponent } from './manager-change-pass-word.component';

describe('ManagerChangePassWordComponent', () => {
  let component: ManagerChangePassWordComponent;
  let fixture: ComponentFixture<ManagerChangePassWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerChangePassWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerChangePassWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
