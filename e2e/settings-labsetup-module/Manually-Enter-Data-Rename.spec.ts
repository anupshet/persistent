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
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { SingleSummary } from '../page-objects/single-summary.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';


const fs = require('fs');
let jsonData;
// fs.readFile('./JSON_data/Archive.json', (err, data) => {
//   if (err) { throw err; }
//   const settings = JSON.parse(data);
//   jsonData = settings;
// });

const library=new BrowserLibrary();
library.parseJson('./JSON_data/Archive.json').then(function(data) {
  jsonData = data;
});
// fs.readFile('./JSON_data/Manually-Enter-Data-Rename.json', (err, data) => {
//   if (err) { throw err; }
//   const settings = JSON.parse(data);
//   jsonData = settings;
// });



describe('Test Suite: Manually Enter Data Renaming', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const multiPoint = new MultiPointDataEntryInstrument();
  const archive = new ArchivingLots();
  const newLabSetup = new NewLabSetup();

  const singleSummary = new SingleSummary();
  const multiSummary = new MultiSummary();
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

  it('To verify manually enter data option is present on instrument/Control/Analyte level', function () {
    newLabSetup.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    // tslint:disable-next-line: no-unused-expression
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.verifyManuallyEnterDataOption().then(function (manually) {
      expect(manually).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.verifyManuallyEnterDataOption().then(function (manually) {
      expect(manually).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.verifyManuallyEnterDataOption().then(function (manually) {
      expect(manually).toBe(true);
    });
  });

});
