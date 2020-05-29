import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNotebookComponent } from './create-notebook.component';

describe('CreateNotebookComponent', () => {
  let component: CreateNotebookComponent;
  let fixture: ComponentFixture<CreateNotebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNotebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
