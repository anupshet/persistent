// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed } from '@angular/core/testing';

import { OktaAuthService } from '@okta/okta-angular';

import { OktaSessionService } from './okta-session.service';

describe('OktaSessionService', () => {
  let service: OktaSessionService;
  const mockOktaAuthService = jasmine.createSpyObj([
    'signInWithRedirect',
    'tokenManager'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OktaAuthService, useValue: mockOktaAuthService }
      ]
    });
    service = TestBed.inject(OktaSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
