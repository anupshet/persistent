/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { CustomSortOrder } from '../page-objects/Select-SortOrder.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/SelectCustomSortOrder.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: Select Custom Sort Order', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dashBoard = new Dashboard();
  const navigation = new NewNavigation();
  const customSortOrder = new CustomSortOrder();
  const labsetup = new NewLabSetup();
  const setting = new Settings();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });
// in
 it('Test case 1: To verify the Instrument/control/Analyte/Panel are by default sorted in alphabetical order', function () {
    customSortOrder.verifyDefaultItemSorting('Department').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.verifyDefaultItemSorting('Panel').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    labsetup.navigateTO(jsonData.AutoDep).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting('Instrument').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    labsetup.navigateTO(jsonData.AutoInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting('Control').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    labsetup.navigateTO(jsonData.AutoControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting('Analyte').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });
// in
  it('Test case 2: To verify the analytes on data entry page are sorted alphabetically be default ', function () {
    labsetup.navigateTO(jsonData.AutoDep).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.AutoInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting('DataTabel').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    labsetup.navigateTO(jsonData.AutoControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting('DataTabel').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });
// in
  it('Test case 3: Verify A-Z sorting option is displayed for panel', function () {
    customSortOrder.clickOnSortButton('Panel').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnSortButton('Department').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(jsonData.AutoDep).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton('Instrument').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    labsetup.navigateTO(jsonData.AutoInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton('Control').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(jsonData.AutoControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton('Analyte').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
// in
/*   it('Test case 2: Verify grabbers are ' +
       'displayed and drag and drop is available for panel/department/instrument/control/analyte', function () {
    customSortOrder.clickOnSortButton('Panel').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.customSortItems(jsonData.AutoPanel1,jsonData.AutoPanel2).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });

    customSortOrder.clickOnSortButton('Department').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.customSortItems(jsonData.AutoDep,jsonData.AutoDep2).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(jsonData.AutoDep).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton('Instrument').then(function (verified) {
      expect(verified).toBe(true);
    });

    labsetup.navigateTO(jsonData.AutoInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton('Control').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(jsonData.AutoControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton('Analyte').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
  }); */

  it('Test case 8 : Verify sort option is not available for one panel/department/instrument/control/analyte', function () {
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(false);
      dashBoard.waitForElement();
    });
    labsetup.navigateTO(jsonData.AutoDeptWithOneInstr).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.AutoInstrWithOneControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(false);
      dashBoard.waitForElement();
    });
  });

// in
  it('Test case 11 : Verify data tables are sorted using custom sorting ', function () {
    labsetup.navigateTO(jsonData.AutoDep).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.AutoInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifyCustomSortedValuesForDatatable('Instrument').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.clickOnSortButton('Instrument').then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.customSortItems(jsonData.AutoControl, jsonData.AutoControl2).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.clickOnDoneBtn().then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.verifyCustomSortedValuesForDatatable('Instrument').then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });
});
