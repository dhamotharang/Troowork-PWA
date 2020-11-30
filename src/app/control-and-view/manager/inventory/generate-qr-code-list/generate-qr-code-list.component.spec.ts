import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateQrCodeListComponent } from './generate-qr-code-list.component';

describe('GenerateQrCodeListComponent', () => {
  let component: GenerateQrCodeListComponent;
  let fixture: ComponentFixture<GenerateQrCodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateQrCodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateQrCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
