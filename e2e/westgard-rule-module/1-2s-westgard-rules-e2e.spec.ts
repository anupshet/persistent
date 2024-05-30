/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/WestgardRules.json').then(function (data) {
  jsonData = data;
});

describe('Westgard Rules', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const analyteSettings = new AnalyteSettings();
  const out = new LogOut();
  const pointData = new PointDataEntry();
  const newLabSetup = new NewLabSetup();
  const westgard = new WestgardRule();
  const setting = new Settings();
  const newSetting = new InheritedSettings();
  let multiplyL1, multiplyL2, addL1, addL2, l1Value, l2Value;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 12 - To verify the Rule 1 of 2s Warning is given for the 1 of 2s data'
    + ' (Positive Warning  for value range - 0.01)). @P1', function () {
      newLabSetup.navigateTO(jsonData.DeptName).then(function (dept) {
        expect(dept).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstName).then(function (inst) {
        expect(inst).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
        expect(prod).toBe(true);
      });
      browser.sleep(2000);
      newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      newSetting.setWarnRule('1-').then(function (verified) {
        expect(verified).toBe(true);
      });
      westgard.setValueRange('0.01').then(function (valueRange) {
        expect(valueRange).toBe(true);
      });
      setting.clickUpdateControlBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiplyL1 = 0.01;
      multiplyL2 = 0.01;
      addL1 = 0.01;
      addL2 = 0.01;
      analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, addL1, addL2).then(function (newData) {
        l1Value = newData[0];
        l2Value = newData[1];
        console.log(l1Value);
        console.log(l2Value);
        pointData.clickHideData().then(function (dataHidden) {
          expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (linkClicked) {
          expect(linkClicked).toBe(true);
        });
        pointData.enterPointValues(l1Value, l2Value).then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
          browser.sleep(15000);
        });
        newLabSetup.navigateTO(jsonData.PointDataAnalyteName2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.compareReason(l1Value, '1-0.01s[W]').then(function (reasonDisplayed1) {
          expect(reasonDisplayed1).toBe(true);
        });
        analyteSettings.compareReason(l2Value, '1-0.01s[W]').then(function (reasonDisplayed2) {
          expect(reasonDisplayed2).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        analyteSettings.comparePointValues().then(function (comparison) {
          expect(comparison).toBe(true);
        });
      });
    });

  it('Test Case 15: To verify the Rule 1 of 2s Warning is given for the 1 of 2s data(Negative Warning value range - 9.99). @P1', function () {
    newLabSetup.navigateTO(jsonData.DeptName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    browser.sleep(2000);
    newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newSetting.setWarnRule('1-').then(function (verified) {
      expect(verified).toBe(true);
    });
    westgard.setValueRange('9.99').then(function (valueRange) {
      expect(valueRange).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = -9.99;
    multiplyL2 = -9.99;
    addL1 = -0.05;
    addL2 = -0.05;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, addL1, addL2).then(function (newData) {
      l1Value = newData[0];
      l2Value = newData[1];
      console.log(l1Value);
      console.log(l2Value);
      pointData.clickHideData().then(function (dataHidden) {
        expect(dataHidden).toBe(true);
      });
      pointData.clickManuallyEnterData().then(function (linkClicked) {
        expect(linkClicked).toBe(true);
      });
      pointData.enterPointValues(l1Value, l2Value).then(function (dataEntered) {
        expect(dataEntered).toBe(true);
      });
      pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.PointDataAnalyteName2).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.compareReason(l1Value, '1-9.99s[W]').then(function (reasonDisplayed2) {
        expect(reasonDisplayed2).toBe(true);
      });
      analyteSettings.compareReason(l2Value, '1-9.99s[W]').then(function (reasonDisplayed2) {
        expect(reasonDisplayed2).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 19:To verify on disabling the Rule 1 of 2s.(Positive and Value range 2.0) @P1', function () {
    newLabSetup.navigateTO(jsonData.DeptName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    browser.sleep(2000);
    newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newSetting.setDisableRule('1-').then(function (verified) {
      expect(verified).toBe(true);
    });
    westgard.setValueRange('2.0').then(function (valueRange) {
      expect(valueRange).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = 0.01;
    addL2 = 0.01;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, addL1, addL2).then(function (newData) {
      l1Value = newData[0];
      l2Value = newData[1];
      console.log(l1Value);
      console.log(l2Value);
      pointData.clickHideData().then(function (dataHidden) {
        expect(dataHidden).toBe(true);
      });
      pointData.clickManuallyEnterData().then(function (linkClicked) {
        expect(linkClicked).toBe(true);
      });
      pointData.enterPointValues(l1Value, l2Value).then(function (dataEntered) {
        expect(dataEntered).toBe(true);
      });
      pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.PointDataAnalyteName2).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.compareReason(l1Value, '1-2.0s[W]').then(function (reasonDisplayed1) {
        expect(reasonDisplayed1).toBe(false);
      });
      analyteSettings.compareReason(l2Value, '1-2.0s[W]').then(function (reasonDisplayed2) {
        expect(reasonDisplayed2).toBe(false);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });
});
