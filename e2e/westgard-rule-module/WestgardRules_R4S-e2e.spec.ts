/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/WRR4S.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Westgard Rules_R4S', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const newLabSetup = new NewLabSetup();
  const westgard = new WestgardRule();
  const analyteSettings = new AnalyteSettings();
  const pointData = new PointDataEntry();
  let multiplyL1, multiplyL2, l1Value, l2Value, addL1, addL2;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 6: To verify if the rejection is shown for R4S Rule @P1', function () {
    const levels = 2;
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName1).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('R-4s', 'reject').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = 1;
    addL2 = -1;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, addL1, addL2).then(function (newData) {
      l1Value = newData[0];
      l2Value = newData[1];
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
      newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
        expect(analyte1).toBe(true);
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
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test case 12: To verify if the warning is shown for R4S Rule @P1', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName1).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('R-4s', 'warning').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = 1;
    addL2 = -1;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, addL1, addL2).then(function (newData) {
      l1Value = newData[0];
      l2Value = newData[1];
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
      newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
        expect(analyte1).toBe(true);
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
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test case 15: To verify that any value can be added after disabling R4S Rule @P1', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName1).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('R-4s', 'disabled').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = 1;
    addL2 = -1;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, addL1, addL2).then(function (newData) {
      l1Value = newData[0];
      l2Value = newData[1];
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
      newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
        expect(analyte1).toBe(true);
      });
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
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
