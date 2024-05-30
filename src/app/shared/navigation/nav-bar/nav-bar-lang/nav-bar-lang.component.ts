// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as ngrxStore from '@ngrx/store';
import { select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import * as fromRoot from '../../../../state/app.state';
import * as navigationStateSelector from '../../../../shared/navigation/state/selectors';
import { AuthenticationService } from '../../../../security/services';
import { FeatureFlagsService } from '../../../services/feature-flags.service';
import { LocalizationService } from '../../services/localizaton.service';
import { Languages } from '../../../../shared/constants/lang.config';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { Cookies } from '../../../../core/helpers/cookies-helper';
import { cookiesExpiryPeriod } from '../../../../core/config/constants/general.const';
import { ConfirmNavigateGuard } from '../../../../master/reporting/shared/guard/confirm-navigate.guard';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';


@Component({
  selector: 'unext-nav-bar-lang',
  templateUrl: './nav-bar-lang.component.html',
  styleUrls: ['./nav-bar-lang.component.scss']
})
export class NavBarLangComponent implements OnInit {
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  destroy$ = new Subject<boolean>();
  @Input() navIconName: string;
  langs: Array<any> = Languages;
  isFeatureFlagActive = false;
  languageName: string;

  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
    private authenticationService: AuthenticationService,
    private featureFlagsService: FeatureFlagsService,
    private localizationService: LocalizationService,
    private navigationService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmNavigate: ConfirmNavigateGuard
  ) {
  }

  ngOnInit() {
    this.localizationService.initialize();
    this.localizationService.getLanguageName.subscribe(name => {
      this.languageName = name;
    });
    this.initializeListeners();
  }

  initializeListeners() {
    if (this.featureFlagsService.hasClientInitialized()) {
      this.isFeatureFlagActive = this.featureFlagsService.getFeatureFlag('localization-toggle', false);
      this.featureFlagHandler(false);
    } else {
      this.featureFlagsService.getClient().on('initialized', () => {
        const valueFlag = this.featureFlagsService.getFeatureFlag('localization-toggle');
        this.isFeatureFlagActive = valueFlag;
        this.featureFlagHandler(false);
      });
    }
    this.featureFlagsService.getClient().on('change:localization-toggle', (value: boolean, previous: boolean) => {
      this.isFeatureFlagActive = value;
      this.featureFlagHandler(true);
    });
  }

  featureFlagHandler(featureFlagToggle: boolean) {
    if (this.isFeatureFlagActive) {
      this.authenticationService.authenticationState
        .pipe(take(1))
        .subscribe((isLoggedIn: boolean) => {
          this.localizationService.getLocaleLang(isLoggedIn, featureFlagToggle);
        });
    } else {
      this.localizationService.setDefaultLanguage();
    }
  }

  async onLangChange(value: any) {
   Cookies.setCookies('language', value.value, cookiesExpiryPeriod);
    if (this.router.url.includes('/login')) {
      this.localizationService.onLangChange(value);
    } else {
      this.localizationService.onLangChange(value);
      if (this.router.url.includes(unRouting.reports)) {
        await this.confirmNavigate.navigateWithoutModal();
      }
    }
  }
}
