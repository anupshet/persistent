import { TestBed, inject } from '@angular/core/testing';

import { AppLoggerService } from './applogger.service';

describe('ApploggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppLoggerService]
    });
  });

  it('should be created', inject([AppLoggerService], (service: AppLoggerService) => {
    expect(service).toBeTruthy();
  }));
});
