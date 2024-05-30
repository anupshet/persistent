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
import { Panels } from '../page-objects/panels-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/SelectCustomSortOrderPanel.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Panels - Select Custom Sort Order', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dashBoard = new Dashboard();
  const navigation = new NewNavigation();
  const customSortOrder = new CustomSortOrder();
  const labsetup = new NewLabSetup();
  const setting = new Settings();
  const panel = new Panels();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: To verify the Panel in left navigation are by default sorted in alphabetical order ', function () {
    setting.navigateTO(jsonData.PanelName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting(jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

  it('Test case 2: To verify the analytes on data entry page of Panels are sorted alphabetically be default', function () {
    setting.navigateTO(jsonData.PanelName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting(jsonData.SortingType2).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

  it('Test case 2: To verify Sort options are not present for one analyte on panel', function () {
    setting.navigateTO(jsonData.PanelNameWithOneAnalyte).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    customSortOrder.clickOnSortButton(jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(false);
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(false);
    });

  });

  it('Test case 3: Verify A-Z sorting option is displayed for edit panel', function () {
    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton(jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickEditThisPanelLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.customSortItemsForPanels(jsonData.PanelAnalyte1, jsonData.PanelAnalyte2).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.verifySortOptionsArePresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 4 : Verify drag and drop custom sorting is available for analytes on panels page', function () {
    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton(jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.customSortItems(jsonData.PanelAnalyte1, jsonData.PanelAnalyte2).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnCancelBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnSortButton(jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.customSortItems(jsonData.PanelAnalyte1, jsonData.PanelAnalyte2).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.verifyCustomSortedValues(true, jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

  it('Test case 11 : Verify data tables in panels are sorted using custom sorting ', function () {
    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton(jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.customSortItems(jsonData.PanelAnalyte1, jsonData.PanelAnalyte2).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    customSortOrder.clickOnDoneBtn().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    /*  customSortOrder.verifyCustomSortedValuesForDatatable('Instrument').then(function (verified) {
       expect(verified).toBe(true);
       dashBoard.waitForElement();
     }); */

  });
});
