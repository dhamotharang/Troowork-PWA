import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkorderComponent } from './create-workorder.component';

describe('CreateWorkorderComponent', () => {
  let component: CreateWorkorderComponent;
  let fixture: ComponentFixture<CreateWorkorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWorkorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
