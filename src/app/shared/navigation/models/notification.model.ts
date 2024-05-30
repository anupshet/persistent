// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ArchiveState } from '../../../contracts/enums/lab-setup/archive-state.enum';
import { RawDataType } from '../../../contracts/models/data-management/base-raw-data.model';
import { PanelState } from '../../../contracts/enums/panels/panel-state.enum';
import { OperationType } from '../../../contracts/enums/lab-setup/operation-type.enum';

export class UserNotification {
  notificationUuid: string;
  // Indicates what kind of notification it is. Currently, this will be 1 for Error, 2 for Warning, and 3 for Info.
  typeId: NotificationTypesEnum;
  featureId: NotificationFeatureEnum; // This will be 1 for Data Processing Errors and 2 for Lot Duplication.
  // tslint:disable-next-line: max-line-length
  messageId: number; // Indicates which text to display in the notification panel for a particular notification. In the future that a feature could have many different types of notification messages to display.
  qcDataSourceId: number;  // Indicates the source that triggered the notification. Currently, this is 1 for Connectivity and 2 for UI.
  order: number; // May be used in the future to sort the notifications in various ways.
  createdTimestamp: Date;
  notificationSpecificData: {
    dataProcessingError?: {
      instrumentName: string;
      productName: string;
      analyteName: string;
      departmentName: string;
      dataTypeId: RawDataType;
      decimalPlaces: number;
      levelData: Array<LevelDataPoints | LevelDataSummary>
    };
    lotDuplication?: {
      instrumentName: string;
      productLotNumber: string;
      duplicationTimestamp: Date;
      isSuccess: boolean;  // At this time will not be used by the UI as it is only sent to the UI if true
    };
    archive?: {
      instrumentName: string;
      productName: string;
      analyteName: string;
      departmentName: string;
      dateTime: Date;
      archiveState: ArchiveState;
      isSuccess: boolean;
    };
    panel?: {
      panelName: string;
      dateTime: Date;
      panelState: PanelState;
      isSuccess: boolean;
    };
    copyInstrument?: {
      instrumentName: string;
      departmentName: string;
      copyTimestamp: Date;
      operationType: OperationType;
      isSuccess: boolean;
    };
    reports?: {
      accountName: string;
      yearMonth: string;
      instrumentName: string;
      pdfUrl: string;
      isSuccess: boolean;
      metaId: string;
      instrumentId: string;
    };
  };
}

export class LevelDataPoints {
  level: number;
  value: number;
}

export class LevelDataSummary {
  level: number;
  mean: number;
  sd: number;
  nPts: number;
}

export class NotificationsTypeAndMessage {
  type: string;
  message: string;
}

export enum NotificationTypesEnum {
  'Error' = 1,
  'Warning' = 2,
  'Info' = 3
}

export enum NotificationMessageEnum {
  'FutureFeature1' = 1,
  'FutureFeature2' = 2
}

export enum NotificationFeatureEnum {
  'DataProcessingError' = 1,
  'LotDuplicationError' = 2,
  'Archive' = 3,
  'Panels' = 4,
  'InstrumentCopyError' = 5,
  'Reports' = 6
}
