/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { UnityDataSync } from './page-objects/data/unity-sync/data-sync.po';
import { ImportConfig } from './page-objects/manage-configuration/valid-config/import-config.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();

library.parseJson('./e2e/qcp-central/test-data/unitySync.json').then(function(data) {
  jsonData = data;
})
describe('Test Suite: Unity Sync - UI', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const sync = new UnityDataSync();
  const importVC = new ImportConfig();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 6: To Verify the Sync Job is added for imported sheet', function () {
    library.logStep('Test Case 6: To Verify the Sync Job is added for imported sheet');
    const analyteColName = 'Analyte Code';
    const methodColName = 'Current Method Code';
    const instColName = 'Current Instrument Code';
    const reagentColName = 'Current Reagent Code';
    let analyteColValue: string[] = [];
    let methodColValue: string[] = [];
    let instColValue: string[] = [];
    let reagColValue: string[] = [];
    let temp1, temp2, temp3, temp4 ;

    qcp.expandMainMenu(jsonData.MainMenu1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectSubMenuOption(jsonData.SubMenu1 , jsonData.SubMenuOption1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.uploadFile(jsonData.SyncDemoFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    importVC.clickMicroslideCheckbox().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    importVC.clickOnUploadAndViewButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (loaded) {
      expect(loaded).toBe(true);
    });
    importVC.clickOnImportButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    importVC.clickOkOnConfirmImport().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    sync.waitForSycnJobToBeAdded().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    out.signOutQCP().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (loaded) {
      expect(loaded).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (loaded) {
      expect(loaded).toBe(true);
    });
    sync.searchTaskDescription('sheet').then(function (searched) {
      expect(searched).toBe(true);
    });
    sync.sortEndDate('Ascending').then(function (sorted) {
      expect(sorted).toBe(true);
    }).then(async function() {
      await qcp.readColumnDataExcel(jsonData.SyncDemoFile, analyteColName).then(function (valueArray) {
        temp1 = Object.assign([], valueArray);
        expect(valueArray).toBeDefined();
      });
      await qcp.readColumnDataExcel(jsonData.SyncDemoFile, methodColName).then(function (valueArray) {
        temp2 = Object.assign([], valueArray);
        expect(valueArray).toBeDefined();
      });
      await qcp.readColumnDataExcel(jsonData.SyncDemoFile, instColName).then(function (valueArray) {
        temp3 = Object.assign([], valueArray);
        expect(valueArray).toBeDefined();
      });
      await qcp.readColumnDataExcel(jsonData.SyncDemoFile, reagentColName).then(function (valueArray) {
        temp4 = Object.assign([], valueArray);
        expect(valueArray).toBeDefined();
      });
      analyteColValue = Object.assign([], temp1);
      methodColValue = Object.assign([], temp2);
      instColValue = Object.assign([], temp3);
      reagColValue = Object.assign([], temp4);
    sync.searchTaskDescription(methodColValue[1]).then(function (searched) {
      expect(searched).toBe(true);
    });
    sync.sortEndDate('Ascending').then(function (sorted) {
      expect(sorted).toBe(true);
    });
    sync.isTaskDisplayedForImport(analyteColValue[1], methodColValue[1], instColValue[1], reagColValue[1]).then(function (displayed) {
      expect(displayed).toBe(true);
    });
   });
  });

});
