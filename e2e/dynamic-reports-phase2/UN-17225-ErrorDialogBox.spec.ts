/*
* Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
*/
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { DynamicReportsPhase2 } from '../page-objects/dynamic-reports-phase2.po';
import { ErrorDialogs } from '../page-objects/UN-17225-ErrorDialogBox.po';

let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/UN-17225-ErrorDialogBox.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite:Verify Error Dialog box for Selection parameter filters on Report page', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dynamicReports = new DynamicReportsPhase2();
  const errordialogs = new ErrorDialogs();

  it('Test case 1 :Verify the presence of error dialog for Clear Selection button and More than one dept', function () {
    library.logStep('Test case 1:Verify Presence of  error dialog when more than 2 dept is selected"');
    library.logStep('Test case 2:Verify Presence of error dialog when clicked on clear selection button"');
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    errordialogs.verifyErrorDialogForDeptSelection().then(function (verified) {
      expect(verified).toBe(true);
    });
    errordialogs.clickOnClearSelectionButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    errordialogs.verifyClearSelectionErrordialog().then(function (verified) {
      expect(verified).toBe(true);
    });
    errordialogs.clickOnContinueButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    out.signOut();
  });
  it('Test case 2 :Verify the presence of error dialog for selection parameter for instrument', function () {
    library.logStep('Test case 1:Verify Presence of  error dialog when more than 5 instrument is selected');
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    errordialogs.verifyErrorDialogForInstrumentSelection().then(function (verified) {
      expect(verified).toBe(true);
    });
    out.signOut();
  });
  it('Test case 3 :Verify the presence of error dialog for selection parameter for control', function () {
    library.logStep('Test case 1:Verify Presence of  error dialog when more than 25 control is selected');
    let role = "Lab Supervisor";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    errordialogs.verifyErrorDialogForControlSelection().then(function (verified) {
      expect(verified).toBe(true);
    });
    out.signOut();
  });
  it('Test case 4:Verify the presence of error dialog for Clear Selection button and More than one dept', function () {
    library.logStep('Test case 1: Verify the presence of error dialog for Clear Selection button and More than one dept');
    let role = "Account User Manager";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(false);
    });
    out.signOut();
  });
  it('Test case 5 :Verify the presence of error dialog for Clear Selection button and More than one dept', function () {
    library.logStep('Test case 1:Verify Presence of  error dialog when more than 2 dept is selected"');
    library.logStep('Test case 2:Verify Presence of error dialog when clicked on clear selection button"');
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    errordialogs.verifyErrorDialogForDeptSelection().then(function (verified) {
      expect(verified).toBe(true);
    });
    errordialogs.clickOnClearSelectionButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    errordialogs.verifyClearSelectionErrordialog().then(function (verified) {
      expect(verified).toBe(true);
    });
    errordialogs.clickOnContinueButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    out.signOut();
  });
  it('Test case 6 :Verify the presence of error dialog for selection parameter for instrument', function () {
    library.logStep('Test case 1:Verify Presence of  error dialog when more than 5 instrument is selected');
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    errordialogs.verifyErrorDialogForInstrumentSelection().then(function (verified) {
      expect(verified).toBe(true);
    });
    out.signOut();
  });
  it('Test case 7 :Verify the presence of error dialog for selection parameter for control', function () {
    library.logStep('Test case 1:Verify Presence of  error dialog when more than 25 control is selected');
    let role = "Lead Tech";
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserName[role], jsonData.Password[role], jsonData.FirstName[role]).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dynamicReports.clickOnReportsIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    errordialogs.verifyErrorDialogForControlSelection().then(function (verified) {
      expect(verified).toBe(true);
    });
    out.signOut();
  });
});
