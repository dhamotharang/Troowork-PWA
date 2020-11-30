import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdocumentfolderCreateComponent } from './newdocumentfolder-create.component';

describe('NewdocumentfolderCreateComponent', () => {
  let component: NewdocumentfolderCreateComponent;
  let fixture: ComponentFixture<NewdocumentfolderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewdocumentfolderCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewdocumentfolderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
