// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {
  SpecReporter
} = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    // './e2e/**/*.e2e-spec.ts'
    // './e2e/user-module/unity-next-e2e.spec.ts',
    //  './e2e/user-module/admin-dashboard-e2e.spec.ts',
    // './e2e/user-module/admin-gearicon-e2e.spec.ts',
    //'./e2e/user-module/admin-user-management-e2e.spec.ts'
    './e2e/user-module/reports.e2e.spec.ts'

  ],

  suites: {
    basice2e: './e2e/user-module/unity-next-e2e.spec.ts',
    admindashboard: './e2e/user-module/admin-dashboard-e2e.spec.ts',
    admingearicon: './e2e/user-module/admin-gearicon-e2e.spec.ts',
    adminlabsetup: './e2e/user-module/admin-lab-setup-e2e.spec.ts',
    datatable: './e2e/user-module/data-table-e2e.spec.ts',
    usermanagement: './e2e/user-module/admin-user-management-e2e.spec.ts',
    findnode: './e2e/user-module/Lab-setup-node-search-e2e.spec.ts',
    accountmanager: './e2e/user-module/admin-account-management-e2e.spec.ts',
    smoketest: './e2e/user-module/smoke-test-e2e.spec.ts',
    reports: './e2e/user-module/report-e2e.spec.ts'
  },

  params: {
    user: {
      username: 'francisco_deguzman@bio-rad.com',
      password: 'P@ssword1',
      username1: 'sudhir_paranjape+u1@bio-rad.com',
      password1: 'Welcome1'
    }
  },

  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      // disable "chrome is being controlled by automated software"
      'args': ['disable-infobars=true'],

      // disable Password manager popup
      'prefs': {
        'credentials_enable_service': false
      }
    }
  },
  directConnect: true,
  baseUrl: 'https://unity-d.qcnet.com/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function () {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    browser.driver.manage().window().maximize();
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
    // Reports Configuration
    let HtmlReporter = require('protractor-beautiful-reporter');
    let path = require('path');

    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'test-report',
      screenshotsSubfolder: 'images',
      jsonsSubfolder: 'jsons',
      docTitle: 'Unity-Next-Smoketest\' Analysis...',
      preserve: false,
      excludeSkippedSpecs: true,
      takeScreenShotsForSkippedSpecs: false,
      docName: 'smoke-testReport.html',
      cssOverrideFile: 'css/style.css'
    }).getJasmine2Reporter());

  }
};
