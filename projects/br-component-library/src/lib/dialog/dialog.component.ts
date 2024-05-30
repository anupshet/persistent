import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogResult } from '../contracts/enums/dialog-result';

@Component({
  selector: 'br-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class BrDialogComponent implements OnInit {
  @Input() title?: string;
  @Input() subTitle?: string;
  @Input() cancelButtonLabel?: string;
  @Input() confirmButtonLabel?: string;
  @Input() xButton = true;
  @Output() buttonClicked = new EventEmitter<DialogResult>();
  public dialogResult = DialogResult;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.title) {
      this.title = this.data.title;
    }
    if (this.data.subTitle) {
      this.subTitle = this.data.subTitle;
    }
    if (this.data.cancelButton) {
      this.cancelButtonLabel = this.data.cancelButton;
    }
    if (this.data.confirmButton) {
      this.confirmButtonLabel = this.data.confirmButton;
    }
    this.xButton = this.data.xButton;
  }

  onClick(dialogResult: DialogResult) {
    this.buttonClicked.emit(dialogResult);
  }
}
