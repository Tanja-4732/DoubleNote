import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookDialogComponent } from './notebook-dialog.component';

describe('CreateNotebookComponent', () => {
  let component: NotebookDialogComponent;
  let fixture: ComponentFixture<NotebookDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotebookDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
