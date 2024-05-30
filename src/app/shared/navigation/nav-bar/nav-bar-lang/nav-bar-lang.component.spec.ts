// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { LocalizationService } from '../../services/localizaton.service';
import { ConfirmNavigateGuard } from '../../../../master/reporting/shared/guard/confirm-navigate.guard';

describe('NavBarLangComponent', () => {


  const mockConfirmNavigateGuard = {
    navigateWithoutModal: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NavigationService, useValue: of('') },
        { provide: LocalizationService, useValue: of('') },
        { provide: ConfirmNavigateGuard, useValue: mockConfirmNavigateGuard },
      ]
    }).compileComponents();
  }));

});
