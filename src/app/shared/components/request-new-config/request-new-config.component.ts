import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as ngrxStore from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil, filter, flatMap, take } from 'rxjs/operators';
import { BrDialogComponent } from 'br-component-library';

import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { RequestNewConfigEmailService } from '../request-new-config-email.service';
import { UploadConfigFileService } from '../upload-config-file/upload-config-file.service';
import { RequestNewConfigHelperService } from '../request-new-config-helper.service';
import { FileInfo, PresignedUrls, NewConfiguration, RequestConfiguration } from './new-configuration.model';
import { RequestNewConfigMessageComponent } from '../request-new-config-message/request-new-config-message.component';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import * as fromRoot from '../../../state/app.state';
import * as fromLocation from '../../state/selectors';
import { LabLocation } from '../../../contracts/models/lab-setup';
import { AppLoggerService } from '../../services/applogger/applogger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';

@Component({
  selector: 'unext-request-new-config',
  templateUrl: './request-new-config.component.html',
  styleUrls: ['./request-new-config.component.scss']
})
export class RequestNewConfigComponent extends BrDialogComponent implements OnInit, OnDestroy {
  public icons = icons;
  public iconsUsed: Array<Icon> = [
    icons.close[48]
  ];
  public isValid = false;
  public isProcessing = false;
  private newConfig = new NewConfiguration();
  protected cleanUp$ = new Subject<boolean>();
  public fileInfo: Array<FileInfo> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RequestNewConfigComponent>,
    public dialog: MatDialog,
    private messageSnackBar: MessageSnackBarService,
    private sendEmailService: RequestNewConfigEmailService,
    private uploadConfigService: UploadConfigFileService,
    private requestNewConfigHelper: RequestNewConfigHelperService,
    private store: ngrxStore.Store<fromRoot.State>,
    private iconService: IconService,
    private appLogger: AppLoggerService,
    private errorLoggerService: ErrorLoggerService
  ) {
    super(data);
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.RequestNewConfigComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit() {
    try {
      this.uploadConfigService.isValid.pipe(takeUntil(this.cleanUp$)).subscribe(
        isValid => (this.isValid = isValid)
      );
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.RequestNewConfigComponent + blankSpace + Operations.OnInit)));
    }
  }

  onSubmit() {
    try {
      if (this.isValid) {
        this.isProcessing = true;
        this.sendEmailService.requestUrls(this.uploadConfigService.fileNames).pipe(
          filter((presignedUrls) => !!presignedUrls), take(1),
          flatMap(async (presignedUrls: Array<PresignedUrls>) => {
            return await this.uploadFiles(presignedUrls);
          }),
          flatMap(() => this.store.pipe(ngrxStore.select(fromLocation.getCurrentLabLocation))),
          flatMap((locationState) => {
            return this.setRequesterAndSendEmail(locationState);
          }), takeUntil(this.cleanUp$))
          .subscribe(() => {
            this.isProcessing = false;
            this.showMessageSnackBar();
          }, ex => {
            this.isProcessing = false;
            this.appLogger.log(`An error occurred ${ex.message}`);
          });
      } else {
        this.uploadConfigService.showErrorMessage.next(true);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.RequestNewConfigComponent + blankSpace + Operations.OnSubmit)));
    }

  }

  public uploadFiles(presignedUrls: Array<PresignedUrls>): Promise<any> {
    return new Promise(resolve => {
      (async () => {
        await this.uploadEach(this.uploadConfigService.files, async (item) => {
          const presignedUrl = presignedUrls.filter((details) => details.fileName === item.name);
          const detail = new FileInfo();
          await this.sendEmailService.sendFile(presignedUrl[0].url, item);
            detail.fileName = presignedUrl[0].fileName;
            detail.entityId = presignedUrl[0].entityId;
            detail.contentType = item.type;
            this.fileInfo.push(detail);
        });
        resolve(true);
      })();
    });
  }

async uploadEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i]);
  }
}

setRequesterAndSendEmail(location: LabLocation) {
  const requestConfig = new RequestConfiguration();
  this.requestNewConfigHelper.setRequesterData(location);
  this.newConfig.requester = this.requestNewConfigHelper.getRequester();
  requestConfig.data = { ...this.newConfig };
  requestConfig.templateId = this.data.templateId;
  requestConfig.files = this.fileInfo;
  return this.sendEmailService.requestFileUpload(
    requestConfig
  );
}

showMessageSnackBar() {
  this.messageSnackBar.openFromComponent(
    RequestNewConfigMessageComponent,
    5000,
    'top',
    'right',
    'request-new-config',
    {
      numberOfFiles: this.uploadConfigService.numberOfFiles,
      name: this.data.name
    }
  );

  this.dialog.closeAll();
  this.closeDialog();
}

closeDialog() {
  try {
    this.dialogRef.close();
  } catch (err) {
    this.errorLoggerService.logErrorToBackend(
      this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
        (componentInfo.RequestNewConfigComponent + blankSpace + Operations.CloseDialog)));
  }
}

ngOnDestroy() {
  this.cleanUp$.next(true);
  this.cleanUp$.unsubscribe();
}
}
