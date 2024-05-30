// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DialogResult } from '../contracts/enums/dialog-result';

@Component({
  selector: 'br-entry-save',
  templateUrl: './entry-save.component.html',
  styleUrls: ['./entry-save.component.scss']
})
export class BrEntrySaveComponent implements OnInit {

  @Input() translationLabels: any;
  @Input() defaultDate: Date;
  @Input() displayTime = true;
  @Input() enableSubmit: boolean;
  @Input() enableCancel: boolean;
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() entryViewStyle = true;
  @Input() showDatePicker = false;
  @Input() showChangeDateButton = false;
  @Input() timeZone: string;
  @Input() currentLanguage: string;
  @Input() isDisabled: boolean;
  @Output() cancelEvent = new EventEmitter<DialogResult>();
  @Output() submitEvent = new EventEmitter<DialogResult>();
  @Output() dateTime = new EventEmitter<Date>();

  public isTimeInputValid = true;

  constructor() { }

  ngOnInit() {}

  public submit(): void {
    this.enableSubmit = false;
    this.submitEvent.emit(DialogResult.OK);
  }

  public cancel(): void {
    this.cancelEvent.emit(DialogResult.Cancel);
  }

  public dateChanged(selectedDate: Date): void {
    this.dateTime.emit(selectedDate);
  }

  public setTimeInputValid(value: boolean) {
    this.isTimeInputValid = value;
  }
}
