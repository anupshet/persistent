// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { DisplayTextPipe } from 'br-component-library';

import { HeaderType } from '../../../../contracts/enums/lab-setup/header-type.enum';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { NavigationService } from '../../../../shared/navigation/navigation.service';

@Component({
  selector: 'unext-lab-setup-header',
  templateUrl: './lab-setup-header.component.html',
  styleUrls: ['./lab-setup-header.component.scss']
})
export class LabSetupHeaderComponent implements OnInit {
  type = HeaderType;
  @Input() currentNode: number;
  @Input() title: string;
  @Input() fullName: string;
  @Input() displayTextPipe: DisplayTextPipe<string>;
  @Input() isDataUpdated: boolean;
  @Input() showDefineOwnControlForm:boolean;
  @Output() closeDefineControlsTab =  new EventEmitter<boolean>();

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.products[48],
    icons.tests[48],
    icons.setupComplete[48],
    icons.instruments[48],
    icons.departments[48],
    icons.setupBegin[48],
    icons.close[24]
  ];


  constructor(
    private iconService: IconService,
    private appLoggerService: AppLoggerService,
    private errorLoggerService: ErrorLoggerService,
    private dialog: MatDialog,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit() {
    try {
      if (!this.title && !this.displayTextPipe
        && (typeof this.title !== 'string') && (typeof this.currentNode !== 'number')) {
        this.appLoggerService.log(`The title or currentNode must be provided of type string and number.`);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnInit)));
    }
  }

  formatText(title: string) {
    return this.displayTextPipe ? this.displayTextPipe.transform(title) : title;
  }

  showWhenIsLabSetup() {
    return this.currentNode === this.type.Department || this.currentNode === this.type.Instrument
      || this.currentNode === this.type.Control || this.currentNode === this.type.Analyte;
  }

  public onClose() {
    if(this.showDefineOwnControlForm){
      this.closeDefineControlsTab.emit(true);
    }else if(this.isDataUpdated) {
      this.confirmCloseLabSetup()
    }else {
      this.navigationService.goPreviousPageInLabSetup();
    }
  }

  private confirmCloseLabSetup(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: this.getTranslation('LABSETUPDEFAULT.LOSECHANGES'),
        cancelButtonText: this.getTranslation('LABSETUPDEFAULT.CANCEL'),
        confirmButtonText: this.getTranslation('LABSETUPDEFAULT.OK')
      }
    });

    dialogRef.afterClosed()
      .subscribe(hasConfirmed => {
        if (hasConfirmed) {
          this.navigationService.goPreviousPageInLabSetup();
        }
      });
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
