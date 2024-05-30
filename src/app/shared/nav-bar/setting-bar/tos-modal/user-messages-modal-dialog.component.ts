// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

import { UserMessage } from '../../../../contracts/models/user-preference/user-message.model';

@Component({
  selector: 'unext-tos-modal-dialog',
  templateUrl: './user-messages-modal-dialog.component.html',
  styleUrls: ['./user-messages-modal-dialog.component.scss']
})
export class UserMessagesDialogComponent implements OnInit {
  public userMessages: Array<UserMessage>;
  public messageForm: FormGroup;
  public formControlNames: Array<string> = [];
  public isValid = false;
  public locale: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<UserMessagesDialogComponent>,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.userMessages = this.data.userMessages;
    this.messageForm = this.createForm();
  }

  private createForm(): FormGroup {
    // Creates the form and populates the data
    this.formControlNames = [];
    const formData = {};

    for (let i = 0, len = this.userMessages.length; i < len; i++) {
      this.formControlNames.push(i.toString());
      if (this.userMessages[i].requiresUserAction) {
        formData[i.toString()] = new FormControl(false, []);
      } else {
        formData[i.toString()] = new FormControl(true, []);
      }
    }
    return new FormGroup(formData);
  }

  public getFormControlName(message: UserMessage): string {
    return this.userMessages.indexOf(message).toString();
  }

  onCheckboxChange($event, message: UserMessage) {
    const messageID = this.userMessages.indexOf(message);
    this.messageForm[messageID.toString()] = true;
    this.validateInput();
  }

  validateInput() {
    this.isValid = this.messageForm.status === 'VALID';
  }

  openNewWindow(message: UserMessage) {
    const linkURL = message.linkUrl.replace('{locale}', message.locale);
    window.open(linkURL);
  }

  onSubmit() {
    if (this.isValid) {
      this.dialogRef.close(true);
    }
  }

  onDisagree() {
    this.dialogRef.close(false);
  }
}
