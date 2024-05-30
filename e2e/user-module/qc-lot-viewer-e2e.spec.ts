/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { QCLotViewer } from '../page-objects/qc-lot-viewer-e2e.po';
import { NewLabDepartment } from '../page-objects/new-lab-department-e2e.po';
import { ConnectivityNew } from '../page-objects/connectivity-new-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/SalesUser.json').then(function(data) {
    jsonData = data;
  });

describe('Test suite: QC Lot Viewer', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const lotviewer = new QCLotViewer();
  const deptSetup = new NewLabDepartment();
  const connect = new ConnectivityNew();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.SalesUsername, jsonData.SalesPassword, jsonData.AdminFirstName);
  });

  it('Test case 44: Sales User is able to login to unity-next', function () {
    library.logStep('Test case 44: Sales User is able to login to unity-next');
    library.logStep('Test case 45: Sales User should be presented with QC Lot Viewer Card');
    library.logStep('Test case 46: Sales User should be presented with Release Notes & Terms of Use menus under Gear Icon');
    library.logStep('Test case 47: Sales User should not be presented with Lab Setup Screen');
    library.logStep('Test case 48: Sales User should not be presented with Lab Name in the header');
    library.logStep('Test case 49: Sales User should not be presented with Connectivity Icon.');
    library.logStep('Test case 50: Sales User should not be presented with Left Navigation Panel.');
    library.logStep('Test case 51: Sales User should not be presented with any tooltip.');
    lotviewer.verifyQCLotViewerCardDisplayed().then(function (cardDisplayed) {
      expect(cardDisplayed).toBe(true);
    });
    deptSetup.verifyDepartmentSetupCardDisplayed().then(function (deptSetupDisplayed) {
      expect(deptSetupDisplayed).toBe(false);
    });
    dashBoard.verifyLabNameDisplayed('').then(function (labNameDisplayed) {
      expect(labNameDisplayed).toBe(true);
    });
    connect.verifyConnectivityToolTip().then(function (connectivity) {
      expect(connectivity).toBe(false);
    });
    dashBoard.verifySideNavigationDisplayed().then(function (leftNavigationDisplayed) {
      expect(leftNavigationDisplayed).toBe(false);
    });
    dashBoard.clickGearIcon().then(function (result) {
      expect(result).toBe(true);
    });
    dashBoard.verifyMenuItemsForAdmin('user').then(function (menuItemsForSalesUser) {
      expect(menuItemsForSalesUser).toBe(true);
    });
    lotviewer.logout().then(function (logout) {
      expect(logout).toBe(true);
    });
  });

  it('Test case 52: Sales User should be presented with Ship to Account & Sold to Account dropdowns', function () {
    library.logStep('Test case 52: Sales User should be presented with Ship to Account & Sold to Account dropdowns');
    library.logStep('Test case 53: Sales User should be presented with a list of Ship to Accounts assigned to it.');
    library.logStep('Test case 54: Sales User should be presented with a list of Sold to Accounts assigned to it.');
    library.logStep('Test case 55: Sales User should be able to select a Sold To Account value from the Drop down.');
    library.logStep('Test case 56: Selecting a Sold To Account should give a list of associated Ship To Accounts.');
    library.logStep('Test case 57: Selecting a Sold To Account & Ship To Account from the dropdowns should give a list of QC Products.');
    lotviewer.clickQCLotViewerCard().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    lotviewer.verifySoldToShipToDropdowns().then(function (dropdownsDisplayed) {
      expect(dropdownsDisplayed).toBe(true);
    });
    lotviewer.clickSoldToDropdown().then(function (soldToClicked) {
      expect(soldToClicked).toBe(true);
    });
    lotviewer.selectSoldToFromDropdown().then(function (optionSelected) {
      expect(optionSelected).toBe(true);
    });
    lotviewer.clickShipToDropdown().then(function (shipToClicked) {
      expect(shipToClicked).toBe(true);
    });
    lotviewer.selectShipToFromDropdown().then(function (optionSelected) {
      expect(optionSelected).toBe(true);
    });
    lotviewer.verifyFirstRowInTable().then(function (dataDisplayed) {
      expect(dataDisplayed).toBe(true);
    });
    lotviewer.logout().then(function (logout) {
      expect(logout).toBe(true);
    });
  });
});
