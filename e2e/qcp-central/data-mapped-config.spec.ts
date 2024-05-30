/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { UnityDataSync } from './page-objects/data/unity-sync/data-sync.po';
import { DataMappedConfig } from './page-objects/manage-configuration/data-mapping/data-mapped-configuration.po';
import { NgucConfig } from './page-objects/manage-configuration/nguc-config/nguc-config.po';
import { ImportConfig } from './page-objects/manage-configuration/valid-config/import-config.po';
import { ViewValid } from './page-objects/manage-configuration/valid-config/view-valid-config.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';


const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/dataMappedConfig.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: QCP Data Mapped Configuration', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const viewValid = new ViewValid();
  const dataMapped = new DataMappedConfig();

  beforeEach(function () {

    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: To Verify the UI changes on Data Mapped Configurations', function () {
    library.logStep('Test Case 1: To Verify the UI changes on Data Mapped Configurations');
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
    viewValid.isReagentDropDownDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    dataMapped.selectManufacturer(jsonData.ManufacturerVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectInstrument(jsonData.InstrumentVitros).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    viewValid.isReagentDropDownDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });


  it('Test Case 2: To Verify the ability to view Vitros specific Data Mapped Configurations', function () {
    library.logStep('Test Case 2: To Verify the ability to view Vitros specific Data Mapped Configurations');
    const oldConfig = 'OLD CONFIG NAME';
    const validConfig = 'VALID CONFIG NAME';
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
    viewValid.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
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
  });


  it('Test Case 3: To Verify the ability to view Non - Vitros specific configs', function () {
    library.logStep('Test Case 3: To Verify the ability to view Non - Vitros specific configs');
    const oldConfig = 'OLD CONFIG NAME';
    const validConfig = 'VALID CONFIG NAME';
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
    qcp.searchColumnWithExpectedValue(validConfig, jsonData.AnalyteNonVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.findElementsInTable
      (oldConfig, jsonData.ManufacturerNonVitros + ' ' + jsonData.InstrumentNonVitros).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    dataMapped.findElementsInTable(validConfig, jsonData.InstrumentNonVitros).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMapped.findElementsInTable(validConfig, jsonData.AnalyteNonVitros).then(function (displayed) {
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
    viewValid.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
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


  it('Test Case 5: To Verify the ability of Downloading Excel sheet with VITROS configs -  selected Manufacturer, Reagent & Reagent lots',
    function () {
      library.logStep('Test Case 5: To Verify the ability of Downloading Excel sheet with VITROS configs -  selected Manufacturer, Reagent & Reagent lots');
      const oldConfigTableColName = 'OLD CONFIG NAME';
      const validConfigTableColName = 'VALID CONFIG NAME';
      const oldConfigCsvColName = 'OldConfig';
      const validConfigCsvColName = 'ValidConfig';
      let temp1, temp2;
      let dataValidConfig;
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
      viewValid.selectReagent(jsonData.ReagentVitrosToBeSelected).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      dataMapped.getiFirstDataFromColumn(validConfigTableColName).then(function (text) {
        temp1 = text;
        expect(text).not.toEqual('undefined');
      });
      dataMapped.getiFirstDataFromColumn(oldConfigTableColName).then(function (text) {
        temp2 = text;
        expect(text).not.toEqual('undefined');
      });
      qcp.clickOnDownloadToExcel(jsonData.FileName).then(function (displayed) {
        expect(displayed).toBe(true);
      }).then(async function () {
        dataValidConfig = temp1;
        await dataMapped.readDataCSVDataMapping(jsonData.FileName, validConfigCsvColName, dataValidConfig).then(function (data) {
          expect(data).toBe(true);
        });
      // }).then(async function () {
      //   dataOldConfig = temp2;
      //   await dataMapped.readDataCSVDataMapping(jsonData.FileName, oldConfigCsvColName, dataOldConfig).then(function (data) {
      //     expect(data).toBe(true);
      //   });
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
        const oldConfigTableColName = 'OLD CONFIG NAME';
        const validConfigTableColName = 'VALID CONFIG NAME';
        const oldConfigCsvColName = 'OldConfig';
        const validConfigCsvColName = 'ValidConfig';
        let temp1, temp2;
        let dataValidConfig;
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
        dataMapped.getiFirstDataFromColumn(validConfigTableColName).then(function (text) {
          temp1 = text;
          expect(text).not.toEqual('undefined');
        });
        dataMapped.getiFirstDataFromColumn(oldConfigTableColName).then(function (text) {
          temp2 = text;
          expect(text).not.toEqual('undefined');
        });
        qcp.clickOnDownloadToExcel(jsonData.FileName).then(function (displayed) {
          expect(displayed).toBe(true);
        }).then(async function () {
          dataValidConfig = temp1;
          await dataMapped.readDataCSVDataMapping(jsonData.FileName, validConfigCsvColName, dataValidConfig).then(function (data) {
            expect(data).toBe(true);
          });
        // }).then(async function () {
        //   dataOldConfig = temp2;
        //   await dataMapped.readDataCSVDataMapping(jsonData.FileName, oldConfigCsvColName, dataOldConfig).then(function (data) {
        //     expect(data).toBe(true);
        //   });
        }).then(async function () {
          await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
            expect(deleted).toBe(true);
          });
        });
      });


});
