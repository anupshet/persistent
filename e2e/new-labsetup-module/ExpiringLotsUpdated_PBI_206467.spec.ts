/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { DuplicateLot } from '../page-objects/duplicate-lot-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const fs = require('fs');

let jsonData; ``

const library = new BrowserLibrary();
library.parseJson('./JSON_data/PBI_206467_ExpiringLotsUpdated.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: PBI 206467 - Frontend Expiring Lots UI updates', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  let flagForIEBrowser: boolean;
  const duplicateLot = new DuplicateLot();
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

  it('Test Case 1: To verify total number of expiring lots are displayed for all instruments under Expiring lots header', function () {
    labsetup.verifyExpiringLotCards().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.verifyExpiringCardCount(jsonData.ExpiringLotCount1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 2: Verify total number of repetative lots across all instruments are displayed along with that control name', function () {
    labsetup.verifyExpiringLotCards().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.verifyRepetativeLotNumbersCountDisplayed(jsonData.RepetativeLot, jsonData.RepetatedCount).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 3 : To verify Start new lot overlay is displayed by clicking on that lot', function () {
    labsetup.clickOnProductNameOnExpiringLotCard(jsonData.RepetativeLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    duplicateLot.VerifyStartNewLotPopupUIForDashboard().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 4: Verify "On this instrument" options is select by default if there is only one lot available,'
    + 'Test Case 5: Verify "on multiple instruments" options is select by default if there multiple lots available across all instruments', function () {
      labsetup.verifyRepetativeLotNumbersCountDisplayed(jsonData.NonRepetativeLot, '0').then(function (displayed) {
        expect(displayed).toBe(true);
      });
      labsetup.clickOnProductNameOnExpiringLotCard(jsonData.NonRepetativeLot).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      labsetup.verifyOverlayForLots('0').then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  it('Test Case 4.1: Verify "On this instrument" options is select by default if there is only one lot available,'
    + 'Test Case 5.1: Verify "on multiple instruments" options is select by default if there multiple lots available across all instruments', function () {
      labsetup.verifyRepetativeLotNumbersCountDisplayed(jsonData.RepetativeLot, jsonData.RepetatedCount).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      labsetup.clickOnProductNameOnExpiringLotCard(jsonData.RepetativeLot).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      duplicateLot.clickLotNumberDropdown().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      duplicateLot.SelectLot(jsonData.FutureLot2).then(function (lotSelected) {
        expect(lotSelected).toBe(true);
      });
      labsetup.verifyOverlayForLots(jsonData.RepetatedCount).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  it('Test case 6 : To verify "Start New Lot" starts new lot on multiple instruments', function () {
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username2,
      jsonData.Password2, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    labsetup.clickOnProductNameOnExpiringLotCard(jsonData.RepetativeLot2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    duplicateLot.clickLotNumberDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.FutureLot).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
    });
    labsetup.verifyOverlayForLots(jsonData.RepetatedCount3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    duplicateLot.clickStartNewLotButtonOnOverlay().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.verifyExpiringCardCount(jsonData.ExpiringLotCount2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.navigateTO(jsonData.DeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.verifyControlChanged(jsonData.FutureLot).then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });
});
