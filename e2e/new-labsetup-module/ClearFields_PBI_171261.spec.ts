/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser} from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { NewLabDepartment } from '../page-objects/new-lab-department-e2e.po';
import { AddControl } from '../page-objects/new-labsetup-add_Control-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { Feedback } from '../page-objects/new-lab-feedback-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';

const fs = require('fs');

let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/PBI_171261_ClearFields.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: PBI 171261 - Ability to clear field(s) on lab setup', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const labsetupDept = new NewLabDepartment();
  const control = new AddControl();
  const analyte = new AddAnalyte();
  const feedback = new Feedback();
  const navigation = new NewNavigation();
  let flagForIEBrowser: boolean;
  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
    });
  });
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 1: Verify clicking on clear section button clears out instrument dropdown selected values', function () {
    const depName = jsonData.DeptName;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.selectManufacturerName(jsonData.ManufacturerName).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.selectInstrumentName(jsonData.InstrumentModel).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.verifyAddInstrumentButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labsetup.clickOnClearFieldIcon(jsonData.ManufacturerName).then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labsetup.verifyAddInstrumentButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labsetup.verifyIsSelectedItemIsNotDisplayed(jsonData.ManufacturerName).then(function (enabled) {
      expect(enabled).toBe(true);
    });
  });
  it('Test Case 2: Verify clicking on clear section button clears out add control dropdown selected values', function () {
    const depName = jsonData.DeptNam2;
    const instName = jsonData.InstrumentModel2;
    const cntrlName = jsonData.ControlName;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyLotnumberDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    control.verifyCustomNameDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.clickOnClearFieldIcon(cntrlName).then(function (enabled) {
      expect(enabled).toBe(true);
    });
    control.verifyCustomNameDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
  });
  it('Test Case 3: Verify clicking on clear section button clears out add Analyte dropdown selected values', function () {
    const deptName = jsonData.DeptNam2;
    const instName = jsonData.InstrumentModel3;
    const cntrlName = jsonData.ControlName;
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.verifyAddAnalyte().then(function (status) {
      expect(status).toBe(true);
    });
    analyte.selectAnalyteName(jsonData.analyteName).then(function (selected) {
      expect(selected).toBe(true);
    });
    labsetup.clickOnClearFieldIconForAnalyte(jsonData.analyteName).then(function (selected) {
      expect(selected).toBe(true);
    });
  });
});
