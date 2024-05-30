// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { select } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromRoot from '../../../../state/app.state';
import * as navigationStateSelector from '../../state/selectors';
import { FeatureFlagsService } from '../../../services/feature-flags.service';
import { LocalizationService } from '../../services/localizaton.service';
import { Languages } from '../../../constants/lang.config';
import { SecurityConfigService } from '../../../../security/security-config.service';
import { Cookies } from '../../../../core/helpers/cookies-helper';

@Component({
  selector: 'unext-nav-bar-login-lang',
  templateUrl: './nav-bar-login-lang.component.html',
  styleUrls: ['./nav-bar-login-lang.component.scss']
})
export class NavBarLoginLangComponent implements OnInit {
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  destroy$ = new Subject<boolean>();
  @Input() navIconName: string;
  langs: Array<any> = Languages;
  isFeatureFlagActive: boolean ;
  languageName: string;
  lcid: string;
  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
    private securityConfigService: SecurityConfigService,
    private featureFlagsService: FeatureFlagsService,
    private localizationService: LocalizationService
  ) {
  }

  ngOnInit() {
    this.lcid = Cookies.getCookiesValue('lcid');
    this.localizationService.initialize();
    this.languageName = this.securityConfigService.languageToUse === 'en' ? 'English' : this.securityConfigService.languageToUse;

    this.langs.forEach(item => {
      if (this.lcid === item.lcid ) {
        this.languageName = item.name;
      }
    });
    this.initializeListeners();
  }

  initializeListeners() {
    if (this.featureFlagsService.hasClientInitialized()) {
      this.isFeatureFlagActive = this.featureFlagsService.getFeatureFlag('localization-toggle', false);
      this.featureFlagHandler();
    } else {
      this.featureFlagsService.getClient().on('initialized', () => {
        const valueFlag = this.featureFlagsService.getFeatureFlag('localization-toggle');
        this.isFeatureFlagActive = valueFlag;
        this.featureFlagHandler();
      });
    }
    this.featureFlagsService.getClient().on('change:localization-toggle', (value: boolean, previous: boolean) => {
      this.isFeatureFlagActive = value;
      this.featureFlagHandler();
    });
  }

  featureFlagHandler() {
    if (this.isFeatureFlagActive) {
          this.localizationService.getLocaleLangLogin();
    } else {
      this.localizationService.setDefaultLanguage();
    }
  }

  onLangChange(value: any) {
    this.localizationService.onLangChange(value);
    localStorage.setItem('id', JSON.stringify(value.value));
    window.location.href = 'login/';
    this.setCookies('language', value.value, 5);
    this.setCookies('lcid', value.lcid, 5);


  }

  setCookies(cookieName: string, cookieValue: string, cookieExpiry: number) {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + (cookieExpiry * 24 * 60 * 60 * 1000));
    const expires = `expires="${currentDate.toUTCString()}`;
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
  }

}
