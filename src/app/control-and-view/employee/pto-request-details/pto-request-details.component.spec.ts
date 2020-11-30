import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestDetailsComponent } from './pto-request-details.component';

describe('PtoRequestDetailsComponent', () => {
  let component: PtoRequestDetailsComponent;
  let fixture: ComponentFixture<PtoRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
