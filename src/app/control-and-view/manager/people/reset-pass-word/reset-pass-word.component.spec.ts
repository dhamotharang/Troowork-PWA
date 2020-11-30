import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassWordComponent } from './reset-pass-word.component';

describe('ResetPassWordComponent', () => {
  let component: ResetPassWordComponent;
  let fixture: ComponentFixture<ResetPassWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPassWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPassWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
