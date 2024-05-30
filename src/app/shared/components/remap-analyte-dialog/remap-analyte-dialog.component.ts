// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BrDialogComponent } from 'br-component-library';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import * as fromRoot from '../../../state/app.state';
import * as sharedStateSelector from '../../../shared/state/selectors';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { NavigationService } from '../../navigation/navigation.service';
import { LabLocation } from '../../../contracts/models/lab-setup';

@Component({
  selector: 'unext-remap-analyte-dialog',
  templateUrl: './remap-analyte-dialog.component.html',
  styleUrls: ['./remap-analyte-dialog.component.scss']
})
export class RemapAnalyteDialogComponent extends BrDialogComponent implements OnInit {
  labLocation: LabLocation;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.publish[24],
  ];

  public getCurrentLabLocation$ = this.store.select(sharedStateSelector.getCurrentLabLocation);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RemapAnalyteDialogComponent>,
    private iconService: IconService,
    private navigationService: NavigationService,
    private errorLoggerService: ErrorLoggerService,
    private store: Store<fromRoot.State>,
  ) {
    super(data);
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.RemapAnalyteDialogComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit(): void {
    this.getCurrentLabLocation$.pipe(filter(location => !!location), take(1))
      .subscribe(location => {
        if (location) {
          this.labLocation = location;
        }
      });
  }

  navigateToMapping() {
    this.navigationService.routeToMapping(this.labLocation.parentNodeId);
  }

  onSubmit() {
    this.dialogRef.close(true);
  }
}
