// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed, async   } from '@angular/core/testing';


import { NavigationService } from '../../navigation.service';
import { LocalizationService } from '../../services/localizaton.service';
import { of } from 'rxjs';

describe('NavBarLoginLangComponent', () => {


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NavigationService, useValue: of('') },
        { provide: LocalizationService, useValue: of('') },
      ]
    }).compileComponents();
  }));

});
