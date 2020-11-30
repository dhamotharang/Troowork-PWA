import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkorderTypeComponent } from './create-workorder-type.component';

describe('CreateWorkorderTypeComponent', () => {
  let component: CreateWorkorderTypeComponent;
  let fixture: ComponentFixture<CreateWorkorderTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWorkorderTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkorderTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
