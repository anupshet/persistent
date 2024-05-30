import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import { UploadConfigFileService } from './upload-config-file.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { maxFileSizeLimit } from '../../../core/config/constants/general.const';
import { FileName } from './upload-config-file.model';


@Component({
  selector: 'unext-upload-config-file',
  templateUrl: './upload-config-file.component.html',
  styleUrls: ['./upload-config-file.component.scss']
})
export class UploadConfigFileComponent implements OnInit, OnDestroy {
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.publish[48],
    icons.close[18]

  ];
  files = [];
  fileList: any;
  fileNames: Array<FileName> = [];

  subscription: Subscription;

  // make sure extensions are upper case
  allowed_extensions = ['TXT', 'PDF', 'DOC', 'ZIP', 'JPG', 'PNG'];

  dragClass = '';

  showErrors = false;
  noFilesErrorMsg = true;
  invalidFileExtensionErrorMsg = false;
  fileSizeViolationErrorMsg = false;
  @ViewChild('uploadSameFile') uploadSameFile: ElementRef;


  get numberOfFilesViolationErrorMsg() {
    return this.files.length > 2;
  }

  get numberOfFilesExceededErrorMsg() {
    return this.files.length > 3;
  }

  constructor(
    private router: Router,
    public uploadConfigFileService: UploadConfigFileService,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.UploadConfigFileComponent + blankSpace + Operations.AddIcons)));
    }
  }

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

  ngOnInit() {
    this.subscription = this.uploadConfigFileService.showErrorMessage.subscribe(
      () => (this.showErrors = true)
    );
  }

  fileChange(event) {
    const files = event.target ? event.target.files : event;

    // Filter for only change events that include files.
    if (files.length) {
      this.showErrors = false;
      this.verifyChange(files);
      this.setValidStatus();
      this.uploadConfigFileService.numberOfFiles = this.files.length;
      this.uploadConfigFileService.files = this.files;
      this.uploadSameFile.nativeElement.value = '';
      this.uploadConfigFileService.fileNames = this.fileNames;
    }
  }

  verifyChange(files): void {
    try {
      if (files.length > 0) {
        this.noFilesErrorMsg = false;
        this.invalidFileExtensionErrorMsg = false;

        for (const file of files) {
          const ext: string = file.name.split('.')[file.name.split('.').length - 1];
          if (this.allowed_extensions.lastIndexOf(ext.toUpperCase()) === -1) {
            this.invalidFileExtensionErrorMsg = true;
            break;
          }
          this.files.push(file);
          this.fileNames.push(new FileName(file.name));
        }

        this.verifyFileSizeViolation();
      } else {
        this.noFilesErrorMsg = true;
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.UploadConfigFileComponent + blankSpace + Operations.VerifyChange)));
    }
  }

  setValidStatus() {
    if (
      this.noFilesErrorMsg ||
      this.invalidFileExtensionErrorMsg ||
      this.fileSizeViolationErrorMsg ||
      this.numberOfFilesExceededErrorMsg
    ) {
      this.uploadConfigFileService.isValid.next(false);
    } else {
      this.uploadConfigFileService.isValid.next(true);
    }
  }

  onRemoveFile(index: number) {
    this.invalidFileExtensionErrorMsg = false;
    this.files.splice(index, 1);
    this.fileNames.splice(index, 1);

    if (this.files.length === 0) {
      this.noFilesErrorMsg = true;
      this.fileSizeViolationErrorMsg = false;
    }
    this.verifyFileSizeViolation();
    this.setValidStatus();
    this.uploadConfigFileService.numberOfFiles = this.files.length;
    this.uploadConfigFileService.files = this.files;
    this.uploadConfigFileService.fileNames = this.fileNames;
  }

  private verifyFileSizeViolation() {
    let totalSum = 0;
    for (const file of this.files) {
      const sizeMB = Math.ceil(file.size / 1048576);
      totalSum += sizeMB;
      this.fileSizeViolationErrorMsg = totalSum > maxFileSizeLimit ? true : false;
      if (this.fileSizeViolationErrorMsg) {
        break;
      }
    }
  }

  // Drag&Drop events
  onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = '';

    this.fileChange(evt.dataTransfer.files);
  }

  onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = 'box-on-drag';
  }

  onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
