import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUsnamepaswdbySAComponent } from './set-usnamepaswdby-sa.component';

describe('SetUsnamepaswdbySAComponent', () => {
  let component: SetUsnamepaswdbySAComponent;
  let fixture: ComponentFixture<SetUsnamepaswdbySAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetUsnamepaswdbySAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUsnamepaswdbySAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
