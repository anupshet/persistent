
// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ITemplate } from '../reporting.enum';

export class ReportDialogType {
    dialogType: TypeOfDialog;
    titleIcon?: IconType;
    titleMessage?: string;
    messageIcon?: IconType;
    messageContent?: Array<string>;
    messageType?: TypeOfMessage;
    buttonsList?: Array<DialogButtons>;
    simpleMessageList?: Array<string>;
    fullwidth?: boolean;
    isRename?: boolean;
    templateData?: ITemplate;
}


export class DialogButtons {
    btnName: string;
    btnStyle: StyleOfBtn;
    btnDisable?: boolean;
}

export enum StyleOfBtn {
    ErrorSolidButton = 1,
    OutlineButton = 2,
    SolidButton = 3,
    ErrorOutlineButton = 4
}

export enum TypeOfDialog {
    SingleBlock = 1,
    doubleBlock = 2,
    SimpleBlock = 3,
    FormBlock = 4
}

export enum TypeOfMessage {
    Error = 1,
    Warning = 2,
}

export enum IconType {
    GeneratingCircle = -1,
    GreyClose = 0,
    ContentCopy = 1,
    ContentDelete = 2,
    ContentDownload = 3,
    RedWarning = 4,
    ContentEdit = 5,
    CardWarning = 6,
    ContentUpdate = 7,
    ContentVisibility = 8,
    YellowWarning = 9,
    NotInterested = 10,
    Reload = 11,
}

export enum TemplateValidation {
  Missing = 'Missing',
  AllFound = 'AllFound',
  AllMissing = 'AllMissing',
}

export interface SavedValue {
  buttonIndex: number;
  templateInfo?: ITemplate;
}
