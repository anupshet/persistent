/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { ViewValid } from './page-objects/manage-configuration/valid-config/view-valid-config.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';
const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/pbi187730-viewValid-vitros-qa.json').then(function(data) {
  jsonData = data;
});



describe('Test Suite: PBI187730 - Ability to manage Microslide Configurations in the View Valid Configs UI', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const viewValid = new ViewValid();
  const library = new BrowserLibrary();


  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectSubMenuOption(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: To Verify the UI changes on View Valid Config page', function () {
    library.logStep('Test Case 1: To Verify the UI changes on View Valid Config page');
    qcp.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isReagentDropDownDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    qcp.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    viewValid.isReagentDropDownDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 2: To Verify the ability to view Vitros specific configs', function () {
    library.logStep('Test Case 2: To Verify the ability to view Vitros specific configs');
    const columnName = 'Reagent Lot';
    const columnNameToFind = 'Instrument';
    const columnNameToFind1 = 'Reagent';
    const columnNameToFind2 = 'Instrument Manufacturer';
    const columnNameToFind3 = 'Reagent Lot';
    qcp.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    viewValid.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.isColumnDisplayed(columnName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.isColumnDisplayed(columnNameToFind2).then(function (displayed) {
      expect(displayed).toBe(false);
    });
    qcp.isColumnDisplayed(columnNameToFind3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(columnNameToFind, jsonData.InstrumentVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(columnNameToFind1, jsonData.ReagentVitrosDisplayed).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(columnNameToFind3, jsonData.ReagentLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 3: To Verify the ability to view Non - Vitros specific configs', function () {
    library.logStep('Test Case 3: To Verify the ability to view Non - Vitros specific configs');
    const columnName = 'Reagent Lot';
    const columnName1 = 'Instrument Manufacturer';
    const columnNameToFind = 'Instrument';
    qcp.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    viewValid.isReagentDropDownDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    qcp.isColumnDisplayed(columnName).then(function (displayed) {
      expect(displayed).toBe(false);
    });
    qcp.isColumnDisplayed(columnName1).then(function (displayed) {
      expect(displayed).toBe(false);
    });
    viewValid.findElementsInTable(columnNameToFind, jsonData.InstrumentNonVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 4: To Verify the ability to clear display table when another Manufacturer is selected from Drop Down', function () {
    library.logStep('Test Case 4: To Verify the ability to clear display table when another Manufacturer is selected from Drop Down');
    const columnName = 'Reagent Lot';
    qcp.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    viewValid.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.isColumnDisplayed(columnName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.isTableDisplayedWithValues().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    viewValid.isTableDisplayedWithValues().then(function (displayed) {
      expect(displayed).toBe(false);
    });
  });

  it
  ('Test Case 5: To Verify the ability of Downloading Excel sheet with VITROS configs -  selected Manufacturer, Reagent & Reagent lots',
  function () {
    library.logStep
    ('Test Case 5: To Verify the ability of Downloading Excel sheet with VITROS configs -  selected Manufacturer, Reagent & Reagent lots');
    const columnName = 'Reagent Lot';
    qcp.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    viewValid.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.isColumnDisplayed(columnName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.clickOnDownloadToExcel(jsonData.FileName).then(function (displayed) {
      expect(displayed).toBe(true);
    }).then(async function () {
      await qcp.readDataCSV(jsonData.FileName, 'instrumentManufacturerName', jsonData.ManufacturerVitros).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readDataCSV(jsonData.FileName, 'instrumentName', jsonData.InstrumentVitros).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readDataCSV(jsonData.FileName, 'reagentName', jsonData.ReagentVitrosToBeSelected).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readDataCSV(jsonData.FileName, 'reagentLotNumber', jsonData.ReagentLot).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it
  ('Test Case 6: To Verify the ability of Downloading Excel sheet with Non - VITROS configs-  selected Manufacturer',
  function () {
    library.logStep('Test Case 6: To Verify the ability of Downloading Excel sheet with Non - VITROS configs-  selected Manufacturer');
    const columnName = 'Reagent Lot';
    qcp.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isColumnDisplayed(columnName).then(function (displayed) {
      expect(displayed).toBe(false);
    });
    qcp.clickOnDownloadToExcel(jsonData.FileName).then(function (displayed) {
      expect(displayed).toBe(true);
    }).then(async function () {
      await qcp.readDataCSV(jsonData.FileName, 'instrumentManufacturerName', jsonData.ManufacturerNonVitros).then(function (file) {
        expect(file).toBe(true);
      });
    }).then(async function () {
      await qcp.readDataCSV(jsonData.FileName, 'instrumentName', jsonData.InstrumentNonVitros).then(function (file) {
        expect(file).toBe(true);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });
});
