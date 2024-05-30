/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';


const fs = require('fs');
let jsonData;

const library=new BrowserLibrary();
library.parseJson('./JSON_data/Archive.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Settings', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const multiPoint = new MultiPointDataEntryInstrument();
  const archive = new ArchivingLots();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      browser.sleep(10000);
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('To Verify that user will be able to Archive Instrument', function () {
    library.logStep('To Verify that user will be able to Archive Instrument');
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.clickArchiveToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.isDashboardDisplayed(jsonData.FirstName, jsonData.LabName).then(function (verified) {
      expect(verified).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyReportsTabEnabled().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyEditLinkEnabled(jsonData.InstrumentName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.verifySettingPageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Analyte2).then(function (verified) {
      expect(verified).toBe(true);
    });
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyReportsTabEnabled().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Analyte2).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('To Verify that user will be able to unarchive Instrument', function () {
    library.logStep('To Verify that user will be able to unarchive Instrument');
    const val = '10.1', val1 = '11.1';
    const dataMap = new Map<string, string>();
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.clickUnarchiveToggleAnalyte().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.clickUpdateButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
    });
    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO(jsonData.Department1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(false);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Control).then(function (verified) {
      expect(verified).toBe(false);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.verifyReportsTabEnabled().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyEditLinkEnabled(jsonData.InstrumentName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val, '1').then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.verifySettingPageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(false);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Analyte2).then(function (verified) {
      expect(verified).toBe(false);
    });
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO(jsonData.Department1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(false);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Control).then(function (verified) {
      expect(verified).toBe(false);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', val1);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.verifyReportsTabEnabled().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val1, '1').then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(false);
    });
    archive.verifyleftNavigationGreyedOut(jsonData.Analyte2).then(function (verified) {
      expect(verified).toBe(false);
    });
  });
});
