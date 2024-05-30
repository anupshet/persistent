import { TestBed } from '@angular/core/testing';

import { BrComponentLibraryService } from './br-component-library.service';

describe('BrComponentLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrComponentLibraryService = TestBed.get(BrComponentLibraryService);
    expect(service).toBeTruthy();
  });
});
