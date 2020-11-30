import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRemainingWorkordersDetailsComponent } from './view-remaining-workorders-details.component';

describe('ViewRemainingWorkordersDetailsComponent', () => {
  let component: ViewRemainingWorkordersDetailsComponent;
  let fixture: ComponentFixture<ViewRemainingWorkordersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRemainingWorkordersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRemainingWorkordersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
