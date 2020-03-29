import { TestBed } from "@angular/core/testing";

import { MarkdownEngineService } from "./markdown-engine.service";

describe("MarkdownEngineService", () => {
  let service: MarkdownEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownEngineService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
