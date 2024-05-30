/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { SingleSummary } from '../page-objects/single-summary.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';

const fs = require('fs');
let jsonData;


const library=new BrowserLibrary();
library.parseJson('./JSON_data/RequestNewReagentCalibratorLot-187076.json').then(function(data) {
  jsonData = data;
})


describe('Test Suite: Request New Reagent, Calibrator, Lots', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newSetting = new InheritedSettings();
  const newLabSetup = new NewLabSetup();
  const dashboard = new Dashboard();
  const addAnalyte = new AddAnalyte();
  const pointData = new PointDataEntry();
  const singleSummary = new SingleSummary();
  const analyteSettings = new AnalyteSettings();

  const pdfFile = '../resources/FileUpload_pdf.pdf';
  const txtFile = '../resources/FileUpload_txt.txt';
  const docFile = '../resources/FileUpload_doc.doc';
  const zipFile = '../resources/FileUpload_zip.zip';
  const jpgFile = '../resources/FileUpload_jpg.jpg';
  const pngFile = '../resources/FileUpload_png.png';
  const xlsxFile = '../resources/FileUpload_xlsx.xlsx';
  const csvFile = '../resources/FileUpload_csv.csv';
  const rtfFile = '../resources/FileUpload_rtf.rtf';
  const datFile = '../resources/FileUpload_dat.dat';
  const moreThan7MBFile = '../resources/FileUpload_txt_7.1MB.txt';

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  // TCs for UI Verification
  it('Test case 1: To verify that the UI of request new Reagent, Reagent Lot, Calibrator, Calibrator Lot Page', function () {
    library.logStep('Test case 1: To verify that the UI of request new Reagent Page');
    library.logStep('Test case 2: To verify that the UI of request new Reagent Lot Page');
    library.logStep('Test case 3: To verify that the UI of request new Calibrator Page');
    library.logStep('Test case 4: To verify that the UI of request new Calibrator Lot Page');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLink().then(function (reagentLink) {
      expect(reagentLink).toBe(true);
    });
    // Request Reagent Popup UI Verification
    analyteSettings.VerifyRequestNRRLCCLPopupUI(jsonData.ReagentOption).then(function (UIVerified) {
      expect(UIVerified).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (closeClicked) {
      expect(closeClicked).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    // Request Reagent Lot Popup UI Verification
    analyteSettings.VerifyRequestNRRLCCLPopupUI(jsonData.ReagentLotOption).then(function (UIVerified) {
      expect(UIVerified).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (closeClicked) {
      expect(closeClicked).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLink().then(function (calibratorLink) {
      expect(calibratorLink).toBe(true);
    });
    // Request Calibrator Popup UI Verification
    analyteSettings.VerifyRequestNRRLCCLPopupUI(jsonData.CalibratorOption).then(function (UIVerified) {
      expect(UIVerified).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (closeClicked) {
      expect(closeClicked).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLotLink().then(function (calibratorLotLink) {
      expect(calibratorLotLink).toBe(true);
    });
    // Request Calibrator Lot Popup UI Verification
    analyteSettings.VerifyRequestNRRLCCLPopupUI(jsonData.CalibratorLotOption).then(function (UIVerified) {
      expect(UIVerified).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (closeClicked) {
      expect(closeClicked).toBe(true);
    });
  });

  it('Test case 2: To verify that the Admin user should be able to upload a file to request Reagent, Reagent Lot, Calibrator, Calibrator Lot from Add Analyte Page', function () {
    library.logStep('Test case 5: To verify that Admin user should be able to upload a file to request Reagent from Add Analyte Page');
    library.logStep('Test case 6: To verify that Admin user should be able to upload a file to request Reagent Lot from Add Analyte Page');
    library.logStep('Test case 7: To verify that Admin user should be able to upload a file to request Calibrator from Add Analyte Page');
    library.logStep('Test case 8: To verify Admin user should be able to upload a file to request Calibrator Lot from Add Analyte Page');
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
    library.browseFileToUploadNRCL(pdfFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLotLink().then(function (calibLotLink) {
      expect(calibLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(docFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
  });

  it('Test case 3: To verify that the Admin user should be able to upload a file to request Reagent, Reagent Lot, Calibrator, Calibrator Lot from Edit Analyte Page', function () {
    library.logStep('Test case 9: To verify that the Admin user should be able to upload a file to request Reagent from Edit Analyte Page');
    library.logStep('Test case 10: To verify that the Admin user should be able to upload a file to request Reagent Lot from Edit Analyte Page');
    library.logStep('Test case 11: To verify that the Admin user should be able to upload a file to request Calibrator from Edit Analyte Page');
    library.logStep('Test case 12: To verify that the Admin user should be able to upload a file to request calibrator Lot from Edit Analyte Page');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLink().then(function (reagentLink) {
      expect(reagentLink).toBe(true);
    });
    library.browseFileToUploadNRCL(txtFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(zipFile).then(function (uploaded) {
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
    library.browseFileToUploadNRCL(zipFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
  });

  it('Test case 4: To verify that the Admin user should be able to upload a file to request Reagent Lot & Calibrator Lot from Analyte Data Table Page (Point Data Entry)', function () {
    library.logStep('Test case 13: To verify that the Admin user should be able to upload a file to request Reagent Lot from Analyte Data Table Page (Point Data Entry)');
    library.logStep('Test case 14: To verify that the Admin user should be able to upload a file to request Calibrator Lot from Analyte Data Table Page (Point Data Entry)');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(jpgFile).then(function (uploaded) {
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
  });

  it('Test case 5: To verify that the Admin user should be able to upload a file to request Reagent Lot & Calibrator Lot from Analyte Data Table Page (Summary Data Entry)', function () {
    library.logStep('Test case 15: To verify that the Admin user should be able to upload a file to request Reagent Lot from Analyte Data Table Page (Summary Data Entry)');
    library.logStep('Test case 16: To verify that the Admin user should be able to upload a file to request Calibrator Lot from Analyte Data Table Page (Summary Data Entry)');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    singleSummary.clickShowOption('11').then(function (manually) {
      expect(manually).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(pngFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLotLink().then(function (calibratorLotLink) {
      expect(calibratorLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(pngFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
  });

  it('Test case 6: To verify the error message for unsupported file format for request new Reagent, Reagent Lot, Calibrator, Calibrator Lot Page', function () {
    library.logStep('Test case 17: To verify the error message for unsupported file format for request new Reagent Page');
    library.logStep('Test case 18: To verify the error message for unsupported file format for request new Reagent Lot Page');
    library.logStep('Test case 19: To verify the error message for unsupported file format for request new Calibrator Page');
    library.logStep('Test case 20: To verify the error message for unsupported file format for request new Calibrator Lot Page');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLink().then(function (reagentLink) {
      expect(reagentLink).toBe(true);
    });
    library.browseFileToUploadNRCL(xlsxFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.verifyIncorrectFileTypeError().then(function (incorrectFileType) {
      expect(incorrectFileType).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (popupClosed) {
      expect(popupClosed).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(csvFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.verifyIncorrectFileTypeError().then(function (incorrectFileType) {
      expect(incorrectFileType).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (popupClosed) {
      expect(popupClosed).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLink().then(function (calibratorLink) {
      expect(calibratorLink).toBe(true);
    });
    library.browseFileToUploadNRCL(rtfFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.verifyIncorrectFileTypeError().then(function (incorrectFileType) {
      expect(incorrectFileType).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (popupClosed) {
      expect(popupClosed).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLotLink().then(function (calibratorLotLink) {
      expect(calibratorLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(datFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.verifyIncorrectFileTypeError().then(function (incorrectFileType) {
      expect(incorrectFileType).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (popupClosed) {
      expect(popupClosed).toBe(true);
    });
  });

  it('Test case 7: To verify the error message for unsupported file size for request new Reagent, Reagent Lot, Calibrator, Calibrator Lot Page', function () {
    library.logStep('Test case 21: To verify the error message for unsupported file size for request new Reagent Page');
    library.logStep('Test case 22: To verify the error message for unsupported file size for request new Reagent Lot Page');
    library.logStep('Test case 23: To verify the error message for unsupported file size for request new Calibrator Page');
    library.logStep('Test case 24: To verify the error message for unsupported file size for request new Calibrator Lot Page');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLink().then(function (reagentLink) {
      expect(reagentLink).toBe(true);
    });
    library.browseFileToUploadNRCL(moreThan7MBFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.verifyIncorrectFileSizeError().then(function (incorrectFileType) {
      expect(incorrectFileType).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (popupClosed) {
      expect(popupClosed).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(moreThan7MBFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.verifyIncorrectFileSizeError().then(function (incorrectFileType) {
      expect(incorrectFileType).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (popupClosed) {
      expect(popupClosed).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLink().then(function (calibratorLink) {
      expect(calibratorLink).toBe(true);
    });
    library.browseFileToUploadNRCL(moreThan7MBFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.verifyIncorrectFileSizeError().then(function (incorrectFileType) {
      expect(incorrectFileType).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (popupClosed) {
      expect(popupClosed).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLotLink().then(function (calibratorLotLink) {
      expect(calibratorLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(moreThan7MBFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.verifyIncorrectFileSizeError().then(function (incorrectFileType) {
      expect(incorrectFileType).toBe(true);
    });
    analyteSettings.clickClosePopup().then(function (popupClosed) {
      expect(popupClosed).toBe(true);
    });
  });

  it('Test case 8: To verify that the Lab user should be able to upload a file to request Reagent Lot & Calibrator Lot from Analyte Data Table Page (Point Data Entry)', function () {
    library.logStep('Test case 25: To verify that the Lab user should be able to upload a file to request Reagent Lot from Analyte Data Table Page (Point Data Entry)');
    library.logStep('Test case 26: To verify that the Lab user should be able to upload a file to request Calibrator Lot from Analyte Data Table Page (Point Data Entry)');
    out.signOut().then(function (signedOut) {
      expect(signedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameUser, jsonData.Password, jsonData.FirstNameUser).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(jpgFile).then(function (uploaded) {
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
  });

  it('Test case 9: To verify that the Lab user should be able to upload a file to request Reagent Lot & Calibrator Lot from Analyte Data Table Page (Summary Data Entry)', function () {
    library.logStep('Test case 27: To verify that the Lab user should be able to upload a file to request Reagent Lot from Analyte Data Table Page (Summary Data Entry)');
    library.logStep('Test case 28: To verify that the Lab user should be able to upload a file to request Calibrator Lot from Analyte Data Table Page (Summary Data Entry)');
    out.signOut().then(function (signedOut) {
      expect(signedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameUser, jsonData.Password, jsonData.FirstNameUser).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    singleSummary.clickShowOption('11').then(function (manually) {
      expect(manually).toBe(true);
    });
    analyteSettings.clickDontSeeReagentLotLink().then(function (reagentLotLink) {
      expect(reagentLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(pngFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
    analyteSettings.clickDontSeeCalibratorLotLink().then(function (calibratorLotLink) {
      expect(calibratorLotLink).toBe(true);
    });
    library.browseFileToUploadNRCL(pngFile).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    analyteSettings.clickSendInformation().then(function (sendClicked) {
      expect(sendClicked).toBe(true);
    });
  });
});
