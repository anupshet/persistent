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
const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();
library.parseJson('./JSON_data/Duplicate_Lot.json').then(function(data) {
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
  const duplicateLot = new DuplicateLot();
  const navigation = new NewNavigation();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  // Analyte - Point, 2 decimal points and 2 level
  // Analyte2 - Summary, 3 decimal points and 1 level

  it('Test case 1: Verify duplicate lots functionality', function () {
    library.logStep('Test case 1: Verify duplicate lots functionality.');
    newLabSetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    duplicateLot.VerifyDuplicateLotBtnDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    duplicateLot.ClickDuplicateLotButton().then(function (duplicateLotClicked) {
      expect(duplicateLotClicked).toBe(true);
    });
    duplicateLot.VerifyDuplicateLotsPopupUI().then(function (uiVerified) {
      expect(uiVerified).toBe(true);
    });
    duplicateLot.createDuplicateLot(jsonData.Lot).then(function (createLot) {
      expect(createLot).toBe(true);
    });
    navigation.clickBackArrow().then(function (back) {
      expect(back).toBe(true);
    });
    duplicateLot.VerifyDuplicateLotCreatedNew(jsonData.Control, jsonData.Lot).then(function (uiVerified) {
      expect(uiVerified).toBe(true);
    });
    duplicateLot.verifyLotNumberNotDuplicatedNew(jsonData.Control, jsonData.OldLot, jsonData.Lot).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    duplicateLot.navigateToDuplicateLot(jsonData.Control, jsonData.Lot).then(function (lotNotDuplicated) {
      expect(lotNotDuplicated).toBe(true);
    });
    // tslint:disable-next-line: max-line-length
    duplicateLot.VerifyAllAnalytesCreatedUnderDuplicatedLotsNew(jsonData.Analyte, jsonData.Analyte2, jsonData.Analyte3).then(function (allAnalyteDuplicated) {
      expect(allAnalyteDuplicated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Point').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected('2').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.isSPCRuleSelected('2 of 2s', 'warn').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(2).then(function (levels) {
      expect(levels).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (setValClicked) {
      expect(setValClicked).toBe(true);
    });
    evalMeanSD.verifyPreSetMeanValue('1', '2.10').then(function (meanverified) {
      expect(meanverified).toBe(true);
    });
    evalMeanSD.verifyPreSetSDValue('1', '2.20').then(function (sdverified) {
      expect(sdverified).toBe(true);
    });
    evalMeanSD.verifyPreSetCVValue('2', '2.30').then(function (cvverified) {
      expect(cvverified).toBe(true);
    });
    evalMeanSD.verifyFloatPointValue('2').then(function (floatverified) {
      expect(floatverified).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD('1', 'Fixed', 'Fixed').then(function (meansdverified) {
      expect(meansdverified).toBe(true);
    });
    evalMeanSD.verifySelectedFixedFloatMeanSD('2', 'Fixed', 'Fixed').then(function (meansdverified) {
      expect(meansdverified).toBe(true);
    });
    evalMeanSD.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyDataEntryType('Summary').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected('3').then(function (verifiedData) {
      expect(verifiedData).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(1).then(function (levels) {
      expect(levels).toBe(true);
    });

  });
});


