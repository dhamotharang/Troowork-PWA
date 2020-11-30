import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningQrCodeViewComponent } from './cleaning-qr-code-view.component';

describe('CleaningQrCodeViewComponent', () => {
  let component: CleaningQrCodeViewComponent;
  let fixture: ComponentFixture<CleaningQrCodeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleaningQrCodeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningQrCodeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
