import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestEditComponent } from './pto-request-edit.component';

describe('PtoRequestEditComponent', () => {
  let component: PtoRequestEditComponent;
  let fixture: ComponentFixture<PtoRequestEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
