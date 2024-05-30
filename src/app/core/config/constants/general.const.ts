// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export const unUnspecifiedEntry = 'Unspecified ***';
export const expirationDayLimit = 45;
export const labSetupAnalyteHeaderTitle = 'Add analytes to {title}';
export const productMasterLotId = 'productMasterLotId';
export const instrumentId = 'instrumentId';
export const displayName = 'displayName';
export const name = 'name';
export const instrumentInfo = 'instrumentInfo';
export const replacableTitle = '{title}';
export const levelSettings = 'levelSettings';
export const accountSettings = 'accountSettings';
export const hasOwnAccountSettings = 'hasOwnAccountSettings';
export const defaultLevelSettingsValue = false;
export const decimalPlace: Array<any> = ['0', '1', '2', '3', '4'];
export const textFieldCharLimit = 50;
export const ratingRange: Array<number> = [1, 2, 3, 4, 5];
export const id = 'id';
export const parentNodeId = 'parentNodeId';
export const parentNode = 'parentNode';
export const nodeType = 'nodeType';
export const children = 'children';
export const departmentManager = 'departmentManager';
export const instrumentManufacturer = 'instrumentManufacturer';
export const instrumentModel = 'instrumentModel';
export const customName = 'customName';
export const serialNumber = 'serialNumber';
export const decimalPlaces = 'decimalPlaces';
export const summaryDataEntry = 'summaryDataEntry';
export const instruments = 'instruments';
export const controls = 'controls';
export const departmentsAddLimit = 15;
export const instrumentAddLimit = 35;
export const controlAddLimit = 40;
export const analyteAddLimit = 55;
export const departmentManagerGroup = 'departmentManagerGroup';
export const departmentName = 'departmentName';
export const defaultLabId = '00000000-0000-0000-0000-000000000000';
export const localhostName = 'localhost';
export const maxInputLength = 16;
export const minFileSize = 15;
export const maxFileSize = 30;
export const isValid = 'isValid';
export const errorMessage = 'errorMessage';
export const text = 'text';
export const value = 'value';
export const ruleSettings = 'ruleSettings';
export const level = 'level';
export const cumulative = 'Cumulative';
export const _2_3_2s = '2 of 3/2s';
export const R_4s = 'R-4s';
export const ruleId = 'ruleId';
export const controlName = 'controlName';
export const definedControlName = 'definedControlName';
export const matrix = 'matrix';
export const additionalInstruments = 'additionalInstruments';
export const masterLotNumber = 'masterLotNumber';
export const manufacturerName = 'manufacturerName';
export const controlInfo = 'controlInfo';
export const _2_of_2s = '2 of 2s';
export const kx = 'kx';
export const k_1s = 'k-1s';
export const used = 'Used';
export const productLotLevels = 'productLotLevels';
export const fileSuccessStatus = 1;
export const fileFailureStatus = -6;
export const maxNumberOfFiles = 10;
export const level1Used = 'level1Used';
export const level2Used = 'level2Used';
export const level3Used = 'level3Used';
export const level4Used = 'level4Used';
export const level5Used = 'level5Used';
export const level6Used = 'level6Used';
export const level7Used = 'level7Used';
export const level8Used = 'level8Used';
export const level9Used = 'level9Used';
export const removeKeysArray = ['sdIsCalculated', 'cvIsCalculated', 'isNew'];
// AJT will restore this to settings from settingsv2 once we move to QA
export const settings = 'settingsv2';
export const desc = 'desc';
export const asc = 'asc';
export const minimumNumberPoints = 10;
export const decimalPlaceholder = 'XX';
export const decimalPlacesPattern = '1.' + decimalPlaceholder + '-' + decimalPlaceholder;
export const rule = 7;
export const regexp = '^[0-9\.\-\/]+$';
export const defaultDecimalPlaceValue = 2;
export const IS_DEV_MODE = location.href.toLocaleLowerCase().indexOf('//localhost') > 0
  || location.href.toLocaleLowerCase().indexOf('//unity-dev') > 0;
export const IS_LOCALHOST = location.href.toLocaleLowerCase().indexOf('//localhost:4200') > 0;
// Browser Names
export const browsers = {
  IE: 'IE',
  Chrome: 'Chrome',
  Edge: 'Edge'
};
export const errorCodePrefix = 'ERRORCODE';
export const replaceTextCode = '_**_';
export const groupByKey = 'hierarchyPath';
export const analyteRemovedHeirarchyPath = '[ANALYTE REMOVED]';
export const connectivityDateTimeFormat = 'MMM DD hh:mm A';
export const connectivityDateTimeOnDetailsFormat = 'MMM DD YYYY hh:mm A';
export const newLine = '\n';
export const notificationTypeCodePrefix = 'NOTIFICATIONTYPE_';
export const notificationMessageCodePrefix = 'NOTIFICATIONMESSAGE_';
export const blankSpace = ' ';
export const hyphen = ' - ';
export const colon = ':';
export const backSlash = '\\';
export const equalToSign = '=';
export const openParenthesis = '(';
export const closeParenthesis = ')';
export const forwardSlash = '/';
export const underscore = '_';
export const openSquareParenthesis = '[';
export const closeSquareParenthesis = ']';
export const notificationDateTimeFormat = 'MM/DD/YYYY hh:mm A z';
export const notificationReplaceHierarchyTextCode = '[NOTIFICATIONS_HIERARCHY_CODES]';
export const notificationReplaceDateTextCode = '[NOTIFICATIONS_DATETIME_CODES]';
export const notificationCreatedDateKey = 'createdTimestamp';
export const notificationLotNumber = '[LOT_NUMBER]';
export const notificationInstrumentName = '[INSTRUMENT_NAME]';
export const notificationCreationTime = '[CREATED_TIME]';
export const productInfo = 'productInfo';
export const controlUnavailableCode = 'URC000001';
export const productId = 'productId';
export const manufacturerId = 'manufacturerId';
export const lotInfo = 'lotInfo';
export const allowedRoles = 'Allowed Roles';
export const notificationTitleArchive = 'NOTIFICATIONTITLEARCHIVE';
export const notificationTitleUnarchive = 'NOTIFICATIONTITLEUNARCHIVE';
export const inProgressHeaderPre = 'INPROGRESSHEADER_';
export const inProgressMessagePre = 'INPROGRESSMESSAGE_';
export const includeArchivedItems = 'IncludeArchivedItems';
export const isArchived = 'isArchived';
export const archiveState = 'archiveState';
export const inProgressCode = {
  archive: 'URC000002',
  unarchive: 'URC000003',
  duplicate: 'URC000001',
  panelCreating: 'URC000004',
  panelUpdating: 'URC000005',
  instrumentCopy: 'URC000006',
  default: 'DEFAULT'
};
export const maxPanel = 30;
export const notificationTitlePanelCreate = 'NOTIFICATIONPANELCREATE';
export const notificationTitlePanelEdit = 'NOTIFICATIONPANELEDIT';
export const notificationMsgPanelCreate = 'NOTIFICATIONPANELCREATEMSG';
export const notificationMsgPanelEdit = 'NOTIFICATIONPANELEDITMSG';
export const panelItemProductMasterLotId = '[PANEL_ITEM_PRODUCT_MASTER_LOT_ID]';
export const panelItemCalibratorId = '[PANEL_ITEM_CALIBRATOR_ID]';
export const panelItemReagentLotId = '[PANEL_ITEM_REAGENT_LOT_ID]';
export const lotNumber = 'lotNumber';
export const expirationDate = 'expirationDate';
export const duplicateNodeArray = 'duplicateNodeArray';
export const instrumentsArray = 'instrumentsArray';
export const instrument = 'instrument';
export const countToShowSelectAll = 5;
export const cookieExpiryPeriod = 356;
export const cookiesExpiryPeriod = 5;
export const selectAllInstruments = 'selectAllInstruments';
export const panelViewComponentNodeTypeErrorMessage = 'Data management state has wrong nodetype. Expected node type is panel.';
export const additionalText = 'additionalText';
export const sortOrder = 'sortOrder';
export const panel = 'panel';
export const edit = 'edit';
export const instrumentAddLimitTextCode = '[INSTRUMENT_ADD_LIMIT]';
export const controlLimitMessageTextCode = '[CONTROL_ADD_LIMIT]';
export const analyteLimitMessageTextCode = '[ANALYTE_ADD_LIMIT]';
export const maxLengthLimitTextCode = '[MAX_LENGTH_LIMIT]';
export const duplicateInstrumentArray = 'duplicateInstrumentArray';
export const department = 'department';
export const caseInsensitiveModifier = 'gi';
export const oneMinuteCountdown = 60000;
export const logoutWarningTimer = 600000;
export const signoutTimer = 900000;
export const maxFileSizeLimit = 7;
export const entityId = 'entityId';
export const controlInfoCustomName = 'controlInfo.customName';
export const controlInfoLotNumber = 'controlInfo.lotNumber';
export const dataEntryMode = 'dataEntryMode';
export const duplicateLotInstruments = 'duplicateLotInstruments';
export const urlId = ':id';
export const urltype = ':type';
export const technologist = 'Technologist';
export const leadTechnologist = 'LeadTechnologist';
export const atText = 'at';
export const allText = 'All';
export const bioRadPlaceHolder = '[BIO_RAD]';
export const bioRadText = 'Bio-Rad';
// AdvancedLJTimeframeComponent
export const advLjMaxValueForSlider = 90;
export const advLjMinValueForSlider = 1;
export const advLjTickInterval = 15;
export const advLjDefaultSliderValue = 30;
export const advLjShowThumbLabel = true;
// ----------------------------
// AdvancedLjPanelComponent
export const resultsKey = 'results';
export const instrumentNamePlaceholder = '[INSTRUMENT_NAME]';
export const controlNamePlaceholder = '[CONTROL_NAME]';
export const lotNumberPlaceholder = '[LOT_NUMBER]';
export const expiringDatePlaceholder = '[EXPIRING_DATE]';
export const expiringDateFormat = 'DD MMM YYYY';
// AdvancedLJChartComponent
export const subTitleLevel = 'Level';
export const labInstrumentsDataType = '[INSTRUMENT_DATA_TYPE]';
export const labDataTextNoOfInstruments = '[INSTRUMENT_NUMBERS]';
// ----------------------------
export const code = 'code';
export const allDates = 'all-dates';
export const dateRangeOpened = 'range-opened';
export const isAddValue = 'add';
export const Decimal = 'Decimal';
export const Comma = 'Comma';
export const maxlength = 'maxlength';
export const title = 'title';
export const checkbox = 'checkbox';
export const use_stats = 'use_stats'; // transformer fields key value
export const use_stats_hms = 'use_sd'; // transformer fields key value

// Entity type strings
export const nodeTypeNames = {
  0: 'account',
  1: 'group',
  2: 'location',
  3: 'department',
  4: 'instrument',
  5: 'product',
  6: 'test',
  7: 'user',
  9: 'accountsettings',
  10: 'panel'
};

// AccountList
export const paginationAccounts = 'paginationAccounts';
export const paginationLocations = 'paginationLocations';
export const paginationGroups = 'paginationGroups';
export const paginationBioRadUsers = 'paginationBioRadUsers';
export const paginationUsers = 'paginationUsers';
export const paginationItemsPerPage = 20;
export const paginationUsersPerPage = 25;
export const pageItemsDisplay = 5;

// Sort
export const customSort = 'Custom';
export const autoSort = 'A-Z';

// LocationForm
export const maxMonthLength = 72;

// for error message component
export const accountForm = 'account-form';
export const accountLocationForm = 'account-location-form';
export const userManagementDialog = 'user-management-dialog';
export const bioRadUserManagementDialog = 'bioRad-user-management';
export const deleteBioRadUser = 'user';

export const materialPadding = 16;
export const headerHeight = 87;

// Data management service
export const calibratorLotName = '[CALIBRATOR_LOT_NAME]';
export const reagentLotName = '[REAGENT_LOT_NAME]';
export const historyRunDate = '[RUN_DATE]';
export const historyRunTime = '[RUN_TIME]';
export const genericData = '[GENERIC_DATA]';
export const levelText = '[LEVEL_TEXT]';
export const levelValue = '[LEVEL_VALUE]';
export const levelSD = '[LEVEL_SD]';
export const levelMean = '[LEVEL_MEAN]';
export const isAccept = 'isAccept';

export const paginationStatus = 'paginationStatus';
export const reports = 'Reports';
export const Reporting = 'Reporting';
export const reportsFirstPage = 1;
export const reportsItemsPerPage = 10;
export const multipleInstruments = 'Multiple Instruments';

export const levelCheckboxes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const maxLengthForName = 50;
export const maxLengthForLotNumber = 15;
export const maxLengthForManufacturerName = 50;
export const maxLengthForCustomName = 50;
export const maxLengthForSearchAnalyte = 40;
export const minLengthForSearchAnalyte = 2;
export const analyteSearchFilterLength = 1;
export const expirationStr = ' exp. ';
export const nonBrManufacturerIdStr = '0';
export const nonBrManufacturerId = 0;
export const brManufacturerId = 2;
export const nonBrControlText = 'NBR Control';
export const valid = 'VALID';

export const featureFlagsChangeCode = 'change:';
export const featureFlagsInitializedCode = 'initialized';
export const localizationToggleCode = 'localization-toggle';
export const nonBrLotsToggleCode = 'non-br-lots-toggle';
export const brBrandedToggleCode = 'br-branded-lots-toggle';
export const level7MinWIdth = '2250';
export const level8MinWIdth = '2500';
export const level9MinWIdth = '2800';
export const ownControlsNavTittle = 'Manage Your Own Control';
export const regexForWhiteSpaces = /\s+/g;

// Data Review
export const paginationDataReview = 'paginationDataReview';
export const paginationDataReviewPerPage = 25;
export const addedBy = 'AddedBy';
export const benchReviewedBy = 'BenchReviewedBy';
export const supervisorReviewedBy = 'SupervisorReviewedBy';

export const paginationMissingTests = 'paginationMissingTests';
export const missingTestPageItemsPerPage = 40;