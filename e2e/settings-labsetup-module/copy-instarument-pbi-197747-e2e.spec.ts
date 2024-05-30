/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { EvalMeanSD } from '../page-objects/EvalMeanSD-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';
import { Connectivity } from '../page-objects/connectivity-mapping-e2e.po';

const fs = require('fs');
let jsonData;


const library=new BrowserLibrary();
library.parseJson('./JSON_data/copy-instrument-pbi-197747_qa.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite PBI 197747: Copy Instrument to another department with existing Instrument at destination', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newSetting = new InheritedSettings();
  const newLabSetup = new NewLabSetup();
  const evalMeanSD = new EvalMeanSD();
  const addAnalyte = new AddAnalyte();
  const archive = new ArchivingLots();
  const connectivity = new Connectivity();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: To verify Copy Instrument Across department with existing Instrument at destination', function () {
    library.logStep('Test case 1: To verify Copy Instrument Across department with existing Instrument at destination');
    newLabSetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (editInstrumentClicked) {
      expect(editInstrumentClicked).toBe(true);
    });
    setting.VerifyCopyInstrumentSectionUI().then(function (UIVerified) {
      expect(UIVerified).toBe(true);
    });
    setting.clickToDepartmentDropdown().then(function (dropdownClicked) {
      expect(dropdownClicked).toBe(true);
    });
    setting.verifyDeptDisplayed(jsonData.Department).then(function (deptDisplayed) {
      expect(deptDisplayed).toBe(true);
    });
    setting.verifyDeptDisplayed(jsonData.Department3).then(function (deptDisplayed) {
      expect(deptDisplayed).toBe(true);
    });
    setting.verifyDeptDisplayed(jsonData.Department4).then(function (deptDisplayed) {
      expect(deptDisplayed).toBe(true);
    });
    setting.verifyDeptDisplayed(jsonData.Department5).then(function (deptDisplayed) {
      expect(deptDisplayed).toBe(false);
    });
    setting.selectToDepartment(jsonData.TargetDepartment).then(function (selectedDept) {
      expect(selectedDept).toBe(true);
    });
    setting.verifyErrorMessageSameInstName().then(function (errorDisplayed) {
      expect(errorDisplayed).toBe(true);
    });
    setting.verifyCopyButtonDisabled().then(function (copyDisabled) {
      expect(copyDisabled).toBe(true);
    });
    setting.enterCopyInstrumentCustomName(jsonData.CustomName).then(function (customNameEntered) {
      expect(customNameEntered).toBe(true);
    });
    setting.verifyCopyButtonEnabled().then(function (copyEnabled) {
      expect(copyEnabled).toBe(true);
    });
    setting.clickCopyButton().then(function (copyClicked) {
      expect(copyClicked).toBe(true);
    });
  });

  it('Test case 2: To verify that the new Instrument is created', function () {
    library.logStep('Test case 2: To verify that the new Instrument is created');
    newLabSetup.navigateTO(jsonData.TargetDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.CustomName).then(function (created) {
      expect(created).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.CustomName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (editInstrumentClicked) {
      expect(editInstrumentClicked).toBe(true);
    });
    setting.verifyInstrumentManufacturer(jsonData.InstrumentManufacturer).then(function (verifiedManufacturer) {
      expect(verifiedManufacturer).toBe(true);
    });
    setting.verifyInstrumentModel(jsonData.InstrumentModel).then(function (verifiedModel) {
      expect(verifiedModel).toBe(true);
    });
  });

  it('Test case 3: To verify that the expired control lot is not created under the new Instrument', function () {
    library.logStep('Test case 3: To verify that the expired control lot is not created under the new Instrument');
    newLabSetup.navigateTO(jsonData.TargetDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.CustomName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.ExpiredControl).then(function (created) {
      expect(created).toBe(false);
    });
  });

  it('Test case 4: To verify that the archived control lot is not created under the new Instrument', function () {
    library.logStep('Test case 4: To verify that the archived control lot is not created under the new Instrument');
    archive.clickArchiveItemToggle().then(function (toggleClicked) {
      expect(toggleClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.CustomName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.ArchivedControl).then(function (created) {
      expect(created).toBe(false);
    });
  });

  it('Test case 5: To verify that the active control lot is created under the new Instrument', function () {
    library.logStep('Test case 5: To verify that the active control lot is created under the new Instrument');
    newLabSetup.navigateTO(jsonData.TargetDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.CustomName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.ActiveControl).then(function (created) {
      expect(created).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ActiveControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.Analyte1).then(function (created) {
      expect(created).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.Analyte2).then(function (created) {
      expect(created).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.Analyte3).then(function (created) {
      expect(created).toBe(false);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Summary').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(4).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(2).then(function (levels) {
      expect(levels).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(2).then(function (levels) {
      expect(levels).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(3).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('7-T', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('R-4s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(jsonData.Level1, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level1, jsonData.CVValue).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('2').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 6: To verify that the empty control lot is created under the new Instrument', function () {
    library.logStep('Test case 6: To verify that the empty control lot is created under the new Instrument');
    newLabSetup.navigateTO(jsonData.TargetDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.CustomName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.EmptyControl).then(function (created) {
      expect(created).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.EmptyControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    addAnalyte.verifyAddAnalytePage().then(function (addAnalytePage) {
      expect(addAnalytePage).toBe(true);
    });
  });

  it('Test case 7: To verify that the active control lot with Control Level Settings is created under the new Instrument', function () {
    library.logStep('Test case 7: To verify that the active control lot with Control Level Settings is created under the new Instrument');
    newLabSetup.navigateTO(jsonData.TargetDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.CustomName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyEntityCreated(jsonData.ControlLevelSettingsControl).then(function (created) {
      expect(created).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlLevelSettingsControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editControl) {
      expect(editControl).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(0).then(function (levels) {
      expect(levels).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(0).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('2 of 2s', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isRuleSelected('3-1s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickControlSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(1, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level1, jsonData.CVValue1).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte4).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(1).then(function (levels) {
      expect(levels).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(0).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('2 of 2s', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isRuleSelected('3-1s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(jsonData.Level1, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level1, jsonData.CVValue1).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 8: To verify that the Instrument created using Copy Instrument functionality is available for Mapping using Connectivity',
    function () {
      library.logStep('Test case 8: To verify that the Instrument created using Copy Instrument functionality is available for Mapping using Connectivity');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connectivity.applyDepartmentFilter(jsonData.TargetDepartment).then(function (filter) {
        expect(filter).toBe(true);
      });
      connectivity.verifyCardDisplayed(jsonData.CustomName).then(function (instCardDisplayed) {
        expect(instCardDisplayed).toBe(true);
      });
    });
});
