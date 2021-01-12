import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestPWAComponent } from './pto-request-pwa.component';

describe('PtoRequestPWAComponent', () => {
  let component: PtoRequestPWAComponent;
  let fixture: ComponentFixture<PtoRequestPWAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestPWAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestPWAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
