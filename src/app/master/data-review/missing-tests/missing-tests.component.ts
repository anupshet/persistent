// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { PaginationInstance } from 'ngx-pagination';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { MissingTest, MissingTestPayload, MissingTestPopupData, MissingTestResponseData, 
  MissingTestUpdateData, ReviewPaginationParams } from '../../../contracts/models/data-review/data-review-info.model';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { componentInfo,Operations } from '../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { icons } from '../../../core/config/constants/icon.const';
import { blankSpace, displayName, missingTestPageItemsPerPage, 
  pageItemsDisplay, paginationMissingTests } from '../../../../app/core/config/constants/general.const';
import { DataReviewService } from '../../../shared/api/data-review.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { AuditTrail, AuditTrackingAction, AuditTrackingActionStatus, AppNavigationTracking } from '../../../../app/shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';

@Component({
  selector: 'unext-missing-tests',
  templateUrl: './missing-tests.component.html',
  styleUrls: ['./missing-tests.component.scss']
})
export class MissingTestsComponent implements OnInit {
  totalPages: number = 0;
  totalItems: number = 0;
  readonly maxSize = pageItemsDisplay;
  icons = icons;
  //Pagination is applied on mock data for now and when the API will be ready we can replace it and integrate the API.
  paginationConfig: PaginationInstance = {
    id:paginationMissingTests,
    itemsPerPage: missingTestPageItemsPerPage,
    currentPage: 1,
    totalItems: 1
  };
  iconsUsed: Array<Icon> = [
    icons.close[24]
  ];
  displayedColumns: string[] = ['departmentName', 'instrumentName', 'controlName', 'lot', 'analyteName', 'level'];
  dataSource: MissingTest[] = [];
  labLocationId: string;
  reviewType: number;
  labDepartments: Array<string> = [];
  labInstruments: Array<string> = [];
  labPanels: Array<string> = [];

  constructor(public dialogRef: MatDialogRef<MissingTestsComponent>, 
    @Inject(MAT_DIALOG_DATA) private _data: MissingTestPopupData,
    private dataReviewApiService: DataReviewService,
    private errorLoggerService: ErrorLoggerService,
    private appNavigationTrackingService: AppNavigationTrackingService) {}

  ngOnInit(): void {
    this.dataSource = this._data.response.missingTests;
    this.labLocationId = this._data.labLocationId;
    this.reviewType = this._data.reviewType;
    this.labDepartments = this._data.labDepartments;
    this.labInstruments = this._data.labInstruments;
    this.labPanels = this._data.labPanels;
    this.totalItems = this.paginationConfig.totalItems = this._data.response.paginationParams.totalItems;
    this.paginationConfig.itemsPerPage = missingTestPageItemsPerPage;
    this.totalPages = this._data.response.paginationParams.totalPages;
    this.paginationConfig.currentPage = this.paginationConfig.currentPage <= this.totalPages ? this.paginationConfig.currentPage : 1;

    if (!this._data.instrumentsGroupedByDept) {
      this.displayedColumns.splice(0, 1);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onPageChange(dataReviewPageIndex: number) {
    this.paginationConfig.currentPage = dataReviewPageIndex;
    const paginationParams = new ReviewPaginationParams();
    paginationParams.searchString = '';
    paginationParams.searchColumn = 1;
    paginationParams.sortColumn = 1;
    paginationParams.sortDescending = false;
    paginationParams.pageIndex = dataReviewPageIndex - 1;
    paginationParams.pageSize = missingTestPageItemsPerPage;
    let payload: MissingTestPayload = {
      paginationParams: paginationParams,
      labLocationId: this.labLocationId,
      reviewType: this.reviewType,
      labDepartments: this.labDepartments,
      labInstruments: this.labInstruments,
      labPanels: this.labPanels
    }
    this.dataReviewApiService.getMissingTests(payload)
      .pipe(take(1))
      .subscribe((res) => {
        if(res.missingTests !== null) {
          this.dataSource = res.missingTests;
        }
      },
      error => {
        if (error.error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              (componentInfo.MissingTestsComponent + blankSpace + Operations.GetMissingTestsData)));
        }
      });
  }

  sendData(){
    const paginationParams = new ReviewPaginationParams();
    paginationParams.searchString = '';
    paginationParams.searchColumn = 1;
    paginationParams.sortColumn = 1;
    paginationParams.sortDescending = false;
    paginationParams.pageIndex = 0;
    paginationParams.pageSize = this.totalItems;
    let payload: MissingTestPayload = {
      paginationParams: paginationParams,
      labLocationId: this.labLocationId,
      reviewType: this.reviewType,
      labDepartments: this.labDepartments,
      labInstruments: this.labInstruments,
      labPanels: this.labPanels
    }
    this.dataReviewApiService.getMissingTests(payload)
      .pipe(take(1))
      .subscribe((res: MissingTestResponseData) => {
        if(res.missingTests !== null) {
          let labLotTestIds = [];
          for(const item of res.missingTests) {
            labLotTestIds.push(item.labLotTestId);
          }
          if(labLotTestIds.length > 0) {
            this.submitMissingTestsData(labLotTestIds);
          }
        }
      },
      error => {
        if (error.error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              (componentInfo.MissingTestsComponent + blankSpace + Operations.GetMissingTestsData)));
        }
      });
  }

  submitMissingTestsData(labLotTestIds) {
    const auditTrail: AuditTrail = {
      eventType: AuditTrackingAction.MissingTests,
      action: AuditTrackingAction.Create,
      actionStatus: AuditTrackingActionStatus.Success,
      currentValue: {
        labLotTestIds
      }
    };
    const appNavigationTracking: AppNavigationTracking = {
      auditTrail: auditTrail
    }
    const auditNavTracking = this.appNavigationTrackingService.prepareAuditTrailPayload(appNavigationTracking);
    const payLoad: MissingTestUpdateData = {
      labLocationId: this.labLocationId,
      labLotTestIds: labLotTestIds,
      time: new Date().toISOString(),
      AuditDetails: auditNavTracking
    }
    this.dataReviewApiService.saveMissingTests(payLoad)
      .pipe(take(1))
      .subscribe((response) => {
        if(response.statusText == "OK") {
          this.dialogRef.close(true);
        }
      },
      error => {
        if (error.error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              (componentInfo.MissingTestsComponent + blankSpace + Operations.SaveMissingTestsData)));
        }
      });
  }
}
