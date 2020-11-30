import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningDetailsComponent } from './cleaning-details.component';

describe('CleaningDetailsComponent', () => {
  let component: CleaningDetailsComponent;
  let fixture: ComponentFixture<CleaningDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleaningDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
