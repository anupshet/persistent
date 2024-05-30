// © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved
import { Component, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'unext-date-time-cell',
  templateUrl: './date-time-cell.component.html',
  styleUrls: ['./date-time-cell.component.scss']
})
export class DateTimeCellComponent {

  @Input() runDateTime: Date;
  @Input() isInsert: boolean;
  @Input() isRestartFloat: boolean;


  constructor(
    private translate: TranslateService,
  ) { }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

}
