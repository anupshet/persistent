//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { LoginEvent } from './page-objects/login-e2e.po';
import { LogOut } from './page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from './utils/browserUtil';
import { NewLabSetup } from './page-objects/new-labsetup-e2e.po';
import { DynamicReportsPhase2 } from './page-objects/Dynamic-reports-phase2-e2e.po';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/UN-14318.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
describe('Test Suite: Dynamic reports UI', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const newLabSetup = new NewLabSetup();
  const dynamicReport = new DynamicReportsPhase2(); 
  
  afterEach(function () {
    out.signOut();
  });
  // For Account User Manager role
  it("Test case 1: Lab setup is not visible for AUM role ", function () {
    library.logStep('Test Case: Verify Quick Reports Icon is not Visible');
    
    loginEvent.loginToApplication(jsonData.URL, jsonData.LS_Username, jsonData.LS_Password, jsonData.LS_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
      });

  // For Lab Supervisor Role
  it("Test case 1: verify the Dynamic Reports Icon navigation throughout the application ", function () {
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Dept page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Dept page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Instrument page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Instrument page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Control page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Control page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Analyte page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Analyte page');
    
    loginEvent.loginToApplication(jsonData.URL, jsonData.LS_Username, jsonData.LS_Password, jsonData.LS_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
      });
    dynamicReport.clickOnReportsIcon().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.clickOnCancelbtn().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.LS_DepartmentName).then(function (Department) {
        expect(Department).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LS_InstrumentName).then(function (Instrument) {
        expect(Instrument).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LS_ControlName).then(function (Control) {
        expect(Control).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LS_AnalyteName).then(function (Analyte) {
        expect(Analyte).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
  });

      // For Lab Technician Role
      it("Test case 1: verify the Dynamic Reports Icon navigation throughout the application ", function () {
        library.logStep('Test Case: Verify Quick Reports Icon is Visible in Dept page');
        library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Dept page');
        library.logStep('Test Case: Verify Quick Reports Icon is Visible in Instrument page');
        library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Instrument page');
        library.logStep('Test Case: Verify Quick Reports Icon is Visible in Control page');
        library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Control page');
        library.logStep('Test Case: Verify Quick Reports Icon is Visible in Analyte page');
        library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Analyte page');
    loginEvent.loginToApplication(jsonData.URL, jsonData.LT_Username, jsonData.LT_Password, jsonData.LT_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
      });
    dynamicReport.clickOnReportsIcon().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.clickOnCancelbtn().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.LT_DepartmentName).then(function (Department) {
        expect(Department).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LT_InstrumentName).then(function (Instrument) {
        expect(Instrument).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LT_ControlName).then(function (Control) {
        expect(Control).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LT_AnalyteName).then(function (Analyte) {
        expect(Analyte).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
  });

//    For Technician Role
    it("Test case 1: verify the Dynamic Reports Icon navigation throughout the application ", function () {
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Dept page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Dept page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Instrument page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Instrument page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Control page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Control page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Analyte page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Analyte page');
loginEvent.loginToApplication(jsonData.URL, jsonData.Tech_Username, jsonData.Tech_Password, jsonData.Tech_firstname).then(function (loggedIn) {
    console.log(jsonData.URL);
    expect(loggedIn).toBe(true);
  });
dynamicReport.clickOnReportsIcon().then(function (Verified) {
  expect(Verified).toBe(true);
});
dynamicReport.clickOnCancelbtn().then(function (Verified) {
  expect(Verified).toBe(true);
});
newLabSetup.navigateTO(jsonData.Tech_DepartmentName).then(function (Department) {
    expect(Department).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.Tech_InstrumentName).then(function (Instrument) {
    expect(Instrument).toBe(true);
  });
  dynamicReport.clickOnReportsIcon().then(function (Verified) {
    expect(Verified).toBe(true);
  });
  dynamicReport.clickOnCancelbtn().then(function (Verified) {
    expect(Verified).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.Tech_ControlName).then(function (Control) {
    expect(Control).toBe(true);
  });
  dynamicReport.clickOnReportsIcon().then(function (Verified) {
    expect(Verified).toBe(true);
  });
  dynamicReport.clickOnCancelbtn().then(function (Verified) {
    expect(Verified).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.Tech_AnalyteName).then(function (Analyte) {
    expect(Analyte).toBe(true);
  });
  dynamicReport.clickOnReportsIcon().then(function (Verified) {
    expect(Verified).toBe(true);
  });
  dynamicReport.clickOnCancelbtn().then(function (Verified) {
    expect(Verified).toBe(true);
  });
});
// For Lab Use Manager + Lab Supervisor Role
it("Test case 1: verify the Dynamic Reports Icon navigation throughout the application ", function () {
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Dept page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Dept page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Instrument page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Instrument page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Control page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Control page');
    library.logStep('Test Case: Verify Quick Reports Icon is Visible in Analyte page');
    library.logStep('Test Case: Verify Clicking on Cancel button navigates back to Analyte page');
    
    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LS_Username, jsonData.LUM_LS_Password, jsonData.LUM_LS_firstname).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
      });
    dynamicReport.clickOnReportsIcon().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.clickOnCancelbtn().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.LUM_LS_DepartmentName).then(function (Department) {
        expect(Department).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LUM_LS_InstrumentName).then(function (Instrument) {
        expect(Instrument).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LUM_LS_ControlName).then(function (Control) {
        expect(Control).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.LUM_LS_AnalyteName).then(function (Analyte) {
        expect(Analyte).toBe(true);
      });
      dynamicReport.clickOnReportsIcon().then(function (Verified) {
        expect(Verified).toBe(true);
      });
      dynamicReport.clickOnCancelbtn().then(function (Verified) {
        expect(Verified).toBe(true);
      });
  });
});
});

