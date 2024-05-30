/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/MultiPoint_Spec2.json').then(function(data) {
  jsonData = data;
});
describe('Multi Point Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const multiPoint = new MultiPointDataEntryInstrument();
  const library = new BrowserLibrary();
  const setting = new Settings();
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
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 5:Instrument: Run Entry Input Data Verification Using Tab Key (Multi Point)', function () {
    library.logStep('Test case 5:Instrument: Run Entry Input Data Verification Using Tab Key (Multi Point)');
    library.logStep('Test case 26:Instrument: Run Entry Input Data Verification Using Enter Key (Multi Point)');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyRunEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '2');
    dataEnter.set('14', '4');
    dataEnter.set('17', '6');
    dataEnter.set('21', '8');
    dataEnter.set('24', '10');
    dataEnter.set('27', '12');
    dataEnter.set('31', '14');
    dataEnter.set('34', '16');
    dataEnter.set('37', '18');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '17');
    tabFocusedElement1.set('17', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '27');
    tabFocusedElement1.set('27', '31');
    tabFocusedElement1.set('31', '34');
    tabFocusedElement1.set('34', '37');
    tabFocusedElement1.set('37', 'End');

    multiPoint.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    multiPoint.verifyRunEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 6:Instrument: Level Entry Input Data Verification Using the Tab Key (Multi Point)', function () {
    library.logStep('Test case 6:Instrument: Level Entry Input Data Verification Using the Tab Key (Multi Point)');
    library.logStep('Test case 27:Instrument: Level Entry Input Data Verification Using the Enter Key (Multi Point)');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyLevelEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });

    //  step 2
    const dataEnter = new Map<string, string>();
    dataEnter.set('1001', '1');
    dataEnter.set('1004', '2');
    dataEnter.set('1007', '3');
    dataEnter.set('2001', '4');
    dataEnter.set('2004', '5');
    dataEnter.set('2007', '6');
    dataEnter.set('3001', '7');
    dataEnter.set('3004', '8');
    dataEnter.set('3007', '9');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('1001', '1004');
    tabFocusedElement1.set('1004', '1007');
    tabFocusedElement1.set('1007', '2001');
    tabFocusedElement1.set('2001', '2004');
    tabFocusedElement1.set('2004', '2007');
    tabFocusedElement1.set('2007', '3001');
    tabFocusedElement1.set('3001', '3004');
    tabFocusedElement1.set('3004', '3007');
    tabFocusedElement1.set('3007', 'End');

    multiPoint.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    multiPoint.verifyLevelEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 5:Control: Run Entry Input Data Verification Using Tab Key (Multi Point)', function () {
    library.logStep('Test case 5:Control: Run Entry Input Data Verification Using Tab Key (Multi Point)');
    library.logStep('Test case 26:Control: Run Entry Input Data Verification Using Enter Key (Multi Point)');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyRunEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '2');
    dataEnter.set('14', '4');
    dataEnter.set('17', '6');
    dataEnter.set('21', '8');
    dataEnter.set('24', '10');
    dataEnter.set('27', '12');
    dataEnter.set('31', '14');
    dataEnter.set('34', '16');
    dataEnter.set('37', '18');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '17');
    tabFocusedElement1.set('17', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '27');
    tabFocusedElement1.set('27', '31');
    tabFocusedElement1.set('31', '34');
    tabFocusedElement1.set('34', '37');
    tabFocusedElement1.set('37', 'End');

    multiPoint.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    multiPoint.verifyRunEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 6:Control: Level Entry Input Data Verification Using the Tab Key (Multi Point)', function () {
    library.logStep('Test case 6:Control: Level Entry Input Data Verification Using the Tab Key (Multi Point)');
    library.logStep('Test case 27:Control: Level Entry Input Data Verification Using the Enter Key (Multi Point)');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyLevelEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });

    //  step 2
    const dataEnter = new Map<string, string>();
    dataEnter.set('1001', '1');
    dataEnter.set('1004', '2');
    dataEnter.set('1007', '3');
    dataEnter.set('2001', '4');
    dataEnter.set('2004', '5');
    dataEnter.set('2007', '6');
    dataEnter.set('3001', '7');
    dataEnter.set('3004', '8');
    dataEnter.set('3007', '9');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('1001', '1004');
    tabFocusedElement1.set('1004', '1007');
    tabFocusedElement1.set('1007', '2001');
    tabFocusedElement1.set('2001', '2004');
    tabFocusedElement1.set('2004', '2007');
    tabFocusedElement1.set('2007', '3001');
    tabFocusedElement1.set('3001', '3004');
    tabFocusedElement1.set('3004', '3007');
    tabFocusedElement1.set('3007', 'End');

    multiPoint.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    multiPoint.verifyLevelEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });
});

