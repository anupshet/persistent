//  © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { groupBy, cloneDeep } from 'lodash';
import { takeUntil, filter, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { ImportStatus, ImportError } from '../../../shared/models/connectivity-status.model';
import { ImportStatusParam } from '../../../shared/models/connectivity-status.model';
import { errorCodePrefix, groupByKey, analyteRemovedHeirarchyPath } from '../../../../../core/config/constants/general.const';
import * as actions from '../../../state/actions';
import * as fromConnectivity from '../../../state';
import * as connectivityStateSelector from '../../../state/selectors';
import { ErrorLogService } from '../../../shared/services/error-log.service';
import { ConnErrorType } from '../../../../../contracts/enums/error-type.enum';
@Component({
  selector: 'unext-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss']
})
export class ErrorLogComponent implements OnInit {
  _importStatus: ImportStatus;
  get importStatus(): ImportStatus {
    return this._importStatus;
  }
  @Input() emitterObjectId: EventEmitter<any> = new EventEmitter<any>();
  public statusId: any;
  public showDetailsId: any;
  public ImportStatus: any;
  protected destroy$ = new Subject<boolean>();

  public groupedObject;
  public detailsFlag = false;
  public importStatusData: any;
  public errorTitle: string;
  public errorDetails: string;
  public importError = ConnErrorType.ImportError;
  constructor(
    private subStore: Store<fromConnectivity.ConnectivityStates>,
    private errorLogService: ErrorLogService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.groupedObject = {};
    this.statusId = 'initialValue';
    this.emitterObjectId.subscribe((data: { toString: () => any; }) => {
      this.importStatusData = data;
      this.statusId = data['id'].toString();
      if (this.importStatusData?.connErrorType === this.importError && this.importStatusData?.errorCount > 0) {
        this.ImportStatus = this.getImportStatusDetails(this.statusId);
      } else if (((this.importStatusData?.connErrorType === this.importError && this.importStatusData?.errorCount === 0)
        || this.importStatusData?.connErrorType !== null) &&
        this.importStatusData?.connErrorCode !== null) {
        this.detailsFlag = true;
        this.errorTitle = this.importStatusData?.connErrorType;
        const translatedErrorTitle = 'CONNECTIVITYERRORS.' + this.errorTitle.replace(/\s/g, '').toUpperCase();
        this.errorTitle = this.getTranslation(translatedErrorTitle);
        this.errorDetails = this.importStatusData?.connErrorCode;
        const translatedErrorMsg = 'CONNECTIVITYERRORS.' + this.errorDetails.replace(/\s/g, '').toUpperCase();
        this.errorDetails = this.getTranslation(translatedErrorMsg);
        this.populateTranslatedErrors(this.ImportStatus?.errorList);
      }
    });

    this.errorLogService.showDetailsId.subscribe((data: any) => {
      this.showDetailsId = data;
    });
  }

  getImportStatusDetails(objectId: string) {
    if (objectId) {
      const importStatusParam: ImportStatusParam = {
        objectId: objectId
      };
      this.subStore.dispatch(actions.connectivityActions.getImportStatusDetails({ importStatusParam }));
      this.subStore.pipe(select(connectivityStateSelector.getImportStatusDetails))
        .pipe(filter((hasData) => !!hasData), takeUntil(this.destroy$))
        .subscribe((statusDetails) => {
          this.detailsFlag = false;
          if (statusDetails && this.showDetailsId === statusDetails.statuses[0].id) {
            this.ImportStatus = statusDetails.statuses[0];
            this.detailsFlag = true;
            this.errorTitle = this.importStatusData?.connErrorType;
            const translatedErrorTitle = 'CONNECTIVITYERRORS.' + this.errorTitle.replace(/\s/g, '').toUpperCase();
            this.errorTitle = this.getTranslation(translatedErrorTitle);
            this.populateTranslatedErrors(this.ImportStatus.errorList);
          }
        });

    }
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  populateTranslatedErrors(errorList) {
    if (errorList) {
      const tempErrorlist = cloneDeep(errorList);

      tempErrorlist.map((error: ImportError) => {
        if (error.hierarchyPath.toUpperCase() === analyteRemovedHeirarchyPath) {
          error.hierarchyPath = this.getTranslation('ERRORLOG.ANALYTEREMOVED');
        }
        const errorId = error.processingErrorId;
        const translateErrorCode = 'ERRORLOG.' + errorCodePrefix + errorId;
        const errorMsg = this.getTranslation(translateErrorCode);
        error.details = errorMsg.toString();
        this.errorDetails = error.details;
      });

      this.groupedObject = this.getErrorsGroupByKey(tempErrorlist);
    }
  }

  getErrorsGroupByKey(errorList: Array<ImportError>) {
    const result = groupBy(errorList, groupByKey);
    return result;
  }

  close() {
    this.showDetailsId = '';
  }
}
