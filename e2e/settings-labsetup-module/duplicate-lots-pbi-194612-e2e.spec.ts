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
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { DuplicateLot } from '../page-objects/duplicate-lot-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Duplicate_Lot_pbi_194612.json').then(function(data) {
  jsonData = data;
});



describe('Test Suite PBI 194612: Retain Fixed CV where set', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newSetting = new InheritedSettings();
  const newLabSetup = new NewLabSetup();
  const evalMeanSD = new EvalMeanSD();
  const pointData = new PointDataEntry();
  const duplicateLot = new DuplicateLot();
  const navigation = new NewNavigation();
  const dashboard = new Dashboard();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: To verify the "Retain fixed CV where set" functionality for the same instrument', function () {
    library.logStep('Test case 1: To verify the "Retain fixed CV where set" functionality for the same instrument');
    // Navigate to Edit Control Page
    newLabSetup.navigateTO(jsonData.OnDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    // Start New Lot
    duplicateLot.ClickStartNewLotButton().then(function (duplicateLotClicked) {
      expect(duplicateLotClicked).toBe(true);
    });
    duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
      expect(LotNumberClicked).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.OnFutureLot1).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
    });
    duplicateLot.verifyRetainCVCheckbox().then(function (retainCVVerified) {
      expect(retainCVVerified).toBe(true);
    });
    duplicateLot.clickRetainCVCheckbox().then(function (retainCVClicked) {
      expect(retainCVClicked).toBe(true);
    });
    duplicateLot.verifyCancelEnabled().then(function (cancelEnabled) {
      expect(cancelEnabled).toBe(true);
    });
    duplicateLot.verifyStartNewLotEnabled().then(function (startNewLotEnabled) {
      expect(startNewLotEnabled).toBe(true);
    });
    duplicateLot.clickStartNewLotButtonOnOverlay().then(function (startNewLotClicked) {
      expect(startNewLotClicked).toBe(true);
    });
    // Verification of the duplicated items
    dashboard.clickUnityNext().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.OnControl, jsonData.OnFutureLot1).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    // Verification of Analyte Settings
    newLabSetup.navigateTO(jsonData.OnAnalyte1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(3).then(function (levels) {
      expect(levels).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(4).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isSPCRuleSelected('1-2.00', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isSPCRuleSelected('1-3', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(jsonData.Level1, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(jsonData.Level2, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(jsonData.Level3, 'Fixed', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level1, jsonData.CVValue).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level2, jsonData.CVValue).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('3').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 2: To verify the "Retain fixed CV where set" functionality for Across Instruments Option', function () {
    library.logStep('Test case 2: To verify the "Retain fixed CV where set" functionality for Across Instruments Option');
    // Navigate to Control Settings Page
    newLabSetup.navigateTO(jsonData.OnDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.OnControl, jsonData.OnLot).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    // Start New Lot
    duplicateLot.ClickStartNewLotButton().then(function (duplicateLotClicked) {
      expect(duplicateLotClicked).toBe(true);
    });
    // Start New Lot Overlay
    duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
      expect(LotNumberClicked).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.OnFutureLot2).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
    });
    // On Multiple Instruments Option
    duplicateLot.selectOnMultipleInstrumentsOption().then(function (OnMultipleInstrumentSelected) {
      expect(OnMultipleInstrumentSelected).toBe(true);
    });
    duplicateLot.clickCheckBxInst(jsonData.OnInstrument, jsonData.TargetDepartment1).then(function (checkBoxSelected) {
      expect(checkBoxSelected).toBe(true);
    });
    duplicateLot.clickCheckBxInst(jsonData.OnInstrument, jsonData.TargetDepartment2).then(function (checkBoxSelected2) {
      expect(checkBoxSelected2).toBe(true);
    });
    duplicateLot.verifyRetainCVCheckbox().then(function (retainCVVerified) {
      expect(retainCVVerified).toBe(true);
    });
    duplicateLot.clickRetainCVCheckbox().then(function (retainCVClicked) {
      expect(retainCVClicked).toBe(true);
    });
    duplicateLot.verifyStartNewLotEnabled().then(function (startNewLotEnabled) {
      expect(startNewLotEnabled).toBe(true);
    });
    // Click Start New Lot
    duplicateLot.clickStartNewLotButtonOnOverlay().then(function (startNewLotClicked) {
      expect(startNewLotClicked).toBe(true);
    });
  });

  it('Test case 3: To verify that the lot duplication with "Retain fixed CV where set" is properly done for 1st Analyte with Eval Mean SD settings', function () {
    library.logStep('Test case 3: To verify that the lot duplication with "Retain fixed CV where set" is properly done for 1st Analyte with Eval Mean SD settings');
    // Verification of the Source Instrument Duplicate Lot
    newLabSetup.navigateTO(jsonData.OnDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.OnControl, jsonData.OnFutureLot2).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnAnalyte1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(3).then(function (levels) {
      expect(levels).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(4).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isSPCRuleSelected('1-2.00', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isSPCRuleSelected('1-3', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(1, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(2, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(3, 'Fixed', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('3').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level1, jsonData.CVValue).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level2, jsonData.CVValue).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 4: To verify that the lot duplication with "Retain fixed CV where set" is properly done for 2nd Analyte with Eval Mean SD settings', function () {
    library.logStep('Test case 4: To verify that the lot duplication with "Retain fixed CV where set" is properly done for 2nd Analyte with Eval Mean SD settings');
    newLabSetup.navigateTO(jsonData.TargetDepartment1).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.OnControl, jsonData.OnFutureLot2).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetAnalyte1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(3).then(function (levels) {
      expect(levels).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(2).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('1').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('2').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('3').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 5: To verify that the lot duplication with "Retain fixed CV where set" is properly done for 3rd Analyte with Eval Mean SD settings', function () {
    library.logStep('Test case 5: To verify that the lot duplication with "Retain fixed CV where set" is properly done for 3rd Analyte with Eval Mean SD settings');
    newLabSetup.navigateTO(jsonData.TargetDepartment2).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.OnControl, jsonData.OnFutureLot2).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editControl) {
      expect(editControl).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(1).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('R-4s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickControlSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(1, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level1, jsonData.CVValue3).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('2').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('3').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetAnalyte2).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(1).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('R-4s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD(1, 'Float', 'Fixed').then(function (verifyValues) {
      expect(verifyValues).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(jsonData.Level1, jsonData.CVValue3).then(function (cvVerified) {
      expect(cvVerified).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('2').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('3').then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
});
