// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { select } from '@ngrx/store';
import * as ngrxSelector from '@ngrx/store';
import * as fromRoot from './../../../state/app.state';
import * as navigationStateSelector from '../../../shared/navigation/state/selectors';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as moment from 'moment';

interface LocationState {
  currentLabLocation: { locationTimeZone: null }
}

@Pipe({
  name: 'uNextDate',
  pure: false
})
export class UnityNextDatePipe implements PipeTransform, OnDestroy {
  getLocationState = createFeatureSelector<LocationState>('location');
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  getCurrentLabLocation = createSelector(this.getLocationState, (state) => state ? state.currentLabLocation : null);
  public getCurrentLabLocation$ = this.store.pipe(select(this.getCurrentLabLocation));
  private destroy$ = new Subject<boolean>();
  defaultLanguageValue = 'en';
  offsetByLabTimeZone = true;
  labTimeZone: string;

  constructor(
    private store: ngrxSelector.Store<fromRoot.State>,
    private translateService: TranslateService
  ) { }

  transform(value: any, args?: any, offset?: string): any {
    // If manually pass offset,  it's format should be e.g. '-7:00'
    if (!!offset && offset !== '') {
      this.offsetByLabTimeZone = false;
    }

    const datePipe = new DatePipe(this.translateService.currentLang || this.defaultLanguageValue);
    let locale, format;

    this.navigationGetLocale$
      .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
      .subscribe(loc => {
        locale = loc;
      });
    this.getCurrentLabLocation$.pipe(filter(labLocation => !!labLocation),
      takeUntil(this.destroy$)).subscribe(labLocation => {
        if (labLocation) {
          this.labTimeZone = labLocation.locationTimeZone;
        }
      });

    if (args === 'short') {
      if (locale.dateFormat === 0 && locale.timeFormat === 0) {
        if (locale.language === 'de' || locale.language === 'pl') {
          format = 'LL.dd.yyyy, h:mm a';
        } else if (locale.language === 'hu' || locale.language === 'ko') {
          format = 'LL. dd. yyyy, h:mm a';
        } else if (locale.locale === 'en-US') {
          format = 'M/d/yy, h:mm a';
        } else if (locale.language === 'ru') {
          format = 'M.d.yyyy, h:mm a';
        } else {
          if (locale.locale === 'fr-CA') {
            format = 'M-d-yyyy, h:mm a';
          } else {
            format = 'M/d/yyyy, h:mm a';
          }
        }
      }
      else if (locale.dateFormat === 0 && locale.timeFormat === 1) {
        if (locale.language === 'de' || locale.language === 'pl') {
          format = 'LL.dd.yyyy, HH:mm';
        } else if (locale.language === 'hu' || locale.language === 'ko') {
          format = 'LL. dd. yyyy, HH:mm';
        } else if (locale.locale === 'en-US') {
          format = 'M/d/yy, h:mm a';
        } else if (locale.language === 'ru') {
          format = 'M.d.yyyy, h:mm a';
        } else {
          if (locale.locale === 'fr-CA') {
            format = 'M-d-yyyy, HH h mm';
          } else {
            format = 'M/d/yyyy, HH:mm';
          }
        }
      }
      else if (locale.dateFormat === 0 && locale.timeFormat === 2) {
        format = 'M/d/yyyy, a h:mm';  // future implementation
      }
      else if (locale.dateFormat === 1 && locale.timeFormat === 0) {
        if (locale.language === 'de' || locale.language === 'pl') {
          format = 'dd.LL.yyyy, h:mm a';
        }
        else if (locale.language === 'hu' || locale.language === 'ko') {
          format = 'LL. dd yyyy., h:mm a';
        } else if (locale.locale === 'en-US') {
          format = 'd/M/yy, h:mm a';
        } else if (locale.language === 'ru') {
          format = 'd.M.yyyy, h:mm a';
        } else {
          if (locale.locale === 'fr-CA') {
            format = 'd-M-yyyy, h:mm a';
          } else {
            format = 'd/M/yyyy, h:mm a';
          }
        }
      }
      else if (locale.dateFormat === 1 && locale.timeFormat === 1) {
        if (locale.language === 'de' || locale.language === 'pl') {
          format = 'dd.LL.yyyy, HH:mm';
        } else if (locale.language === 'hu' || locale.language === 'ko') {
          format = 'dd. LL. yyyy, HH:mm';
        } else if (locale.locale === 'en-US') {
          format = 'd/M/yy, h:mm a';
        } else if (locale.language === 'ru') {
          format = 'd.M.yyyy, h:mm a';
        } else {
          if (locale.locale === 'fr-CA') {
            format = 'd-M-yyyy, HH:mm';
          } else {
            format = 'd/M/yyyy, HH:mm';
          }
        }
      }
      else if (locale.dateFormat === 1 && locale.timeFormat === 2) {
        format = 'd/M/yyyy, a h:mm';// future implementation
      }
      else if (locale.dateFormat === 2 && locale.timeFormat === 0) {
        if (locale.language === 'de' || locale.language === 'pl') {
          format = 'yyyy.LL.dd, h:mm a';
        } else if (locale.language === 'hu' || locale.language === 'ko') {
          format = 'yyyy. LL. dd, h:mm a';
        } else if (locale.locale === 'en-US') {
          format = 'yy/M/d, h:mm a';
        } else if (locale.language === 'ru') {
          format = 'yyyy.M.d, h:mm a';
        } else {
          if (locale.locale === 'fr-CA') {
            format = 'yyyy-M-d, h:mm a';
          } else {
            format = 'yyyy/M/d, h:mm a';
          }
        }
      }
      else if (locale.dateFormat === 2 && locale.timeFormat === 1) {
        if (locale.language === 'de' || locale.language === 'pl') {
          format = 'yyyy.LL.dd, HH:mm';
        } else if (locale.language === 'hu' || locale.language === 'ko') {
          format = 'yyyy. LL. dd, HH:mm';
        } else if (locale.locale === 'en-US') {
          format = 'yy/M/d, h:mm a';
        } else if (locale.language === 'ru') {
          format = 'yyyy.M.d, h:mm a';
        } else {
          if (locale.locale === 'fr-CA') {
            format = 'yyyy-M-d, HH:mm';
          } else {
            format = 'yyyy/M/d, HH:mm';
          }
        }
      }
      else if (locale.dateFormat === 2 && locale.timeFormat === 2) {
        format = 'yy/M/d,  a h:mm';// future implementation
      }
    }
    else if (args === 'medium') {
      if (locale.dateFormat === 0) {
        if (locale.timeFormat === 0) {
          format = 'MMM d, y, h:mm a';
        }
        else if (locale.timeFormat === 1) {
          format = 'MMM d, y, HH:mm';
        }
        else if (locale.timeFormat === 2) {
          format = 'MMM d, y, a h:mm';
        }
      }
      else if (locale.dateFormat === 1) {
        if (locale.timeFormat === 0) {
          format = 'd MMM y, h:mm a';
        }
        else if (locale.timeFormat === 1) {
          format = 'd MMM y, HH:mm';
        }
        else if (locale.timeFormat === 2) {
          format = 'd MMM y, a h:mm';
        }
      }
      else if (locale.dateFormat === 2) {
        if (locale.timeFormat === 0) {
          format = 'y MMM d, h:mm a';
        }
        else if (locale.timeFormat === 1) {
          format = 'y MMM d, HH:mm';
        }
        else if (locale.timeFormat === 2) {
          format = 'y MMM d,  a h:mm';
        }
      }
    }
    else if (args === 'shortTime') {
      if (locale.timeFormat === 0) {
        format = 'h:mm a';
      }
      else if (locale.timeFormat === 1) {
        format = 'HH:mm';
      }
      else if (locale.timeFormat === 2) {
        format = 'a h:mm';
      }
    }
    else if (args === 'shortDate') {
      if (locale.locale === 'en-US') {
        if (locale.locale.dateFormat === 0) {
          format = 'M/d/yy';
        }
        else if (locale.dateFormat === 1) {
          format = 'd/M/yy';
        }
        else if (locale.dateFormat === 2) {
          format = 'yy/M/d';
        }
      }
      else if (locale.locale === 'fr-CA') {
        if (locale.dateFormat === 0) {
          format = 'M-d-yyyy';
        }
        else if (locale.dateFormat === 1) {
          format = 'd-M-yyyy';
        }
        else if (locale.dateFormat === 2) {
          format = 'yyyy-M-d';
        }
      }
      else if (
        locale.language === 'hu' || locale.language === 'de' ||
        locale.language === 'ru' || locale.language === 'ko' ||
        locale.language === 'pl'
      ) {
        if (locale.dateFormat === 0) {
          format = 'M.d.yyyy';
        }
        else if (locale.dateFormat === 1) {
          format = 'd.M.yyyy';
        }
        else if (locale.dateFormat === 2) {
          format = 'yyyy.M.d';
        }
      }
      else {
        if (locale.dateFormat === 0) {
          format = 'M/d/yyyy';
        }
        else if (locale.dateFormat === 1) {
          format = 'd/M/yyyy';
        }
        else if (locale.dateFormat === 2) {
          format = 'yyyy/M/d';
        }
      }
    }
    else if (args === 'mediumDate') {
      if (locale.dateFormat === 0) {
        format = locale.language === 'de' ? 'M.d.y' : 'MMM d, y';
      }
      else if (locale.dateFormat === 1) {
        format = locale.language === 'de' ? 'd.M.y' : 'd MMM y';
      }
      else if (locale.dateFormat === 2) {
        format = locale === 'de' ? 'y.M.d' : 'y. MMM. d';
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
    else if (args === 'monthAndDateAbbreviated' && (locale.dateFormat === 0 || locale.dateFormat === 2)) {
      format = 'MMM dd';
    }
    else if (args === 'monthAndDateAbbreviated' && locale.dateFormat === 1) {
      format = 'dd MMM';
    }
    else if (args === 'fullMonth') {
      format = 'MMMM';
    }
    
    if (this.offsetByLabTimeZone && this.labTimeZone) {
      offset = moment(value).tz(this.labTimeZone).format('Z');
    }

    return (format !== undefined) ? datePipe.transform(value, format, offset) : datePipe.transform(value, args, offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
