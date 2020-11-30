import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmeetingortrainingeventComponent } from './viewmeetingortrainingevent.component';

describe('ViewmeetingortrainingeventComponent', () => {
  let component: ViewmeetingortrainingeventComponent;
  let fixture: ComponentFixture<ViewmeetingortrainingeventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewmeetingortrainingeventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewmeetingortrainingeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
