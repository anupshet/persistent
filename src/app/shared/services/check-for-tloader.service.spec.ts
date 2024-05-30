//  © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed } from '@angular/core/testing';
import { CheckForTloaderService } from './check-for-tloader.service';

describe('CheckForTloaderService', () => {
  let service: CheckForTloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckForTloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
