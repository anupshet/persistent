// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { orderBy, cloneDeep } from 'lodash';
import { hasValue } from 'br-component-library';
import { take } from 'rxjs/operators';

import {
  NotificationsTypeAndMessage, UserNotification, NotificationTypesEnum,
  NotificationMessageEnum, NotificationFeatureEnum
} from '../../../models/notification.model';
import { icons } from '../../../../../core/config/constants/icon.const';
import { IconService } from '../../../../icons/icons.service';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import {
  notificationTypeCodePrefix, notificationDateTimeFormat, blankSpace, notificationMessageCodePrefix, level, decimalPlacesPattern,
  decimalPlaceholder, notificationReplaceHierarchyTextCode, notificationReplaceDateTextCode, openParenthesis, closeParenthesis, equalToSign,
  notificationCreatedDateKey, notificationLotNumber, notificationInstrumentName, notificationCreationTime, caseInsensitiveModifier
} from '../../../../../core/config/constants/general.const';
import { RawDataType } from '../../../../../contracts/models/data-management/base-raw-data.model';
import { DateTimeHelper } from '../../../../date-time/date-time-helper';
import { ArchiveState } from '../../../../../contracts/enums/lab-setup/archive-state.enum';
import { ErrorLoggerService } from '../../../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { componentInfo, Operations } from '../../../../../core/config/constants/error-logging.const';
import { PanelState } from '../../../../../contracts/enums/panels/panel-state.enum';
import { Permissions } from '../../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { NotificationApiService } from '../../../services/notificationApi.service';
import { AuditTrackingAction } from '../../../../../shared/models/audit-tracking.model';
import { UIConfigService } from '../../../../../shared/services/ui-config.service';

@Component({
  selector: 'unext-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  providers: [DecimalPipe]
})

export class NotificationListComponent implements OnInit {
  public notificationCount: number;
  @Input() expandNotificationList: boolean;
  @Input() timeZone: string;
  _notifications: Array<UserNotification>;
  get notifications(): Array<UserNotification> {
    return this._notifications;
  }
  @Input('notifications')
  set notifications(value: Array<UserNotification>) {
    this._notifications = (value && this.dateTimeHelper) ?
      this.dateTimeHelper.sortByDateDesc(cloneDeep(value), notificationCreatedDateKey) : [];
    this.notificationCount = value ? value.length : 0;
    if (!this.notificationCount && this.trigger) {
      this.trigger.closeMenu();
    }
    this.notificationsTypeAndMessage = [];
    this.populateTranslatedNotification();
  }
  @Output() dismissNotificationId = new EventEmitter<string>();
  @Output() dismissAllNotifications = new EventEmitter<void>();
  public notificationsTypeAndMessage: Array<NotificationsTypeAndMessage> = [];
  readonly notificationType = NotificationTypesEnum;
  readonly featureType = NotificationFeatureEnum;
  readonly notificationTypeMsg = NotificationMessageEnum;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.notificationsNone[24],
    icons.close[18]
  ];
  @ViewChild('menuTrigger') trigger;
  constructor(
    private iconService: IconService,
    private _decimalPipe: DecimalPipe,
    private dateTimeHelper: DateTimeHelper,
    private errorLoggerService: ErrorLoggerService,
    private appNavigationService: AppNavigationTrackingService,
    private notificationApiService: NotificationApiService,
    private brPermissionsService: BrPermissionsService,
    private uiConfigAction: UIConfigService,
    private translate: TranslateService) {
    this.iconService.addIcons(this.iconsUsed);
  }
  permissions = Permissions;

  ngOnInit(): void {
    this.notificationCount = this.notifications ? this.notifications.length : 0;
    this.populateTranslatedNotification();
  }
  captureViewEvent(): void {
    if (this.notifications.length > 0) {
      this.notificationApiService.action = AuditTrackingAction.View;
      const data = this.notificationApiService.notificationData();
      delete data.auditTrail.currentValue.ids;
      this.appNavigationService.logAuditTracking(data, true);
    }
  }

  populateTranslatedNotification() {
    this.notifications.forEach(ele => {
      const translateTypeCode = notificationTypeCodePrefix + ele.featureId;
      let translation = '';
      if (translateTypeCode === 'NOTIFICATIONTYPE_1') {
        translation = this.getTranslations('TRANSLATION.PROCESSINGERROR');
      }
      if (translateTypeCode === 'NOTIFICATIONTYPE_6') {
        translation = this.getTranslations('TRANSLATION.REPORT');
      }
      if (translateTypeCode === 'NOTIFICATIONTYPE_2') {
        translation = this.getTranslations('TRANSLATION.DUPLICATIONERROR');
      }
      if (translateTypeCode === 'NOTIFICATIONTYPE_5') {
        translation = this.getTranslations('TRANSLATION.INSTRUMENTERROR');
      }
      const tempObject: NotificationsTypeAndMessage = new NotificationsTypeAndMessage();
      let translatedType = '';
      if (ele.featureId === this.featureType.Archive) {
        const archiveCode = ele.notificationSpecificData.archive.archiveState === ArchiveState.Archived
          ? this.getTranslations('TRANSLATION.ARCHIVINGERROR') : this.getTranslations('TRANSLATION.UNARCHIVINGERROR');
        translatedType = archiveCode;
      } else if (ele.featureId === this.featureType.Panels) {
        const archiveCode = ele.notificationSpecificData.panel.panelState === PanelState.Create
          ? this.getTranslations('TRANSLATION.CREATIONERROR') : this.getTranslations('TRANSLATION.EDITERROR');
        translatedType = archiveCode;
      } else {
        translatedType = translation;
      }
      tempObject.type = translatedType;

      switch (ele.featureId) {
        case this.featureType.DataProcessingError:
        case this.featureType.LotDuplicationError:
        case this.featureType.Archive:
        case this.featureType.InstrumentCopyError:
          const translateMsgCode = notificationMessageCodePrefix + ele.featureId;
          let translation = '';
          if (translateMsgCode === 'NOTIFICATIONMESSAGE_1') {
            translation = this.getTranslations('TRANSLATION.SUBMITTEDFOR') + ' ' + notificationReplaceHierarchyTextCode + ' ' + this.getTranslations('TRANSLATION.NO') + ' ' +notificationReplaceDateTextCode + ' ' + this.getTranslations('TRANSLATION.FAILED');
          }
          if (translateMsgCode === 'NOTIFICATIONMESSAGE_2') {
            translation = this.getTranslations('TRANSLATION.LOTDUPLICATION');
          }
          if (translateMsgCode === 'NOTIFICATIONMESSAGE_3') {
            translation = this.getTranslations('TRANSLATION.ARCHIVINGFOR');
          }
          if (translateMsgCode === 'NOTIFICATIONMESSAGE_5') {
            translation = this.getTranslations('TRANSLATION.COPYINSTRUMENT');
          }
          const notificationMessage = translation;
          tempObject.message = this.createNotificationMesssage(ele, notificationMessage);
          break;
        case this.featureType.Panels:
          const panelsTranslateMsgCode = ele.notificationSpecificData.panel.panelState === PanelState.Create ?
          this.getTranslations('TRANSLATION.CREATIONERROR') : this.getTranslations('TRANSLATION.EDITERROR');
          const panelsNotificationMessage = panelsTranslateMsgCode;
          tempObject.message = this.createNotificationMesssage(ele, panelsNotificationMessage);
          break;
        default:
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, '', Operations.defaultCasePopulateMessages,
              (componentInfo.NotificationListComponent + blankSpace + Operations.populateTranslationMesssage)));
          break;
      }
      this.notificationsTypeAndMessage.push(tempObject);
    });
  }

  createNotificationMesssage(notificationElement: UserNotification, translatedText: string) {
    switch (notificationElement.featureId) {
      case this.featureType.DataProcessingError:
        const levelText = this.getTranslations('TRANSLATION.LEVELS').trim();
        const meanText = this.getTranslations('TRANSLATION.MEAN1').trim();
        const sdText = this.getTranslations('TRANSLATION.SDS').trim();
        const pointsText = this.getTranslations('TRANSLATION.POINT').trim();
        const sortedLevelData = orderBy(notificationElement.notificationSpecificData.dataProcessingError.levelData, [level]);
        // for converting values to corresponding decimal plaecs
        const regexPattern: RegExp = new RegExp(decimalPlaceholder, 'g');
        const patternToDecimal = (hasValue(notificationElement.notificationSpecificData.dataProcessingError.decimalPlaces)) ?
          // tslint:disable-next-line: max-line-length
          decimalPlacesPattern.replace(regexPattern, notificationElement.notificationSpecificData.dataProcessingError.decimalPlaces.toString()) : '';
        const levelDataString = sortedLevelData.map(e => {
          if (notificationElement.notificationSpecificData.dataProcessingError.dataTypeId === RawDataType.RunData) {
            const dataValue = hasValue(e.value) ? this.getDecimalPlaceConvertedValue(e.value, patternToDecimal) : null;
            return levelText + blankSpace + e.level + equalToSign + dataValue;
          } else {
            const meanValue = hasValue(e.mean) ? this.getDecimalPlaceConvertedValue(e.mean, patternToDecimal) : null;
            const sdValue = hasValue(e.sd) ? this.getDecimalPlaceConvertedValue(e.sd, patternToDecimal) : null;
            const nPtsValue = hasValue(e.nPts) ? e.nPts : null;
            return levelText + blankSpace + e.level + blankSpace +
              meanText + equalToSign + meanValue + blankSpace +
              sdText + equalToSign + sdValue + blankSpace +
              pointsText + equalToSign + nPtsValue;
          }
        }).join(',');
        let hierarchyPath = notificationElement.notificationSpecificData.dataProcessingError.instrumentName + blankSpace +
          notificationElement.notificationSpecificData.dataProcessingError.productName + blankSpace +
          notificationElement.notificationSpecificData.dataProcessingError.analyteName + blankSpace +
          openParenthesis + levelDataString + closeParenthesis;
        if (notificationElement.notificationSpecificData.dataProcessingError.departmentName) {
          hierarchyPath = notificationElement.notificationSpecificData.dataProcessingError.departmentName + blankSpace + hierarchyPath;
        }
        const createdTime = this.dateTimeHelper
          .getTimezoneFormattedDateTime(notificationElement.createdTimestamp, this.timeZone, notificationDateTimeFormat);
        return translatedText ? translatedText.replace(notificationReplaceHierarchyTextCode, hierarchyPath)
          .replace(notificationReplaceDateTextCode, createdTime) : '';

      case this.featureType.LotDuplicationError:
        const lotNumber = notificationElement.notificationSpecificData.lotDuplication.productLotNumber;
        const instrumentName = notificationElement.notificationSpecificData.lotDuplication.instrumentName;
        const createdTimeLotDuplicationError = this.dateTimeHelper
          .getTimezoneFormattedDateTime(notificationElement.createdTimestamp, this.timeZone, notificationDateTimeFormat);
        return translatedText ? translatedText.replace(notificationLotNumber, lotNumber)
          .replace(notificationInstrumentName, instrumentName).replace(notificationCreationTime, createdTimeLotDuplicationError) : '';

      case this.featureType.Archive:
        if (!notificationElement.notificationSpecificData.archive.isSuccess) {
          let hierarchyPathArchivingError = notificationElement.notificationSpecificData.archive.instrumentName + blankSpace +
            (notificationElement.notificationSpecificData.archive.productName ?? '') + blankSpace +
            (notificationElement.notificationSpecificData.archive.analyteName ?? '');
          if (notificationElement.notificationSpecificData.archive.departmentName) {
            hierarchyPathArchivingError = notificationElement.notificationSpecificData.archive.departmentName + blankSpace +
              hierarchyPathArchivingError;
          }
          return translatedText.replace(notificationReplaceHierarchyTextCode, hierarchyPathArchivingError);
        }
        break;
      case this.featureType.Panels:
        if (!notificationElement.notificationSpecificData.panel.isSuccess) {
          return translatedText;
        }
        break;
      case this.featureType.InstrumentCopyError:
        if (!notificationElement.notificationSpecificData.copyInstrument.isSuccess) {
          const copyTimeInstrumentCopyError = this.dateTimeHelper
            .getTimezoneFormattedDateTime(notificationElement.notificationSpecificData.copyInstrument.copyTimestamp,
              this.timeZone, notificationDateTimeFormat);
          const instrumentCopyErrorInstrumentName = notificationElement.notificationSpecificData.copyInstrument.instrumentName;
          translatedText = translatedText ? translatedText.replace(notificationInstrumentName, instrumentCopyErrorInstrumentName)
            .replace(notificationReplaceDateTextCode, copyTimeInstrumentCopyError) : '';
          return this.highlightContent(instrumentCopyErrorInstrumentName, translatedText);
        }
        break;
      default:
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, '', Operations.defaultCaseNotification,
            (componentInfo.NotificationListComponent + blankSpace + Operations.createNotificationMesssage)));
        return;
    }
  }

  getDecimalPlaceConvertedValue(actualValue: number, patternToDecimal: string) {
    return this._decimalPipe.transform(actualValue, patternToDecimal).replace(/,/g, '');
  }

  dismissNotification(notificationId: string) {
    this.notificationApiService.getDismissId = notificationId;
    this.notificationApiService.isDismissId = true;
    this.dismissNotificationId.emit(notificationId);
  }

  public highlightContent(stringToHighlight: string, content: string) {
    if (!stringToHighlight) {
      return content;
    }
    return content.replace(new RegExp(stringToHighlight, caseInsensitiveModifier), match => {
      return '<span class="red">' + match + '</span>';
    });
  }

  checkForTempUrl(url: string) {
    return url.substring(0, 4) === 'temp';
  }


  clearAllNotifications() {
    this.dismissAllNotifications.emit();
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
