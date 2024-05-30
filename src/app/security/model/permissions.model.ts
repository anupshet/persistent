// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

export enum Permissions {
  AccountAdd = 1,
  AccountEdit = 2,
  AccountDelete = 3,
  UserAdd = 4,
  UserEdit = 5,
  UserDelete = 6,
  LotViewer = 7,
  LocationAdd = 8,
  LocationEdit = 9,
  LocationDelete = 10,
  DepartmentAdd = 11,
  DepartmentEdit = 12,
  DepartmentDelete = 13,
  InstrumentAdd = 14,
  InstrumentEdit = 15,
  InstrumentDelete = 16,
  ControlAdd = 17,
  ControlEdit = 18,
  ControlDelete = 19,
  AnalyteAdd = 20,
  AnalyteEdit = 21,
  AnalyteDelete = 22,
  Archiving = 23,
  SettingsDecimalPlaces = 24,
  SettingsLevelsInUse = 25,
  SettingsPointSummary = 26,
  RulesChanges = 27,
  EvalMeanSDCV = 28,
  FloatPoints = 29,
  RestartFloat = 30,
  PanelsAdd = 31,
  PanelsEdit = 32,
  PanelsDelete = 33,
  MultiDataEntryAdd = 34,
  SingleDataEntryAdd = 35,
  SingleDataEntryEdit = 36,
  SingleDataEntryDelete = 37,
  StartNewLot = 38,
  ChartsAdvancedLJ = 39,
  ReportsRun = 40,
  ReportsCorrectiveActionsEntry = 41,
  ReportsSaveAndDownload = 42,
  ConnectivityEnableDisableUser = 43,
  ConnectivityConfiguration = 44,
  ConnectivityStatus = 45,
  ConnectivityUpload = 46,
  ConnectivityMapping = 47,
  DashboardLotViewer = 48,
  DashboardExpiringLots = 49,
  DashboardConfiguration = 50,
  DashboardExpiringLicense = 51,
  AccountListView = 52,
  LocationListView = 53,
  BioRadUserAdd = 54,
  BioRadUserEdit = 55,
  BioRadUserDelete = 56,
  ViewAccount = 57,
  GroupAdd = 58,
  GroupEdit = 59,
  GroupDelete = 60,
  ViewLocation = 61,
  LaunchLocation = 62,
  LotViewerUserReport = 63,
  LotViewerSalesReport = 64,
  BioRadUserListView = 65,
  UserListView = 66,
  UserAddViewOnly = 67,
  UserEditViewOnly = 68,
  DepartmentAddViewOnly = 69,
  DepartmentEditViewOnly = 70,
  InstrumentAddViewOnly = 71,
  InstrumentEditViewOnly = 72,
  ControlAddViewOnly = 73,
  ControlEditViewOnly = 74,
  AnalyteAddViewOnly = 75,
  AnalyteEditViewOnly = 76,
  EvalMeanSDCVViewOnly = 77,
  PanelsAddViewOnly = 78,
  PanelsEditViewOnly = 79,
  ConnectivityEnableDisableUserViewOnly = 80,
  ConnectivityConfigurationViewOnly = 81,
  ConnectivityStatusViewOnly = 82,
  ConnectivityUploadViewOnly = 83,
  ConnectivityMappingViewOnly = 84,
  LabSettingsViewOnly = 85,
  LabSettings = 86,
  PanelsView = 87,
  ViewDepartment = 88,
  ViewGroup = 89,
  ViewUser = 90,
  ViewInstrument = 91,
  ViewControl = 92,
  ViewAnalyte = 93,
  ReportsViewSavedItems = 94,
  StartNewLotViewOnly = 95,
  Notifications = 96,
  CreateOrUpdateTemplate = 97,
  ViewTemplate = 98,
  DeleteTemplate = 99,
  BenchReview = 100,
  SupervisorReview = 101,
  ManageExpectedTests = 102,
  ViewMissingTests = 103,
  BenchReviewViewOnly = 104,
  SupervisorReviewViewOnly = 105,
  ManageExpectedTestsViewOnly = 106,
  NonBRLotManagement = 107,
  NonBRLotManagementViewOnly = 108
}

export interface PermissionRequired {
  permissionsAllowed: Array<Permissions>;
  hideIfNotPermitted: boolean;
  disableIfNotPermitted: boolean;
}

export const DataManagementAccessPermissions = [
  Permissions.MultiDataEntryAdd,
  Permissions.SingleDataEntryAdd,
  Permissions.SingleDataEntryEdit,
  Permissions.SingleDataEntryDelete,
  Permissions.StartNewLot,
  Permissions.ChartsAdvancedLJ,
  Permissions.ReportsRun,
  Permissions.ReportsCorrectiveActionsEntry,
  Permissions.ReportsSaveAndDownload
];

export const LabAccessPermissions = [
  Permissions.DepartmentAdd,
  Permissions.DepartmentEdit,
  Permissions.DepartmentDelete,
  Permissions.InstrumentAdd,
  Permissions.InstrumentEdit,
  Permissions.InstrumentDelete,
  Permissions.ControlAdd,
  Permissions.ControlEdit,
  Permissions.ControlDelete,
  Permissions.AnalyteAdd,
  Permissions.AnalyteEdit,
  Permissions.AnalyteDelete,
  Permissions.Archiving,
  Permissions.SettingsDecimalPlaces,
  Permissions.SettingsLevelsInUse,
  Permissions.SettingsPointSummary,
  Permissions.RulesChanges,
  Permissions.EvalMeanSDCV,
  Permissions.FloatPoints,
  Permissions.RestartFloat,
  Permissions.PanelsAdd,
  Permissions.PanelsEdit,
  Permissions.PanelsDelete,
  Permissions.DepartmentAddViewOnly,
  Permissions.DepartmentEditViewOnly,
  Permissions.InstrumentAddViewOnly,
  Permissions.InstrumentEditViewOnly,
  Permissions.ControlAddViewOnly,
  Permissions.ControlEditViewOnly,
  Permissions.AnalyteAddViewOnly,
  Permissions.AnalyteEditViewOnly,
  Permissions.EvalMeanSDCVViewOnly,
  Permissions.PanelsAddViewOnly,
  Permissions.PanelsEditViewOnly,
  Permissions.PanelsView,
  Permissions.LabSettingsViewOnly,
  Permissions.LabSettings,
  // included as backend team needs these permissions
  Permissions.ViewDepartment,
  Permissions.ViewGroup,
  Permissions.ViewUser,
  Permissions.ViewInstrument,
  Permissions.ViewControl,
  Permissions.ViewAnalyte,
];

export const UserManagementAccessPermissions = [
  Permissions.UserAdd,
  Permissions.UserEdit,
  Permissions.UserDelete,
  Permissions.UserListView,
  Permissions.UserAddViewOnly,
  Permissions.UserEditViewOnly
];

export const AccountManagementAccessPermissions = [
  Permissions.AccountListView,
  Permissions.LocationListView
];

export const BioradUserManagementAccessPermissions = [
  Permissions.BioRadUserAdd,
  Permissions.BioRadUserEdit,
  Permissions.BioRadUserDelete
];

export const PanelsAccessPermissions = [
  Permissions.PanelsView,
  Permissions.PanelsAddViewOnly,
  Permissions.PanelsEditViewOnly,
  Permissions.PanelsAdd,
  Permissions.PanelsEdit,
  Permissions.PanelsDelete
];

export const DashBoardAccessPermissions = [
  Permissions.DashboardLotViewer,
  Permissions.DashboardExpiringLots,
  Permissions.DashboardConfiguration,
  Permissions.DashboardExpiringLicense,
  Permissions.LotViewer,
  Permissions.StartNewLot,
  Permissions.StartNewLotViewOnly
];

export const InstrumentAccessPermissions = [
  Permissions.InstrumentAdd,
  Permissions.InstrumentAddViewOnly,
  Permissions.InstrumentEdit,
  Permissions.InstrumentEditViewOnly,
  Permissions.InstrumentDelete,
  Permissions.ViewInstrument
];

export const DepartmentAccessPermissions = [
  Permissions.DepartmentAdd,
  Permissions.DepartmentAddViewOnly,
  Permissions.DepartmentEdit,
  Permissions.DepartmentEditViewOnly,
  Permissions.DepartmentDelete,
  Permissions.ViewDepartment
];

export const ControlAccessPermissions = [
  Permissions.ControlAdd,
  Permissions.ControlAddViewOnly,
  Permissions.ControlEdit,
  Permissions.ControlEditViewOnly,
  Permissions.ControlDelete,
  Permissions.ViewControl
];

export const AnalyteAccessPermissions = [
  Permissions.AnalyteAdd,
  Permissions.AnalyteAddViewOnly,
  Permissions.AnalyteEdit,
  Permissions.AnalyteEditViewOnly,
  Permissions.AnalyteDelete,
  Permissions.ViewAnalyte
];

export const ViewPermissions = [
  Permissions.PanelsView,
  Permissions.ViewDepartment,
  Permissions.ViewGroup,
  Permissions.ViewUser,
  Permissions.ViewInstrument,
  Permissions.ViewControl,
  Permissions.ViewAnalyte,
];

export const DataReviewPermissions = [
  Permissions.BenchReview,
  Permissions.BenchReviewViewOnly,
  Permissions.SupervisorReview,
  Permissions.SupervisorReviewViewOnly
];

export const ReportsAccessPermissions = [
  Permissions.ReportsRun,
  Permissions.ReportsCorrectiveActionsEntry,
  Permissions.ReportsSaveAndDownload,
  Permissions.ReportsViewSavedItems,
  Permissions.PanelsView,
  Permissions.ViewDepartment,
  Permissions.ViewInstrument,
  Permissions.ViewControl,
  Permissions.ViewAnalyte,
];
export const NonBRLotManagementPermissions = [
  Permissions.NonBRLotManagement,
  Permissions.NonBRLotManagementViewOnly
];

