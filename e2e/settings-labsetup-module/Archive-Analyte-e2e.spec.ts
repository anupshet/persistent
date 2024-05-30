/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';

const fs = require('fs');
let jsonData;

const library=new BrowserLibrary();
library.parseJson('./JSON_data/Archive-Analyte.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: Archive Analyte', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const labsetup = new NewLabSetup();
  const newLabSetup = new NewLabSetup();
  const pointData = new PointDataEntry();
  const multiPoint = new MultiPointDataEntryInstrument();
  const dashboard = new Dashboard();
  const setting = new Settings();
  const archivingLots = new ArchivingLots();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: To verify that the user can archive the analyte', function () {
    library.logStep('Test case 1: To verify that the user can archive the analyte');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (archiveDisplayed) {
      expect(archiveDisplayed).toBe(true);
    });
    archivingLots.clickArchiveToggle().then(function (archiveClicked) {
      expect(archiveClicked).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (toggleDisplayed) {
      expect(toggleDisplayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (toggleClicked) {
      expect(toggleClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyEditLinkEnabled(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.verifyCancelUpdateEnabled(jsonData.Status1).then(function (cancleupdateEnabled1) {
      expect(cancleupdateEnabled1).toBe(true);
    });
    archivingLots.clickArchiveToggle().then(function (archiveClicked) {
      expect(archiveClicked).toBe(true);
    });
    archivingLots.verifyCancelUpdateEnabled(jsonData.Status).then(function (cancleupdateEnabled3) {
      expect(cancleupdateEnabled3).toBe(true);
    });
    archivingLots.clickCancelButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
    });
    // Analyte Archived
    dashboard.clickUnityNext().then(function (home) {
      expect(home).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (toggleDisplayed) {
      expect(toggleDisplayed).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    archivingLots.verifyReportsTabEnabled().then(function (reportEnabled) {
      expect(reportEnabled).toBe(true);
    });
    multiPoint.clickManuallyEnterDataInstrumentControl().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    multiPoint.clickManuallyEnterDataInstrumentControl().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    archivingLots.verifyDataTablePageGreyedOutAnalyteLevel().then(function (greyedOut) {
      expect(greyedOut).toBe(true);
    });
    archivingLots.verifyEditLinkEnabled(jsonData.Analyte).then(function (editEnabled) {
      expect(editEnabled).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    archivingLots.verifySettingPageGreyedOut().then(function (settingsdisabled) {
      expect(settingsdisabled).toBe(true);
    });
    out.signOut().then(function (loggedout) {
      expect(loggedout).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameUser,
      jsonData.PasswordUser, jsonData.FirstNameUser).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (toggleDisplayed) {
      expect(toggleDisplayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (toggleClicked) {
      expect(toggleClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    archivingLots.verifyDataTablePageGreyedOutAnalyteLevel().then(function (greyedOut) {
      expect(greyedOut).toBe(true);
    });
  });

  it('Test case 2: To verify that the user can un-archive the analyte', function () {
    library.logStep('Test case 2: To verify that the user can un-archive the analyte');
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (toggleDisplayed) {
      expect(toggleDisplayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (toggleClicked) {
      expect(toggleClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.clickUnarchiveToggleAnalyte().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archivingLots.clickUpdateButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
    });
    dashboard.clickUnityNext().then(function (home) {
      expect(home).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    archivingLots.verifyReportsTabEnabled().then(function (reportEnabled) {
      expect(reportEnabled).toBe(true);
    });
    multiPoint.clickManuallyEnterDataInstrumentControl().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    multiPoint.clickManuallyEnterDataInstrumentControl().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    archivingLots.verifyAnalyteGreyedOut(jsonData.Analyte1).then(function (greyedOut) {
      expect(greyedOut).toBe(false);
    });
    multiPoint.clickManuallyEnterDataInstrumentControl().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    archivingLots.verifyAnalyteGreyedOut(jsonData.Analyte1).then(function (greyedOut) {
      expect(greyedOut).toBe(false);
    });
    archivingLots.VerifyCountOfDisabledAnalytes(0).then(function (countmatches) {
      expect(countmatches).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    archivingLots.verifyEditLinkEnabled(jsonData.Analyte).then(function (editEnabled) {
      expect(editEnabled).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    archivingLots.verifySettingPageGreyedOut().then(function (GreyedOut) {
      expect(GreyedOut).toBe(false);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterPointValues(9, 10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.verifyEnteredPointValues(9, 10).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    });
});
