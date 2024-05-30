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
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';

const fs = require('fs');
let jsonData;

const library=new BrowserLibrary();
library.parseJson('./JSON_data/EvaluationMeanSD.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Settings', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newSetting = new InheritedSettings();
  const newLabSetup = new NewLabSetup();
  const evalMeanSD = new EvalMeanSD();
  const pointData = new PointDataEntry();
  const multiPoint = new MultiPointDataEntryInstrument();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: Verify that user will be able to set Fixed, Float Mean SD and verify restart float functionality @P1', function () {
    library.logStep('Test case 1: Verify that user will be able to set Fixed, Float Mean SD and verify restart float functionality');
    const dataMap = new Map<string, string>();
    const floatPoint = '2';
    newLabSetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.addFloatPointValue(floatPoint).then(function (floatpointAdded) {
      expect(floatpointAdded).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('1', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('1', 1.10, 0.10, 0).then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('2', 'Fixed', 'Float').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('2', 1.20, 0, 0).then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('3', 'Float', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('3', 0, 0.30, 0).then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('4', 'Float', 'Float').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    // For CV
    evalMeanSD.selectFixedFloatMeanSD('5', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('5', 1.40, 0, 10).then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    // For CV
    evalMeanSD.selectFixedFloatMeanSD('6', 'Float', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('6', 0, 0, 11).then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyFloatPointValue(floatPoint).then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetMeanValue(1, '1.10').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetSDValue(1, '0.10').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetMeanValue(2, '1.20').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetSDValue(3, '0.30').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetMeanValue(5, '1.40').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(5, '10').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(6, '11').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '1.10');
    dataMap.set('102', '1.10');
    dataMap.set('103', '1.10');
    dataMap.set('104', '1.10');
    dataMap.set('105', '1.10');
    dataMap.set('106', '1.10');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '1.20');
    dataMap.set('102', '1.20');
    dataMap.set('103', '1.20');
    dataMap.set('104', '1.20');
    dataMap.set('105', '1.20');
    dataMap.set('106', '1.20');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '1.30');
    dataMap.set('102', '1.30');
    dataMap.set('103', '1.30');
    dataMap.set('104', '1.30');
    dataMap.set('105', '1.30');
    dataMap.set('106', '1.30');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.VerifyZScoreValues(true, false, '2').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    pointData.clickEnteredValuesRow().then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level1', 1, 'Fixed', 'Fixed').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level2', 3, 'Fixed', 'Float').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level3', 5, 'Float', 'Fixed').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level4', 7, 'Float', 'Float').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level5', 9, 'Fixed', 'Fixed').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level6', 11, 'Float', 'Fixed').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.clickRestartToggle().then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    pointData.clickSubmitUpdatesButton().then(function (submitUpdatesButtonClicked) {
      expect(submitUpdatesButtonClicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '1.40');
    dataMap.set('102', '1.40');
    dataMap.set('103', '1.40');
    dataMap.set('104', '1.40');
    dataMap.set('105', '1.40');
    dataMap.set('106', '1.40');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    evalMeanSD.VerifyZScoreValues(false, true, '1').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.clickFloatingStatisticsToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.clickFloatTypeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.verifyDropdownValues().then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.selectValueFromDropDown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.verifyCurrentValueLabel().then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('1').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('2').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('3').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('5').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('6').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.disableFloatingStatisticsToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.clickExitWitoutSaving().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 1: Verify that user will be able to set Fixed, Float Mean SD and verify restart float functionality', function () {
    library.logStep('Test case 1: Verify that user will be able to set Fixed, Float Mean SD and verify restart float functionality');
    const dataMap = new Map<string, string>();
    const floatPoint = '2';
    newLabSetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    newSetting.isSPCRuleSelected('1-2s', 'warning').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    evalMeanSD.addFloatPointValue(floatPoint).then(function (floatpointAdded) {
      expect(floatpointAdded).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('1', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('2', 'Fixed', 'Float').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.clickCloseEvalMeanSD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.verifyExitConfirmationMessage().then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.clickExitWitoutSaving().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.addFloatPointValue(floatPoint).then(function (floatpointAdded) {
      expect(floatpointAdded).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('1', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('1', 1.10, 0.10, 0).then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('2', 'Fixed', 'Float').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('2', 1.20, 0, 0).then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('3', 'Float', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('3', 0, 0.30, 0).then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('4', 'Float', 'Float').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    // For CV
    evalMeanSD.selectFixedFloatMeanSD('5', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('5', 1.40, 0, 10).then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    // For CV
    evalMeanSD.selectFixedFloatMeanSD('6', 'Float', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.enterEvalMeanSd('6', 0, 0, 11).then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyFloatPointValue(floatPoint).then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetMeanValue(1, '1.10').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetSDValue(1, '0.10').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetMeanValue(2, '1.20').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetSDValue(3, '0.30').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetMeanValue(5, '1.40').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(5, '10').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue(6, '11').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.clickCancel().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '1.10');
    dataMap.set('102', '1.10');
    dataMap.set('103', '1.10');
    dataMap.set('104', '1.10');
    dataMap.set('105', '1.10');
    dataMap.set('106', '1.10');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '1.20');
    dataMap.set('102', '1.20');
    dataMap.set('103', '1.20');
    dataMap.set('104', '1.20');
    dataMap.set('105', '1.20');
    dataMap.set('106', '1.20');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '1.30');
    dataMap.set('102', '1.30');
    dataMap.set('103', '1.30');
    dataMap.set('104', '1.30');
    dataMap.set('105', '1.30');
    dataMap.set('106', '1.30');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    evalMeanSD.VerifyZScoreValues(true, false, '2').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    pointData.clickEnteredValuesRow().then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level1', 1, 'Fixed', 'Fixed').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level2', 3, 'Fixed', 'Float').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level3', 5, 'Float', 'Fixed').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level4', 7, 'Float', 'Float').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level5', 9, 'Fixed', 'Fixed').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.verifyRestartToggleAndValuesDisplayed('Level6', 11, 'Float', 'Fixed').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    evalMeanSD.clickRestartToggle().then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    pointData.clickSubmitUpdatesButton().then(function (submitUpdatesButtonClicked) {
      expect(submitUpdatesButtonClicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    dataMap.set('101', '1.40');
    dataMap.set('102', '1.40');
    dataMap.set('103', '1.40');
    dataMap.set('104', '1.40');
    dataMap.set('105', '1.40');
    dataMap.set('106', '1.40');
    evalMeanSD.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    evalMeanSD.VerifyZScoreValues(false, true, '1').then(function (restartValues) {
      expect(restartValues).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.clickFloatingStatisticsToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.clickFloatTypeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.verifyDropdownValues().then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.selectValueFromDropDown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    evalMeanSD.verifyCurrentValueLabel().then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('1').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('2').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('3').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('5').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.verifyCurrentValuesforLevels('6').then(function (verified) {
      expect(verified).toBe(true);
    });
    evalMeanSD.disableFloatingStatisticsToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
});


