import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookCardComponent } from './notebook-card.component';

describe('NotebookCardComponent', () => {
  let component: NotebookCardComponent;
  let fixture: ComponentFixture<NotebookCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotebookCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
