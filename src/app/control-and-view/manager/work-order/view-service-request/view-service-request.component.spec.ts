import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceRequestComponent } from './view-service-request.component';

describe('ViewServiceRequestComponent', () => {
  let component: ViewServiceRequestComponent;
  let fixture: ComponentFixture<ViewServiceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewServiceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
