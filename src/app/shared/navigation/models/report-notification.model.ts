// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class ReportNotification {
  id: string; // notification Id
  metaId?: string;
  accountNumber?: string;
  yearMonth?: string;
  reportStatus?: ReportStatusTypes;
  reportType?: string;
  reportName?: string;
  pdfUrl?: string;
  updatedTimestamp?: string;
  locationId?: string;
  isDismiss?: boolean;
  isRead?: boolean;
}

export enum ReportStatusTypes {
  Generating = 0,
  GeneratingSaving = 2,
  Ready = 1,
  ReadySaved = 3,
  Error = -1,
  ErrorSaved = -2
}


