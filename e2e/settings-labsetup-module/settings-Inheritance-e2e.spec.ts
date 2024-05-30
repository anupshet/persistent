/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Settings-Inheritance.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: Settings', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newSetting = new InheritedSettings();
  const analyte = new AddAnalyte();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 16: To Verify UI of Edit Control Page', function () {
    library.logStep('Test case 16: To Verify UI of Edit Control Page');
    setting.navigateTO(jsonData.Dept1Name).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isControlPageDisplayed(jsonData.Dept1Inst1Cont1).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Dept1Inst1Cont1).then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.verifyEditControlPage(jsonData.Dept1Inst1Cont1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 17: To verify Summary Data Entry Toggle on Edit Control Page ', function () {
    library.logStep('Test case 17: To verify Summary Data Entry Toggle on Edit Control Page ');
    setting.navigateTO(jsonData.Dept1Name).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont1).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Dept1Inst1Cont1).then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.verifySummaryToggleEnabled().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 18: Verify Decimal places dropdown of edit control window', function () {
    library.logStep('Test case 18: Verify Decimal places dropdown of edit control window');
    const selectedDecimal = 2;
    setting.navigateTO(jsonData.Dept1Name).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont1).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Dept1Inst1Cont1).then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(selectedDecimal).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 21: To Verify that On Disabling Summary Data Toggle will not display the SPC'
    + ' Rules section on Edit Control Page', function () {
      setting.navigateTO(jsonData.Dept1Name).then(function (dept) {
        expect(dept).toBe(true);
      });
      setting.navigateTO(jsonData.Dept1Inst1).then(function (inst) {
        expect(inst).toBe(true);
      });
      setting.navigateTO(jsonData.Dept1Inst1Cont2).then(function (ctrl) {
        expect(ctrl).toBe(true);
      });
      setting.clickOnEditThisControlLink().then(function (settings) {
        expect(settings).toBe(true);
      });
      newSetting.clickDisableSummaryToggleButton().then(function (summaryToggle) {
        expect(summaryToggle).toBe(true);
      });
      newSetting.isSPCRulesDisplayed().then(function (summaryToggle) {
        expect(summaryToggle).toBe(true);
      });
    });

  it('Test case 20: To Verify that On Enabling Summary Data Toggle will not display the SPC Rules section on Edit Control Page', function () {
    setting.navigateTO(jsonData.Dept1Name).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont2).then(function (ctrl) {
      expect(ctrl).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (settings) {
      expect(settings).toBe(true);
    });
    newSetting.clickEnableSummaryToggleButton().then(function (summaryToggle) {
      expect(summaryToggle).toBe(true);
    });
    newSetting.isSPCRulesDisplayed().then(function (summaryToggle) {
      expect(summaryToggle).toBe(false);
    });
  });

  // Data should be added in newSetting and need to add vefification method
  it('Test case 22: Verify that Summary Toggle will be disabled On Edit Control page if newSettings'
    + ' & data is already available in the Control', function () {
      setting.navigateTO(jsonData.Dept1Name).then(function (dept) {
        expect(dept).toBe(true);
      });
      setting.navigateTO(jsonData.Dept1Inst1).then(function (inst) {
        expect(inst).toBe(true);
      });
      setting.navigateTO(jsonData.Dept1Inst1Cont2).then(function (ctrl) {
        expect(ctrl).toBe(true);
      });
      setting.clickOnEditThisControlLink().then(function (settings) {
        expect(settings).toBe(true);
      });
      newSetting.verifySummaryToggleEnabled().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

  // Need to add all rules in verification method once the UI is stable
  it('Test case 23: To Verify the SPC Rule UI on Edit Control Page', function () {
    setting.navigateTO(jsonData.Dept1Name).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont2).then(function (ctrl) {
      expect(ctrl).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (settings) {
      expect(settings).toBe(true);
    });
    newSetting.clickDisableSummaryToggleButton().then(function (summaryToggle) {
      expect(summaryToggle).toBe(true);
    });
    newSetting.verifySPCUI().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 24: Verify SPC Rules info icon on SPC Rules Page', function () {
    setting.navigateTO(jsonData.Dept1Name).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont2).then(function (ctrl) {
      expect(ctrl).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (settings) {
      expect(settings).toBe(true);
    });
    newSetting.clickDisableSummaryToggleButton().then(function (summaryToggle) {
      expect(summaryToggle).toBe(true);
    });
    newSetting.verifySPCInfoIcon().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 25: Verify that User can select Reject, Warn & Disable action for SPC Rules by selecting Radio Buttons', function () {
    setting.navigateTO(jsonData.Dept1Name).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont2).then(function (ctrl) {
      expect(ctrl).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (settings) {
      expect(settings).toBe(true);
    });
    newSetting.clickDisableSummaryToggleButton().then(function (summaryToggle) {
      expect(summaryToggle).toBe(true);
    });
    newSetting.verifyRadioBtnSelected().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 26: Verify that clicking on Cancel button will show the default SPC Rules', function () {
    setting.navigateTO(jsonData.Dept1Name).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont2).then(function (ctrl) {
      expect(ctrl).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (settings) {
      expect(settings).toBe(true);
    });
    newSetting.clickDisableSummaryToggleButton().then(function (summaryToggle) {
      expect(summaryToggle).toBe(true);
    });
    newSetting.rejectRule('2 of 2s').then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.clickCancelButton().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    newSetting.isSPCRulesDisplayed().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

  it('Test case 19: To verify levels in use of edit control window', function () {
    library.logStep('Test case 19: To verify levels in use of edit control window');
    const selectedLevels = 1;
    setting.navigateTO(jsonData.InheritanceDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.InheritanceInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.InheritanceControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.InheritanceControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(selectedLevels).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 27: Verify that user will be able to Update the SPC Rules by clicking on Update Button', function () {
    library.logStep('Test case 27: Verify that user will be able to Update the SPC Rules by clicking on Update Button');
    setting.navigateTO(jsonData.InheritanceDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.InheritanceInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.InheritanceControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.rejectRule('7-T').then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newSetting.clickOkUpdateControlWarning().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.isSPCRuleSelected('7-T', 'reject').then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  // P1
  it('Test case 28: Verify that SPC Rules applied for Control will be applicable for All Analytes under that Control @P1', function () {
    library.logStep('Test case 28: Verify that SPC Rules applied for Control will be applicable for All Analytes under that Control');
    setting.navigateTO(jsonData.InheritanceDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.InheritanceInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.InheritanceControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.rejectRule('2 of 2s').then(function (selected) {
      expect(selected).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newSetting.clickOkUpdateControlWarning().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.InheritanceAnalyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.isSPCRuleSelected('2 of 2s', 'reject').then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  // P1
  it('Test case 35: To verify that Decimal & Levels selected for Control will be applicable for all newly added analytes under that Control @P1', function () {
    library.logStep('Test case 35: To verify that Decimal selected for Control will be applicable for all newly added analytes under that Control');
    library.logStep('Test case 38: To verify that Levels in use selected for Control will be applicable for all newly added analytes under that Control');
    const levels = 4;
    const decimals = 3;
    setting.navigateTO(jsonData.Dept1Name).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont3).then(function (verified) {
      expect(verified).toBe(true);
    });
    analyte.selectAnalyteName(jsonData.Dept1Inst1Cont3Analyte).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (cancelled) {
      expect(cancelled).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Name).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont3).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Inst1Cont3Analyte).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(levels).then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.verifyDecimalPlaceSelected(decimals).then(function (verified) {
      expect(verified).toBe(true);
    });
    newSetting.isSPCRuleSelected('2 of 2s', 'reject').then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickDeleteAnalyteButton().then(function (deleteClicked) {
      expect(deleteClicked).toBe(true);
    });
    setting.clickConfirmDeleteAnalyteButton().then(function (confirmDeleteClicked) {
      expect(confirmDeleteClicked).toBe(true);
    });
  });
});

