// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */

var fsj = require("jsonfile");
var path = require('path');
var fs = require('fs');
var moment = require('moment');
const fsExtra = require('fs-extra');
var downloadsPath = path.resolve(__dirname, './e2e/qcp-central/qcp-downloads');

const {
  SpecReporter
} = require('jasmine-spec-reporter');

var TfsReporter = require('jasmine-tfs-reporter');
const { split } = require("ts-node");
//Capture timestamp
var now = moment();
var timestamp = now.format('YYYY-MM-DD-HH-mm-ss');
var dateStamp = now.format('DD-MM-YYYY-hh-mm-ss');
var xmlDirPath = path.join(path.join(__dirname), './allure-results/Allure-XML' + '/' + dateStamp);
var htmlDirPath = path.join(path.join(__dirname), './allure-results/Allure-HTML' + '/' + dateStamp);

exports.config = {
  allScriptsTimeout: 250000,
  plugins: [

    {

      path: "node_modules/protractor-image-comparison/build",

      options: {

        baselineFolder: path.join(process.cwd(), './image/compared'),

        formatImageName: `{tag}-{logName}-{width}x{height}`,

        screenshotPath: path.join(process.cwd(), './image/screenshot'),

        autoSaveBaseline: 'true',

      },

    },

  ],
  specs: [
    //'./e2e/settings-labsetup-module/copy-instarument-pbi-197745-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/copy-instarument-pbi-197746-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/copy-instarument-pbi-197747-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/copy-instarument-pbi-197745_WithoutDept-e2e.spec.ts',
    // './e2e/qcp-central/data-mapped-config.spec.ts',
    // './e2e/qcp-central/data-unmapped-config.spec.ts',
    // './e2e/qcp-central/unity-sync.spec.ts',
    //'./e2e/qcp-central/nguc-config.spec.ts',
    //'./e2e/qcp-central/view-valid-config.spec.ts',
    //'./e2e/qcp-central/transformer-administrator.spec.ts',
    //'./e2e/qcp-central/import-valid-config.spec.ts',   
    //'./e2e/qcp-central/codelist-reagent.spec.ts',
    //'./e2e/qcp-central/codelist-manufacturer.spec.ts',   
    //'./e2e/settings-labsetup-module/RequestNewReagentCalibratorLot-187076.spec.ts'
    //'./e2e/user-module/add-user-PBI196501-e2e.spec.ts'
    //'./e2e/user-module/admin-user-login-e2e.spec.ts',
    //'./e2e/user-module/admin-user-authorization-e2e.spec.ts',
    //'./e2e/user-module/manually-edit-user-e2e.spec.ts',
    //'./e2e/user-module/manually-add-new-user-e2e.spec.ts',
    //'./e2e/user-module/admin-delete-user-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/EvaluationMeanSD-e2e.spec.ts', 
    //'./e2e/settings-labsetup-module/duplicate-lot-e2e.spec.ts'
    //'./e2e/datatable-module/multi-point_1.spec.ts',
    //'./e2e/datatable-module/multi-point_2.spec.ts', 
    //'./e2e/datatable-module/multi-point_3.spec.ts',  
    //'./e2e/datatable-module/multi-point_4.spec.ts',
    //'./e2e/datatable-module/multi-point_5.spec.ts',
    //'./e2e/settings-labsetup-module/settings-spec1-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/settings-spec2-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/settings-spec3-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/settings-spec4-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/panels-e2e.spec.ts',
    //'./e2e/westgard-rule-module/westgardRules_7T-Spec1-e2e.spec.ts',
    //'./e2e/westgard-rule-module/westgardRules_7T-Spec2-e2e.spec.ts',
    //'./e2e/westgard-rule-module/westgardRules_7T-Spec3-e2e.spec.ts',
    //'./e2e/westgard-rule-module/westgardRules_7T-e2e.spec.ts',
    //'./e2e/westgard-rule-module/3-1s-Westgard-Rule-e2e.spec.ts',
    //'./e2e/westgard-rule-module/4-1s-Westgard-Rule-e2e.spec.ts',
    //'./e2e/westgard-rule-module/1-3s-Westgard-Rule-e2e.spec.ts',
    //'./e2e/westgard-rule-module/1-2s-westgard-rules-e2e.spec.ts',
    //'./e2e/westgard-rule-module/2-2s-westgard-rules-e2e.spec.ts',
    //'./e2e/westgard-rule-module/2-3-2s-westgard-rules-e2e.spec.ts'
    //'./e2e/westgard-rule-module/WestgardRules_R4S-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/settings-labsetup-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/settings-Inheritance-e2e.spec.ts',
    //'./e2e/datatable-module/multi-point_new.spec.ts',
    //'./e2e/new-navigation-module/navigation-e2e.spec.ts',
    //'./e2e/datatable-module/PriorDateTime-e2e.spec.ts',
    //'./e2e/datatable-module/WR7x-e2e.spec.ts',
    //'./e2e/datatable-module/WR8x-e2e.spec.ts',
    //'./e2e/datatable-module/WR9x-e2e.spec.ts',
    //'./e2e/datatable-module/WR10x-e2e.spec.ts',
    //'./e2e/datatable-module/WR12x-e2e.spec.ts',
    //'./e2e/user-module/qc-lot-viewer-e2e.spec.ts',
    //'./e2e/sanity/Sanity-Suite-e2e.spec.ts',
    //'./e2e/user-module/admin-account-management-e2e.spec.ts'
    //'./e2e/new-labsetup-module/labsetup-e2e.spec.ts'
    //'./e2e/datatable-module/Data_Entry_Option-e2e.spec.ts',
    //'./e2e/dashboard-module/actionable-dashboard-e2e.spec.ts',
    //'./e2e/user-module/admin-user-management-e2e.spec.ts',
    //'./e2e/user-module/Lab-setup-node-search-e2e.spec.ts',
    //'./e2e/labsetup-module/setup-point-data-entry-e2e.spec.ts',
    //'./e2e/connectivity-module/connectivity-newMap-e2e.spec.ts',
    //'./e2e/settings-labsetup-module/advancedlj-210167-e2e.spec.ts',
    // './e2e/westgard-rule-module/R2.40-vitros-Westgard_Rules_Multiple_Reagents-e2e.spec.ts',
    // './e2e/user-module/AddUser-PBI_10782-e2e.spec.ts',
    // 'e2e/permission-model-module/UN-10605-PermissionsUserManagement.spec.ts',
    // './e2e/permission-model-module/PBI-10647-Search-Bio-RadUserManagementPage.spec.ts',
    // './e2e/permission-model-module/PBI-10793-Add-User-Bio-Rad-User-Management.spec.ts',
    // './e2e/permission-model-module/PBI-10794-Edit-A-User-Bio-Rad-User-Management.spec.ts',
    // './e2e/audit-trail/TrackUserActivityOnNotifications-UN-11112.spec.ts',
    //// './e2e/audit-trail/TrackUserActivityOnControlDataTable-UN-11109.spec.ts',
    // './e2e/audit-trail/TrackUsersActivityOnGearIcon-UN-11073.spec.ts',
    // './e2e/audit-trail/TrackUserActivityOnUNSettings-UN-11082.spec.ts',
    //'./e2e/audit-trail/TrackUsersActivityOnUnityNextForLabSetup-UN-11081.spec.ts',
    // //'./e2e/audit-trail/UN-15363DynamicReportAT.spec.ts',
    // //'./e2e/audit-trail/HistorySectionOnDataTable-UN-10530.spec.ts',
    // //'./e2e/audit-trail/UN-10518Labsetting.spec.ts',
    //'./e2e/UN-14318.spec.ts'
    // './e2e/dynamic-reports-phase2/UN-17225-ErrorDialogBox.spec.ts',
    // './e2e/connectivity-module/UN-14086-Connectivity-Error-Enhancements.spec.ts',
    //'./e2e/connectivity-module/UN-17612-Connectivity-Error-Enhancements.spec.ts',
    //'./e2e/BenchAndReview/UN-16267AdvanceQclicenseType.spec.ts'
    //'./e2e/BenchAndReview/UN-13945DashboardCard.spec.ts',
    // './e2e/BenchAndReview/UN-13947DataColumns.spec.ts',
    //'./e2e/BenchAndReview/AbilityToManageDataColumn-UN-13949.spec.ts'
    // './e2e/BenchAndReview/RenameSendToPeerQcButtonToSubmit-UN-17005.spec.ts',
    // './e2e/BenchAndReview/BenchReviewPermissionsForNewRoles-UN-15018.spec.ts',
    //  './e2e/BenchAndReview/AbilityToReviewIndividualDataRuns-UN-16749.spec.ts'
   // //'./e2e/BenchAndReview/AbilityToReviewDataOnCurrentPageAndAllData-UN-13951.spec.ts',
   ////'./e2e/BenchAndReview/SaveAndPersistColumnPreferencesByUser-UN-16828.spec.ts',
   //'./e2e/BenchAndReview/updatedDataPointsResentForBenchReview-UN-17126.spec.ts',
   //./e2e/BenchAndReview/TopFiltersCounts-UN-17066.spec.ts'
   //'./e2e/BenchAndReview/AbilityToReviewDataOnCurrentPageAndAllData-UN-13951.spec.ts',
   ////'./e2e/BenchAndReview/SaveAndPersistColumnPreferencesByUser-UN-16828.spec.ts',
   //'./e2e/BenchAndReview/updatedDataPointsResentForBenchReview-UN-17126.spec.ts',
    ////./e2e/BenchAndReview/TopFiltersCounts-UN-17066.spec.ts',
    ////'./e2e/BenchAndReview/AdditionalFilterCounts-UN-17067.spec.ts',
    //'./e2e/BenchAndReview/ApplicationofTopfilter-UN-16669.spec.ts',
     //'./e2e/BenchAndReview/EditDataMode-View-UN17117.spec.ts',
    //'./e2e/BenchAndReview/ManageExpectedTestsLink-UN-14761.spec.ts',
   // //'./e2e/BenchAndReview/Tooltip-DynamicFilters-UN-17064.spec.ts',
    //'./e2e/BenchAndReview/B&SReviewIndepndntData-UN-17764.spec.ts',
    //'./e2e/BenchAndReview/SupportDataForColumnsPeerMeanPeerSdPeerCv-UN-17129.spec.ts',
    //'./e2e/BenchAndReview/BenchAndSupervisorReviewpermissionsForCTSUser-UN-16594.spec.ts',
    //'./e2e/BenchAndReview/AtDataUpdForBenAndSuperRev-UN-15913.spec.ts',
    //'./e2e/BenchAndReview/UpdatChngMadeOnEditDataUN-14764.spec.ts',
    './e2e/BenchAndReview/AdditionalFilters-UN-14917.spec.ts'
  ],

  suites: {
    userLogin: './e2e/user-module/admin-user-login-e2e.spec.ts',
    userAutorization: './e2e/user-module/admin-user-authorization-e2e.spec.ts',
    editUser: './e2e/user-module/manually-edit-user-e2e.spec.ts',
    addNewUser: './e2e/user-module/manually-add-new-user-e2e.spec.ts',
    deleteUser: './e2e/user-module/admin-delete-user-e2e.spec.ts',
    accountManager: './e2e/user-module/admin-account-management-e2e.spec.ts',
    labSetup1: './e2e/new-labsetup-module/new-labsetup-spec1.e2e.spec.ts',
    labSetup2: './e2e/new-labsetup-module/new-labsetup-spec2.e2e.spec.ts',
    labSetup3: './e2e/new-labsetup-module/new-labsetup-spec3.e2e.spec.ts',
    labSetup4: './e2e/new-labsetup-module/new-labsetup-spec4.e2e.spec.ts',
    labSetup5: './e2e/new-labsetup-module/new-labsetup-spec5.e2e.spec.ts',
    settings1: './e2e/settings-labsetup-module/settings-spec1-e2e.spec.ts',
    settings2: './e2e/settings-labsetup-module/settings-spec2-e2e.spec.ts',
    settings3: './e2e/settings-labsetup-module/settings-spec3-e2e.spec.ts',
    settings4: './e2e/settings-labsetup-module/settings-spec4-e2e.spec.ts',
    settingsInherit: './e2e/settings-labsetup-module/settings-Inheritance-e2e.spec.ts',
    archiveAnalyte: './e2e/settings-labsetup-module/Archive-Analyte-e2e.spec.ts',
    archiveInstrument: './e2e/settings-labsetup-module/archive-Instrument-e2e.spec.ts',
    duplicateLot: './e2e/settings-labsetup-module/duplicate-lot-e2e.spec.ts',
    evalMeanSd: './e2e/settings-labsetup-module/EvaluationMeanSD-e2e.spec.ts',
    singlePoint: './e2e/datatable-module/point-data-entry-e2e.spec.ts',
    singleSummary: './e2e/datatable-module/Single_summary_data_entry.spec.ts',
    multiSummary1: './e2e/datatable-module/multi-summary-spec1.spec.ts',
    multiSummary2: './e2e/datatable-module/multi-summary-spec2.spec.ts',
    multiSummary3: './e2e/datatable-module/multi-summary-spec3.spec.ts',
    multiSummary4: './e2e/datatable-module/multi-summary-spec4.spec.ts',
    multiPoint1: './e2e/datatable-module/multi-point_1.spec.ts',
    multiPoint2: './e2e/datatable-module/multi-point_2.spec.ts',
    multiPoint3: './e2e/datatable-module/multi-point_3.spec.ts',
    multiPoint4: './e2e/datatable-module/multi-point_4.spec.ts',
    multiPoint5: './e2e/datatable-module/multi-point_5.spec.ts',
    priorDateTime: './e2e/datatable-module/PriorDateTime-e2e.spec.ts',
    navigation1: './e2e/new-navigation-module/new-navigation1-e2e.spec.ts',
    navigation2: './e2e/new-navigation-module/new-navigation2-e2e.spec.ts',
    '1-2s': './e2e/westgard-rule-module/1-2s-westgard-rules-e2e.spec.ts',
    '1-3s': './e2e/westgard-rule-module/1-23s-westgard-rules-e2e.spec.ts',
    '2-2s': './e2e/westgard-rule-module/2-2s-westgard-rules-e2e.spec.ts',
    '2-3-2s': './e2e/westgard-rule-module/2-3-2s-westgard-rules-e2e.spec.ts',
    '3-1s': './e2e/westgard-rule-module/3-1s-Westgard-Rule-e2e.spec.ts',
    '4-1s': './e2e/westgard-rule-module/4-1s-Westgard-Rule-e2e.spec.ts',
    'R4s': './e2e/westgard-rule-module/WestgardRules_R4S-e2e.spec.ts',
    '7T-1': './e2e/westgard-rule-module/westgardRules_7T-Sepc1-e2e.spec.ts',
    '7T-2': './e2e/westgard-rule-module/westgardRules_7T-Sepc2-e2e.spec.ts',
    '7T-3': './e2e/westgard-rule-module/westgardRules_7T-Sepc3-e2e.spec.ts',
    '7x-1': './e2e/westgard-rule-module/WR7x_1-e2e.spec.ts',
    '7x-2': './e2e/westgard-rule-module/WR7x_2-e2e.spec.ts',
    '7x-3': './e2e/westgard-rule-module/WR7x_3-e2e.spec.ts',
    '8x-1': './e2e/westgard-rule-module/WR8x_1-e2e.spec.ts',
    '8x-2': './e2e/westgard-rule-module/WR8x_2-e2e.spec.ts',
    '8x-3': './e2e/westgard-rule-module/WR8x_3-e2e.spec.ts',
    '9x-1': './e2e/westgard-rule-module/WR9x_1-e2e.spec.ts',
    '9x-2': './e2e/westgard-rule-module/WR9x_2-e2e.spec.ts',
    '9x-3': './e2e/westgard-rule-module/WR9x_3-e2e.spec.ts',
    '10x-1': './e2e/westgard-rule-module/WR10x_1-e2e.spec.ts',
    '10x-2': './e2e/westgard-rule-module/WR10x_2-e2e.spec.ts',
    '10x-3': './e2e/westgard-rule-module/WR10x_3-e2e.spec.ts',
    '12x-1': './e2e/westgard-rule-module/WR12x_1-e2e.spec.ts',
    '12x-2': './e2e/westgard-rule-module/WR12x_2-e2e.spec.ts',
    '12x-3': './e2e/westgard-rule-module/WR12x_3-e2e.spec.ts',
  },

  params: {
    user: {
      env: "",
      username: 'sampada_gulhane+lab@bio-rad.com',
      password: 'Welcome1',
      username4: 'francisco_deguzman@bio-rad.com',
      password4: 'P@ssword1',
      username1: 'sudhir_paranjape+u1@bio-rad.com',
      password1: 'Welcome1',
      username2: 'sudhir_paranjape@bio-rad.com',
      password2: 'Welcome1',
      report: 'true'
    },
  },

  // Uncomment for execution on Edge
  //Edge Legacy
  // seleniumArgs: ['-Dwebdriver.edge.driver=C:\\Users\\amruta_karale\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\webdriver-manager\\selenium\\MicrosoftWebDriver.exe'],
  // // Edge Chromium
  //  seleniumArgs: ['-Dwebdriver.edge.driver=C:\\Users\\amruta_karale\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\webdriver-manager\\selenium\\edgedriver_win64\\msedgedriver.exe'],

  /*
    capabilities: {
      //Uncomment for execution on Chrome
      browserName: 'chrome',  
      avoidProxy: true,
      chromeOptions: {
        // disable "chrome is being controlled by automated software"
        args: ['disable-infobars=true'],
        // args: ['--disable-gpu'],
        args: ['disable-backgrounding-occluded-windows'],
        // disable Password manager popup
        prefs: {
          credentials_enable_service: false
        },
          shardTestFiles: true, 
          maxInstances: 2,
      }
  */

  capabilities: {
    //Uncomment for execution on Chrome
    browserName: 'chrome',
    loggingPrefs: {
      performance: 'ALL',
    },
    //  shardTestFiles: true,
    //  maxInstances: 1,
    avoidProxy: true,
    ignoreUncaughtExceptions: true,
    chromeOptions: {

      // disable "chrome is being controlled by automated software"
      args: ['disable-infobars=true', 'disable-backgrounding-occluded-windows', '--disable-gpu'],
      // w3c: false,
      // disable Password manager popup
      prefs: {
        credentials_enable_service: false,
        download: {
          'prompt_for_download': false,
          'default_directory': downloadsPath
        },
      }
    }
    // // Uncomment for execution on IE
    // browserName: 'internet explorer',
    // avoidProxy:true,
    // ignoreProtectedModeSettings: true,
    // version: '11',
    // nativeEvents: false,
    // unexpectedAlertBehaviour: 'accept',
    // enablePersistentHover: true,
    // 'disable-popup-blocking': true

    // // Uncomment for execution on Edge
    //   browserName: 'MicrosoftEdge',
    //   avoidProxy:true,
    //   maxInstances: 1,
    //   platformName: 'windows',
    //   nativeEvents: false,
    //   shardTestFiles: true,
    //   args: ['--disable-gpu']

  },

  // // //Uncomment for execution on Chrome
  directConnect: true,
  baseUrl: 'http://localhost:4200/',

  //  // Uncomment for execution on IE
  //  seleniumAddress: 'http://localhost:4444/wd/hub/',


  // multiCapabilities: [
  //   {
  //   browserName: 'chrome',
  //   avoidProxy: true,
  //   args: ['disable-infobars=true', 'disable-backgrounding-occluded-windows'],
  //   credentials_enable_service: false,
  //   seleniumAddress: 'http://192.168.0.107:5566/wd/hub',
  //   specs : ['./e2e/user-module/admin-user-login-e2e.spec.ts'],
  //   shardTestFiles: true, 
  //   maxInstances: 1,
  //    }, 
  //    {
  //     browserName: 'chrome',
  //     avoidProxy: true,
  //     args: ['disable-infobars=true', 'disable-backgrounding-occluded-windows'],
  //     credentials_enable_service: false,
  //     shardTestFiles: true, 
  //     seleniumAddress: 'http://192.168.0.107:5577/wd/hub',
  //     specs : ['./e2e/westgard-rule-module/3-1s-Westgard-Rule-e2e.spec.ts'],
  //     maxInstances: 1,
  //    }],

  // {
  //   'browserName': 'internet explorer',
  //   avoidProxy:true,
  //   ignoreProtectedModeSettings: true,
  //   version: '11',
  //   nativeEvents: false,
  //   unexpectedAlertBehaviour: 'accept',
  //   enablePersistentHover: true,
  //   'disable-popup-blocking': true,
  //   seleniumAddress: 'http://localhost:4422/wd/hub/',
  // }, {
  //     browserName: 'MicrosoftEdge',
  //     seleniumArgs: ['-Dwebdriver.edge.driver=C:\\Users\\amruta_karale\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\webdriver-manager\\selenium\\edgedriver_win64\\msedgedriver.exe'],
  //     avoidProxy:true,
  //     maxInstances: 1,
  //     platformName: 'windows',
  //     nativeEvents: false,
  //     shardTestFiles: true,
  //     args: ['disable-gpu'],
  //     args: ['disable-backgrounding-occluded-windows'],
  //     seleniumAddress: 'http://localhost:4433/wd/hub/'
  //  }],

  // splitTestsBetweenCapabilities: true,
  // multiCapabilities: [
  //   {
  //   browserName: 'chrome',
  //   avoidProxy: true,
  //   args: ['disable-infobars=true', 'disable-backgrounding-occluded-windows'],
  //   credentials_enable_service: false,
  //   seleniumAddress: 'http://192.168.0.107:5566/wd/hub',
  //   // specs : ['./e2e/user-module/admin-user-login-e2e.spec.ts'],
  //   shardTestFiles: true,
  //   maxInstances: 1,
  //    }, 
  //    {
  //     browserName: 'chrome',
  //     avoidProxy: true,
  //     args: ['disable-infobars=true', 'disable-backgrounding-occluded-windows'],
  //     credentials_enable_service: false,
  //     // shardTestFiles: true, 
  //     seleniumAddress: 'http://192.168.0.107:5577/wd/hub',
  //     // specs : ['./e2e/westgard-rule-module/3-1s-Westgard-Rule-e2e.spec.ts'],
  //     shardTestFiles: true,
  //     maxInstances: 1,
  //    }],

  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 6000000,
    print: function () { }
  },

  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });

    browser.driver.manage().window().maximize();
    //  if (browser.params.user.report === 'true') {
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: 'raw',
        },
      })
    );

    if (browser.params.user.report == 'true') {

      if (!fs.existsSync(xmlDirPath)) {
        fs.mkdirSync(xmlDirPath, { recursive: true, mode: 777 });
      }
      if (!fs.existsSync(htmlDirPath)) {
        fs.mkdirSync(htmlDirPath, { recursive: true, mode: 777 });
      }
      fsExtra.emptyDirSync(xmlDirPath);
      fsExtra.emptyDirSync(htmlDirPath);

    }

    const AllureReporter = require("jasmine-allure-reporter");
    jasmine.getEnv().addReporter(
      new AllureReporter({
        resultsDir: xmlDirPath,
      })
    );
    // jasmine.getEnv().afterEach(function (done) {
    //   browser.takeScreenshot().then(function (png) {
    //     allure.createAttachment('Screenshot', function () {
    //         return new Buffer(png, 'base64')
    //     }, 'image/png')()
    // }).catch((error) => console.log(error));
    // });

    // Reports Configuration
    let HtmlReporter = require('protractor-beautiful-reporter');

    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: 'test-report',
        screenshotsSubfolder: 'images',
        jsonsSubfolder: 'jsons',
        docTitle: "Unity-Next Analysis...",
        preserve: false,
        excludeSkippedSpecs: true,
        takeScreenShotsForSkippedSpecs: false,
        docName: 'UnityNextReport.html',
        cssOverrideFile: 'css/style.css'
      }).getJasmine2Reporter()
    );
    // }
  },
  onComplete: function () {
    //child-process: node.js package to execute system command synchronously
    // if (browser.params.user.report === 'true') {
    const execSync = require("child_process").execSync;
    execSync('allure generate "' + xmlDirPath + '" -o "' + htmlDirPath + '" --clean');
    // }
  },


};
