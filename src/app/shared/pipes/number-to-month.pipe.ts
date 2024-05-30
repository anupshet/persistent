import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({ name: 'numberToMonth' })
export class NumberToMonthPipe implements PipeTransform {
  constructor( private translate: TranslateService) { }

  transform(value: any): any {
    return this.getTranslation('FILTERMONTHS.' + Months[value].toUpperCase());
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}

enum Months {
  'January' = 1,
  'February' = 2,
  'March' = 3,
  'April' = 4,
  'May' = 5,
  'June' = 6,
  'July' = 7,
  'August' = 8,
  'September' = 9,
  'October' = 10,
  'November' = 11,
  'December' = 12
}






