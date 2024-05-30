import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  private busyRequests = 0;
  public spinnerStatus = this.spinnerSubject.asObservable();

  constructor(
    private translate: TranslateService
  ) {}

  public displaySpinner(isDisplay: boolean): void {
    if (this.getTranslation('BUSY.MESSAGE') !== 'BUSY.MESSAGE') {
      this.busyRequests = isDisplay ? this.busyRequests + 1 : this.busyRequests - 1;
      this.spinnerSubject.next(this.busyRequests > 0);
    }
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
