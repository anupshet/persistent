import { Inject, LOCALE_ID, Injectable } from '@angular/core';
import { FR_FR, ZH_HANS, ZH_CN } from './locale.constants';

@Injectable()
export class LocaleConverter {
  constructor(@Inject(LOCALE_ID) private _locale: string) { }

  getLocaleWithMomentConversions(): string {
    if (this.localeIsFr_Fr()) {
      return FR_FR;
    } else if (this.localeIsZh_Hans()) {
      return ZH_CN;
    } else {
      return this._locale;
    }
  }

  getLocaleWithMaterialConversions(): string {
    // These have the same conversions right now. Remove this comment if that ever changes.
    return this.getLocaleWithMomentConversions();
  }

  private localeIsFr_Fr(): boolean {
    return this.equalsCaseInsensitive(FR_FR, this._locale);
  }

  private localeIsZh_Hans(): boolean {
    return this.equalsCaseInsensitive(ZH_HANS, this._locale);
  }

  private equalsCaseInsensitive(a: string, b: string): boolean {
    if (!a) {
      return false;
    }
    return a.localeCompare(b, undefined, {sensitivity: 'accent'}) === 0;
  }
}
