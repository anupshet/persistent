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

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/WR7x_1.json').then(function(data) {
  jsonData = data;
});

describe('Westgard Rules:- 7x', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const analyteSettings = new AnalyteSettings();
  const out = new LogOut();
  const pointData = new PointDataEntry();
  const newLabSetup = new NewLabSetup();
  const library = new BrowserLibrary();
  let multiplyL1, multiplyL2, firstAddL1, firstAddL2, secondAddL1, secondAddL2,
    // tslint:disable-next-line: prefer-const
    thirdAddL1, thirdAddL2, fourthAddL1, l1Value, l2Value;
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

  it('Test Case 5:- To check if Warning is shown for multilevel data which violates 7x rule for values below Mean (Across runs)',
    function () {
      library.logStep('Test Case 5:- To check if the Warning is shown for the multilevel data which violates the 7x rule for values below Mean (Across runs)');
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
      analyteSettings.selectKxRule('7x', 'warning').then(function (rule1Selected) {
        expect(rule1Selected).toBe(true);
      });
      analyteSettings.clickUpdateButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      multiplyL1 = 0;
      multiplyL2 = 0;
      firstAddL1 = -0.01;
      firstAddL2 = -0.01;
      secondAddL1 = -0.02;
      secondAddL2 = -0.02;
      thirdAddL1 = -0.03;
      thirdAddL2 = -0.03;
      analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
        firstAddL1, firstAddL2).then(function (newData) {
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
          });
          newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
            expect(analyte).toBe(true);
          });
          newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
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
          pointData.clickShowData().then(function (showDataClicked) {
            expect(showDataClicked).toBe(true);
          });
          analyteSettings.comparePointValues().then(function (comparison) {
            expect(comparison).toBe(true);
          });
          analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
            // tslint:disable-next-line: no-shadowed-variable
            secondAddL1, secondAddL2).then(function (newData) {
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
              });
              newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                expect(analyte).toBe(true);
              });
              newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
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
              pointData.clickShowData().then(function (showDataClicked) {
                expect(showDataClicked).toBe(true);
              });
              analyteSettings.comparePointValues().then(function (comparison) {
                expect(comparison).toBe(true);
              });
              analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                // tslint:disable-next-line: no-shadowed-variable
                thirdAddL1, thirdAddL2).then(function (newData) {
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
                  });
                  newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                    expect(analyte).toBe(true);
                  });
                  newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
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
                  pointData.clickShowData().then(function (showDataClicked) {
                    expect(showDataClicked).toBe(true);
                  });
                  analyteSettings.comparePointValues().then(function (comparison) {
                    expect(comparison).toBe(true);
                  });
                  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                    // tslint:disable-next-line: no-shadowed-variable
                    secondAddL1, secondAddL2).then(function (newData) {
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
                      });
                      newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                        expect(analyte).toBe(true);
                      });
                      newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
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
                      pointData.clickShowData().then(function (showDataClicked) {
                        expect(showDataClicked).toBe(true);
                      });
                      analyteSettings.comparePointValues().then(function (comparison) {
                        expect(comparison).toBe(true);
                      });
                    });
                });
            });
        });
    });
});
