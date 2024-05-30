/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';

export const DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable()
export class LocalizationDatePickerHelper {
  constructor(private adapter: DateAdapter<moment.Moment>) { }

  getShortDateFormatString(selectedLanguage) {
    const shortDateFormatOptions = {
      'en-US': {
        0: 'M/DD/YY',
        1: 'DD/M/YY',
        2: 'YY/M/DD',
      },
      'en-GB': {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "fr-FR": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "fr-CA": {
        0: 'MM-DD-YYYY',
        1: 'DD-MM-YYYY',
        2: 'YYYY-MM-DD',
      },
      "es-ES": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "it-IT": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "pt-PT": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "pl-PL": {
        0: 'MM.DD.YYYY',
        1: 'DD.MM.YYYY',
        2: 'YYYY.MM.DD',
      },
      "hu-HU": {
        0: 'MM.DD.YYYY',
        1: 'DD.MM.YYYY',
        2: 'YYYY.MM.DD',
      },
      "de-DE": {
        0: 'MM.DD.YYYY',
        1: 'DD.MM.YYYY',
        2: 'YYYY.MM.DD',
      },
      "ru-RU": {
        0: 'MM.DD.YYYY',
        1: 'DD.MM.YYYY',
        2: 'YYYY.MM.DD',
      },
      "ko-KR": {
        0: 'M.DD.YYYY',
        1: 'DD.M.YYYY',
        2: 'YYYY.M.DD',
      },
      "ja-JP": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "zh-CN": {
        0: 'M/DD/YYYY',
        1: 'DD/M/YYYY',
        2: 'YYYY/M/DD',
      }
    };

    if (shortDateFormatOptions[selectedLanguage.locale] && shortDateFormatOptions[selectedLanguage.locale][selectedLanguage.dateFormat]) {
      DATEPICKER_FORMATS.display.dateInput = shortDateFormatOptions[selectedLanguage.locale][selectedLanguage.dateFormat];
    }
  }

  getMediumDateFormatString(selectedLanguage) {
    if (selectedLanguage.locale === 'en-US') {
      moment.locale('en')
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD' + ' [' + moment().format('MMM') + '] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY' + ' [' + moment().format('MMM') + '] ' + 'DD';
      }
    } else if (selectedLanguage.locale === 'en-GB') {
      moment.locale('en')
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD' + ' [' + moment().format('MMM') + '] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY' + ' [' + moment().format('MMM') + '] ' + 'DD';
      }
    } else if (selectedLanguage.locale === 'fr-FR') {
      moment.locale('fr');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD' + ' [' + moment().format('MMM') + '] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY' + ' [' + moment().format('MMM') + '] ' + 'DD';
      }
    } else if (selectedLanguage.locale === 'fr-CA') {
      moment.locale('fr');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD' + ' [' + moment().format('MMM') + '] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY' + ' [' + moment().format('MMM') + '] ' + 'DD';
      }
    } else if (selectedLanguage.locale === 'es-ES') {
      moment.locale('es');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD' + ' [' + moment().format('MMM') + '] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY' + ' [' + moment().format('MMM') + '] ' + 'DD';
      }
    } else if (selectedLanguage.locale === 'it-IT') {
      moment.locale('it');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD' + ' [' + moment().format('MMM') + '] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY' + ' [' + moment().format('MMM') + '] ' + 'DD';
      }
    } else if (selectedLanguage.locale === 'pt-PT') {
      moment.locale('pt');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' [de] ' + 'DD' + ' [de] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD' + ' [de] ' + '[' + moment().format('MMM') + ']' + ' [de] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY' + ' [de] ' + '[' + moment().format('MMM') + ']' + ' [de] ' + 'DD';
      }
    } else if (selectedLanguage.locale === 'pl-PL') {
      moment.locale('pl');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD' + ' [' + moment().format('MMM') + '] ' + 'YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY' + ' [' + moment().format('MMM') + '] ' + 'DD';
      }
    } else if (selectedLanguage.locale === 'hu-HU') {
      moment.locale('hu');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD. ' + 'YYYY.';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD.' + ' [' + moment().format('MMM') + '] ' + 'YYYY.';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY.' + ' [' + moment().format('MMM') + '] ' + 'DD.';
      }
    } else if (selectedLanguage.locale === 'de-DE') {
      moment.locale('de');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = 'MM.DD.YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD.MM.YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY.MM.DD';
      }
    } else if (selectedLanguage.locale === 'ru-RU') {
      moment.locale('ru');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = '[' + moment().format('MMM') + ']' + ' DD. ' + 'YYYY г.';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD.' + ' [' + moment().format('MMM') + '] ' + 'YYYY г.';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY г.' + ' [' + moment().format('MMM') + '] ' + 'DD.';
      }
    } else if (selectedLanguage.locale === 'ko-KR') {
      moment.locale('ko');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = 'MM.DD.YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD.MM.YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY.MM.DD';
      }
    } else if (selectedLanguage.locale === 'ja-JP') {
      moment.locale('ja');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = 'MM/DD/YYYY';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD/MM/YYYY';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY/MM/DD';
      }
    } else if (selectedLanguage.locale === 'zh-CN') {
      moment.locale('zh');
      if (selectedLanguage.dateFormat === 0) {
        DATEPICKER_FORMATS.display.dateInput = 'MM月 DD日 YYYY年';
      } else if (selectedLanguage.dateFormat === 1) {
        DATEPICKER_FORMATS.display.dateInput = 'DD日 MM月 YYYY年';
      } else if (selectedLanguage.dateFormat === 2) {
        DATEPICKER_FORMATS.display.dateInput = 'YYYY年 MM月 DD日';
      }
    }
  }
}
