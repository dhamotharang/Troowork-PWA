import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingEditComponent } from './building-edit.component';

describe('BuildingEditComponent', () => {
  let component: BuildingEditComponent;
  let fixture: ComponentFixture<BuildingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
