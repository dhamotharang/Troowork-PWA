import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestEditPWAComponent } from './pto-request-edit-pwa.component';

describe('PtoRequestEditPWAComponent', () => {
  let component: PtoRequestEditPWAComponent;
  let fixture: ComponentFixture<PtoRequestEditPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestEditPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestEditPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
