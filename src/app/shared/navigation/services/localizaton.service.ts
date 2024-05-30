// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DefaultLangChangeEvent } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { ApiService } from '../../api/api.service';
import { unApi } from '../../../core/config/constants/un-api-methods.const';
import { LocalePreferences } from '../../models/locale-preferences.model';
import * as navigationStateSelector from '../../../shared/navigation/state/selectors';
import * as fromRoot from '../../../state/app.state';
import * as actions from '../../../state/actions';
import { Languages, DEFAULT_LANGUAGE } from '../../../shared/constants/lang.config';
import { Language, LanguagesMapping } from '../../components/language-dialog/language-list-mapping';
@Injectable({
  providedIn: 'root'
})

export class LocalizationService implements OnDestroy {
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  langs: Array<any> = Languages;
  browsersLocale: string;
  selectedLang: any = Languages;
  currentUserId: string;
  langSettingOpen = false;
  transaltionChange = false;
  getLanguageValue: string;
  localeLanguage: any = { lcid: 'en-US' };
  private destroy$ = new Subject<boolean>();
  constructor(
    private api: ApiService,
    private store: Store<fromRoot.State>,
    private translate: TranslateService,
  ) {
    this.browsersLocale = this.translate.getBrowserLang();
  }

  private languageName = new BehaviorSubject<string>('');
  getLanguageName = this.languageName.asObservable();
  currentLangauge;
  setLanguageName(name: string) {
    this.languageName.next(name);
  }

  // from authentication.service.ts
  setLanguage(currentUser) {
    this.currentUserId = currentUser.id;
    if (currentUser.hasOwnProperty('localePreferences')) {
      let getLanguageMapping = { ...this.getLanguageMapping(currentUser.localePreferences.locale) };
      if (currentUser.localePreferences.numberFormat !== undefined) {
        getLanguageMapping['numberFormat'] = currentUser.localePreferences.numberFormat;
        getLanguageMapping['dateFormat'] = currentUser.localePreferences.dateFormat;
        getLanguageMapping['timeFormat'] = currentUser.localePreferences.timeFormat;
        getLanguageMapping['language'] = currentUser.localePreferences.language;
      }
      this.store.dispatch(actions.NavBarActions.setLocale({ locale: getLanguageMapping })
      );
    }
  }

  saveLanguage(payload: LocalePreferences): Promise<LocalePreferences> {
    if (this.currentUserId !== undefined) {
      const path = unApi.portal.localePreferencesPost;
      return this.api.post<LocalePreferences>(path, payload).toPromise();
    }
  }

  findLanguageFromList(langcode): object {
    const item = [];
    this.langs.forEach(language => {
      if (language.value === langcode && item.length === 0) {
        item.push(language);
      }
    });

    if (item.length === 0) {
      item.push(DEFAULT_LANGUAGE);
    }
    return item[0];
  }

  initialize() {
    this.translate.onLangChange.subscribe((params: DefaultLangChangeEvent) => {
      this.selectedLang = this.findLanguageFromList(params.lang);
    });
  }
  getLanguageMapping(value): Language {
    if (value === '') {
      value = DEFAULT_LANGUAGE['locale'];
    }
    return LanguagesMapping.find(lagData => lagData.locale === value);
  }

  onLangChange(value: any) {
    this.getLanguageValue = value.lcid;
    this.selectedLang = this.findLanguageFromList(value.value);
    const getLanguageMapping = this.getLanguageMapping(this.selectedLang.lcid);
    const payload: LocalePreferences = {
      id: this.currentUserId,
      locale: value.lcid,
      language: this.selectedLang.value,
      numberFormat: getLanguageMapping.numberFormat,
      dateFormat: getLanguageMapping.dateFormat,
      timeFormat: getLanguageMapping.timeFormat
    };
    this.saveLanguage(payload);
    this.setStoreTranslation();
  }

  getLocaleLang(isLoggedIn: boolean, featureFlagToggle: boolean) {
    this.navigationGetLocale$.pipe(take(1))
      .subscribe(
        (lang) => {
          if (lang === null && isLoggedIn) {
            if (this.browsersLocale === null || this.browsersLocale === '') {
              // default to english
              this.selectedLang = DEFAULT_LANGUAGE;
            } else {
              // default to browser's locale
              this.selectedLang = this.findLanguageFromList((this.browsersLocale).slice(0, 2));
            }
            this.setStoreTranslation();
          } else if (!isLoggedIn) {
            if (this.translate.currentLang && !featureFlagToggle) {
              this.selectedLang = this.findLanguageFromList(this.translate.currentLang);
            } else {
              this.selectedLang = this.findLanguageFromList((this.browsersLocale).slice(0, 2));
            }
            this.setStoreTranslation();
          } else {
            // use Store
            this.selectedLang = lang;
            this.setStoreTranslation(true);
            this.store.dispatch(actions.NavBarActions.setLocale({ locale: this.selectedLang }));
            this.setLanguageName(this.selectedLang.name);
          }
        }
      );
  }

  // handle localization scenarios for unauthenticated users prior to login
  getLocaleLangLogin() {
    this.navigationGetLocale$.pipe(take(1))
      .subscribe(
        (lang) => {
          this.currentLangauge = lang;
          if (lang === null) {
            if (this.browsersLocale === null || this.browsersLocale === '') {
              // default to english
              this.selectedLang = DEFAULT_LANGUAGE;
            } else {
              // default to browser's locale
              this.selectedLang = this.findLanguageFromList((this.browsersLocale).slice(0, 2));
            }
          }
        }
      );
  }

  setDefaultLanguage() {
    this.selectedLang = DEFAULT_LANGUAGE;
    this.setStoreTranslation();
  }

  setStoreTranslation(currentUserHasLanguageInStore = false) {
    this.getLocaleLangLogin();
    this.setTranslation();
    let languageValue;
    let lcid = this.selectedLang.lcid;
    if (this.langSettingOpen) {
      lcid = this.currentLangauge.locale;
    }
    if (lcid) {
      languageValue = lcid;
    } else {
      languageValue = this.selectedLang.locale;
    }
    if (currentUserHasLanguageInStore === false) {
      let getLanguageMapping: Language;
      if (this.getLanguageValue) {
        getLanguageMapping = this.getLanguageMapping(this.getLanguageValue);
      } else {
        getLanguageMapping = this.getLanguageMapping(languageValue);
      }
      this.store.dispatch(actions.NavBarActions.setLocale({ locale: getLanguageMapping }));
      this.setLanguageName(getLanguageMapping.name);
    }
  }

  setTranslation() {
    const currentLanguge = this.getLanguageMapping(this.getLanguageValue);
    let selectedLanguage = this.selectedLang.language;
    if (this.selectedLang.value) {
      selectedLanguage = this.selectedLang.value;
    }
    if (!this.translate.defaultLang) {
      this.translate.setDefaultLang(selectedLanguage);
    }
    if (this.langSettingOpen) {
      this.translate.use(currentLanguge.language);
    } else {
      this.translate.use(selectedLanguage);
    }
  }
  getLocaleValue() {
    this.navigationGetLocale$.pipe(take(1))
      .subscribe(
        (lang) => {
          this.currentLangauge = lang;
        });
    return this.currentLangauge.locale;
  }
  getLocaleDate() {
    this.navigationGetLocale$
      .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
      .subscribe(loc => {
        this.localeLanguage = loc;
      });
    return this.localeLanguage.dateFormat;
  }
  getLocaleLanguage() {
    return this.localeLanguage;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
