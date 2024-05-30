/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { UnityDataSync } from './page-objects/data/unity-sync/data-sync.po';
import { NgucConfig } from './page-objects/manage-configuration/nguc-config/nguc-config.po';
import { ImportConfig } from './page-objects/manage-configuration/valid-config/import-config.po';
import { ViewValid } from './page-objects/manage-configuration/valid-config/view-valid-config.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';


const fs = require('fs');
let jsonData;

// Localhost

const library = new BrowserLibrary();

library.parseJson('./e2e/qcp-central/test-data/ngucConfig.json').then(function(data) {
  jsonData = data;
})

describe('Test Suite: QCP - NGUC Config', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const viewValid = new ViewValid();
  const fileData = new Array();
  const importVC = new ImportConfig();
  const sync = new UnityDataSync();
  const nguc = new NgucConfig();

  beforeEach(function () {

    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

it('Test Case 1: To Verify the UI changes on NGUC Config', function () {
  library.logStep('Test Case 1: To Verify the UI changes on NGUC Config');
  library.logStep('Test Case 2: To Verify the ability to view NGUC data');
  const columnToBeSearched = 'Instrument Name';
  qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  nguc.isInstrumentDropDownDisplayed().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.isTableDisplayedWithValues().then(function (clicked) {
    expect(clicked).toBe(false);
  });
  qcp.selectInstrument(jsonData.Instrument).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.isTableDisplayedWithValues().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.findElementsInTable(columnToBeSearched, jsonData.Instrument ).then(function (clicked) {
    expect(clicked).toBe(true);
  });
});


it('Test Case 3: To Verify the ability to add new VITROs Microslide old configurations', function () {
  library.logStep('Test Case 3: To Verify the ability to add new VITROs Microslide old configurations');
  const analyteCol = 'Analyte Name';
  const methodCol = 'Method Name';
  const instrumentCol = 'Instrument Name';
  const reagentCol = 'Reagent Name';
  qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  nguc.clickOnAddNewOldConfigButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  nguc.selectNewConfigToAdd(jsonData.NewAnalyte, jsonData.NewInstrument, jsonData.NewMethod, jsonData.NewReagent).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  nguc.clickOnAddButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectInstrument(jsonData.NewInstrument).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.searchColumnWithExpectedValue(analyteCol, jsonData.NewAnalyte).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.findElementsInTable(analyteCol, jsonData.NewAnalyte).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.findElementsInTable(instrumentCol, jsonData.NewInstrument).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.findElementsInTable(methodCol, jsonData.NewMethod).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.findElementsInTable(reagentCol, jsonData.NewReagent).then(function (clicked) {
    expect(clicked).toBe(true);
  });
});

it('Test Case 4: To Verify the ability of Downloading Excel sheet with -  selected instrument', function () {
  library.logStep('Test Case 4: To Verify the ability of Downloading Excel sheet with -  selected instrument');
  qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectInstrument(jsonData.NewInstrument).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.clickOnDownloadToExcel(jsonData.FileName).then(function (displayed) {
    expect(displayed).toBe(true);
  }) .then(async function() {
    await qcp.readDataCSV(jsonData.FileName, 'instrumentName', jsonData.NewInstrument).then(function (fileArray) {
      expect(fileArray).toBe(true);
    });
  }).then(async function() {
    await qcp.readDataCSV(jsonData.FileName, 'reagentName', jsonData.NewReagent ).then(function (fileArray) {
      expect(fileArray).toBe(true);
    });
  }) .then(async function() {
    await qcp.readDataCSV(jsonData.FileName, 'analyteName', jsonData.NewAnalyte).then(function (fileArray) {
      expect(fileArray).toBe(true);
    });
  }) .then(async function() {
    await qcp.readDataCSV(jsonData.FileName, 'methodName', jsonData.NewMethod).then(function (fileArray) {
      expect(fileArray).toBe(true);
    });
  }).then(async function () {
    await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
      expect(deleted).toBe(true);
    });
  });
});

it('Test Case 5: To Verify the ability to add Delete added VITROs Microslide old configurations', function () {
  library.logStep('Test Case 5: To Verify the ability to add Delete added VITROs Microslide old configurations');
  const analyteCol = 'Analyte Name';
  const methodCol = 'Method Name';
  const instrumentCol = 'Instrument Name';
  const reagentCol = 'Reagent Name';
  qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectInstrument(jsonData.NewInstrument).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.searchColumnWithExpectedValue(analyteCol, jsonData.NewAnalyte).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.searchColumnWithExpectedValue(methodCol, jsonData.NewMethod).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.searchColumnWithExpectedValue(instrumentCol, jsonData.NewInstrument).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.searchColumnWithExpectedValue(reagentCol, jsonData.NewReagent).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectCheckbox().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.clickOnDeleteButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.clickOnDeleteConfirmButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.selectInstrument(jsonData.NewInstrument).then(function (clicked) {
    expect(clicked).toBe(true);
  });
  qcp.searchColumnWithExpectedValue(analyteCol, jsonData.NewAnalyte).then(function (clicked) {
    expect(clicked).toBe(false);
  });
});
});
