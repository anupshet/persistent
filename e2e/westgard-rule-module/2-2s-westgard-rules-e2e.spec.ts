/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
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
  const dashboard = new Dashboard();
  const loginEvent = new LoginEvent();
  const analyteSettings = new AnalyteSettings();
  const out = new LogOut();
  const pointData = new PointDataEntry();
  const newLabSetup = new NewLabSetup();
  const library = new BrowserLibrary();
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

  it('Test Case 10: To verify the Rule 2 of 2s Warning is given for the 2 of 2s data(Negative Warning). @P1', function () {
    newLabSetup.navigateTO(jsonData.DeptName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    browser.sleep(1000);
    newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newSetting.setWarnRule('2 of 2s').then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = -2;
    multiplyL2 = -2;
    addL1 = -0.02;
    addL2 = -0.05;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
      addL1, addL2).then(function (newData) {
        l1Value = newData[0];
        pointData.clickHideData().then(function (dataHidden) {
          expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (linkClicked) {
          expect(linkClicked).toBe(true);
        });
        pointData.enterPointValue(l1Value).then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointDataAnalyteName2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
          addL1, addL2).then(function (newData1) {
            l1Value = newData1[0];
            pointData.clickHideData().then(function (dataHidden) {
              expect(dataHidden).toBe(true);
            });
            pointData.clickManuallyEnterData().then(function (linkClicked) {
              expect(linkClicked).toBe(true);
            });
            pointData.enterPointValue(l1Value).then(function (dataEntered) {
              expect(dataEntered).toBe(true);
            });
            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
              expect(submitClicked).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.PointDataAnalyteName2).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            pointData.verifyEnteredPointValuesLvl1(l1Value).then(function (valuesVerified) {
              expect(valuesVerified).toBe(true);
            });
            analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
              expect(displayed).toBe(true);
            });
            analyteSettings.compareReason(l1Value, '2-2s[W]').then(function (reasonDisplayed1) {
              expect(reasonDisplayed1).toBe(true);
            });
            analyteSettings.comparePointValueLevel1().then(function (comparison) {
              expect(comparison).toBe(true);
            });
          });
      });
  });

  it('Test Case 26: To verify the Rule 2 of 2s Rejection is given for the 2 of 2s data(Positive Rejection). @P1', function () {
    newLabSetup.navigateTO(jsonData.DeptName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newSetting.rejectRule('2 of 2s').then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = 0.02;
    addL2 = 0.05;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
      addL1, addL2).then(function (newData) {
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
        newLabSetup.navigateTO(jsonData.PointDataAnalyteName2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isStrikeThroughShown(l1Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.compareReason(l1Value, '2-2s').then(function (reasonDisplayed1) {
          expect(reasonDisplayed1).toBe(false);
        });
        analyteSettings.compareReason(l2Value, '2-2s').then(function (reasonDisplayed1) {
          expect(reasonDisplayed1).toBe(true);
        });
        analyteSettings.comparePointValues().then(function (comparison) {
          expect(comparison).toBe(false);
        });
      });
  });

  it('Test Case 29: To verify that any value can be added after disabling the Rule (Disabling 2 of 2s warning). @P1', function () {
    newLabSetup.navigateTO(jsonData.DeptName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointDataAnalyteName).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newSetting.setDisableRule('2 of 2s').then(function (verified) {
      expect(verified).toBe(true);
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
      analyteSettings.compareReason(l1Value, '2-2s[W]').then(function (reasonDisplayed1) {
        expect(reasonDisplayed1).toBe(false);
      });
      analyteSettings.compareReason(l2Value, '2-2s[W]').then(function (reasonDisplayed2) {
        expect(reasonDisplayed2).toBe(false);
      });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });
});

