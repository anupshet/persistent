import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BrDialogComponent } from 'br-component-library';
import { CookiePreferencesComponent } from '../cookie-preferences/cookie-preferences.component';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';


@Component({
  selector: 'unext-cookie-disclaimer-message',
  templateUrl: './cookie-disclaimer-message.component.html',
  styleUrls: ['./cookie-disclaimer-message.component.scss']
})
export class CookieDisclaimerMessageComponent extends BrDialogComponent {

  icons = icons
  iconsUsed: Array<Icon> = [this.icons.langDark[24]];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CookieDisclaimerMessageComponent>,
    private iconService: IconService
  ) {
    super(data);
    this.iconService.addIcons(this.iconsUsed);
   }

  onManageCookiePreferences() {
    const dialogRef = this.dialog.open(CookiePreferencesComponent, {
      height: '100%',
      maxWidth: '100%'
    });

    dialogRef.disableClose = true;
  }

  onAcceptAndContinue() {
    this.dialogRef.close(true);
  }

  onDeclineCookies() {
    this.dialogRef.close(false);
  }
}
