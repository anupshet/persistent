/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { UnityDataSync } from './page-objects/data/unity-sync/data-sync.po';
import { DataMappedConfig } from './page-objects/manage-configuration/data-mapping/data-mapped-configuration.po';
import { DataUnMappedConfig } from './page-objects/manage-configuration/data-mapping/data-unmapped-configuration.po';
import { NgucConfig } from './page-objects/manage-configuration/nguc-config/nguc-config.po';
import { ImportConfig } from './page-objects/manage-configuration/valid-config/import-config.po';
import { ViewValid } from './page-objects/manage-configuration/valid-config/view-valid-config.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';


const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/dataUnmappedConfig.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: QCP Data Unmapped Configuration', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const viewValid = new ViewValid();
  const dataMapped = new DataMappedConfig();
  const unmapped = new DataUnMappedConfig();
  const sync = new UnityDataSync();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: To Verify the UI changes on Data Un-Mapped Configurations', function () {
    library.logStep('Test Case 1: To Verify the UI changes on Data Un-Mapped Configurations');
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isReagentDropDownDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isReagentDropDownDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });


  it('Test Case 2: To Verify the ability to view Vitros specific Data Un Mapped/Mapped Configurations', function () {
    library.logStep('Test Case 2: To Verify the ability to view Vitros specific Data Un Mapped/Mapped Configurations');
    const instManufacturerColName = 'Instrument Manufacturer';
    const instrumentColName = 'Instrument';
    const reagentColName = 'Reagent';
    const reagentLotColName = 'Reagent Lot';
    const hasDataMappingColName = 'Has Data Mapping';
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.isColumnDisplayed(instManufacturerColName).then(function (displayed) {
      expect(displayed).toBe(false);
    });
    viewValid.isColumnDisplayed(instrumentColName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.isColumnDisplayed(reagentColName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.isColumnDisplayed(reagentLotColName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.isColumnDisplayed(hasDataMappingColName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(instrumentColName, jsonData.InstrumentVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(reagentColName, jsonData.ReagentVitrosDisplayed).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(reagentLotColName, jsonData.ReagentLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });


  it('Test Case 3: To Verify the ability to view Non - Vitros specific configs', function () {
    library.logStep('Test Case 3: To Verify the ability to view Non - Vitros specific configs');
    const instManufacturerColName = 'Instrument Manufacturer';
    const instrumentColName = 'Instrument';
    const hasDataMappingColName = 'Has Data Mapping';
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    viewValid.isColumnDisplayed(hasDataMappingColName).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(instrumentColName, jsonData.InstrumentNonVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 4: To Verify the ability to clear display table when another Manufacturer is selected from Drop Down', function () {
    library.logStep('Test Case 4: To Verify the ability to clear display table when another Manufacturer is selected from Drop Down');
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.isTableDisplayedWithValues().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isTableDisplayedWithValues().then(function (displayed) {
      expect(displayed).toBe(false);
    });
  });


  it('Test Case 5: To Verify the ability of Downloading Excel sheet with Microslide reagent lots -  selected Manufacturer, Instrument & Reagent',
    function () {
      library.logStep('Test Case 5: To Verify the ability of Downloading Excel sheet with Microslide reagent lots -  selected Manufacturer, Instrument & Reagent');
      const columnName = 'Reagent Lot';
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      unmapped.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      viewValid.isColumnDisplayed(columnName).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      qcp.clickOnDownloadToExcelUnmapped(jsonData.FileName).then(function (displayed) {
        expect(displayed).toBe(true);
      }) .then(async function() {
        await qcp.readDataCSV(jsonData.FileName, 'instrumentManufacturerName', jsonData.ManufacturerVitros).then(function (fileArray) {
          expect(fileArray).toBe(true);
        });
      }).then(async function() {
        await qcp.readDataCSV(jsonData.FileName, 'instrumentName', jsonData.InstrumentVitros ).then(function (fileArray) {
          expect(fileArray).toBe(true);
        });
      }).then(async function() {
        await qcp.readDataCSV(jsonData.FileName, 'reagentName', jsonData.ReagentVitrosToBeSelected ).then(function (fileArray) {
          expect(fileArray).toBe(true);
        });
      }).then(async function() {
        await qcp.readDataCSV(jsonData.FileName, 'reagentLotNumber', jsonData.ReagentLot ).then(function (fileArray) {
          expect(fileArray).toBe(true);
        });
      }).then(async function () {
        await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
          expect(deleted).toBe(true);
        });
      });
    });

  it('Test Case 6: To Verify the ability of Downloading Excel sheet with Non - Microslide reagent lots mapping-  selected Manufacturer, Instrument',
      function () {
      library.logStep('Test Case 6: To Verify the ability of Downloading Excel sheet with Non - Microslide reagent lots mapping-  selected Manufacturer, Instrument');
      const columnName = 'Reagent Lot';
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      dataMapped.selectManufacturer(jsonData.ManufacturerNonVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectInstrument(jsonData.InstrumentNonVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      viewValid.isColumnDisplayed(columnName).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      qcp.clickOnDownloadToExcelUnmapped(jsonData.FileName).then(function (displayed) {
        expect(displayed).toBe(true);
      }) .then(async function() {
        await qcp.readDataCSV(jsonData.FileName, 'instrumentManufacturerName', jsonData.ManufacturerNonVitros).then(function (file) {
          expect(file).toBe(true);
        });
      }).then(async function() {
        await qcp.readDataCSV(jsonData.FileName, 'instrumentName', jsonData.InstrumentNonVitros ).then(function (file) {
          expect(file).toBe(true);
        });
      }).then(async function () {
        await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
          expect(deleted).toBe(true);
        });
      });
    });
/*
  it('Test Case 7: To Verify the ability to' +
   'map the microslide configuration with unmapped old microslide configuration on Add New Data Mapping Configuration pop-up', function () {
    library.logStep('Test Case 7: To Verify' +
   ' the ability to map the microslide configuration ' +
   'with unmapped old microslide configuration on Add New Data Mapping Configuration pop-up');
    library.logStep('Test Case 8: To verify ' +
   'the ability to view new microslide mapping  added from Add New Data Mapping page is displayed on Data Unmapped Config page');
    const instManufacturerColName = 'Instrument Manufacturer';
    const instrumentColName = 'Instrument';
    const reagentColName = 'Reagent';
    const reagentLotColName = 'Reagent Lot';
    const hasDataMappingColName = 'Has Data Mapping';
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelectedNew).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    unmapped.clickAddNewDataMapping().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.verifyReagentlotInValidConfig(jsonData.ReagentVitrosToBeDisplayedNew).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectInstrumentAddNewDataMapping(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectAnalyteAddNewDataMapping(jsonData.OldAnalyte).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectMethodAddNewDataMapping(jsonData.OldMethod).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectOldConfig(jsonData.OldConfig).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.clickAddConfig().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelectedNew).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(instrumentColName, jsonData.InstrumentVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(reagentColName, jsonData.ReagentVitrosToBeDisplayedNew).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(reagentLotColName, jsonData.ReagentLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 9: To verify the ability to view' +
   ' new microslide mapping  added from Add New Data Mapping page is displayed on View Valid Config', function () {
    library.logStep('Test Case 9: To verify the ability ' +
   'to view new microslide mapping  added from Add New Data Mapping page is displayed on View Valid Config');
    const instManufacturerColName = 'Instrument Manufacturer';
    const instrumentColName = 'Instrument';
    const reagentColName = 'Reagent';
    const reagentLotColName = 'Reagent Lot';
    const hasDataMappingColName = 'Has Data Mapping';
    const taskDescription = 'Data Mapping Test';
    const analyteCol = 'Analyte Name';
    const methodCol = 'Method Name';
    const instrumentCol = 'Instrument Name';
    const reagentCol = 'Reagent Name';
    // View Valid config
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(instrumentColName, jsonData.InstrumentVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(reagentColName, jsonData.ReagentVitrosDisplayed).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(reagentLotColName, jsonData.ReagentLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });


  it('Test Case 10: To verify the ability to view new' +
   ' microslide mapping  added from Add New Data Mapping page is displayed on NGUC Config Page', function () {
    library.logStep('Test Case 10: To verify the ability ' +
   'to view new microslide mapping  added from Add New Data Mapping page is displayed on NGUC Config Page');
    const instManufacturerColName = 'Instrument Manufacturer';
    const instrumentColName = 'Instrument';
    const reagentColName = 'Reagent';
    const reagentLotColName = 'Reagent Lot';
    const hasDataMappingColName = 'Has Data Mapping';
    const taskDescription = 'Data Mapping Test';
    const analyteCol = 'Analyte Name';
    const methodCol = 'Method Name';
    const instrumentCol = 'Instrument Name';
    const reagentCol = 'Reagent Name';
    // NGUC
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectSubMenu(jsonData.NGUCMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.searchColumnWithExpectedValue(analyteCol, jsonData.OldAnalyte).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.findElementsInTable(analyteCol, jsonData.OldAnalyte).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.findElementsInTable(instrumentCol, jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.findElementsInTable(methodCol, jsonData.OldMethod).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 11: To verify that Sync job for new microslide mapping is  added on Unity Data Sync Page', function () {
    library.logStep('Test Case 11: To verify that Sync job for new microslide mapping is  added on Unity Data Sync Page');
    const instManufacturerColName = 'Instrument Manufacturer';
    const instrumentColName = 'Instrument';
    const reagentColName = 'Reagent';
    const reagentLotColName = 'Reagent Lot';
    const hasDataMappingColName = 'Has Data Mapping';
    const taskDescription = 'Data Mapping Test';
    const analyteCol = 'Analyte Name';
    const methodCol = 'Method Name';
    const instrumentCol = 'Instrument Name';
    const reagentCol = 'Reagent Name';
    // Unity Sync
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
    sync.searchTaskDescription(taskDescription).then(function (searched) {
      expect(searched).toBe(true);
    });
    sync.sortEndDate('Ascending').then(function (sorted) {
      expect(sorted).toBe(true);
    });
    sync.isTaskDisplayedForImport(taskDescription, taskDescription, taskDescription, taskDescription).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 8: To verify the ability to view new ' +
   'microslide mapping added from Add New Data Mapping page which is displayed on different pages  in the application', function () {
    library.logStep('Test Case 8: To verify the ability ' +
   'to view new microslide mapping added from Add New Data Mapping page which is displayed on different pages  in the application');
    const instManufacturerColName = 'Instrument Manufacturer';
    const instrumentColName = 'Instrument';
    const reagentColName = 'Reagent';
    const reagentLotColName = 'Reagent Lot';
    const hasDataMappingColName = 'Has Data Mapping';
    const taskDescription = 'Data Mapping Test';
    const analyteCol = 'Analyte Name';
    const methodCol = 'Method Name';
    const instrumentCol = 'Instrument Name';
    const reagentCol = 'Reagent Name';
    // Data Mapped Config

    const oldConfig = 'OLD CONFIG NAME';
    const validConfig = 'VALID CONFIG NAME';
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenuOption, jsonData.DataMappingMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.findElementsInTable(oldConfig, jsonData.InstrumentVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.findElementsInTable(validConfig, jsonData.InstrumentVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.findElementsInTable(oldConfig, jsonData.OldVitrosReagent).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.findElementsInTable(validConfig, jsonData.ReagentVitrosDisplayed).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.findElementsInTable(validConfig, jsonData.ReagentLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelectedNew).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    unmapped.clickAddNewDataMapping().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectInstrumentAddNewDataMapping(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectAnalyteAddNewDataMapping(jsonData.OldAnalyte).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectMethodAddNewDataMapping(jsonData.OldMethod).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectOldConfig(jsonData.OldConfig).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.clickAddConfig().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenu, jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelectedNew).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(instrumentColName, jsonData.InstrumentVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(reagentColName, jsonData.ReagentVitrosToBeDisplayedNew).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    viewValid.findElementsInTable(reagentLotColName, jsonData.ReagentLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 7: To Verify the ability to delete the Data Mapped Configuration', function () {
    library.logStep('Test Case 7: To verify the ability to' +
   ' view new microslide mapping added from Add New Data Mapping page which is displayed on different pages  in the application');
    const instManufacturerColName = 'Instrument Manufacturer';
    const instrumentColName = 'Instrument';
    const reagentColName = 'Reagent';
    const reagentLotColName = 'Reagent Lot';
    const hasDataMappingColName = 'Has Data Mapping';
    const taskDescription = 'Data Mapping Test';
    const analyteCol = 'Analyte Name';
    const methodCol = 'Method Name';
    const instrumentCol = 'Instrument Name';
    const reagentCol = 'Reagent Name';
    // Data Mapped Config

    const oldConfig = 'OLD CONFIG NAME';
    const validConfig = 'VALID CONFIG NAME';
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectSubMenuOptionDataMappedConfig(jsonData.SubMenuOption, jsonData.DataMappingMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unmapped.selectReagent(jsonData.ReagentVitrosToBeSelectedNew).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.searchColumnWithExpectedValue(validConfig, jsonData.ReagentVitrosToBeDisplayedNew).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    // dataMapped.findElementsInTable(oldConfig, jsonData.InstrumentVitros).then(function (displayed) {
    //   expect(displayed).toBe(true);
    // });
    // dataMapped.findElementsInTable(validConfig, jsonData.InstrumentVitros).then(function (displayed) {
    //   expect(displayed).toBe(true);
    // });
    // dataMapped.findElementsInTable(oldConfig, jsonData.OldVitrosReagent).then(function (displayed) {
    //   expect(displayed).toBe(true);
    // });

    qcp.selectCheckbox().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.clickOnDeleteButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
  */
});
