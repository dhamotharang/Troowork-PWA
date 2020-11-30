import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneViewComponent } from './zone-view.component';

describe('ZoneViewComponent', () => {
  let component: ZoneViewComponent;
  let fixture: ComponentFixture<ZoneViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
