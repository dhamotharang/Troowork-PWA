import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptdialogComponent } from './promptdialog.component';

describe('PromptdialogComponent', () => {
  let component: PromptdialogComponent;
  let fixture: ComponentFixture<PromptdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromptdialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
