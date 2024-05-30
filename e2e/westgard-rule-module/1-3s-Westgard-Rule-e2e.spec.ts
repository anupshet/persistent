/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Westgard.json').then(function(data) {
  jsonData = data;
});

describe('Westgard Rules', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const analyteSettings = new AnalyteSettings();
  const out = new LogOut();
  const pointData = new PointDataEntry();
  const library = new BrowserLibrary();
  const westgard = new WestgardRule();
  const setting = new Settings();
  const multipoint = new MultiPointDataEntryInstrument();
  let multiplyL1, multiplyL2, addL1, addL2, l1Value, l2Value;
  let flagForIEBrowser: boolean;

  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
    });
  });

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 12: To verify the Rule 1 of 3s is given Rejection for the 1 of 3s data (Positive value range - 9.99)). @P1', function () {
    library.logStep('Test Case 12: To verify the Rule 1 of 3s is given Rejection for the 1 of 3s data (Positive value range - 9.99)).');
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte3).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('1-9.99', 'reject').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = 9.99;
    multiplyL2 = 9.99;
    addL1 = 0.1;
    addL2 = 0.1;
    westgard.getCalculatedValuesForBothLevelsFromCumulativeValues
      (multiplyL1, multiplyL2, addL1, addL2, 'Positive').then(function (newData) {
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
        westgard.enterPointValues(l1Value, l2Value).then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte3).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        westgard.compareReason(l1Value, '1-9.99').then(function (reasonDisplayed1) {
          expect(reasonDisplayed1).toBe(true);
        });
        westgard.comparePointValues().then(function (comparison) {
          expect(comparison).toBe(false);
        });
      });
  });

  it('Test Case 15: To verify the Rule 1 of 3s is given Rejection for the 1 of 3s data (Negative value range - 5.99)). @P1', function () {
    library.logStep('Test Case 15: To verify the Rule 1 of 3s is given Rejection for the 1 of 3s data (Negative value range - 5.99)).');
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte3).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('1-5.99', 'reject').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = 5.99;
    multiplyL2 = 5.99;
    addL1 = 0.1;
    addL2 = 0.1;
    westgard.getCalculatedValuesForBothLevelsFromCumulativeValues
      (multiplyL1, multiplyL2, addL1, addL2, 'Negative').then(function (newData) {
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
        });
        setting.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte3).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        westgard.compareReason(l1Value, '1-5.99').then(function (reasonDisplayed1) {
          expect(reasonDisplayed1).toBe(true);
        });
        pointData.clickHideData().then(function (dataHidden) {
          expect(dataHidden).toBe(true);
        });
        westgard.waitForSummaryStatistics().then(function (displayed) {
          expect(displayed).toBe(true);
        });
        westgard.comparePointValues().then(function (comparison) {
          expect(comparison).toBe(false);
        });
      });
  });

  it('Test Case 16: To verify on disabling the Rule 1 of 3s.(Negative and Value range -3.99) @P1', function () {
    library.logStep('Test Case 16: To verify on disabling the Rule 1 of 3s.(Negative and Value range -3.99)');
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte3).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('1-3.99', 'disabled').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = 3.99;
    multiplyL2 = 3.99;
    addL1 = 0.1;
    addL2 = 0.1;
    westgard.getCalculatedValuesForBothLevelsFromCumulativeValues
      (multiplyL1, multiplyL2, addL1, addL2, 'Positive').then(function (newData) {
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
        });
        setting.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte3).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(false);
        });
        analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
          expect(displayed).toBe(false);
        });
      });
  });
});
