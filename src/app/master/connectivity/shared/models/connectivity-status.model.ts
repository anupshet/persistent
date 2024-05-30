//  © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

export class ImportStatuses {
	statuses: Array<ImportStatus>;
}

export class StatusesPaginationRequest {
	locationId: string;
	pageIndex: number;
	pageSize: number;
}

export class StatusPage {
	statuses: Array<ImportStatus>;
	pageIndex: number;
	totalPages: number;
	pageSize: number;
	totalItems: number;
}

export class ImportStatus {
	connErrorType: string;
	connErrorCode: string;
	id: string;
	accountId: string;
	parsingJobName: string;
	fileNames: string[];
	userName: string;
	uploadedDateTime: Date;
	processedDateTime: Date;
	totalCount: number;
	processedCount: number;
	disabledCount: number;
	errorCount: number;
	status: number;
	isEdge: boolean;
	errorList: Array<ImportError>;
	isDownloadable: boolean;
}

export class UpdateStatus {
  id?: string;
  status?: number;
  error?: '';
  locationId?: string;
}

export class ImportError {
	labTestId: string;
	processingErrorId: number;
	hierarchyPath: string;
	details: string;
	count: number;
}

export class StatusFileDownloadInfo {
	statusId: string;
	statusFileUrl: string;
}

export enum ConnectivityDetailStatusEnum {
	'Done' = 1,
	'Refresh' = 2,
	'Detail' = 3,
	'FileUploadError' = 4
}

export enum ConnectivityStatusPipelineEnum {
  // beginning to send data through the pipeline.
  'ImportStatusPipelineStart' = 1,
  // ImportStatusUploadFailed represents an attempt to upload data from an endpoint but has failed.
  'ImportStatusUploadFailed' = -1,

  // ImportStatusParsingReady represents data has been uploaded and is ready for parsing.
  'ImportStatusParsingReady' = 11,
  // ImportStatusParsingStarted represents data that is currently being parsed.
  'ImportStatusParsingStarted' = 3,
  // ImportStatusParsingErrored represents data that has failed parsing.
  'ImportStatusParsingErrored' = -2,

  // ImportStatusMappingReady represents data that has been parsed and is ready for mapping.
  'ImportStatusMappingReady' = 2,
  // ImportStatusMappingStarted represents data that is currently being mapped.
  'ImportStatusMappingStarted' = 5,
  // ImportStatusMappingPending represents data that is being held until mapping has been completed by the user.
  'ImportStatusMappingPending' = 6,
  // ImportStatusMappingPending represents data that is ready for mapping retry (i.e., after user has mapped codes).
  'ImportStatusMappingRetryReady' = 7,
  // ImportStatusMappingErrored represents data that has failed mapping.
  'ImportStatusMappingErrored' = -3,

  // ImportStatusDataProcessingReady represents data that has finished mapping and is ready for processing.
  'ImportStatusDataProcessingReady' = 8,
  // ImportStatusDataProcessingStarted represents data that is currently being processed.
  'ImportStatusDataProcessingStarted' = 9,
  // ImportStatusDataProcessingErrored represents an attempt to process data via backend services has failed.
  'ImportStatusDataProcessingErrored' = -4,

	// ImportStatusDone represents the Done value in the ImportStatus table.
	'ImportStatusDone' = 10,

	// ImportStatusBidirectionalPipelineStart represents data has been received by an endpoint (e.g., uploaddata)
	// intended for bidirectional use.
	'ImportStatusBidirectionalPipelineStart' = 21,
	// ImportStatusBidirectionalUploadFailed represents an attempt to upload data from an endpoint but has failed.
	'ImportStatusBidirectionalUploadFailed' = -21,

	// ImportStatusBidirectionalParsingReady represents bidirectional data is ready for parsing.
	'ImportStatusBidirectionalParsingReady' = 22,
	// ImportStatusBidirectionalParsingStarted represents bidirectional data that is currently being parsed.
	'ImportStatusBidirectionalParsingStarted' = 23,
	// ImportStatusBidirectionalParsingErrored represents bidirectional data that has failed parsing.
	'ImportStatusBidirectionalParsingErrored' = -22,

	// ImportStatusBidirectionalMappingReady represents bidirectional data that has been parsed and is ready for mapping.
	'ImportStatusBidirectionalMappingReady' = 24,
	// ImportStatusBidirectionalMappingStarted represents bidirectional data that is currently being mapped.
	'ImportStatusBidirectionalMappingStarted' = 25,
	// ImportStatusBidirectionalMappingErrored represents bidirectional data that has failed mapping.
	'ImportStatusBidirectionalMappingErrored' = -23,

	// ImportStatusBidirectionalDataProcessingReady represents bidirectional data that has finished mapping and is ready
	// for processing.
	'ImportStatusBidirectionalDataProcessingReady' = 26,
	// ImportStatusBidirectionalDataProcessingStarted represents bidirectional data that is currently being processed.
	'ImportStatusBidirectionalDataProcessingStarted' = 27,
	// ImportStatusBidirectionalDataProcessingErrored represents an attempt to process bidirectional data via backend
	// services has failed.
	'ImportStatusBidirectionalDataProcessingErrored' = -24,

	// ImportStatusBidirectionalDone represents the Done value in the ImportStatus table for bidirectional data.
	'ImportStatusBidirectionalDone' = 28
}

export interface ImportStatusParam {
	objectId: string;
}
