// 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { PezContent } from 'br-component-library';

import { PointDataResult, RunData } from '../data-management/run-data.model';
import { LevelSelection } from "../../../contracts/models/portal-api/level-test-settings.model";
import { EntityType } from '../../enums/entity-type.enum';
import { AppNavigationTracking } from '../../../../app/shared/models/audit-tracking.model';

export class DataReviewInfo {
  isSupervisorReview: boolean;
}

// Count request object
export class UnReviewedCountRequest {
  labLocationId: string;
  reviewType: ReviewType;
}

// Count response object
export class UnReviewedCountResponse {
  totalUnreviewedRunCount: number;
}

// Unreviewed Data Request object
export class UnReviewedDataRequest {
  labLocationId: string;
  labDepartments: Array<string>;
  labInstruments: Array<string>;
  labPanels: Array<string>;
  reviewFilters: Array<ReviewFilter>;
  startFrom: Date;
  endTo: Date;
  reviewType: ReviewType;
  paginationParams: ReviewPaginationParams;
}

export class ReviewFilter {
  filterType: ReviewFilterTypes;
  include: boolean;
}

export enum ReviewFilterTypes {
  Accepted = 1,
  Warning = 2,
  Rejected = 3,
  ActionAndComments = 4,
  Violations = 5,
  Last30Days = 6,
}

export enum ReviewType {
  Bench = 0,
  Supervisor = 1
}

export class ReviewPaginationParams {
  searchString: string;
  searchColumn: number;
  sortDescending: boolean;
  sortColumn: number;
  pageIndex: number;
  pageSize: number;
}

export class ReviewData extends RunData {
  analyteName: string;
  departmentId: string;
  departmentName: string;
  instrumentName: string;
  instrumentAlias: string;
  productName: string;
  customProductName: string;
  productMasterLotNumber: string;
  reagentName: string;
  reagentLotNumber: string;
  reagentLotId: number;
  method: string;
  unit: string;
  calibrator: string;
  calibratorLotNumber: string;
  calibratorLotId: number;
  codeListTestId: number;
  labUnitId: number;
  lotExpiringDate: Date;
  interactions: Array<PezContent>;
  decimalPlaces: number;
  addedBy?: string;
}

export class ReviewDataTableResult extends ReviewData {
  levelResult: PointDataResult;
  rowSpan: number;
  rowNum: number;
  resultIndex: number;
  isPlaceholderRow: boolean;
  isHeaderRow: boolean;
  headerLotExpirationDate: string;
}

// Response object
export class ReviewPaginationResponse {
  reviewData: Array<ReviewData>;
  runIdsOfAllPages: Array<string>;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

// Unreviewed Data Response object
export class UnReviewedDataResponse {
  counts: UnReviewedDataCounts;
  results: ReviewPaginationResponse;
  isManagedExpectedTestsConfigured: boolean;
  missingTestsCount?: number;
}

export class UnReviewedDataCounts {
  accepted: number;
  warning: number;
  rejected: number;
  actionAndComments: number;
  last30Days: number;
  violations: number;
}

export class BenchReviewDataColumns {
  analyte: string;
  date: Date;
  time: string;
  level: string;
  results: string;
  zScore: string;
  rules: string[];
  evalMean: string;
  evalSD: string;
  evalCV: string;
  reportedBy: string;
  status: string;
}

export class RunReview {
  runId: number;
  userAction: string;
  userComment: string;
}

export class ReviewDataRequest {
  reviewType: ReviewType;
  runReviews: Array<RunReview>;
  auditDetails?: AppNavigationTracking;
}

export class RunReviewSelection extends RunReview {
  selected: boolean;
}

export class UserReviewPreferences {
  userId: string;
  showAnalyte: boolean;
  showDate: boolean;
  showTime: boolean;
  showLevel: boolean;
  showResults: boolean;
  showZscore: boolean;
  showRules: boolean;
  showEvalMean: boolean;
  showEvalSD: boolean;
  showEvalCV: boolean;
  showReportedBy: boolean;
  showStatus: boolean;
  showPeerMean: boolean;
  showPeerSD: boolean;
  showPeerCV: boolean;
}

export class DisplayColumn {
  columnName: string;
  id: number;
  isChecked: boolean;
}

export interface MissingTest {
  labLotTestId?: string,
  departmentName: string,
  instrumentName: string,
  controlName: string,
  lot: string,
  analyteName: string,
  level: number
}

export class NameId {
  id? : string;
  displayName? : string;
}

/** Expected test configuration request. */
export class UserManageExpectedTestsSettings {
  labLocationId: string;
  expectedTests: ExpectedTest[];
  auditDetails: AppNavigationTracking;
  missingTestsCount?: number;
}

/** Expected test configuration for a lab test and level. */
export class ExpectedTest {
  labLotTestId: string;
  level: number;
  isSelected: boolean;
}

/** Manage expected tests item node with expandable, level and loading information */
export class ExpectedTestsTreeNode {
  id: string;
  nodeType: EntityType
  displayName: string;
  level: number;
  expandable: boolean;
  isLoading = false;
  isArchived: boolean;
  isLotExpired: boolean;
  secondaryText: string;
  levels: Array<LevelSelection>;
}

export class MissingTestPayload {
  paginationParams: ReviewPaginationParams;
  labLocationId: string;
  reviewType: number;
  labDepartments: Array<string>;
  labInstruments: Array<string>;
  labPanels: Array<string>
}

export class MissingTestResponse {
  labLotTestId: string;
  departmentName: string;
  instrumentName: string;
  controlName: string;
  lot: string;
  analyteName: string;
  level: number
}

export class MissingTestPopupData {
  labLocationId: string;
  reviewType: number;
  labDepartments: Array<string>;
  labInstruments: Array<string>;
  labPanels: Array<string>;
  instrumentsGroupedByDept: boolean;
  response: MissingTestResponseData;
}

export class MissingTestUpdateData {
  labLocationId: string;
  labLotTestIds: Array<string>;
  time:string;
  AuditDetails: AppNavigationTracking;
}

export class  MissingTestResponseData{
  missingTests: MissingTestResponse[];
  paginationParams: MissingPaginationResponse;
}

export class MissingPaginationResponse {
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalItems: number; 
}

export class AdditionalFilterValues {
  violationsCheckbox: boolean;
  last30DaysCheckbox: boolean;
}