import { TestBed } from '@angular/core/testing';

import { SbpVcsService } from './sbp-vcs.service';

describe('SbpVcsService', () => {
  let service: SbpVcsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbpVcsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
