import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotebookDialogComponent } from './notebook-dialog.component';

describe('CreateNotebookComponent', () => {
  let component: NotebookDialogComponent;
  let fixture: ComponentFixture<NotebookDialogComponent>;

  beforeEach(waitForAsync(() => {
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
