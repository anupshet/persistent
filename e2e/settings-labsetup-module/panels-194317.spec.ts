/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { MultiPoint } from '../page-objects/multi-point.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { Panels } from '../page-objects/panels-e2e.po';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

const fs = require('fs');
let jsonData;


const library=new BrowserLibrary();
library.parseJson('./JSON_data/Panels_194317.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: Panels', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newSetting = new InheritedSettings();
  const newLabSetup = new NewLabSetup();
  const multiPoint = new MultiPoint();
  const pointData = new PointDataEntry();
  const navigation = new NewNavigation();
  const panel = new Panels();
  const panels = new Panels();
  const archive = new ArchivingLots();
  const dashboard = new Dashboard();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });
/*
  // Need 1 Panel with at least 10 Analytes to be created already
  it('Test case 1: To verify that Clicking on (i) icon for an Analyte in the Panel the Analyte info tooltip should be displayed.', function () {
    library.logStep('Test case 1: To verify that Clicking on (i) icon for an Analyte in the Panel the Analyte info tooltip should be displayed.');
    newLabSetup.navigateTO(jsonData.Panel).then(function (dept) {
      expect(dept).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte1).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte2).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte2).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte3).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte3).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte4).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte4).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte5).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte5).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte6).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte6).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte7).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte7).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte8).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte8).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte9).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte9).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInLeftNav(jsonData.Analyte10).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutside(jsonData.Analyte10).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
  });*/

  // Need 1 Panel with at least 10 Analytes to be created already
  // tslint:disable-next-line: max-line-length
  it('Test case 2: To verify that Clicking on (i) icon for an Analyte on the Edit Panel page the Analyte info tooltip should be displayed.', function () {
    library.logStep('Test case 2: To verify that Clicking on (i) icon for an Analyte on the Edit Panel page the Analyte info tooltip should be displayed.');
    newLabSetup.navigateTO(jsonData.Panel).then(function (dept) {
      expect(dept).toBe(true);
    });
    panels.clickEditThisPanelLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte1).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte2).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte2).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte3).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte3).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte4).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte4).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte5).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte5).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte6).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte6).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte7).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte7).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte8).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte8).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte9).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte9).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.Analyte10).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickOutsideSelectedItemsList(jsonData.Analyte10).then(function (clickedOutside) {
      expect(clickedOutside).toBe(true);
    });
  });
});
