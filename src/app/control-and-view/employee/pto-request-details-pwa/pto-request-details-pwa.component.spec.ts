import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestDetailsPWAComponent } from './pto-request-details-pwa.component';

describe('PtoRequestDetailsPWAComponent', () => {
  let component: PtoRequestDetailsPWAComponent;
  let fixture: ComponentFixture<PtoRequestDetailsPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestDetailsPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestDetailsPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
