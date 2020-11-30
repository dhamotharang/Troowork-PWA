import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewinspctnbysprvsrComponent } from './viewinspctnbysprvsr.component';

describe('ViewinspctnbysprvsrComponent', () => {
  let component: ViewinspctnbysprvsrComponent;
  let fixture: ComponentFixture<ViewinspctnbysprvsrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewinspctnbysprvsrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewinspctnbysprvsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
