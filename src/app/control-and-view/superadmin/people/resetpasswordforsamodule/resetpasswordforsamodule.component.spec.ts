import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordforsamoduleComponent } from './resetpasswordforsamodule.component';

describe('ResetpasswordforsamoduleComponent', () => {
  let component: ResetpasswordforsamoduleComponent;
  let fixture: ComponentFixture<ResetpasswordforsamoduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpasswordforsamoduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordforsamoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
