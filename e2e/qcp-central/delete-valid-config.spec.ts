/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { ViewValid } from './page-objects/manage-configuration/valid-config/view-valid-config.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';
import { ImportConfig } from './page-objects/manage-configuration/valid-config/import-config.po';


const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/deleteValid.json').then(function(data) {
  jsonData = data;
})

describe('Test Suite: QCP - Delete Valid Configurations', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const importVC = new ImportConfig();
  const viewValid = new ViewValid();
  const fileData = new Array();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });


  it('Test Case 1: To Verify the ability to Delete Valid Config with Microslide Configurations', function () {
      library.logStep
        ('Test Case 1: To Verify the ability to Delete Valid Config with Microslide Configurations');
        const  reagentCol = 'Reagent';
        qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenuOption(jsonData.SubMenu, jsonData.ImportSubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      // File name to be added
      qcp.uploadFile(jsonData.VitrosFile).then(function (uploaded) {
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

      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenuOption(jsonData.SubMenu, jsonData.ValidSubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      viewValid.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
        expect(displayed).toBe(true);
      });

      qcp.clickOnDeleteButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.clickOnDeleteConfirmButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.searchColumnWithExpectedValue(reagentCol, jsonData.ReagentVitrosToBeSelected).then(function (clicked) {
        expect(clicked).toBe(false);
      });
      viewValid.isTableDisplayedWithValues().then(function (displayed) {
        expect(displayed).toBe(false);
      });

      // Check Datamapping and data unmapped page.
    });

  it('Test Case 2: To Verify the ability to Delete Valid Config with Non Microslide Configurations', function () {
      library.logStep
        ('Test Case 1: To Verify the ability to Delete Valid Config with Non Microslide Configurations');
        const  reagentCol = 'Reagent';
        qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenuOption(jsonData.SubMenu, jsonData.ImportSubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      // File name to be added
      qcp.uploadFile(jsonData.NonVitrosFile).then(function (uploaded) {
        expect(uploaded).toBe(true);
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

      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenuOption(jsonData.SubMenu, jsonData.ValidSubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectInstrument(jsonData.InstrumentNonVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.searchColumnWithExpectedValue(reagentCol, jsonData.ReagentNonVitrosToBeSelected).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.clickOnDeleteButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.clickOnDeleteConfirmButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });

      qcp.searchColumnWithExpectedValue(reagentCol, jsonData.ReagentNonVitrosToBeSelected).then(function (clicked) {
        expect(clicked).toBe(false);
      });

      viewValid.isTableDisplayedWithValues().then(function (displayed) {
        expect(displayed).toBe(false);
      });
      // Check Datamapping and data unmapped page.
    });
});
