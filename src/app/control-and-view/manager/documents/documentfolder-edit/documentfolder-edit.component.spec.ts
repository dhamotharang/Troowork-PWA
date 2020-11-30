import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentfolderEditComponent } from './documentfolder-edit.component';

describe('DocumentfolderEditComponent', () => {
  let component: DocumentfolderEditComponent;
  let fixture: ComponentFixture<DocumentfolderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentfolderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentfolderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
