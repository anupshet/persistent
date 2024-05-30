//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';

const fs = require('fs');
let jsonData;
const library=new BrowserLibrary();

library.parseJson('./JSON_data/advancelj-206889.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite 206889: Create analyte description component (AnalyteDescriptionComponent )', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
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

  it('Test Case 1: To verify action of clicking on to expand analyte details button in advanced lj.', function () {
    library.logStep(' To verify action of clicking on to expand analyte details button in advanced lj.')
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
    labsetup.clickEditThisAnalyte().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.retrieveDetailsFromEditThisAnalyte().then(function (retrieved) {
      expect(retrieved).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyTextOfAnalyteComponent(jsonData.Analyte, jsonData.Instrument, jsonData.Control, jsonData.Exp).then(function (verified) {
      expect(verified).toBe(true);
    });
    advancedLj.clickExpandButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyActionOfExpand().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test Case 2: To verify action of clicking on to collapse analyte details button in advanced lj.', function () {
    library.logStep('To verify action of clicking on to collapse analyte details button in advanced lj.')
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
    labsetup.clickEditThisAnalyte().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.retrieveDetailsFromEditThisAnalyte().then(function (retrieved) {
      expect(retrieved).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyTextOfAnalyteComponent(jsonData.Analyte, jsonData.Instrument, jsonData.Control, jsonData.Exp).then(function (verified) {
      expect(verified).toBe(true);
    });
    advancedLj.clickExpandButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickCollapseButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyActionOfCollapse().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
