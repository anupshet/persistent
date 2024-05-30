//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';

const fs = require('fs');
let jsonData;
const library=new BrowserLibrary();

library.parseJson('./JSON_data/advancelj-206566.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite 206566: Update Advanced LJ panel component layout and retrieve data (AdvancedLjPanelComponent)', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const labsetup = new NewLabSetup();
  const advancedLj = new AdvancedLJ();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 1:To Verify the UI of Advanced LJ Panel Component.', function () {
    library.logStep('To Verify the UI of Advanced LJ Panel Component.')
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyUIOfAdvancedLjChart().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test Case 2:To Verify text of Analyte Component in Advanced LJ.', function () {
    library.logStep('To Verify text of Analyte Component in Advanced LJ.')
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyTextOfAnalyteComponent(jsonData.Analyte, jsonData.Instrument, jsonData.Control, jsonData.Exp).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test Case 3:To Verify action of clicking on to "X" button in Advanced LJ.', function () {
    library.logStep('To Verify action of clicking on to "X" button in Advanced LJ.')
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyActionOfCloseButton().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test Case 4:To Verify levels displayed in Advanced LJ Chart.', function () {
    library.logStep('To Verify levels displayed in Advanced LJ Chart')
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.verifyLevelDisplayedInAdvancedLjChart().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
