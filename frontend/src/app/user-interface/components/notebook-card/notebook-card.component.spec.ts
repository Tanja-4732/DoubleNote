import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotebookCardComponent } from './notebook-card.component';

describe('NotebookCardComponent', () => {
  let component: NotebookCardComponent;
  let fixture: ComponentFixture<NotebookCardComponent>;

  beforeEach(waitForAsync(() => {
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
