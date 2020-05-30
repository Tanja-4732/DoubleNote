import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbpNotebookComponent } from './sbp-notebook.component';

describe('SbpNotebookComponent', () => {
  let component: SbpNotebookComponent;
  let fixture: ComponentFixture<SbpNotebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbpNotebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbpNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
