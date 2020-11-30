import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateshiftComponent } from './createshift.component';

describe('CreateshiftComponent', () => {
  let component: CreateshiftComponent;
  let fixture: ComponentFixture<CreateshiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateshiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
