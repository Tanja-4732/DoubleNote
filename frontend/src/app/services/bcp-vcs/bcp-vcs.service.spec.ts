import { TestBed } from '@angular/core/testing';

import { BcpVcsService } from './bcp-vcs.service';

describe('BcpVcsService', () => {
  let service: BcpVcsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BcpVcsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
