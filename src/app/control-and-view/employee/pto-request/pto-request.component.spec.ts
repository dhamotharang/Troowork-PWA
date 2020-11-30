import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoRequestComponent } from './pto-request.component';

describe('PtoRequestComponent', () => {
  let component: PtoRequestComponent;
  let fixture: ComponentFixture<PtoRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtoRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
