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

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Westgard.json').then(function (data) {
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
  let addVal, l1Value, l2Value;
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

  it('Test Case 9: To check if the Warning is displayed for the data which violates the 3-1s rule for -1s in multiple levels @P1', function () {
    library.logStep
      ('Test Case 9: To check if the Warning is displayed for the data which violates the 3-1s rule for -1s in multiple levels');
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('3-1s', 'warning').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    westgard.clickShowData().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    addVal = 0.01;
    westgard.getCalculatedValuesForBothLevels3_1s_4_1s('Negative', addVal).then(function (newData) {
      l1Value = newData[0];
      l2Value = newData[1];
      console.log(l1Value);
      console.log(l2Value);
      westgard.clickHideData().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      westgard.clickManuallyEnterData().then(function (linkClicked) {
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
      setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
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
      westgard.clickShowData().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      addVal = 0.02;
      westgard.getCalculatedValuesForBothLevels3_1s_4_1s('Negative', addVal).then(function (newData1) {
        l1Value = newData1[0];
        l2Value = newData1[1];
        console.log(l1Value);
        console.log(l2Value);
        westgard.clickHideData().then(function (dataHidden) {
          console.log('Data Hide dataHidden: ' + dataHidden);
          expect(dataHidden).toBe(true);
        });
        westgard.clickManuallyEnterData().then(function (linkClicked) {
          expect(linkClicked).toBe(true);
        });
        westgard.enterPointValues(l1Value, '').then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        westgard.verifyEnteredPointValues(l1Value, '').then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        westgard.isWarningDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        westgard.compareReason(l1Value, '3-1s[W]').then(function (reasonDisplayed1) {
          expect(reasonDisplayed1).toBe(true);
        });
        westgard.clickShowData().then(function (displayed) {
          expect(displayed).toBe(true);
        });
      });
    });
  });

  it('Test Case 13: To check if the Rejection is displayed for the data which violates the 3-1s rule for +1s for single level @P1', function () {
    library.logStep
      ('Test Case 13: To check if the Rejection is displayed for the data which violates the 3-1s rule for +1s for single level');
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('3-1s', 'reject').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    westgard.clickShowData().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    addVal = 0.01;
    westgard.getCalculatedValuesForBothLevels3_1s_4_1s('Positive', addVal).then(function (newData) {
      l1Value = newData[0];
      console.log(l1Value);
      console.log(l2Value);
      westgard.clickHideData().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      westgard.clickManuallyEnterData().then(function (linkClicked) {
        expect(linkClicked).toBe(true);
      });
      westgard.enterPointValues(l1Value, '').then(function (dataEntered) {
        expect(dataEntered).toBe(true);
      });
      pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
      });
      setting.navigateTO(jsonData.Analyte2).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      pointData.verifyEnteredPointValues(l1Value, '').then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      westgard.clickShowData().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      addVal = 0.01;
      westgard.getCalculatedValuesForBothLevels3_1s_4_1s('Positive', addVal).then(function (newData1) {
        l1Value = newData1[0];
        console.log(l1Value);
        console.log(l2Value);
        westgard.clickHideData().then(function (displayed) {
          expect(displayed).toBe(true);
        });
        westgard.clickManuallyEnterData().then(function (linkClicked) {
          expect(linkClicked).toBe(true);
        });
        westgard.enterPointValues(l1Value, '').then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value, '').then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(false);
        });
        westgard.clickShowData().then(function (displayed) {
          expect(displayed).toBe(true);
        });
        addVal = 0.01;
        westgard.getCalculatedValuesForBothLevels3_1s_4_1s('Positive', addVal).then(function (newData2) {
          l1Value = newData2[0];
          console.log(l1Value);
          console.log(l2Value);
          westgard.clickHideData().then(function (dataHidden) {
            console.log('Data Hide dataHidden: ' + dataHidden);
            expect(dataHidden).toBe(true);
          });
          westgard.clickManuallyEnterData().then(function (linkClicked) {
            expect(linkClicked).toBe(true);
          });
          westgard.enterPointValues(l1Value, '').then(function (dataEntered) {
            expect(dataEntered).toBe(true);
          });
          pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
          });
          setting.navigateTO(jsonData.Analyte2).then(function (analyte) {
            expect(analyte).toBe(true);
          });
          setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
            expect(analyte).toBe(true);
          });
          westgard.verifyEnteredPointValues(l1Value, '').then(function (valuesVerified) {
            expect(valuesVerified).toBe(true);
          });
          analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
            expect(displayed).toBe(true);
          });
          westgard.compareReason(l1Value, '3-1s').then(function (reasonDisplayed1) {
            expect(reasonDisplayed1).toBe(true);
          });
          westgard.clickShowData().then(function (displayed) {
            expect(displayed).toBe(true);
          });
        });
      });
    });
  });

  it('Test Case 21: To verify that any value can be added after disabling the 3-1s Rule for single level @P1', function () {
    library.logStep
      ('Test Case 21: To verify that any value can be added after disabling the 3-1s Rule for single level');
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('3-1s', 'disabled').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    westgard.clickShowData().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    addVal = 0.02;
    westgard.getCalculatedValuesForBothLevels3_1s_4_1s('Positive', addVal).then(function (newData) {
      l1Value = newData[0];
      console.log(l1Value);
      console.log(l2Value);
      westgard.clickHideData().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      westgard.clickManuallyEnterData().then(function (linkClicked) {
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
      setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      westgard.clickShowData().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      addVal = 0.01;
      westgard.getCalculatedValuesForBothLevels3_1s_4_1s('Positive', addVal).then(function (newData1) {
        l1Value = newData1[0];
        console.log(l1Value);
        console.log(l2Value);
        westgard.clickHideData().then(function (dataHidden) {
          expect(dataHidden).toBe(true);
        });
        westgard.clickManuallyEnterData().then(function (linkClicked) {
          expect(linkClicked).toBe(true);
        });
        pointData.enterPointValues(l1Value, '').then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value, '').then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(false);
        });
      });
    });
  });
});
