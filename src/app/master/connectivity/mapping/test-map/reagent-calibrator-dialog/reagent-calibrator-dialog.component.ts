// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ReagentCalibratorDialogService } from './reagent-calibrator-dialog.service';
import { ReagentCalibratorDialogData } from '../../../../../contracts/models/connectivity-map/reagent-calibrator-dialog-data.model';

@Component({
  selector: 'unext-reagent-calibrator-dialog',
  templateUrl: './reagent-calibrator-dialog.component.html',
  styleUrls: ['./reagent-calibrator-dialog.component.scss']
})
export class ReagentCalibratorDialogComponent implements OnInit {
  lotForm: FormGroup;
  availableReagentCodes: any;
  sortedReagentLots = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReagentCalibratorDialogData,
    private reagentCalibratorDialogService: ReagentCalibratorDialogService,
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<ReagentCalibratorDialogComponent>
  ) { }

  ngOnInit(): void {
    this.getReagentLotCodes();

    this.lotForm = new FormGroup({
      reagentLots: this._fb.array([]),
      selectedCalibratorLotId: new FormControl()
    });
    this.addReagentLotsData();
  }

  createNewReagentLots(data: Array<any>): FormGroup {
    return this._fb.group({
      reagentLotCode: [data ? data : ''],
      reagentLotId: ['', [Validators.required]]
    });
  }

  get reagentLots(): FormArray {
    return this.lotForm.get('reagentLots') as FormArray;
  }

  addReagentLotsData() {
    if (this.availableReagentCodes && this.availableReagentCodes.length > 0) {
      this.availableReagentCodes.forEach(ele => {
        this.reagentLots.push(this.createNewReagentLots(ele));
      });
    } else {
      this.createNewReagentLots(null);
    }
  }

  calibratorLotCodeExists(): boolean {
    return this.reagentCalibratorDialogService.calibratorLotCodeExists(
      this.data.chip.calibratorLotCodes);
  }

  reagentLotCodeExists(): boolean {
    return this.reagentCalibratorDialogService.reagentLotCodeExists(
      this.data.chip.reagentLotCodes);
  }

  bothLotCodesExist(): boolean {
    return this.reagentCalibratorDialogService.bothLotCodesExist(
      this.data.chip.calibratorLotCodes,
      this.data.chip.reagentLotCodes
    );
  }

  noLotCodesExist(): boolean {
    return this.reagentCalibratorDialogService.noLotCodesExist(
      this.data.chip.calibratorLotCodes,
      this.data.chip.reagentLotCodes
    );
  }

  onlyCalibratorLotCodeExists(): boolean {
    return this.reagentCalibratorDialogService.onlyCalibratorLotCodeExists(
      this.data.chip.calibratorLotCodes,
      this.data.chip.reagentLotCodes
    );
  }

  onlyReagentLotCodeExists(): boolean {
    return this.reagentCalibratorDialogService.onlyReagentLotCodeExists(
      this.data.chip.calibratorLotCodes,
      this.data.chip.reagentLotCodes
    );
  }

  // this is returning one result for base. Should return multiple later on.
  getCalibratorLotCode(): string {
    return this.reagentCalibratorDialogService.getCalibratorLotCode(this.data);
  }

  getReagentLotCodes() {
    // sorted reagent lots list
    this.sortedReagentLots = this.data.testCard.reagentLots?.sort((a, b) => (a.lotNumber).localeCompare(b.lotNumber)); // Sorted ReagentLots List
    const data = this.reagentCalibratorDialogService.getReagentLotCode(this.data);
    this.availableReagentCodes = [];
    data.forEach(el => {
      this.availableReagentCodes.push(el.code);
    });
  }

  submitLotForm(): void {
    if (this.lotForm.valid) {
      this.dialogRef.close({
        selectedReagentLotId: this.lotForm.value.reagentLots,
        selectedCalibratorLotId: this.lotForm.value.selectedCalibratorLotId,
        calibratorLotCode: this.getCalibratorLotCode(),
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
