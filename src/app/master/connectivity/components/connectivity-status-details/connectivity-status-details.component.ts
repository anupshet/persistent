/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { ImportStatus, ConnectivityDetailStatusEnum, ConnectivityStatusPipelineEnum } from '../../shared/models/connectivity-status.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { connectivityDateTimeFormat } from '../../../../core/config/constants/general.const';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { ErrorLogService } from '../../shared/services/error-log.service';
import { HeaderService } from '../../shared/header/header.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { blankSpace } from '../../../../core/config/constants/general.const';
import { MultipleFilesVerbiage } from '../../shared/models/import-status.const';

@Component({
  selector: 'unext-connectivity-status-details',
  templateUrl: './connectivity-status-details.component.html',
  styleUrls: ['./connectivity-status-details.component.scss']
})
export class ConnectivityStatusDetailsComponent implements OnInit {
  _importStatus: ImportStatus;
  get importStatus(): ImportStatus {
    return this._importStatus;
  }

  @Input('importStatus')
  set importStatus(value: ImportStatus) {
    this._importStatus = value;
  }

  @Input() timeZone: string;
  @Input() index: any;
  @Output() emitterObjectRefresh = new EventEmitter<string>();

  public status: ConnectivityDetailStatusEnum;
  readonly statusType = ConnectivityDetailStatusEnum;
  public emitterObjectId = new EventEmitter<ImportStatus>();
  public pending: number;
  isIntructionsActive: boolean;
  isStatusActive: boolean;
  isUploadActive: boolean;
  isMappingActive: boolean;
  permissions = Permissions;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.statusDone[32],
    icons.statusRefresh[32]
  ];

  constructor(
    private iconService: IconService,
    private dateTimeHelper: DateTimeHelper,
    private errorLogService: ErrorLogService,
    private brPermissionsService: BrPermissionsService,
    private _headerService: HeaderService,
    private orchestratorApiService: OrchestratorApiService,
    private messageSnackBar: MessageSnackBarService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    if (this.importStatus.status === ConnectivityStatusPipelineEnum.ImportStatusUploadFailed ||
      this.importStatus.status === ConnectivityStatusPipelineEnum.ImportStatusParsingErrored ||
      this.importStatus.status === ConnectivityStatusPipelineEnum.ImportStatusBidirectionalUploadFailed ||
      this.importStatus.status === ConnectivityStatusPipelineEnum.ImportStatusBidirectionalParsingErrored) {
      this.status = this.statusType.FileUploadError;
    } else if (this.importStatus.processedDateTime && this.importStatus.errorCount && this.importStatus.errorCount > 0) {
      this.status = this.statusType.Detail;
    } else if (this.importStatus.processedDateTime && !this.importStatus.errorCount) {
      this.status = this.statusType.Done;
    } else {
      this.status = this.statusType.Refresh;
    }
    this.pending = this.importStatus.totalCount - this.importStatus.processedCount -
      this.importStatus.disabledCount - this.importStatus.errorCount;
  }

  getTimezoneFormattedDateTime(date: Date) {
    const dateTimeFormat = connectivityDateTimeFormat;
    return this.dateTimeHelper.ConvertToDateFromDate(date, this.timeZone);
  }

  emitDataRefresh() {
    const emitData = null;
    this.emitterObjectRefresh.emit(emitData);
  }

  emitData() {
    const emitData = this.importStatus.id;
    this.errorLogService.showDetailsId.emit(emitData.toString());
    this.emitterObjectId.emit(this.importStatus);
  }

  downloadStatusFile() {
    this.orchestratorApiService.getLogRecordFileUrlById(this._importStatus.id).then(response => {
      if (response !== undefined && response.statusFileUrl !== undefined && response.statusFileUrl !== '') {
        this.downloadFileFromUrl(response.statusFileUrl);
      } else {
        this.messageSnackBar.showMessageSnackBar(this.getDownloadErrorMessage());
      }
    }, error => {
      if (error.error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, this.getDownloadErrorMessage(),
            componentInfo.ConnectivityStatusDetailsComponent + blankSpace + Operations.OnDownloadingFileError));

        this.messageSnackBar.showMessageSnackBar(this.getDownloadErrorMessage());
      }
    });
  }

  getDownloadFilename() {
    if (this._importStatus.fileNames.length === 1) {
      return this._importStatus.fileNames[0];
    }
    return MultipleFilesVerbiage;
  }

  showDownloadButton() {
    return this._importStatus.fileNames.length > 0 && this._importStatus.isDownloadable;
  }

  private getDownloadErrorMessage(): string {
    return this.getTranslation('CONNECTIVITYSTATUS.FILEDOWNLOADERROR');
  }

  downloadFileFromUrl(url: string) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.click();
    anchor.remove();
  }

  routeToConnectivityMapping() {
    this._headerService.setDialogComponent('mapping');
  }

  // checking permissions
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  reset() {
    this.isIntructionsActive = false;
    this.isStatusActive = false;
    this.isUploadActive = false;
    this.isMappingActive = false;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
