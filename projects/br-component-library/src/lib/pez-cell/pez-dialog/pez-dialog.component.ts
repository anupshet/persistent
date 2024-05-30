import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { PezType } from '../../contracts/enums/pez-type.enum';
import { Pez } from '../../contracts/models/data-management/pez.model';

@Component({
  selector: 'br-pez-dialog',
  templateUrl: './pez-dialog.component.html',
  styleUrls: ['./pez-dialog.component.scss']
})
export class BrPezDialogComponent implements OnInit {
  pezData: Pez;
  isAction: boolean;
  isComment: boolean;
  isUserInteraction: boolean;
  actionTitle: string;
  commentTitle: string;
  actionLogsTitle: string;
  atText: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BrPezDialogComponent>,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.pezData = this.data;
    this.actionTitle = this.pezData.actionTitle;
    this.commentTitle = this.pezData.commentTitle;
    this.actionLogsTitle = this.pezData.actionLogsTitle;
    this.atText = this.pezData.atText;
    this.isAction = false;
    this.isComment = false;
    this.isUserInteraction = false;

    switch (this.pezData.pezType) {
      case PezType.Action:
        this.isAction = true;
        break;
      case PezType.Comment:
        this.isComment = true;
        break;
      case PezType.UserInteraction:
        this.isUserInteraction = true;
        break;
      default:
        this.isAction = true;
    }
  }
}
