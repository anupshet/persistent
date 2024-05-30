// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LabLotTest, SlideGenSchedule } from '../../shared/models/lab-lot-test.model';

@Component({
  selector: 'unext-connectivity-scheduler',
  templateUrl: './connectivity-scheduler.component.html',
  styleUrls: ['./connectivity-scheduler.component.scss']
})
export class ConnectivitySchedulerComponent implements OnInit {

  @Input() disableUploadButton: boolean;
  @Input() analytes: Array<LabLotTest>;
  @Input() labLocationId: string;
  @Output() goBack = new EventEmitter();
  @Output() upload: EventEmitter<Array<SlideGenSchedule>> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public onBackClicked(): void {
    this.goBack.emit();
  }

  public onUpload(slideGenSchedules: Array<SlideGenSchedule>): void {
    this.upload.emit(slideGenSchedules);
  }
}
