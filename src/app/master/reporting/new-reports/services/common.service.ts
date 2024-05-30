// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentType } from '@angular/cdk/portal';
import { ComponentRef, Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { blankSpace } from '../../../../core/config/constants/general.const';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { DialogButtons, ReportDialogType, TypeOfDialog } from '../../models/report-dialog';
import {
  AnalyteResponse, ControlResponse, DepartmentResponse, GroupControlResponse, GroupInstrumentResponse,
  InstrumentResponse, LabConfigResponse
} from '../../models/report-info';
import { LabConfig } from '../../reporting.enum';


@Injectable()
export class CommonService {
  private destroy$ = new Subject<boolean>();
  constructor(
    private dialog: MatDialog,
    private errorLoggerService: ErrorLoggerService,
  ) {
  }

  dataFilter(type: string, labConfigData: LabConfigResponse) {
    let filter = null;
    let isChecked: boolean = null;
    switch (type) {
      case LabConfig.department:
        isChecked = labConfigData?.departments?.some(department => department.isChecked);
        filter = isChecked ? ((element: DepartmentResponse) => element.isChecked) : ((element: DepartmentResponse) => !element.isFiltered);
        break;
      case LabConfig.analyte:
        isChecked = labConfigData?.analytes?.some(analyte => analyte.isChecked);
        filter = isChecked ? ((element: AnalyteResponse) => element.isChecked) : ((element: AnalyteResponse) => !element.isFiltered);
        break;
      case LabConfig.instrument:
        isChecked = labConfigData?.instruments?.some(instrument => instrument.isChecked);
        filter = isChecked ? ((element: GroupInstrumentResponse) => element.groups.filter(group => group.isChecked)) :
          ((element: GroupInstrumentResponse) => element.groups.filter(group => !group.isFiltered));
        break;
      case LabConfig.control:
        isChecked = labConfigData?.controls?.some(control => control.isChecked);
        filter = isChecked ? ((element: GroupControlResponse) => element.groups.filter(group => group.isChecked)) :
          ((element: GroupControlResponse) => element.groups.filter(group => !group.isFiltered));
        break;
    }
    return filter;
  }

  filterLabConfigData(labConfigData: LabConfigResponse) {
    let _filter = this.dataFilter(LabConfig.department.toString(), labConfigData);
    let departmentList = labConfigData?.departments?.filter(_filter);
    _filter = this.dataFilter(LabConfig.analyte.toString(), labConfigData);
    let analyteList = labConfigData?.analytes?.filter(_filter);
    _filter = this.dataFilter(LabConfig.instrument.toString(), labConfigData);
    let instrumentList = labConfigData?.instruments?.map<InstrumentResponse>(_filter).flat();
    _filter = this.dataFilter(LabConfig.control.toString(), labConfigData);
    let controlList = labConfigData?.controls?.map<ControlResponse>(_filter).flat();
    let isSelectionValid = true;
    let canProceed = true;
    const isGroupByDept = labConfigData.locations.find((location, index) => index === 0).instrumentGroupByDept;
    if (isGroupByDept) {
      instrumentList = instrumentList?.filter((instrument, index) => {
        const isMatch = departmentList?.some(department => department.id === instrument.parentId);
        if (!isMatch) {
          isSelectionValid = false;
        }
        return isMatch;
      });
    }
    controlList = controlList?.filter((control, index) => {
      const isMatch = instrumentList.some(instrument => instrument.id === control.parentId);
      if (!isMatch) {
        isSelectionValid = false;
      }
      return isMatch;
    });
    analyteList = analyteList?.filter((analyte, index) => {
      const isMatch = controlList.some(control => analyte.parentId?.indexOf(control.id) >= 0);
      if (!isMatch) {
        isSelectionValid = false;
      }
      return isMatch;
    });

    controlList = controlList?.filter((control, index) => {
      const isMatch = analyteList.some(analyte => analyte.parentId?.indexOf(control.id) >= 0);
      if (!isMatch) {
        isSelectionValid = false;
      }
      return isMatch;
    });
    instrumentList = instrumentList?.filter((instrument, index) => {
      const isMatch = controlList.some(control => control.parentId === instrument.id);
      if (!isMatch) {
        isSelectionValid = false;
      }
      return isMatch;
    });
    if (isGroupByDept) {
      departmentList = departmentList?.filter((department, index) => {
        const isMatch = instrumentList.some(instrument => instrument.parentId === department.id);
        if (!isMatch) {
          isSelectionValid = false;
        }
        return isMatch;
      });
    }
    if ((isGroupByDept && departmentList?.length === 0) || instrumentList?.length === 0 || controlList?.length === 0 ||
          analyteList?.length === 0) {
      canProceed = false;
    }
    const response = {
      'departmentList': departmentList?.map(element => element.id),
      'instrumentList': instrumentList?.map(element => element.id),
      'controlList': controlList?.map(element => element.id),
      'analyteList': analyteList?.map(element => element.analyteId),
      'directionIndex': labConfigData.directionIndex,
      isSelectionValid,
      canProceed
    };
    return response;
  }

  openSelectionsDialog(dialogRef: MatDialogRef<any>, componentRef: ComponentType<any>, dialogType: TypeOfDialog, messageContent: string[],
    buttons: DialogButtons[], dialogFullWidth: boolean, action?: string): Promise<boolean> {
    const dialogMessageContent: ReportDialogType = {
      dialogType: dialogType,
      messageContent: messageContent,
      simpleMessageList: dialogType === TypeOfDialog.SimpleBlock ? messageContent : null,
      fullwidth: dialogFullWidth,
      buttonsList: buttons
    };
    return new Promise<boolean>((resolve, reject) => {

      let isContinue = false;
      dialogRef = this.dialog.open(componentRef, {
        panelClass: ['report-generic-container'],
        data: dialogMessageContent,
        autoFocus: false
      });
      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$))
        .subscribe(value => {
          if (!value['buttonIndex']) {
            isContinue = true;
          }
          resolve(isContinue);
        }, (err) => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.LabconfigSelectionComponent + blankSpace + Operations.CloseDialog)));
          reject(err);
        });
    });
  }
}
