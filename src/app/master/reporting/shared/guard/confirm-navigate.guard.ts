// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { IconType, ReportDialogType, StyleOfBtn, TypeOfDialog } from '../../models/report-dialog';
import { NewReportsComponent } from '../../new-reports/new-reports.component';
import { ReportsGenericDialogComponent } from '../../new-reports/components/reports-generic-dialog/reports-generic-dialog.component';
import { take } from 'rxjs/operators';

@Injectable()
export class ConfirmNavigateGuard implements CanDeactivate<NewReportsComponent> {

  public constructor(
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
  ) { }
  private fragment = 'confirmNavigate';
  private allowedUrl = ['/reporting/past-reports'];
  manualCheck ? = null;
  isModalOpen = false;
  canDeactivate(component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.manualCheck || currentRoute.fragment === this.fragment || this.allowedUrl.indexOf(nextState?.url) > -1) {
        this.manualCheck = null;
        return of(true);
      }
    return this.callModal();
  }

  private async callModal(): Promise<boolean> {
    if (this.isModalOpen) {
      return of(false).toPromise();
    }
    const closeBtnName = this.getTranslation('LABCONFIGSELECTION.CLOSE');
    const buttonName = this.getTranslation('LABCONFIGSELECTION.CONTINUEBUTTONTEXT');
    this.isModalOpen = true;
    const response = await this.openGenericDialog(TypeOfDialog.SimpleBlock, null, buttonName, closeBtnName, true);
    this.isModalOpen = false;
    return response;
  }

  async confirmationModal() {
    this.manualCheck = false;
    const response = await this.callModal();
    this.manualCheck = response;
    if (response) {
      this.router.navigate([], { fragment: this.fragment });
    }
    return response;
  }

  async navigateWithoutModal() {
    this.manualCheck = true;
    this.router.navigate([], { fragment: this.fragment });
  }

  openGenericDialog(dialogType: TypeOfDialog, messageIcon: IconType,
    buttonName: string, closeBtnName: string, dialogFullwidth: boolean): Promise<boolean> {
    const dialogMessageContent: ReportDialogType = {
    dialogType: dialogType,
    simpleMessageList: [
      this.getTranslation('LABCONFIGSELECTION.NAVIGATEAWAY'),
      this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO')
    ],
    messageIcon: messageIcon,
    fullwidth: dialogFullwidth,
    buttonsList: [{
      btnName: buttonName,
      btnStyle: StyleOfBtn.SolidButton,
     },
     {
      btnName: closeBtnName,
      btnStyle: StyleOfBtn.OutlineButton
     }]
   };
   const dialog = this.dialog.open(ReportsGenericDialogComponent, {
     panelClass: ['report-generic-container'],
     data: dialogMessageContent,
   });
   return new Promise((resolve) => {
    dialog.afterClosed().toPromise().then((res) => {
      resolve(res.buttonIndex === 0);
    });
   });
 }

 getTranslation(codeToTranslate: string): string {
  let translatedContent: string;
  this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
    translatedContent = translatedString;
    });
  return translatedContent;
}

}
