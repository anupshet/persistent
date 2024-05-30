import { Inject, LOCALE_ID, Injectable } from '@angular/core';

import { FR_FR, ZH_HANS, ZH_CN } from './locale.constants';
import { Utility } from '../../core/helpers/utility';
import { Cookies } from '../../core/helpers/cookies-helper';

@Injectable()
export class LocaleConverter {
  constructor(@Inject(LOCALE_ID) private currentLanguage: string) { }

  getLocaleWithMomentConversions(): string {
    if (this.localeIsFr_Fr()) {
      return FR_FR;
    } else if (this.localeIsZh_Hans()) {
      return ZH_CN;
    } else {
     return this.getCookiesLanguageValue();
    }
  }
  getCookiesLanguageValue(): string {
    this.currentLanguage = Cookies.getCookiesValue('language');
    return this.currentLanguage;
  }
  getLocaleWithMaterialConversions(): string {
    // These have the same conversions right now. Remove this comment if that ever changes.
    return this.getLocaleWithMomentConversions();
  }

  private localeIsFr_Fr(): boolean {
    return Utility.equalsCaseInsensitive(FR_FR, this.getCookiesLanguageValue());
  }

  private localeIsZh_Hans(): boolean {
    return Utility.equalsCaseInsensitive(ZH_HANS, this.getCookiesLanguageValue());
  }
}
