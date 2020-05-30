import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpNotebookComponent } from './bcp-notebook.component';

describe('BcpNotebookComponent', () => {
  let component: BcpNotebookComponent;
  let fixture: ComponentFixture<BcpNotebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BcpNotebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
