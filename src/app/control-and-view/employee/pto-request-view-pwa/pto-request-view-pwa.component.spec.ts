import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestViewPWAComponent } from './pto-request-view-pwa.component';

describe('PtoRequestViewPWAComponent', () => {
  let component: PtoRequestViewPWAComponent;
  let fixture: ComponentFixture<PtoRequestViewPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestViewPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestViewPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
