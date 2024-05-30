// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as ngrxStore from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { BrDialogComponent, DialogResult } from 'br-component-library';

import {
  ParsingInfo,
} from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { ParsingEngineService } from '../../../../shared/services/parsing-engine.service';
import { HeaderService } from '../../shared/header/header.service';
import { InstructionsService } from '../instructions.service';
import * as fromConnectivity from '../../state';
import * as actions from '../../state/actions';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';


@Component({
  selector: 'unext-instructions-table',
  templateUrl: './instructions-table.component.html',
  styleUrls: ['./instructions-table.component.scss']
})
export class InstructionsTableComponent implements OnInit, OnDestroy {

  @Input() accountId: string;
  @Input() displayInstructionsList: boolean;
  @Input() displayInstructionsForm2: boolean;
  @Input() labLocationId: string;

  private destroy$ = new Subject<boolean>();
  private deleteDialogRef: MatDialogRef<BrDialogComponent, any> = null;

  instructionSet: ParsingInfo;
  selectedRow: number;
  displayInstructionsForm: boolean;
  uploadDialog: boolean;
  updateForm: boolean;
  isEdit: boolean;
  selectedInstruction: string;
  selectedInstructionName: string;
  existingInstructionNames: string[];

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.delete[24],
    icons.addCircleOutline[24]
  ];

  constructor(
    private instructionsService: InstructionsService,
    private dialog: MatDialog,
    private parsingEngineService: ParsingEngineService,
    private _headerService: HeaderService,
    private store: ngrxStore.Store<fromConnectivity.ConnectivityStates>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.parsingEngineService
      .getInstructions(this.labLocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(instruction => {
        this.instructionSet = instruction;
        this.instructionSet.configs = instruction.configs;
        if (this.instructionSet.configs.length >= 1) {
          this._headerService.setMenuOptions(true);
          this.store.dispatch(actions.connectivityActions.SetHasInstructions({ payload: true }));
        } else {
          this._headerService.setMenuOptions(false);
          this.store.dispatch(actions.connectivityActions.ClearHasInstructions({ payload: false }));
        }

        this.existingInstructionNames = [];
        this.instructionSet.configs.forEach((instruction) => {
          this.existingInstructionNames.push(instruction.name);
        });
      });

    if (this.displayInstructionsForm2) {
      this.onCreateInstruction();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setClickedRow(selectedRowIndex): void {
    this.selectedRow = selectedRowIndex;
  }

  openDeleteInstructionDialog(selectedConfig) {
    try {
      this.deleteDialogRef = this.dialog.open(BrDialogComponent, {
        data: {
          title: this.getTranslations('TRANSLATION.SURE'),
          cancelButton: this.getTranslations('TRANSLATION.CANCEL'),
          confirmButton: this.getTranslations('TRANSLATION.CONFIRMDELETE')
        }
      });


      const onButtonClick = this.deleteDialogRef.componentInstance.buttonClicked.subscribe(
        dialogResult => {
          switch (dialogResult) {
            case DialogResult.OK:
              return this.deleteInstruction(selectedConfig);
            case DialogResult.Cancel:
              return this.deleteDialogRef.close();
            default:
              return DialogResult.None;
          }
        },
        error => { },
        this.deleteDialogRef.afterClosed().subscribe(() => {
          onButtonClick.unsubscribe();
        })
      );
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.InstructionsTableComponent + blankSpace + Operations.OpenInstructionsDeleteDialog));
    }
  }
  deleteInstruction(selectedConfig) {
    const data = {
      "AccountId": this.accountId
    }
    this.parsingEngineService
      .removeInstructions(selectedConfig.id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {
          const index = this.instructionSet.configs.findIndex(
            i => i['id'] === selectedConfig.id
          );
          this.instructionSet.configs.splice(index, 1);
          this.deleteDialogRef.close();
        },
        error => {
          if (error.error && error.error.status === 'error') {
          }
        }
      );
    if (this.instructionSet.configs.length <= 1) {
      this._headerService.setMenuOptions(false);
    }
  }

  onCreateInstruction() {
    this.displayInstructionsForm = !this.displayInstructionsForm;
    this.instructionsService.disableNextBtn();
  }

  updateInstructions(selectedInstruction) {
    this.updateForm = !this.updateForm;
    this.isEdit = true;
    this.selectedInstruction = selectedInstruction.id;
    this.selectedInstructionName = selectedInstruction.name;
  }

  onCancel() {
    this.uploadDialog = !this.uploadDialog;
  }

  private getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
