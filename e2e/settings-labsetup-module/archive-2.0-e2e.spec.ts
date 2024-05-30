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
import { CustomSortOrder } from '../page-objects/Select-SortOrder.po';


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

  const customSortOrder = new CustomSortOrder();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      browser.sleep(10000);
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('To Verify that archive toggle is displayed and archive list is not present by default', function () {
    library.logStep('To Verify that user will be able to Archive Instrument');

    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyArchiveItemsNotDisplayedByDefault().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyArchiveItemsNotDisplayedByDefault().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyArchiveItemsNotDisplayedByDefault().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.verifyArchiveItemsNotDisplayedByDefault().then(function (displayed) {
      expect(displayed).toBe(true);
    });

  });

  it('To Verify that archive list is displayed in left navigation panel', function () {
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    archive.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archive.verifyArchiveItemsNotDisplayedByDefault().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemsNotDisplayedByDefault().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemsNotDisplayedByDefault().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemsNotDisplayedByDefault().then(function (displayed) {
      expect(displayed).toBe(false);
    });

  });

  it('Verify archive list is sorted alphabetically by default', function () {
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting('ArchivedItems').then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting('ArchivedItems').then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.verifyDefaultItemSorting('ArchivedItems').then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Verify datatables position of archived items in data table panel', function () {
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archive.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    setting.navigateTO('Ferritin').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyDataTablePageGreyedOut().then(function (displayed) {
      expect(displayed).toBe(true);
    });

  });
});
