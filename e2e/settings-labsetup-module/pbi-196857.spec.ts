/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';

const fs = require('fs');
let jsonData;

const browserLogs = require('protractor-browser-logs');

const library=new BrowserLibrary();
library.parseJson('./JSON_data/pbi-196857.json').then(function(data) {
  jsonData = data;
})


describe('Test Suite: PBI 196857', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newLabSetup = new NewLabSetup();
  const dashboard = new Dashboard();
  const addAnalyte = new AddAnalyte();
  const analyteSettings = new AnalyteSettings();
  const out = new LogOut();

  let logs;

  const pdfFile = '../resources/FileUpload_pdf.pdf';
  const txtFile = '../resources/FileUpload_txt.txt';
  const docFile = '../resources/FileUpload_doc.doc';
  const zipFile = '../resources/FileUpload_zip.zip';
  const jpgFile = '../resources/FileUpload_jpg.jpg';
  const pngFile = '../resources/FileUpload_png.png';

  beforeEach(function () {
    logs = browserLogs(browser);
    logs.ignore(logs.DEBUG);
    logs.ignore(logs.INFO);
    // tslint:disable-next-line: semicolon
    logs.ignore((message) => 'server responded with a status of 404');
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    return logs.verify();
  });

  it('Test case 1: To verify that the Admin user should be able to upload a file to request Reagent, Reagent Lot, Calibrator, Calibrator Lot, Analyte from Add Analyte Page', function () {
    library.logStep('Test case 1.1:To verify that the Admin user should be able to upload a file to request Reagent from Add Analyte Page');
    library.logStep('Test case 1.2:To verify that the Admin user should be able to upload a file to request Reagent Lot from Add Analyte Page');
    library.logStep('Test case 1.3:To verify that the Admin user should be able to upload a file to request Calibrator from Add Analyte Page');
    library.logStep('Test case 1.4:To verify that the Admin user should be able to upload a file to request Calibrator Lot from Add Analyte Page');
    library.logStep('Test case 1.5:To verify that the Admin user should be able to upload a file to request Analyte from Add Analyte Page');
    newLabSetup.navigateTO(jsonData.DepartmentName2).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName2).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName2).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.isControlPageDisplayed(jsonData.ProductName2).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.ProductName2).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnAddAnalyteLink().then(function (addAnalyteClicked) {
      expect(addAnalyteClicked).toBe(true);
    });
    addAnalyte.selectReagentLotNumberCheckbox().then(function (reagentLotNumberChecked) {
      expect(reagentLotNumberChecked).toBe(true);
    });
    addAnalyte.selectCalibratorLotNumberCheckbox().then(function (calibratorLotNumberChecked) {
      expect(calibratorLotNumberChecked).toBe(true);
    });
    addAnalyte.selectAnalyte(jsonData.Analyte3).then(function (selectedAnalyte) {
      expect(selectedAnalyte).toBe(true);
    });
    addAnalyte.selectReagent(jsonData.reagent).then(function (reagentSelected) {
      expect(reagentSelected).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLink().then(function (reagentLink) {
      expect(reagentLink).toBe(true);
    });
    library.browseFileToUploadNRCL(pdfFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(docFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLink().then(function (calibLink) {
      expect(calibLink).toBe(true);
    });
    library.browseFileToUploadNRCL(txtFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLotLink().then(function (calibLotLink) {
      expect(calibLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(jpgFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    addAnalyte.clickDontSeeAnalyte().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.browseFileToUpload(zipFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    out.signOut().then(function (signedOut) {
      expect(signedOut).toBe(true);
    });
  });

  it('Test case 2: To verify that the Admin user should be able to upload a file to request Instrument from Add Instrument Page',
    function () {
      library.logStep('Test case 2.1: To verify that the Admin user should be able to upload a file to request Instrument from Add Instrument Page');
      newLabSetup.navigateTO(jsonData.DepartmentName2).then(function (dept) {
        expect(dept).toBe(true);
      });
      newLabSetup.clickAddAnInstrumentButton().then(function (addInstrumentClicked) {
        expect(addInstrumentClicked).toBe(true);
      });
      newLabSetup.clickOnDontSeeYourInstrument().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      newLabSetup.browseFileToUpload(txtFile).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      analyteSettings.clickSendInformation().then(function (sendClicked) {
        expect(sendClicked).toBe(true);
      });
      out.signOut().then(function (signedOut) {
        expect(signedOut).toBe(true);
      });
    });
});
