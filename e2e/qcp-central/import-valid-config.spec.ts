/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { UnityDataSync } from './page-objects/data/unity-sync/data-sync.po';
import { ImportConfig } from './page-objects/manage-configuration/valid-config/import-config.po';
import { ViewValid } from './page-objects/manage-configuration/valid-config/view-valid-config.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';


const fs = require('fs');
let jsonData;

// Localhost


const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/importValidConfig.json').then(function(data) {
  jsonData = data;
})




describe('Test Suite: QCP Import Valid Configurations from Excel', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const viewValid = new ViewValid();
  const fileData = new Array();
  const importVC = new ImportConfig();
  const sync = new UnityDataSync();

  beforeEach(function () {

    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

    it('Test Case 1: To Verify the UI changes on QCP Import Excel Sheet Page to import Microslide excel file', function () {
      library.logStep('Test Case 1: To Verify the UI changes on QCP Import Excel Sheet Page to import Microslide excel file');
      library.logStep('Test Case 2: To Verify non-microslide excel file upload by checking Microslide Configurations check box ');
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.NonVitrosFile).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.isMicroslideCheckboxDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickMicroslideCheckbox().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyErrorMessageDisplayed(jsonData.ErrorMsgVitros).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.clickOkOnErrorMessage().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });

    it('Test Case 3: To Verify microslide excel file upload by unchecking Microslide Configurations check box', function () {
      library.logStep('Test Case 3: To Verify microslide excel file upload by unchecking Microslide Configurations check box');
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.VitrosFile).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyErrorMessageDisplayed(jsonData.ErrorMsgNonVitrso).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.clickOkOnErrorMessage().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });

    it
    ('Test Case 4: To Verify that uploading Microslide Valid Config file, excel content is displayed with Reagent Lot Column', function () {
      library.logStep
      ('Test Case 4: To Verify that uploading Microslide Valid Config file, excel content is displayed with Reagent Lot Column');
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.VitrosFile).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.clickMicroslideCheckbox().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyAllColumnDisplayed(jsonData.VitrosExcelColumns).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

    it('Test Case 5: To verify by importing microslide reagent configurations excel sheet having Invalid data', function () {
      library.logStep
      ('Test Case 5: To verify by importing microslide reagent configurations excel sheet having Invalid data');
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.MissingReagLotFile).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.clickMicroslideCheckbox().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyValidationErrorMessage(jsonData.MissingLotError).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.closeValidationError().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.InvalidLotFile1).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.clickMicroslideCheckbox().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyValidationErrorMessage(jsonData.InvalidLotError).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.closeValidationError().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.InvalidLotFile2).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.clickMicroslideCheckbox().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyValidationErrorMessage(jsonData.InvalidLotError).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.closeValidationError().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.InvalidLotFile3).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.clickMicroslideCheckbox().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyValidationErrorMessage(jsonData.InvalidLotError).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.closeValidationError().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.InvalidLotFile4).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.clickMicroslideCheckbox().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyValidationErrorMessage(jsonData.InvalidLotError).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.closeValidationError().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.uploadFile(jsonData.InvalidLotFile5).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      importVC.clickMicroslideCheckbox().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.clickOnUploadAndViewButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      importVC.verifyValidationErrorMessage(jsonData.InvalidLotError).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      importVC.closeValidationError().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });

    // it
    // ('Test Case 7: To Verify the ability to ' +
    // 'Import Microslide Configurations from Excel with one old configurations mapped to one valid configuration', function () {
    //   library.logStep
    //   ('Test Case 7: To Verify the ability ' +
    //  'to Import Microslide Configurations from Excel with one old configurations mapped to one valid configuration');
    //   qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   // File name to be added
    //   qcp.uploadFile('').then(function (uploaded) {
    //     expect(uploaded).toBe(true);
    //   });
    //   importVC.clickMicroslideCheckbox().then(function (displayed) {
    //     expect(displayed).toBe(true);
    //   });
    //   importVC.clickOnUploadAndViewButton().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   importVC.verifyAllColumnDisplayed(jsonData.VitrosExcelColumns).then(function (displayed) {
    //     expect(displayed).toBe(true);
    //   });
    //   importVC.clickOnImportButton().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   // importVC.verifyConfirmImportMessage().then(function (displayed) {
    //   //   expect(displayed).toBe(true);
    //   // });
    //   importVC.clickOkOnConfirmImport().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    // });

});
