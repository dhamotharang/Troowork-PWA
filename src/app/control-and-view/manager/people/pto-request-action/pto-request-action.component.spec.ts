import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestActionComponent } from './pto-request-action.component';

describe('PtoRequestActionComponent', () => {
  let component: PtoRequestActionComponent;
  let fixture: ComponentFixture<PtoRequestActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
