import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { inProgressCode } from '../../core/config/constants/general.const';

@Injectable()
export class InProgressMessageTranslationService {

  constructor(private translate: TranslateService) { }

  setProgressMessage(unavailableReasonCode: string) {
    let header = '';
    let message = '';
    switch (unavailableReasonCode) {
      case inProgressCode.duplicate:
        header = 'TRANSLATION.DUPLICATIONLOT';
        message = 'TRANSLATION.WORKWITHLOT';
        break;
      case inProgressCode.archive:
        header = 'TRANSLATION.ARCHIVINGPROCESS';
        message = 'TRANSLATION.CHECKBACKLATER';
        break;
      case inProgressCode.unarchive:
        header = 'TRANSLATION.ARCHIVINGPROCESS';
        message = 'TRANSLATION.CHECKBACKLATER';
        break;
      case inProgressCode.panelCreating:
        header = 'TRANSLATION.PANELCREATION';
        break;
      case inProgressCode.panelUpdating:
        header = 'TRANSLATION.PANELUPDATE';
        break;
      case inProgressCode.instrumentCopy:
        header = 'TRANSLATION.INSTRUMENTPROGRESS';
        message = 'TRANSLATION.THISINSTRUMENT';
        break;
      default:
        header = 'TRANSLATION.CURRENTLYUNAVAILABLE';
        message = 'TRANSLATION.CURRENTLYUNAVAILABLE';
        break;
    }
    return {
      progressHeader:  this.getTranslations(header),
      progressMessage:  this.getTranslations(message)
    };
  }
  
  getTranslations(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
