/*
* Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
*/
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { DynamicReport } from '../page-objects/UN-12458_QuickReport.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/UN-12458_QuickReport.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite:Verify Permissions to Dynamic Reports', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const newLabSetup = new NewLabSetup();
  const dynamicReport = new DynamicReport();

  it('Test case 1 :Verify the Presence of quick report button at instrument level for Lab Supervisor role', function () {
    library.logStep('Test case 1:Verify Presence of Text label as Create report for this instrument"');
    library.logStep('Test case 2:Verify Presence of Create report button for instrument level');
    library.logStep('Test case 3:Verify Presence of calendar at instrument level');
    library.logStep('Test case 4:Verify user navigates to dynamic report page after clicking on Quick report button.');
    library.logStep('Test case 5:Verify presence of Report Type Dropdown,Month Calendar,Create and cancel button at Dynamic report page.');
    library.logStep('Test case 6:Verify "All" report type are selected BYdefault when coming from quick report to Dynamic report page.');
    library.logStep('Test case 7:Verify if Create button present at DR page is enabled');
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyQuickReportsComponentAtInstrument().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.VerifyCurrentMonthIsDefaultInCalender().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyNavigationToReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyUIComponentsAtReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyAllReportsTypeSelectedByDefault().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyIfCreateButtonIsEnabled().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    out.signOut();
  });
  it('Test case 2 :Verify if Month selected from the calendar present at instrument level is tranferred to Dynamic report tab through quick report', function () {
    library.logStep('Test case 1:Verify if Month selected from the calendar present at instrument level is tranferred to Dynamic report tab through quick report"');
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyIfSelectedMonthIsNavigatedToReportsTab(jsonData.Month).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    out.signOut();
  });

  it('Test case 3 :Verify the Presence of quick report button at Control level for Lab Supervisor role', function () {
    library.logStep('Test case 1:Verify Presence of Text label as Create report for this Control"');
    library.logStep('Test case 2:Verify Presence of Create report button for Control level');
    library.logStep('Test case 3:Verify Presence of calendar at Control level');
    library.logStep('Test case 4:Verify user navigates to dynamic report page after clicking on Quick report button.');
    library.logStep('Test case 5:Verify presence of Report Type Dropdown,Month Calendar,Create and cancel button at Dynamic report page.');
    library.logStep('Test case 6:Verify "All" report type are selected BYdefault when coming from quick report to Dynamic report page.');
    library.logStep('Test case 7:Verify if Create button present at DR page is enabled');
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyQuickReportComponentAtControl().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.VerifyCurrentMonthIsDefaultInCalender().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyNavigationToReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyUIComponentsAtReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyAllReportsTypeSelectedByDefault().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyIfCreateButtonIsEnabled().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    out.signOut();
  });

  it('Test case 4 :Verify if Month selected from the calendar present at Control level is tranferred to Dynamic report tab through quick report', function () {
    library.logStep('Test case 1:Verify if Month selected from the calendar present at Control level is tranferred to Dynamic report tab through quick report"');
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyIfSelectedMonthIsNavigatedToReportsTab(jsonData.Month).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    out.signOut();
  });

  it('Test case 5 :Verify the Presence of quick report button at instrument level for Lead Tech', function () {
    library.logStep('Test case 1:Verify Presence of Text label as Create report for this instrument"');
    library.logStep('Test case 2:Verify Presence of Create report button for instrument level');
    library.logStep('Test case 3:Verify Presence of calendar at instrument level');
    library.logStep('Test case 4:Verify user navigates to dynamic report page after clicking on Quick report button.');
    library.logStep('Test case 5:Verify presence of Report Type Dropdown,Month Calendar,Create and cancel button at Dynamic report page.');
    library.logStep('Test case 6:Verify "All" report type are selected BYdefault when coming from quick report to Dynamic report page.');
    library.logStep('Test case 7:Verify if Create button present at DR page is enabled');
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyQuickReportsComponentAtInstrument().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.VerifyCurrentMonthIsDefaultInCalender().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyNavigationToReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyUIComponentsAtReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyAllReportsTypeSelectedByDefault().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyIfCreateButtonIsEnabled().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    out.signOut();
  });
  it('Test case 6 :Verify if Month selected from the calendar present at instrument level is tranferred to Dynamic report tab through quick report', function () {
    library.logStep('Test case 1:Verify if Month selected from the calendar present at instrument level is tranferred to Dynamic report tab through quick report"');
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyIfSelectedMonthIsNavigatedToReportsTab(jsonData.Month).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    out.signOut();
  });

  it('Test case 7 :Verify the Presence of quick report button at Control level for Lab Supervisor role', function () {
    library.logStep('Test case 1:Verify Presence of Text label as Create report for this Control"');
    library.logStep('Test case 2:Verify Presence of Create report button for Control level');
    library.logStep('Test case 3:Verify Presence of calendar at Control level');
    library.logStep('Test case 4:Verify user navigates to dynamic report page after clicking on Quick report button.');
    library.logStep('Test case 5:Verify presence of Report Type Dropdown,Month Calendar,Create and cancel button at Dynamic report page.');
    library.logStep('Test case 6:Verify "All" report type are selected BYdefault when coming from quick report to Dynamic report page.');
    library.logStep('Test case 7:Verify if Create button present at DR page is enabled');
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyQuickReportComponentAtControl().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.VerifyCurrentMonthIsDefaultInCalender().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyNavigationToReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyUIComponentsAtReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyAllReportsTypeSelectedByDefault().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyIfCreateButtonIsEnabled().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    out.signOut();
  });

  it('Test case 8 :Verify if Month selected from the calendar present at Control level is tranferred to Dynamic report tab through quick report', function () {
    library.logStep('Test case 1:Verify if Month selected from the calendar present at Control level is tranferred to Dynamic report tab through quick report"');
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyIfSelectedMonthIsNavigatedToReportsTab(jsonData.Month).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    out.signOut();
  });

  it('Test case 9 :Verify the Presence of quick report button at instrument level for Tech', function () {
    library.logStep('Test case 1:Verify Presence of Text label as Create report for this instrument"');
    library.logStep('Test case 2:Verify Presence of Create report button for instrument level');
    library.logStep('Test case 3:Verify Presence of calendar at instrument level');
    library.logStep('Test case 4:Verify user navigates to dynamic report page after clicking on Quick report button.');
    library.logStep('Test case 5:Verify presence of Report Type Dropdown,Month Calendar,Create and cancel button at Dynamic report page.');
    library.logStep('Test case 6:Verify "All" report type are selected BYdefault when coming from quick report to Dynamic report page.');
    library.logStep('Test case 7:Verify if Create button present at DR page is enabled');
    let role = "Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyQuickReportsComponentAtInstrument().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.VerifyCurrentMonthIsDefaultInCalender().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyNavigationToReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyUIComponentsAtReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyAllReportsTypeSelectedByDefault().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyIfCreateButtonIsEnabled().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    out.signOut();
  });
  it('Test case 10 :Verify if Month selected from the calendar present at instrument level is tranferred to Dynamic report tab through quick report', function () {
    library.logStep('Test case 1:Verify if Month selected from the calendar present at instrument level is tranferred to Dynamic report tab through quick report"');
    let role = "Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyIfSelectedMonthIsNavigatedToReportsTab(jsonData.Month).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    out.signOut();
  });

  it('Test case 11 :Verify the Presence of quick report button at Control level for Lab Supervisor role', function () {
    library.logStep('Test case 1:Verify Presence of Text label as Create report for this Control"');
    library.logStep('Test case 2:Verify Presence of Create report button for Control level');
    library.logStep('Test case 3:Verify Presence of calendar at Control level');
    library.logStep('Test case 4:Verify user navigates to dynamic report page after clicking on Quick report button.');
    library.logStep('Test case 5:Verify presence of Report Type Dropdown,Month Calendar,Create and cancel button at Dynamic report page.');
    library.logStep('Test case 6:Verify "All" report type are selected BYdefault when coming from quick report to Dynamic report page.');
    library.logStep('Test case 7:Verify if Create button present at DR page is enabled');
    let role = "Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyQuickReportComponentAtControl().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.VerifyCurrentMonthIsDefaultInCalender().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyNavigationToReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyUIComponentsAtReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyAllReportsTypeSelectedByDefault().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyIfCreateButtonIsEnabled().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    out.signOut();
  });

  it('Test case 12 :Verify if Month selected from the calendar present at Control level is tranferred to Dynamic report tab through quick report', function () {
    library.logStep('Test case 1:Verify if Month selected from the calendar present at Control level is tranferred to Dynamic report tab through quick report"');
    let role = "Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyIfSelectedMonthIsNavigatedToReportsTab(jsonData.Month).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    out.signOut();
  });

  it('Test case 13 :Verify the Presence of quick report button at instrument level for Account User Manager + Lab Supervisor', function () {
    library.logStep('Test case 1:Verify Presence of Text label as Create report for this instrument"');
    library.logStep('Test case 2:Verify Presence of Create report button for instrument level');
    library.logStep('Test case 3:Verify Presence of calendar at instrument level');
    library.logStep('Test case 4:Verify user navigates to dynamic report page after clicking on Quick report button.');
    library.logStep('Test case 5:Verify presence of Report Type Dropdown,Month Calendar,Create and cancel button at Dynamic report page.');
    library.logStep('Test case 6:Verify "All" report type are selected BYdefault when coming from quick report to Dynamic report page.');
    library.logStep('Test case 7:Verify if Create button present at DR page is enabled');
    let role = "Account User Manager + Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyQuickReportsComponentAtInstrument().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.VerifyCurrentMonthIsDefaultInCalender().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyNavigationToReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyUIComponentsAtReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyAllReportsTypeSelectedByDefault().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyIfCreateButtonIsEnabled().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    out.signOut();
  });
  it('Test case 14 :Verify if Month selected from the calendar present at instrument level is tranferred to Dynamic report tab through quick report', function () {
    library.logStep('Test case 1:Verify if Month selected from the calendar present at instrument level is tranferred to Dynamic report tab through quick report"');
    let role = "Account User Manager + Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyIfSelectedMonthIsNavigatedToReportsTab(jsonData.Month).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    out.signOut();
  });

  it('Test case 15 :Verify the Presence of quick report button at Control level for Lab Supervisor role', function () {
    library.logStep('Test case 1:Verify Presence of Text label as Create report for this Control"');
    library.logStep('Test case 2:Verify Presence of Create report button for Control level');
    library.logStep('Test case 3:Verify Presence of calendar at Control level');
    library.logStep('Test case 4:Verify user navigates to dynamic report page after clicking on Quick report button.');
    library.logStep('Test case 5:Verify presence of Report Type Dropdown,Month Calendar,Create and cancel button at Dynamic report page.');
    library.logStep('Test case 6:Verify "All" report type are selected BYdefault when coming from quick report to Dynamic report page.');
    library.logStep('Test case 7:Verify if Create button present at DR page is enabled');
    let role = "Account User Manager + Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyQuickReportComponentAtControl().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.VerifyCurrentMonthIsDefaultInCalender().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyNavigationToReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyUIComponentsAtReportsTab().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyAllReportsTypeSelectedByDefault().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    dynamicReport.verifyIfCreateButtonIsEnabled().then(function (Verified) {
      expect(Verified).toBe(true);
    });
    out.signOut();
  });

  it('Test case 16 :Verify if Month selected from the calendar present at Control level is tranferred to Dynamic report tab through quick report', function () {
    library.logStep('Test case 1:Verify if Month selected from the calendar present at Control level is tranferred to Dynamic report tab through quick report"');
    let role = "Account User Manager + Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dynamicReport.verifyIfSelectedMonthIsNavigatedToReportsTab(jsonData.Month).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    out.signOut();
  });

  it('Test case 17 :To Verify that the user does not have access to Reports Page', function () {

  
    let role = "Account User Manager";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
      
      dynamicReport.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(false);
    });
  
  out.signOut();
  
  
  
  });

  it('Test case 18 :To Verify that the user does not have access to Reports Page', function () {

  
    let role = "Lab User Manager";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (result) {
      expect(result).toBe(true);
    });
      
      dynamicReport.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(false);
    });
  
  out.signOut();
   
  });
});
