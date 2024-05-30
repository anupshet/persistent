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
import { Panels } from '../page-objects/panels-e2e.po';

const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();
library.parseJson('./JSON_data/Expired-Lots-Panels.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: Expired Lots on Panel Items', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const newLabSetup = new NewLabSetup();
  const pointData = new PointDataEntry();
  const multiPoint = new MultiPointDataEntryInstrument();
  const archive = new ArchivingLots();
  const dashboard = new Dashboard();
  const panel = new Panels();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });
/*
  it('Test case 1: Verify Expired Lots Popup on edit panel items option', function () {
    library.logStep('Test case 1: Verify Expired Lots Popup on edit panel items option');
    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    })
    pointData.clickManuallyEnterData().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    archive.verifyLotIsExpired().then(function (archiveDisplayed) {
      expect(archiveDisplayed).toBe(true);
    });
    // Analyte Archived
    dashboard.clickUnityNext().then(function (home) {
      expect(home).toBe(true);
    });
    panel.clickOnPanelName("TestNewDev").then(function (navigate) {
      expect(navigate).toBe(true);
    });
    panel.clickEditThisPanelLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archive.verifyPopUpForExpiredLotsOnPanel(jsonData.Analyte1).then(function (archiveDisplayed) {
      expect(archiveDisplayed).toBe(true);
    });

  });*/

});

