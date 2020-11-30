import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRecurWorkorderComponent } from './update-recur-workorder.component';

describe('UpdateRecurWorkorderComponent', () => {
  let component: UpdateRecurWorkorderComponent;
  let fixture: ComponentFixture<UpdateRecurWorkorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRecurWorkorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRecurWorkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
