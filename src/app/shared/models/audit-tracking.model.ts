// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { PezContent } from 'br-component-library/public_api';

import { AppUser } from '../../security/model/app-user.model';

import { EntityType } from '../../contracts/enums/entity-type.enum';
import { NodeInfo } from './../../contracts/models/shared/duplicate-control-request.model';
import { PointDataResult } from '../../contracts/models/data-management/run-data.model';

import { RuleSetting } from '../../contracts/models/lab-setup/rule-setting.model';
import { DataEntryMode } from '../../contracts/models/lab-setup/data-entry-mode.enum';
import { LabLocation } from '../../contracts/models/lab-setup/lab-location.model';
import { LevelEvaluationMeanSd } from '../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { ExpectedTest } from '../../contracts/models/data-review/data-review-info.model';

export class AuditTracking {
  action: AuditTrackingAction;
  actionStatus: AuditTrackingActionStatus;
  resource: string;
  comment?: string;
  tags?: string;
}
export const enum AuditTrackingActionStatus {
  Failure = 'Failure',
  Success = 'Success',
  Pending = 'Pending',
  Pass = 'Pass',
}
export const enum AuditTrackingAction {
  Login = 'Login',
  Logout = 'Logout',
  Settings = 'Settings',
  Create = 'Create',
  Copy = 'Copy',
  Archive = 'Archive',
  Unarchive = 'Unarchive',
  Delete = 'Delete',
  ChangeLocation = 'ChangeLocation',
  NoVersionJsonFound = 'NoVersionJsonFound',
  ViewQCLotViewer = 'ViewQCLotViewer',
  AddLotViewerUser = 'AddLotViewerUser',
  Preferences = 'Preferences',
  Update = 'Update',
  LabSetup = 'Lab Setup',
  Panel = 'Panel',
  Add = 'Add',
  ControlDataTable = 'Control Data Table',
  DuplicateLot = 'Duplicate Lot',
  Dashboard = 'Dashboard',
  Notification = 'notification',
  View = 'View',
  Clear = 'Clear',
  ClearAll = 'ClearAll',
  Sort = 'Sort',
  DepartmentSort = 'Sort Department',
  PanelSort = 'Sort Panel',
  Download = 'Download',
  eval = 'Eval',
  FileUpload = 'File Upload',
  Save = 'Save',
  Sign = 'Sign',
  Map = 'Map',
  Unmap = 'Unmap',
  Disable = 'Disable',
  Enable = 'Enable',
  Configure = 'Configure',
  Review = 'Review',
  MissingTests = 'Missing Tests',
  ManageExpectedTests = 'Manage Expected Tests'
}

export const enum AuditTrackingEvent {
  UserManagement = 'User Management',
  LabSetup = 'Lab Setup',
  InstrumentDataTable = 'Instrument Data Table',
  AnalyteDataTable = 'Analyte Data Table',
  AdvancedLJChart = 'Advanced LJ Chart',
  Report = 'Report',
  FileUpload = 'File Upload',
  FileStatus = 'File Status',
  Preferences = 'Preferences',
  Sort = 'Sort',
  NBRLot = 'NBRLot',
  NBRControl = 'NBRControl',
  DataReview = 'Data Review'
}

export const enum AuditTrackingSort {
  Custom = 'Custom',
  Alphabetical = 'Alphabetical',
  None = 'None'
}

export interface AuditTrailValueData {
  prior: AuditTrailPriorCurrentValues;
  current: AuditTrailPriorCurrentValues;
}
export class AuditTrailPriorCurrentValues {
  id?: string;
  group_id?: string;
  groupName?: string;
  user_id?: string;
  location_id?: string;
  locationName?: string;
  dataType?: DataEntryMode;
  decimalPlaces?: number | string;
  trackReagentCalibrator?: boolean;
  instrumentsGroupedByDept?: boolean;
  unitType?: UnitType;
  archivedGetter?: boolean;
  departmentName?: Array<string>;
  analyteName?: Array<string>;
  instrumentName?: Array<string>;
  departmentManagerName?: Array<string>;
  name?: string;
  isArchived?: boolean;
  displayName?: number | string;
  targetEntityCustomName?: string | number;
  manufacturerName?: Array<string>;
  reagentName?: Array<string>;
  reagentLotNumber?: Array<string> | Array<number>;
  instrumentSerial?: Array<string> | Array<number>;
  instrumentCustomName?: Array<string> | Array<number>;
  controlName?: Array<string> | Array<number>;
  lotNumber?: Array<string> | Array<number>;
  levels?: Array<boolean> | Array<Number>;
  isSummary?: boolean;
  customName?: Array<string>;
  productCustomName?: string | number;
  ruleSettings?: Array<RuleSetting>;
  archived?: boolean;
  method?: Array<string> | string;
  unit?: Array<string> | Array<number> | string;
  calibratorName?: Array<string> | Array<number> | string;
  calibratorManufacturer?: string | number;
  selectAllAnalytes?: boolean;
  selectCalibratorLots?: boolean;
  selectReagentLots?: boolean;
  summaryDataEntry?: boolean;
  parentNodes?: Array<NodeInfo>;
  nodeType?: EntityType;
  targetProductMasterLotId?: number;
  sourceNodeId?: string;
  retainFixedCV?: boolean;
  locationId?: string;
  controlId?: string;
  levelData?: Array<AnalyteLevelData>;
  isAction?: boolean;
  isComment?: boolean;
  action?: string;
  comment?: string;
  isReagentLot?: boolean;
  reagentLot?: string;
  reagentId?: string | number;
  isCalibratorLot?: boolean;
  calibratorId?: string | number;
  calibratorLot?: string | number;
  level?: number;
  mean?: number;
  numPoints?: number;
  sd?: number;
  value?: Array<string> | Array<number> | Array<boolean>;
  currentDateTime?: Date | string;
  ids?: Array<String>;
  sort?: string;
  reagentLotID?: string | number;
  reagentLotName?: string | number;
  calibratorLotID?: string | number;
  calibratorLotName?: string | number;
  acceptReject?: Array<PointDataResult>;
  runDate?: Date | string;
  runStringTime?: string;
  restartFloat?: boolean;
  floatPoint?: number;
  minimumNumberOfPoints?: number;
  floatingStatistcsFlag?: boolean;
  floatType?: string;
  levelEvalMeanSdData?: Array<LevelEvaluationMeanSd> | Array<AnalyteLevelData>;
  labInstrumentNodeId?: string;
  labLocationId?: string;
  reportMetaId?: string;
  reportCreatedOn?: string;
  reportDownloadFileName?: string;
  reportType?: string;
  correctiveActions?: object;
  nodeTypeName?: string;
  levelEvlMeanSdData?: Array<{LevelEvaluationMeanSd}>;
  levelEvlMeanSdDataCollection?: Array<{LevelEvaluationMeanSd}>;
  labLotTestIds?: Array<string>;
  expectedTests?: Array<ExpectedTest>;
}
export class AuditTrail {
  eventType: string;
  action: string;
  actionStatus: string;
  nodeType?: AuditTrailNodeType;
  currentValue?: AuditTrailPriorCurrentValues;
  priorValue?: AuditTrailPriorCurrentValues;
  meta_id?: string[];
  run_id?: string;
  hierarchy?: {};
  device_id?: string;
  runDateTime?: Date;
}
export class AppNavigationTracking {
  auditTrail: AuditTrail;
  account_id?: string;
  accountNumber?: string;
  accountName?: string;
  group_id?: string;
  groupName?: string;
  user_id?: string;
  location_id?: string;
  locationName?: string;
  eventDateTime?: Date;
  localDateTime?: Date;
  userRoles?: Array<string>;
  awsCorrelationId?: string;
  oktaId?: string;
  hasDepartments?: boolean;
  userName?: string;
}
export class AuditTrailNodeType {
  account_id?: string;
  accountNumber?: string;
  accountName?: string;
  group_id?: string;
  groupName?: string;
  location_id?: string;
  locationName?: string;
  department_id?: string;
  department_name?: string;
  instrument_id?: string;
  instrument_name?: string;
  control_id?: string;
  control_name?: string;
  analyte_id?: string;
  analyte_name?: string;
}
export const enum UnitType {
  Conventional = 0,
  SIunit = 1
}

export interface AnalyteLevelData {
  level?: number;
  mean?: number;
  numPoints?: number;
  sd?: number;
  controlLevel?: number;
  resultValue?: number;
  isAccept?: boolean;
}
export interface BaseHierarchy {
  id?: string;
  name?: string;
  groups?: BaseHierarchy[];
  locations?: BaseHierarchy[];
  departments?: BaseHierarchy[];
  instruments?: BaseHierarchy[];
  controls?: BaseHierarchy[];
  analytes?: BaseHierarchy[];
}

export interface Hierarchy {
  account: BaseHierarchy[];
}

export interface ReviewSummaryHistory {
  [key: string]: AppNavigationTracking[];
}

export interface ReviewSummaryContent {
  [key: string]: PezContent[];
}

export const LOGIN_AUDIT_TRAIL: AuditTrail = {
  eventType: AuditTrackingAction.Login,
  action: AuditTrackingAction.Login,
  actionStatus: AuditTrackingActionStatus.Success,
};

export const FAILED_LOGIN_AUDIT_TRAIL_PAYLOAD: AppNavigationTracking = {
  eventDateTime: new Date(),
  localDateTime: new Date(),
  auditTrail: { ...LOGIN_AUDIT_TRAIL, actionStatus: AuditTrackingActionStatus.Failure }
};

export const INACTIVE_LOGOUT_PAYLOAD: AuditTracking = {
  action: AuditTrackingAction.Logout,
  actionStatus: AuditTrackingActionStatus.Pass,
  resource: ''
};

export const INACTIVE_LOGOUT_AUDIT_TRAIL: AuditTrail = {
  eventType: AuditTrackingAction.Logout,
  action: AuditTrackingAction.Logout,
  actionStatus: AuditTrackingActionStatus.Pass,
};

export const SORT_AUDIT_TRAIL: AuditTrail = {
  eventType: AuditTrackingEvent.Sort,
  action: AuditTrackingAction.PanelSort,
  actionStatus: AuditTrackingActionStatus.Success,
};

export const getLocationValue = ({ parentNodeId: group_id, groupName, id: user_id, id: location_id, labLocationName: locationName }: LabLocation): AuditTrailPriorCurrentValues => ({
  group_id,
  groupName,
  user_id,
  location_id,
  locationName,
});

/*
*  destructuring operator used to initialize local variables from the method's first two arguments, user and labLocation
*  allows to keep payload json declaration concise. Look how simple a call to this method is:
*     const payload = this.getChangeLocationPayload(user, labLocation, auditTrail);
*/
export const getChangeLocationPayload = ({ accountId: account_id = '', id: user_id = '', accountNumber = '', roles: _userRoles = [] }: AppUser,
  { accountName = '', parentNodeId: group_id = '', groupName = '', id: location_id = '', labLocationName: locationName = '', contactRoles: locationRoles = [] }: LabLocation,
  auditTrail: AuditTrail): AppNavigationTracking => {
  const userRoles = locationRoles?.length > 1 ?
    _userRoles?.concat(locationRoles) ?? [''] :
    _userRoles ?? [''];
  return {
    eventDateTime: new Date(),
    localDateTime: new Date(),
    account_id,
    user_id,
    accountNumber,
    accountName,
    group_id,
    groupName,
    location_id,
    locationName,
    userRoles,
    auditTrail
  };
};

export const getLoginPayload = (location: LabLocation, user: AppUser): AppNavigationTracking => {
  const currentValue = { ...getLocationValue(location), user_id: user.id };
  const auditTrail = { ...LOGIN_AUDIT_TRAIL, currentValue };
  return { auditTrail };
};

export const getSortPayload = (device_id: string, sort: AuditTrackingSort): AppNavigationTracking => {
  return {
    auditTrail: {
      ...SORT_AUDIT_TRAIL,
      device_id,
      currentValue: {
        sort
      },
      priorValue: {}
    }
  }
};

