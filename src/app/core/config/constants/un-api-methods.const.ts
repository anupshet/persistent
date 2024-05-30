// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { urlPlaceholders } from './un-url-placeholder.const';

export const unApi = {
  lab: {
    labHierarchy: `labsetup/v2/get-tree-node/${urlPlaceholders.nodeTypeName}?LoadChildren=${urlPlaceholders.loadUpToGrandchildren}`
  },

  matrix: {
    matrixData: `matrix`
  },

  labLocation: {
    labLocations: 'labs/{labId}/locations', // LS//
  },

  product: {
    // Removed, Get all lots from CodeList, then exclude existing lots of parent instrument using state data//
    productlots: 'labs/{labId}/products/{id}/productlots'
  },

  treeNode: {
    instrumentReportsNodes:
      `labsetup/get-tree-node/${urlPlaceholders.nodeTypeName}?LoadChildren=${urlPlaceholders.loadUpToGrandchildren}&LoadTestSettings=True`,
    // TODO: 01/31/2020  Refactor this in future, included for connectivity
    loadFullTree: `labsetup/get-tree-node/${urlPlaceholders.nodeTypeName}?LoadChildren=LoadAllDescendants&LoadTestSettings=True`
  },

  dataManagement: {
    summaryStats: 'summarystats/{labMonthStatsInfo}/{yearMonth}',
    actions: 'actions', // CodeList//
    reporting: { // PdfReporting microservice //
      getAllReports: 'pdfreporting/reports/list/AllReports/{reportLevel}/{entityId}',
      generateAllReports:
        'pdfreporting/reports/generate/AllReports/{reportLevel}/{save}',
      generateTimeoutReports:
        'pdfreporting/reports/savepdf/AllReports/{reportLevel}/{save}',
      getReportPDF:
        'pdfreporting/reports/{reportId}',
      releaseNotes: 'pdfreporting/release-notes/{fileName}',
    }
  },

  dynamicReporting: {
    generateReport: 'dynreport/generate_pdf',
    viewReport: 'dynreport/view_pdf_p2',
    saveReport: 'dynreport/save_pdf_p2',
    searchReport: 'labsetup/v1/DynamicReport/LabConfigs',
    retrieveStatistics: 'dynreport/retrieve-statistics',
    getTemplates: 'dynreport/get_filter_template',
    saveTemplate: 'dynreport/save_filter_template',
    notificationsReport: `dynreport/notification/${urlPlaceholders.locationId}`,
    dismissNotificationReport: `dynreport/notification/dismiss/${urlPlaceholders.notificationId}`,
    dismissAllNotificationReport: `dynreport/notification/dismiss-all/${urlPlaceholders.locationId}`,
    updateNotificationReport: `dynreport/notification/${urlPlaceholders.notificationId}?isRead=true`,
    createReport: 'dynreport/generate_pdf_p2',
    updateTemplate: 'dynreport/update_filter_template',
    deleteTemplate: `dynreport/delete_filter_template/${urlPlaceholders.templatedId}`
  },

  portal: { // this is all the new aws endpoints for PortalAPI (DON'T DELETE THEM)
    portalData: 'portaldata',
    labSetup: `labsetup/${urlPlaceholders.nodeTypeName}`,
    // TODO: Remove labSetupV2 when labSetup supports v2 url instead
    labSetupV2: `labsetup/v2/${urlPlaceholders.nodeTypeName}`, // used for UM post user (add/edit)
    labSetupV3: `labsetup/v3/${urlPlaceholders.nodeTypeName}`, // used for customer facing UM post user (add/edit)
    labSetupBatch: `labsetup/batch/${urlPlaceholders.nodeTypeName}`,
    labSetupList: `labsetup/list/${urlPlaceholders.nodeType}`,
    // TODO: Remove labSetupGet when labSetup supports v2 url instead for all nodeTypes
    labSetupGet: `labsetup/${urlPlaceholders.nodeTypeName}/${urlPlaceholders.nodeId}`,
    labSetupGetV2: `labsetup/v2/${urlPlaceholders.nodeTypeName}/${urlPlaceholders.nodeId}`,
    labSetupGetNodeFromHeader: `labsetup/v2/${urlPlaceholders.nodeTypeName}`,
    labSetupGetAncestors: `labsetup/ancestors/${urlPlaceholders.nodeTypeName}/${urlPlaceholders.nodeId}`,
    labSetupGetAncestorsMultiple: `labsetup/ancestors/${urlPlaceholders.nodeTypeName}`,
    labSetupDuplicate: `labsetup/duplicate/${urlPlaceholders.nodeTypeName}`,
    duplicateLotInstruments: `list-duplicate-lot-instruments/${urlPlaceholders.instrumentId}/${urlPlaceholders.productId}/${urlPlaceholders.sourceProductMasterLotId}/${urlPlaceholders.targetProductMasterLotId}`,
    duplicateNode: `labsetup/duplicate-nodes/${urlPlaceholders.nodeTypeName}`,
    labSetupDelete: `labsetup/${urlPlaceholders.nodeTypeName}/${urlPlaceholders.nodeId}`,
    labSetupDeleteV2: `labsetup/v2/${urlPlaceholders.nodeTypeName}/${urlPlaceholders.nodeId}`,
    labSetupDeleteAccount: `labsetup/${urlPlaceholders.nodeTypeName}/${urlPlaceholders.nodeId}`,
    labSetupSearch: `labsetup/v2/search/${urlPlaceholders.nodeType}/${urlPlaceholders.searchString}`,
    labSetupSearchList: `labsetup/search/${urlPlaceholders.nodeTypeName}`,
    labSetupSearchLocationList: `labsetup/v2/search/${urlPlaceholders.nodeTypeName}`, // used for search location
    labSetupSearchBioRadUser: `labsetup/search/bioraduser`,
    labSetupBioRadUser: `labsetup/bioraduser`,
    labSetupBioRadUserDelete: `labsetup/bioraduser/${urlPlaceholders.nodeId}`,
    accountSettings: `labsetup/account-settings`,
    panel: `panel`,
    allowedRoles: `labsetup/allowedUserRoles`,
    expiredLotsV2: `labsetup/v2/expiredLots/${urlPlaceholders.nodeId}?groupedbydepartment=`,
    labSetupLocationLookup: `labsetup/location/lookup`,
    localePreferencesPost: `labsetup/localePreferences`,
    labSetupAddNonBrControl: `labsetup/batch/product/nbr`,
    labSetupStartNewNonBrLot: `labsetup/product/nbr/masterlot`,
    labSetupCustomProductDelete: `labsetup/product/nbr`,
  },

  lotviewerReport: `powerbi/embedtoken/${urlPlaceholders.lotviewerReportType}`,

  panels: 'panels',

  labData: {
    yearsAndMonthsWithPointData: 'Stats/hasdata/{year}/{labTestIds}',
    rawdata: 'rawdata',
    rawdataAdvLj: `rawdata?type=ALJ&labtestid=${urlPlaceholders.labTestId}&datatype=RunData&startdate=${urlPlaceholders.startDate}&enddate=${urlPlaceholders.endDate}&output=zip&v=${urlPlaceholders.cacheBuster}`,
    auditTracking: 'audit-tracking',
    navAuditTracking: 'at',
    navAuditTrackingNonauth: 'atna',
    navAuditTrackingHistory: 'ath'
  },

  dataReview: {
    base: 'data-review',
    unreviewedData: 'data',
    dataRunCount: 'count',
    reviewedData: 'data/review',
    userReviewPreferences: 'user/preferences',
    expectedTests: 'user/manageexpectedtests',
    missingTest: '/user/missingexpectedtests'
  },

  codelistManagement: {
    queryStringParams: {
      productLot: 'productLot',
      analyte: 'analyte',
      instrument: 'instrument',
      reagent: 'reagent',
      id: 'id'
    },
    analyte: 'analytes',
    units: 'units',
    method: 'methods',
    manufacturer: `manufacturers?type=${urlPlaceholders.manufacturerType}&locationId=${urlPlaceholders.locationId}`,
    calibrator: 'calibrators',
    calibratorLot: 'calibrators/{calibratorId}/calibratorLots',
    productsByInstrumentAndLocationId: `products?instrument=${urlPlaceholders.instrumentId}&locationId=${urlPlaceholders.locationId}`,
    reagent: 'reagents',
    reagentLot: 'reagents/{reagentId}/reagentLots',
    productMasterLotsByProductId: `products/${urlPlaceholders.productId}/productmasterlots`,
    testSpecSearch:
      'test-specs?a={analyteId}&m={methodId}&i={instrumentId}&r={reagentLotId}&u={unitId}&c={calibratorLotId}',
    testSpec: 'test-specs/{testSpecId}',
    testSpecAdd: 'test-specs',
    testSpecAddBatch: 'test-specs/add-test-specs',
    tests: 'tests/{codeListTestId}',
    instrumentsList: 'manufacturers/{manufacturerId}/instruments',
    reagentLotsByTestIds: 'tests/reagentsbytestids',
    calibratorLotsByTestIds: 'tests/calibratorsbytestids',
    testSpecsByIds: 'test-specs/testspecsbyids',
    customProducts: 'products/nbr',
    customProductsByAccountId: 'products/nbr/{accountId}',
    customProductLots: 'productmasterlots/nbr'
  },

  connectivity: {
    status: `status?AccountId=${urlPlaceholders.accountId}`, // depracated
    getStatuses: `v3/statuses`,
    getStatusesId: `v3/statuses/{objectId}`,
    getStatusFileUrlById: `v3/status/fileUrl/{statusId}`,
    updateStatus: 'v3/statuses',
    uploadFiles: `v3/files`,
    getParsing: `v2/parsing`,
    postParsing: `v2/parsing/location`,
    parsingAdd: 'parsing',
    parsingInfa: `parsing/infa`,
    instructionsById: `v2/parsing/{parsingJobConfigId}`,
    parsingInstructions: `v2/parsing/{parsingJobConfigId}`,
    codemapping: `v2/codemapping/codes`,
    mapInstrument: 'v2/codemapping/map-instrument',
    unMapInstrument: 'v2/codemapping/unmap-instrument',
    enableInstrument: 'v2/codemapping/enable-instrument',
    disableInstrument: 'v2/codemapping/disable-instrument',
    deleteInstrument: 'v2/codemapping/delete-instrument',
    mapProduct: 'v2/codemapping/map-product',
    unMapProduct: 'v2/codemapping/unmap-product',
    enableProduct: 'v2/codemapping/enable-product',
    disableProduct: 'v2/codemapping/disable-product',
    deleteProduct: 'v2/codemapping/delete-product',
    mapTest: 'v2/codemapping/map-test-with-multiple-reagents',
    unMapTest: 'v2/codemapping/unmap-test',
    enableTest: 'v2/codemapping/enable-test',
    disableTest: 'v2/codemapping/disable-test',
    deleteTest: 'v2/codemapping/delete-test',
    loadFullTree: `labsetup/v2/get-tree-node/${urlPlaceholders.nodeTypeName}?LoadChildren=LoadAllDescendants`,
    getTransformers: 'transformers/list',
    setTransformers: 'transformers/update',
    getTransformerFields: 'transformers/formfields',
    addTransformerConfiguration: 'transformers/configure',
    updateTransformerConfiguration: 'transformers/configuration/update',
    deleteConfiguration: `delete/configuration`,
    getEdgeBoxIdentifiers: 'edgedevices/unassigned'
  },

  spcRules: { // Change all to LabData TestSettings endpoint - need to add new endpoint calls to labdataservice.ts //
    rules: 'RulesTemplate',
    testSettings: 'testsettings/LabTest/{id}',
    productSettings: 'testsettings/LabProduct/{id}',
    saveSettings: 'testsettings',
    // AJT will restore this to settings from settingsv2 once we move to QA
    settings: `settingsv2/${urlPlaceholders.nodeTypeName}/${urlPlaceholders.entityId}/${urlPlaceholders.parentEntityId}`,
    spcRuleSettings: `settings/${urlPlaceholders.nodeTypeName}`
  },

  userManagement: { // no change in aws - goes to User Management microservice)
    addUser: 'user',
    editUser: 'user',
    deleteUser: 'user',
    userCheck: 'user/check'
  },

  labconfiguration: {
    tests: 'tests'
  },

  shared: {
    // refactor of the TestTracker concept is needed
    testTracker: {
      // remote TestTracker. Part 1 which tracks last selected tree entity can be stored in user preferences and the
      // Part 2 which sets the default
      // TestSpec for a LabTest is simply stored as TestSpecId in the new tree entity
      // (i.e. when a user changes lot, change the TestSpecId on the LabTest but leave TestId alone)
      save: 'test-tracker/save',
      delete: 'test-tracker/delete/{labTestId}'
    }
  },

  notification: {
    subscribe: '/subscribe',
    unsubscribe: '/unsubscribe',
    notification: 'notification',
    dismiss: `notification/dismiss/${urlPlaceholders.notificationUuid}`,
    dismissAll: `notification/dismiss-all-notification/${urlPlaceholders.locationId}`
  },

  floatingStatistics: {
    floatingStatisticsTimeframe: 'floating-statistics',
    floatingStatisticsStart: `floating-statistics-start/${urlPlaceholders.entityId}`
  },

  evaluationMeanSd: {
    evaluationMeanSdItems: 'evaluation-mean-sd-items',
    evaluationMeanSd: 'evaluation-mean-sd',
    evaluationMeanSdForRun: `evaluation-mean-sd-for-run/${urlPlaceholders.runId}`
  },

  trackingLog: {
    errorLogger: 'log/error'
  },

  updateSortOrder: `update-sort-order/${urlPlaceholders.nodeTypeName}`,

  emailSender: {
    presignedURL: 'getpresignedurl',
    send: 'send'
  }
};
