import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentfolderViewComponent } from './documentfolder-view.component';

describe('DocumentfolderViewComponent', () => {
  let component: DocumentfolderViewComponent;
  let fixture: ComponentFixture<DocumentfolderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentfolderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentfolderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
