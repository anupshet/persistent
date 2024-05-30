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


const library=new BrowserLibrary();
library.parseJson('./JSON_data/Archive-Analyte.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: Archive Analyte', function () {
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
  it('Test case 1: Verify archived analytes are positioned at the bottom of panel analytes in edit panel screen', function () {
    library.logStep('Test case 1: Verify archived analytes are positioned at the bottom of panel analytes in edit panel screen');
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
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (archiveDisplayed) {
      expect(archiveDisplayed).toBe(true);
    });
    archive.clickArchiveToggle().then(function (archiveClicked) {
      expect(archiveClicked).toBe(true);
    });
    // Analyte Archived
    dashboard.clickUnityNext().then(function (home) {
      expect(home).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (toggleDisplayed) {
      expect(toggleDisplayed).toBe(true);
    });
    archive.clickArchiveItemToggle().then(function (toggleClicked) {
      expect(toggleClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    archive.verifyArchiveItemToggleDisplayed().then(function (archiveDisplayed) {
      expect(archiveDisplayed).toBe(true);
    });
    archive.clickArchiveToggle().then(function (archiveClicked) {
      expect(archiveClicked).toBe(true);
    });
    // Analyte Archived
    dashboard.clickUnityNext().then(function (home) {
      expect(home).toBe(true);
    });
    panel.clickOnPanelName('TestArchivePBI2').then(function (navigate) {
      expect(navigate).toBe(true);
    });
    panel.clickEditThisPanelLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panel.verifyArchiveAnalytesPositionedBelow().then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });


  it('Test case 2: To verify selected analytes are positioned in alphabetical order', function () {
    library.logStep('Test case 2: To verify selected analytes are positioned in alphabetical order');
    archive.verifyArchiveItemToggleDisplayed().then(function (archiveDisplayed) {
      expect(archiveDisplayed).toBe(true);
    });
    archive.clickArchiveItemToggle().then(function (toggleClicked) {
      expect(toggleClicked).toBe(true);
    });
    panel.clickOnPanelName('TestArchivePBI2').then(function (navigate) {
      expect(navigate).toBe(true);
    });
    panel.clickEditThisPanelLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panel.verifyOrderOfArchivePanelItems().then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });*/
});

