import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeViewFeedbackComponent } from './qr-code-view-feedback.component';

describe('QrCodeViewFeedbackComponent', () => {
  let component: QrCodeViewFeedbackComponent;
  let fixture: ComponentFixture<QrCodeViewFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCodeViewFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeViewFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
