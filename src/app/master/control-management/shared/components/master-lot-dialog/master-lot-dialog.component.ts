// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { LotManagementEnum } from '../../../../../master/control-management/shared/models/lot-management.enum';
import { CustomLotManagementComponent } from '../custom-lot-management/custom-lot-management.component';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { Permissions } from '../../../../../security/model/permissions.model';

@Component({
  selector: 'unext-master-lot-dialog',
  templateUrl: './master-lot-dialog.component.html',
  styleUrls: ['./master-lot-dialog.component.scss']
})
export class MasterLotDialogComponent implements OnInit {
  @ViewChild('customLotManagement', { static: false }) customLotManagement: CustomLotManagementComponent;
  startDate = new Date();
  buttonText: string;
  lotManagementEnum = LotManagementEnum;
  submitButtonText: string;
  cancelButtonText: string;
  masterLotFormStatus = true;
  permissions = Permissions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MasterLotDialogComponent>,
    private translate: TranslateService,
    private brPermissionsService: BrPermissionsService
  ) { }

  ngOnInit(): void {
    this.submitButtonText = this.data.mode === this.lotManagementEnum.Edit ? this.getTranslation('MASTERLOTDIALOG.UPDATELOT') : this.getTranslation('MASTERLOTDIALOG.ADDLOT');
    this.cancelButtonText = this.getTranslation('MASTERLOTDIALOG.CANCEL');
  }

  onUpdateData(): void {
    this.dialogRef.close(this.customLotManagement.masterLotDataForm.value);
  }

  onCancel(): void {
    this.dialogRef.close(true);
  }

  formUpdated(value: boolean) {
    this.masterLotFormStatus = value;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

}
