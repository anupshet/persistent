// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import * as ngrxSelector from '@ngrx/store';
import { select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as moment from 'moment';

interface NavigationState {
  locale?: object;
}
interface State {
  navigation: NavigationState;
}

interface LocationState {
  currentLabLocation: { locationTimeZone: null}
}

@Pipe({
  name: 'uNextDate',
  pure: false
})
export class UnityNextDatePipe implements PipeTransform, OnDestroy  {
  getLocationState = createFeatureSelector<LocationState>('location');
  getCurrentLabLocation = createSelector(this.getLocationState, (state) => state ? state.currentLabLocation : null);
  public getCurrentLabLocation$ = this.store.pipe(select(this.getCurrentLabLocation));

  getNavigationState = createFeatureSelector<NavigationState>('navigation');
  getLocale = createSelector(this.getNavigationState, (state) => state && state.locale ?
    state.locale : {country: 'US', lcid: 'en-US', value: 'en', name: 'English'});
  navigationGetLocale$ = this.store.pipe(select(this.getLocale));
  private destroy$ = new Subject<boolean>();
  storedLocale;
  defaultLanguageValue = 'en';
  offsetByLabTimeZone = true;
  labTimeZone: string;

  constructor(
    private store: ngrxSelector.Store<State>,
    private translateService: TranslateService
  ) {
    this.navigationGetLocale$
      .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
      .subscribe(loc => {
        this.storedLocale = loc;
      });
    this.getCurrentLabLocation$.pipe(filter(labLocation => !!labLocation),
      takeUntil(this.destroy$)).subscribe(labLocation => {
        if (labLocation) {
          this.labTimeZone = labLocation.locationTimeZone;
        }
      });
  }

  transform(value: any, args?: any, offset?: string): any {
    if (this.storedLocale !== undefined) {
      // If manually pass offset,  it's format should be e.g. '-7:00'
      if (!!offset && offset !== '') {
        this.offsetByLabTimeZone = false;
      }

      const currentLanguage = (this.storedLocale.hasOwnProperty('language')) ?
      this.storedLocale.language : this.translateService.currentLang;
      const datePipe = new DatePipe(currentLanguage || this.defaultLanguageValue);
      let format;

      if (args === 'short') {
        if (this.storedLocale.dateFormat === 0 && this.storedLocale.timeFormat === 0) {
          if (this.storedLocale.language === 'de' || this.storedLocale.language === 'pl') {
            format = 'LL.dd.yyyy, h:mm a';
          } else if (this.storedLocale.language === 'hu' || this.storedLocale.language === 'ko') {
            format = 'LL. dd. yyyy, h:mm a';
          } else if (this.storedLocale.locale === 'en-US') {
            format = 'M/d/yy, h:mm a';
          } else if (this.storedLocale.language === 'ru') {
            format = 'M.d.yyyy, h:mm a';
          } else {
            if (this.storedLocale.locale === 'fr-CA') {
              format = 'M-d-yyyy, h:mm a';
            } else {
              format = 'M/d/yyyy, h:mm a';
            }
          }
        }
        else if (this.storedLocale.dateFormat === 0 && this.storedLocale.timeFormat === 1) {
          if (this.storedLocale.language === 'de' || this.storedLocale.language === 'pl') {
            format = 'LL.dd.yyyy, HH:mm';
          } else if (this.storedLocale.language === 'hu' || this.storedLocale.language === 'ko') {
            format = 'LL. dd. yyyy, HH:mm';
          } else if (this.storedLocale.locale === 'en-US') {
            format = 'M/d/yy, h:mm a';
          } else if (this.storedLocale.language === 'ru') {
            format = 'M.d.yyyy, h:mm a';
          } else {
            if (this.storedLocale.locale === 'fr-CA') {
              format = 'M-d-yyyy, HH h mm';
            } else {
              format = 'M/d/yyyy, HH:mm';
            }
          }
        }
        else if (this.storedLocale.dateFormat === 0 && this.storedLocale.timeFormat === 2) {
          format = 'M/d/yyyy, a h:mm';  // future implementation
        }
        else if (this.storedLocale.dateFormat === 1 && this.storedLocale.timeFormat === 0) {
          if (this.storedLocale.language === 'de' || this.storedLocale.language === 'pl') {
            format = 'dd.LL.yyyy, h:mm a';
          }
          else if (this.storedLocale.language === 'hu' || this.storedLocale.language === 'ko') {
            format = 'LL. dd yyyy., h:mm a';
          } else if (this.storedLocale.locale === 'en-US') {
            format = 'd/M/yy, h:mm a';
          } else if (this.storedLocale.language === 'ru') {
            format = 'd.M.yyyy, h:mm a';
          } else {
            if (this.storedLocale.locale === 'fr-CA') {
              format = 'd-M-yyyy, h:mm a';
            } else {
              format = 'd/M/yyyy, h:mm a';
            }
          }
        }
        else if (this.storedLocale.dateFormat === 1 && this.storedLocale.timeFormat === 1) {
          if (this.storedLocale.language === 'de' || this.storedLocale.language === 'pl') {
            format = 'dd.LL.yyyy, HH:mm';
          } else if (this.storedLocale.language === 'hu' || this.storedLocale.language === 'ko') {
            format = 'dd. LL. yyyy, HH:mm';
          } else if (this.storedLocale.locale === 'en-US') {
            format = 'd/M/yy, h:mm a';
          } else if (this.storedLocale.language === 'ru') {
            format = 'd.M.yyyy, h:mm a';
          } else {
            if (this.storedLocale.locale === 'fr-CA') {
              format = 'd-M-yyyy, HH:mm';
            } else {
              format = 'd/M/yyyy, HH:mm';
            }
          }
        }
        else if (this.storedLocale.dateFormat === 1 && this.storedLocale.timeFormat === 2) {
          format = 'd/M/yyyy, a h:mm';// future implementation
        }
        else if (this.storedLocale.dateFormat === 2 && this.storedLocale.timeFormat === 0) {
          if (this.storedLocale.language === 'de' || this.storedLocale.language === 'pl') {
            format = 'yyyy.LL.dd, h:mm a';
          } else if (this.storedLocale.language === 'hu' || this.storedLocale.language === 'ko') {
            format = 'yyyy. LL. dd, h:mm a';
          } else if (this.storedLocale.locale === 'en-US') {
            format = 'yy/M/d, h:mm a';
          } else if (this.storedLocale.language === 'ru') {
            format = 'yyyy.M.d, h:mm a';
          } else {
            if (this.storedLocale.locale === 'fr-CA') {
              format = 'yyyy-M-d, h:mm a';
            } else {
              format = 'yyyy/M/d, h:mm a';
            }
          }
        }
        else if (this.storedLocale.dateFormat === 2 && this.storedLocale.timeFormat === 1) {
          if (this.storedLocale.language === 'de' || this.storedLocale.language === 'pl') {
            format = 'yyyy.LL.dd, HH:mm';
          } else if (this.storedLocale.language === 'hu' || this.storedLocale.language === 'ko') {
            format = 'yyyy. LL. dd, HH:mm';
          } else if (this.storedLocale.locale === 'en-US') {
            format = 'yy/M/d, h:mm a';
          } else if (this.storedLocale.language === 'ru') {
            format = 'yyyy.M.d, h:mm a';
          } else {
            if (this.storedLocale.locale === 'fr-CA') {
              format = 'yyyy-M-d, HH:mm';
            } else {
              format = 'yyyy/M/d, HH:mm';
            }
          }
        }
        else if (this.storedLocale.dateFormat === 2 && this.storedLocale.timeFormat === 2) {
          format = 'yy/M/d,  a h:mm';// future implementation
        }
      }
      else if (args === 'medium') {
        if (this.storedLocale.dateFormat === 0) {
          if (this.storedLocale.timeFormat === 0) {
            format = 'MMM d, y, h:mm a';
          }
          else if (this.storedLocale.timeFormat === 1) {
            format = 'MMM d, y, HH:mm';
          }
          else if (this.storedLocale.timeFormat === 2) {
            format = 'MMM d, y, a h:mm';
          }
        }
        else if (this.storedLocale.dateFormat === 1) {
          if (this.storedLocale.timeFormat === 0) {
            format = 'd MMM y, h:mm a';
          }
          else if (this.storedLocale.timeFormat === 1) {
            format = 'd MMM y, HH:mm';
          }
          else if (this.storedLocale.timeFormat === 2) {
            format = 'd MMM y, a h:mm';
          }
        }
        else if (this.storedLocale.dateFormat === 2) {
          if (this.storedLocale.timeFormat === 0) {
            format = 'y MMM d, h:mm a';
          }
          else if (this.storedLocale.timeFormat === 1) {
            format = 'y MMM d, HH:mm';
          }
          else if (this.storedLocale.timeFormat === 2) {
            format = 'y MMM d,  a h:mm';
          }
        }
      }
      else if (args === 'shortTime') {
        if (this.storedLocale.timeFormat === 0) {
          format = 'h:mm a';
        }
        else if (this.storedLocale.timeFormat === 1) {
          format = 'HH:mm';
        }
        else if (this.storedLocale.timeFormat === 2) {
          format = 'a h:mm';
        }
      }
      else if (args === 'shortDate') {
        if (this.storedLocale.locale === 'en-US') {
          if (this.storedLocale.locale.dateFormat === 0) {
            format = 'M/d/yy';
          }
          else if (this.storedLocale.dateFormat === 1) {
            format = 'd/M/yy';
          }
          else if (this.storedLocale.dateFormat === 2) {
            format = 'yy/M/d';
          }
        }
        else if (this.storedLocale.locale === 'fr-CA') {
          if (this.storedLocale.dateFormat === 0) {
            format = 'M-d-yyyy';
          }
          else if (this.storedLocale.dateFormat === 1) {
            format = 'd-M-yyyy';
          }
          else if (this.storedLocale.dateFormat === 2) {
            format = 'yyyy-M-d';
          }
        }
        else if (
          this.storedLocale.language === 'hu' || this.storedLocale.language === 'de' ||
          this.storedLocale.language === 'ru' || this.storedLocale.language === 'ko' ||
          this.storedLocale.language === 'pl'
        ) {
          if (this.storedLocale.dateFormat === 0) {
            format = 'M.d.yyyy';
          }
          else if (this.storedLocale.dateFormat === 1) {
            format = 'd.M.yyyy';
          }
          else if (this.storedLocale.dateFormat === 2) {
            format = 'yyyy.M.d';
          }
        }
        else {
          if (this.storedLocale.dateFormat === 0) {
            format = 'M/d/yyyy';
          }
          else if (this.storedLocale.dateFormat === 1) {
            format = 'd/M/yyyy';
          }
          else if (this.storedLocale.dateFormat === 2) {
            format = 'yyyy/M/d';
          }
        }
      }
      else if (args === 'mediumDate') {
        if (this.storedLocale.dateFormat === 0) {
          format = this.storedLocale.language === 'de' ? 'M.d.y' : 'MMM d, y';
        }
        else if (this.storedLocale.dateFormat === 1) {
          format = this.storedLocale.language === 'de' ? 'd.M.y' : 'd MMM y';
        }
        else if (this.storedLocale.dateFormat === 2) {
          format = this.storedLocale.language === 'de' ? 'y.M.d' : 'y. MMM. d';
        }
      }
      // Remove. Some date formats which we are still using but not in current design docs
      else if (args === 'shortDateyy') {
        format = 'MM/dd/yyyy';
      }
      else if (args === 'longDate') {
        format = 'MMMM d, y';
      }
      else if (args === 'longDatemmm') {
        format = 'MMM d, y';
      }
      else if (args === 'monthAbbreviated') {
        format = 'MMM';
      }
      else if (args === 'monthAndDateAbbreviated' && this.storedLocale.timeFormat === 0) {
        format = 'MMM dd h:mm a';
      }
      else if (args === 'monthAndDateAbbreviated' && this.storedLocale.timeFormat === 1) {
        format = 'MMM dd HH:mm';
      }
      else if (args === 'fullMonth') {
        format = 'MMMM';
      }

      if (this.offsetByLabTimeZone && this.labTimeZone) {
        offset = moment(value).tz(this.labTimeZone).format('Z');
      }

      return (format !== undefined) ? datePipe.transform(value, format, offset) : datePipe.transform(value, args, offset);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
