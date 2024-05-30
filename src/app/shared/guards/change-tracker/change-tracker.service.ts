// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { take } from 'rxjs/operators';
import { BrDialogComponent, DialogResult } from 'br-component-library';
import { TranslateService } from '@ngx-translate/core';

const changeState = {
  hasChanges: false,
  okCustomAction: null,
  customPromptAction: null,
  cancelCustomAction: null,
  currentDialogRef: null
}; // This should be considered for relocation into UI state.

@Injectable()
export class ChangeTrackerService implements CanDeactivate<any> {
  public get unSavedChanges(): boolean {
    return changeState.hasChanges;
  }
  public customTitle: string;
  public customSubTitle: string;
  public customCancelButtonText: string;
  public customConfirmButtonText: string;
  public showConfirmButtonFirst: boolean;
  public customWidth: number;
  public canDeactivateSubject = new Subject<boolean>();
  private dialogRef: MatDialogRef<BrDialogComponent, any> = null;

  // NGX-Pagination constant
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 25,
    currentPage: 1
  };
  public pendingPage: number;

  public constructor(
    public dialog: MatDialog,
    public translateService: TranslateService,
  ) {
    const me = this;
    window.onbeforeunload = function (e) {
      if (me.unSavedChanges) {
        const dialogText =this.getTranslation('CHANGETRACKER.SUBTITLE');
        e.returnValue = dialogText;
        return dialogText;
      }
    };
  }

  public canDeactivate(
    component: any,
    currentRoute?: ActivatedRouteSnapshot,
    currentState?: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.unSavedChanges) {
      if (changeState.customPromptAction) {
        changeState.customPromptAction();
        return false;
      } else {
        this.openDialogConfirmation();
      }
      return this.canDeactivateSubject.asObservable();
    } else {
      if (changeState.currentDialogRef) {
        changeState.currentDialogRef();
      }
      this.config.currentPage = this.pendingPage;
      return true;
    }
  }

  public setDirty() {
    changeState.hasChanges = true;
  }

  public resetDirty() {
    changeState.hasChanges = false;
  }

  // Use an async custom function to allow for situations that require async processing until the dialog is closed.
  public setOkAction(customCallback: Function) {
    changeState.okCustomAction = customCallback;
  }

  public setCustomPrompt(customCallback: Function) {
    changeState.customPromptAction = customCallback;
  }

  public getDialogRef(customCallback: Function) {
    changeState.currentDialogRef = customCallback;
  }

  // Use an async custom function to allow for situations that require async processing until the dialog is closed.
  public setCancelAction(customCallback: Function) {
    changeState.cancelCustomAction = customCallback;
  }

  openDialogConfirmation() {
    if (this.dialogRef != null) {
      return;
    }
    const translatedTitle = this.customTitle || this.getTranslation('CHANGETRACKER.TITLE');
    const translatedSubTitle = this.customSubTitle || this.getTranslation('CHANGETRACKER.SUBTITLE');
    const translatedCancelButton = this.customCancelButtonText || this.getTranslation('CHANGETRACKER.CANCELBUTTON');
    const translatedConfirmButton = this.customConfirmButtonText || this.getTranslation('CHANGETRACKER.CONFIRMBUTTON');

    this.dialogRef = this.dialog.open(BrDialogComponent, {
      panelClass:'br-dialog-component-panel-class',
      data: {
        title: translatedTitle,
        subTitle: translatedSubTitle,
        cancelButton: translatedCancelButton,
        confirmButton: translatedConfirmButton,
        xbutton: true,
        showConfirmButtonFirst: this.showConfirmButtonFirst,
        customWidth: this.customWidth ? this.customWidth : null
      }
    });

    const buttonClick = this.dialogRef.componentInstance.buttonClicked.subscribe(
      async dialogResult => {
        // Action if Cancel or Do not Save Data is clicked
        if (dialogResult === DialogResult.Cancel) {
          this.dialogRef.close();
          this.canDeactivateSubject.next(true);
          this.resetDirty();
        } else if (dialogResult === DialogResult.OK) {
          // Action if Submit and Leave is clicked
          this.dialogRef.close();
          this.resetDirty();
          if (changeState.okCustomAction) {
            await changeState.okCustomAction();
          }
        }
      },
      error => { }
    );

    this.dialogRef.afterClosed().subscribe(() => {
      buttonClick.unsubscribe();
      this.dialogRef = undefined;
    });
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translateService.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

}
