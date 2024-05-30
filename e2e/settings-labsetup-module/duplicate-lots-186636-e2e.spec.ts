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
import { DuplicateLot } from '../page-objects/duplicate-lot-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

const fs = require('fs');
let jsonData;

const library=new BrowserLibrary();
library.parseJson('./JSON_data/Duplicate_Lot_186636_QA.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: Duplicate Lots Across Instruments', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newSetting = new InheritedSettings();
  const newLabSetup = new NewLabSetup();
  const evalMeanSD = new EvalMeanSD();
  const duplicateLot = new DuplicateLot();
  const dashboard = new Dashboard();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: To verify the UI of "Start New Lot" dialog box', function () {
    library.logStep('Test case 1: To verify the UI of "Start New Lot" dialog box');
    newLabSetup.navigateTO(jsonData.SourceDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.SourceInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.SourceControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    duplicateLot.VerifyStartNewLotBtnDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    duplicateLot.ClickStartNewLotButton().then(function (duplicateLotClicked) {
      expect(duplicateLotClicked).toBe(true);
    });
    duplicateLot.VerifyStartNewLotPopupUI(jsonData.SourceControl).then(function (uiVerified) {
      expect(uiVerified).toBe(true);
    });
    duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
      expect(LotNumberClicked).toBe(true);
    });
    duplicateLot.verifyLotDisplayed(jsonData.FutureLot1, jsonData.FutureLot1Expiry).then(function (verified1) {
      expect(verified1).toBe(true);
    });
    duplicateLot.verifyLotDisplayed(jsonData.FutureLot2, jsonData.FutureLot2Expiry).then(function (verified2) {
      expect(verified2).toBe(true);
    });
    duplicateLot.verifyLotDisplayed(jsonData.FutureLot3, jsonData.FutureLot3Expiry).then(function (verified3) {
      expect(verified3).toBe(true);
    });
    duplicateLot.verifyLotDisplayed(jsonData.FutureLot4, jsonData.FutureLot4Expiry).then(function (verified4) {
      expect(verified4).toBe(true);
    });
    duplicateLot.verifyLotDisplayed(jsonData.FutureLot5, jsonData.FutureLot5Expiry).then(function (verified5) {
      expect(verified5).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.FutureLot2).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
    });
    duplicateLot.verifyOnMultipleInstrumentsEnabled().then(function (onMultipleInstrumentsEnabled) {
      expect(onMultipleInstrumentsEnabled).toBe(true);
    });
    duplicateLot.verifyCancelEnabled().then(function (cancelEnabled) {
      expect(cancelEnabled).toBe(true);
    });
    duplicateLot.verifyStartNewLotEnabled().then(function (startNewLotEnabled) {
      expect(startNewLotEnabled).toBe(true);
    });
    duplicateLot.selectOnMultipleInstrumentsOption().then(function (OnMultipleInstrumentsSelected) {
      expect(OnMultipleInstrumentsSelected).toBe(true);
    });
    duplicateLot.verifyCheckBxSelectAllInstrumentsDisplayed().then(function (allInstrumentsBelow) {
      expect(allInstrumentsBelow).toBe(true);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.SourceInstrument, jsonData.SourceDepartment).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(true);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument1, jsonData.TargetDepartment1).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(true);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument2, jsonData.TargetDepartment2).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(true);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument3, jsonData.TargetDepartment3).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(true);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument4, jsonData.TargetDepartment4).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(true);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument5, jsonData.TargetDepartment5).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(false);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument6, jsonData.TargetDepartment6).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(false);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument7, jsonData.TargetDepartment7).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(false);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument8, jsonData.TargetDepartment8).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(false);
    });
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument9, jsonData.TargetDepartment9).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(false);
    });
    // tslint:disable-next-line: max-line-length
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument10, jsonData.TargetDepartment10).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(false);
    });
    // tslint:disable-next-line: max-line-length
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument11, jsonData.TargetDepartment11).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(true);
    });
    // tslint:disable-next-line: max-line-length
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument12, jsonData.TargetDepartment12).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(true);
    });
    // tslint:disable-next-line: max-line-length
    duplicateLot.verifyCheckBxInstDeptDisplayed(jsonData.TargetInstrument13, jsonData.TargetDepartment13).then(function (instDeptDisplayed) {
      expect(instDeptDisplayed).toBe(false);
    });
    duplicateLot.clickCheckBxInst(jsonData.TargetInstrument1, jsonData.TargetDepartment1).then(function (checkBxClicked) {
      expect(checkBxClicked).toBe(true);
    });
    duplicateLot.verifyCancelEnabled().then(function (cancelEnabled) {
      expect(cancelEnabled).toBe(true);
    });
    duplicateLot.verifyStartNewLotEnabled().then(function (startNewLotEnabled) {
      expect(startNewLotEnabled).toBe(true);
    });
    duplicateLot.clickCheckBxAllBelowInstruments().then(function (checkBoxClicked) {
      expect(checkBoxClicked).toBe(true);
    });
    duplicateLot.verifyAllCheckedBoxesChecked(8).then(function (allSelected) {
      expect(allSelected).toBe(true);
    });
    duplicateLot.verifyCancelEnabled().then(function (cancelEnabled) {
      expect(cancelEnabled).toBe(true);
    });
    duplicateLot.verifyStartNewLotEnabled().then(function (startNewLotEnabled) {
      expect(startNewLotEnabled).toBe(true);
    });
    duplicateLot.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    duplicateLot.VerifyStartNewLotPopupUI(jsonData.SourceControl).then(function (uiVerified) {
      expect(uiVerified).toBe(true);
    });
    duplicateLot.clickCloseButton().then(function (closeClicked) {
      expect(closeClicked).toBe(true);
    });
  });

  // tslint:disable-next-line: max-line-length
  it('Test case 2: To verify that the Start New Lot button is not visible on Control Settings Page for a Control with no analytes.', function () {
    library.logStep('Test case 2: To verify that the Start New Lot button is not visible on Control Settings Page for a Control with no analytes.');
    newLabSetup.navigateTO(jsonData.TargetDepartment5).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetInstrument5).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetControl5).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    duplicateLot.VerifyStartNewLotBtnDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
  });

  it('Test case 1: To verify the Duplicate Lot functionality for the same instrument', function () {
    library.logStep('Test case 1: To verify the Duplicate Lot functionality for the same instrument');
    newLabSetup.navigateTO(jsonData.OnDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnControlCustom).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    duplicateLot.ClickStartNewLotButton().then(function (duplicateLotClicked) {
      expect(duplicateLotClicked).toBe(true);
    });
    duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
      expect(LotNumberClicked).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.OnFutureLot2).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
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
    dashboard.clickUnityNext().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.OnInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.OnControlCustom, jsonData.OnFutureLot2).then(function (lotNotDuplicated) {
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
    newLabSetup.navigateTO(jsonData.OnAnalyte2).then(function (analyte2) {
      expect(analyte2).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Summary').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(2).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(3).then(function (levels) {
      expect(levels).toBe(true);
    });
  });

  it('Test case 1: To verify the Duplicate Lot functionality for Across Instruments Option', function () {
    library.logStep('Test case 1: To verify the Duplicate Lot functionality for Across Instruments Option');
    newLabSetup.navigateTO(jsonData.SourceDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.SourceInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.SourceControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    duplicateLot.ClickStartNewLotButton().then(function (duplicateLotClicked) {
      expect(duplicateLotClicked).toBe(true);
    });
    duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
      expect(LotNumberClicked).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.FutureLot1).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
    });
    duplicateLot.selectOnMultipleInstrumentsOption().then(function (OnMultipleInstrumentSelected) {
      expect(OnMultipleInstrumentSelected).toBe(true);
    });
    duplicateLot.verifyCheckBxSelectAllInstrumentsDisplayed().then(function (allInstrumentsBelow) {
      expect(allInstrumentsBelow).toBe(true);
    });
    duplicateLot.clickCheckBxAllBelowInstruments().then(function (checkBoxClicked) {
      expect(checkBoxClicked).toBe(true);
    });
    duplicateLot.verifyStartNewLotEnabled().then(function (startNewLotEnabled) {
      expect(startNewLotEnabled).toBe(true);
    });
    duplicateLot.clickStartNewLotButtonOnOverlay().then(function (startNewLotClicked) {
      expect(startNewLotClicked).toBe(true);
    });
  });

  it('Test case 2: To verify that the lot duplication is properly done for the Control with 1 analyte configured for Point Data & 1 for Summary Data.', function () {
    library.logStep('Test case 2: To verify that the lot duplication is properly done for the Control with 1 analyte configured for Point Data & 1 for Summary Data.');
    newLabSetup.navigateTO(jsonData.SourceDepartment).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.SourceInstrument).then(function (sourceInst) {
      expect(sourceInst).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.SourceControl, jsonData.FutureLot1).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
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
    newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte1) {
      expect(analyte1).toBe(true);
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
    newSetting.verifyNumberOfLevelDisplayed(3).then(function (levels) {
      expect(levels).toBe(true);
    });
  });

  // tslint:disable-next-line: max-line-length
  it('Test case 3: To verify that the lot duplication is properly done for the Control with 2 analytes configured for Summary Data.', function () {
    library.logStep('Test case 3: To verify that the lot duplication is properly done for the Control with 2 analytes configured for Summary Data.');
    newLabSetup.navigateTO(jsonData.TargetDepartment1).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetInstrument1).then(function (sourceInst) {
      expect(sourceInst).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.TargetControl1, jsonData.FutureLot1).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte3).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Summary').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(2).then(function (levels) {
      expect(levels).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(2).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte4).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Summary').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(3).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(3).then(function (levels) {
      expect(levels).toBe(true);
    });
  });

  // tslint:disable-next-line: max-line-length
  it('Test case 4: To verify that the lot duplication is properly done for the Control with 2 analytes configured for Point Data.', function () {
    library.logStep('Test case 4: To verify that the lot duplication is properly done for the Control with 2 analytes configured for Point Data.');
    newLabSetup.navigateTO(jsonData.TargetDepartment2).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetInstrument2).then(function (sourceInst) {
      expect(sourceInst).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.TargetControl2, jsonData.FutureLot1).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte5).then(function (analyte1) {
      expect(analyte1).toBe(true);
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
    newSetting.verifyDecimalPlaceSelected(2).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte6).then(function (analyte1) {
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
    newSetting.verifyDecimalPlaceSelected(3).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
  });

  it('Test case 5: To verify that the lot duplication is properly done for the Control with 1 analyte configured for Point Data and with Westgard Rules', function () {
    library.logStep('Test case 5: To verify that the lot duplication is properly done for the Control with 1 analyte configured for Point Data and with Westgard Rules');
    newLabSetup.navigateTO(jsonData.TargetDepartment3).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetInstrument3).then(function (sourceInst) {
      expect(sourceInst).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.TargetControl3, jsonData.FutureLot1).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte7).then(function (analyte1) {
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
    newSetting.isSPCRuleSelected('1-2.00', 'disable').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isSPCRuleSelected('1-3', 'disable').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('2 of 2s', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('2 of 3/2s', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isKxRuleSelected('7x', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('7-T', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('R-4s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isRuleSelected('4-1s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
  });

  it('Test case 6: To verify that the lot duplication is properly done for the Control with 1 analyte configured for Point Data and with Eval Mean SD', function () {
    library.logStep('Test case 6: To verify that the lot duplication is properly done for the Control with 1 analyte configured for Point Data and with Eval Mean SD');
    newLabSetup.navigateTO(jsonData.TargetDepartment4).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetInstrument4).then(function (sourceInst) {
      expect(sourceInst).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.TargetControl4, jsonData.FutureLot1).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte8).then(function (analyte1) {
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

  it('Test case 7: To verify that the lot duplication is properly done for the Control with 1 active & 1 archived analyte.', function () {
    library.logStep('Test case 7: To verify that the lot duplication is properly done for the Control with 1 active & 1 archived analyte.');
    newLabSetup.navigateTO(jsonData.TargetDepartment11).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetInstrument11).then(function (sourceInst) {
      expect(sourceInst).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.TargetControl11, jsonData.FutureLot1).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte14).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Summary').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(3).then(function (levels) {
      expect(levels).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(2).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    duplicateLot.VerifyAnalyteDuplicated(jsonData.Analyte13).then(function (analyteDuplicated) {
      expect(analyteDuplicated).toBe(false);
    });
  });

  // tslint:disable-next-line: max-line-length
  it('Test case 8: To verify that the lot duplication is properly done for the Control with 1 Analyte & Control Level settings applied.', function () {
    library.logStep('Test case 8: To verify that the lot duplication is properly done for the Control with 1 Analyte & Control Level settings applied.');
    newLabSetup.navigateTO(jsonData.TargetDepartment12).then(function (sourceDept) {
      expect(sourceDept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.TargetInstrument12).then(function (sourceInst) {
      expect(sourceInst).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.TargetControl12, jsonData.FutureLot1).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editControl) {
      expect(editControl).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(0).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('R-4s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte15).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(0).then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isWestgardRuleSelected('R-4s', 'reject').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyValuesNotSet('1').then(function (clickedSetValues) {
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
