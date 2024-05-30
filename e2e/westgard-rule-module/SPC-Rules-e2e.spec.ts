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
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/NewSPCRules.json').then(function(data) {
  jsonData = data;
});

describe('SPC Rules', function () {
  browser.waitForAngularEnabled(false);
  const dashboard = new Dashboard();
  const loginEvent = new LoginEvent();
  const analyteSettings = new AnalyteSettings();
  const out = new LogOut();
  const pointData = new PointDataEntry();
  const newLabSetup = new NewLabSetup();
  const library = new BrowserLibrary();
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

  it('Test Case 1:- To verify that the SPC Rules page is correctly displayed', function () {
    library.logStep('Test Case 1:- To verify that the SPC Rules page is correctly displayed');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.spcRulesDisplayed().then(function (displayedCorrectly) {
      expect(displayedCorrectly).toBe(true);
    });
  });

  it('Test Case 2:- To verify if the user is able to setup the SPC Rules', function () {
    library.logStep('Test Case 2:- To verify if the user is able to setup the SPC Rules');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.selectSpcRule('1-2s', 'warning').then(function (rule1Selected) {
      expect(rule1Selected).toBe(true);
    });
    analyteSettings.selectSpcRule('1-3s', 'reject').then(function (rule2Selected) {
      expect(rule2Selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.isSPCRuleSelected('1-2s', 'warning').then(function (rule1Selected) {
      expect(rule1Selected).toBe(true);
    });
    analyteSettings.isSPCRuleSelected('1-3s', 'reject').then(function (rule2Selected) {
      expect(rule2Selected).toBe(true);
    });
  });

  it('Pre-requisite: Setup SPC Rules and Add 5 records', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterPointValues(3.9, 2.46).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.enterPointValues(3.95, 2.51).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.enterPointValues(4.00, 2.56).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.enterPointValues(4.05, 2.61).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.enterPointValues(4.10, 2.66).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
  });

  it('Test Case 4:- To verify the Rule 1:2s Warning is given for the 1:2s data.', function () {
    library.logStep('Test Case 4:- To verify the Rule 1:2s Warning is given for the 1:2s data.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = 0;
    addL2 = 0;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 5:- To verify the Rule 1:2s Warning is given for the data above 1:2s range.', function () {
    library.logStep('Test Case 5:- To verify the Rule 1:2s Warning is given for the data above 1:2s range.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 6:- To verify the Rule 1:2s Warning is not given for the data within 1:2s range.', function () {
    library.logStep('Test Case 6:- To verify the Rule 1:2s Warning is not given for the data within 1:2s range.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = -0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 7:- To verify the Rule 1:3s Rejection is given for the 1:3s data.', function () {
    library.logStep('Test Case 7:- To verify the Rule 1:3s Rejection is given for the 1:3s data.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 3;
    multiplyL2 = 3;
    addL1 = 0;
    addL2 = 0;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-3S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-3S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 8:- To verify the Rule 1:3s Rejection is given for the data above 1:3s range.', function () {
    library.logStep('Test Case 8:- To verify the Rule 1:3s Rejection is given for the data above 1:3s range.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 3;
    multiplyL2 = 3;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-3S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-3S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 9:- To verify the Rule 1:3s Rejection is not given for the data within 1:3s range.', function () {
    library.logStep('Test Case 9:- To verify the Rule 1:3s Rejection is not given for the data within 1:3s range.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 3;
    multiplyL2 = 3;
    addL1 = -0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 10:- To verify if the user is able to add the data with value which is within range 1:2s for level 1 & value above range 1:2s for level 2, without and with warning respectively.', function () {
    library.logStep('Test Case 10:- To verify if the user is able to add the data with value which is within range 1:2s for level 1 & value above range 1:2s for level 2, without and with warning respectively.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 11:- To verify that the user is unable to add the data with value which is above 1:2s range for level 1 & which is above 1:3s range for level 2.', function () {
    library.logStep('Test Case 11:- To verify that the user is unable to add the data with value which is above 1:2s range for level 1 & which is above 1:3s range for level 2.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 3;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isStrikeThroughShown(l1Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-3S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 12:- To verify that the user is unable to add the data with value which is above 1:3s range for level 1 & below 1:2s range for level 2', function () {
    library.logStep('Test Case 12:- To verify that the user is unable to add the data with value which is above 1:3s range for level 1 & below 1:2s range for level 2.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 3;
    multiplyL2 = 2;
    addL1 = 0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isStrikeThroughShown(l2Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-3S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 13:- To verify the rejected value & value with a warning on Multi Point page.', function () {
    library.logStep('Test Case 13:- To verify the rejected value & value with a warning on Multi Point page.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 3;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isStrikeThroughShown(l2Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-3S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
      dashboard.breadcrumbLevel(jsonData.DepartmentName).then(function (breadcrumbClicked) {
        expect(breadcrumbClicked).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
        expect(inst).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
        expect(prod).toBe(true);
      });
      analyteSettings.verifyRejectFromControlLevel(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.verifyWarningFromControlLevel(l2Value, true).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });
  });

  it('Test Case 15:- To verify that the lab user is unable to add the data with value which is above 1:2s range for level 1 & which is above 1:3s range for level 2.', function () {
    library.logStep('Test Case 15:- To verify that the lab user is unable to add the data with value which is above 1:2s range for level 1 & which is above 1:3s range for level 2.');
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserUsername, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 3;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isStrikeThroughShown(l1Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-3S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 16:- To verify that the lab user is unable to add the data with value which is above 1:3s range for level 1 & below 1:2s range for level 2.', function () {
    library.logStep('Test Case 16:- To verify that the lab user is unable to add the data with value which is above 1:3s range for level 1 & below 1:2s range for level 2.');
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserUsername, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 3;
    multiplyL2 = 2;
    addL1 = 0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isStrikeThroughShown(l2Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-3S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 17:- To verify the Rule 1:2s Warning is given for the -1:2s data.', function () {
    library.logStep('Test Case 17:- To verify the Rule 1:2s Warning is given for the -1:2s data.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -2;
    multiplyL2 = -2;
    addL1 = 0;
    addL2 = 0;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 18:- To verify the Rule 1:2s Warning is given for the data below -1:2s range.', function () {
    library.logStep('Test Case 18:- To verify the Rule 1:2s Warning is given for the data below -1:2s range.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -2;
    multiplyL2 = -2;
    addL1 = -0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 19:- To verify the Rule 1:2s Warning is not given for the data within -1:2s range.', function () {
    library.logStep('Test Case 19:- To verify the Rule 1:2s Warning is not given for the data within -1:2s range.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -2;
    multiplyL2 = -2;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 20:- To verify the Rule 1:3s Rejection is given for the -1:3s data.', function () {
    library.logStep('Test Case 20:- To verify the Rule 1:3s Rejection is given for the -1:3s data.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -3;
    multiplyL2 = -3;
    addL1 = 0;
    addL2 = 0;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 21:- To verify the Rule 1:3s Rejection is given for the data below -1:3s range.', function () {
    library.logStep('To verify the Rule 1:3s Rejection is given for the data below -1:3s range.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -3;
    multiplyL2 = -3;
    addL1 = -0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-3S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-3S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 22:- To verify the Rule 1:3s Rejection is not given for the data within -1:3s range.', function () {
    library.logStep('Test Case 22:- To verify the Rule 1:3s Rejection is not given for the data within -1:3s range.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -3;
    multiplyL2 = -3;
    addL1 = +0.01;
    addL2 = +0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 23:- To verify if the user is able to add the data with value which is within range -1:2s for level 1 & value below range -1:2s for level 2, without and with warning respectively.', function () {
    library.logStep('Test Case 23:- To verify if the user is able to add the data with value which is within range -1:2s for level 1 & value below range -1:2s for level 2, without and with warning respectively.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -2;
    multiplyL2 = -2;
    addL1 = 0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l2Value, '1-2S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 24:- To verify that the user is unable to add the data with value which is below -1:2s range for level 1 & which is below -1:3s range for level 2.', function () {
    library.logStep('Test Case 24:- To verify that the user is unable to add the data with value which is below -1:2s range for level 1 & which is below -1:3s range for level 2.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -2;
    multiplyL2 = -3;
    addL1 = -0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isStrikeThroughShown(l1Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-3S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 25:- To verify that the user is unable to add the data with value which is below -1:3s range for level 1 & below -1:2s range for level 2.', function () {
    library.logStep('Test Case 25:- To verify that the user is unable to add the data with value which is below -1:3s range for level 1 & below -1:2s range for level 2.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -3;
    multiplyL2 = -2;
    addL1 = -0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-3S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      analyteSettings.isStrikeThroughShown(l2Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 27:- To verify that the lab user is unable to add the data with value which is below -1:2s range for level 1 & which is below -1:3s range for level 2.', function () {
    library.logStep('Test Case 27:- To verify that the lab user is unable to add the data with value which is below -1:2s range for level 1 & which is below -1:3s range for level 2.');
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserUsername, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -2;
    multiplyL2 = -3;
    addL1 = -0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isStrikeThroughShown(l1Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-2S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // analyteSettings.compareReason(l2Value, '1-3S').then(function (reasonDisplayed2) {
      //   expect(reasonDisplayed2).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 28:- To verify that the lab user is unable to add the data with value which is below -1:3s range for level 1 & below -1:2s range for level 2.', function () {
    library.logStep('Test Case 28:- To verify that the lab user is unable to add the data with value which is below -1:3s range for level 1 & below -1:2s range for level 2.');
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserUsername, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -3;
    multiplyL2 = -2;
    addL1 = -0.01;
    addL2 = -0.01;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isStrikeThroughShown(l2Value).then(function (strikeThrough) {
        expect(strikeThrough).toBe(true);
      });
      // analyteSettings.compareReason(l1Value, '1-3S').then(function (reasonDisplayed1) {
      //   expect(reasonDisplayed1).toBe(true);
      // });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(false);
      });
    });
  });

  it('Test Case 3:- To verify if the user is able to disable the SPC Rules which are already setup', function () {
    library.logStep('Test Case 3:- To verify if the user is able to disable the SPC Rules which are already setup');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.selectSpcRule('1-2s', 'disabled').then(function (rule1Selected) {
      expect(rule1Selected).toBe(true);
    });
    analyteSettings.selectSpcRule('1-3s', 'disabled').then(function (rule2Selected) {
      expect(rule2Selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
      browser.sleep(5000);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.isSPCRuleSelected('1-2s', 'disabled').then(function (rule1Selected) {
      expect(rule1Selected).toBe(true);
    });
    analyteSettings.isSPCRuleSelected('1-3s', 'disabled').then(function (rule2Selected) {
      expect(rule2Selected).toBe(true);
    });
  });

  it('Test Case 14:- To verify that any value can be added after disabling the Data Rejection Rules', function () {
    library.logStep('Test Case 14:- To verify that any value can be added after disabling the Data Rejection Rules');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    addL1 = 2;
    addL2 = 2;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test Case 26:- To verify that any value can be added after disabling the Data Rejection Rules', function () {
    library.logStep('Test Case 26:- To verify that any value can be added after disabling the Data Rejection Rules');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    multiplyL1 = -2;
    multiplyL2 = -2;
    addL1 = -2;
    addL2 = -2;
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
        browser.sleep(15000);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      if (flagForIEBrowser === true) {
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
      }
      pointData.verifyEnteredPointValues(l1Value, l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(false);
      });
      // pointData.clickShowData().then(function (showDataClicked) {
      //   expect(showDataClicked).toBe(true);
      // });
      analyteSettings.comparePointValues().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });
});
