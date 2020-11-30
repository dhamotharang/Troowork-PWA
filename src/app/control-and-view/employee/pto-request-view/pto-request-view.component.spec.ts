import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestViewComponent } from './pto-request-view.component';

describe('PtoRequestViewComponent', () => {
  let component: PtoRequestViewComponent;
  let fixture: ComponentFixture<PtoRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
