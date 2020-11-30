import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeViewListComponent } from './qr-code-view-list.component';

describe('QrCodeViewListComponent', () => {
  let component: QrCodeViewListComponent;
  let fixture: ComponentFixture<QrCodeViewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCodeViewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
