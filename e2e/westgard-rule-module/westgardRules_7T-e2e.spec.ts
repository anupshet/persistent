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
library.parseJson('./JSON_data/WR7T.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: Westgard Rules_7T', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const newLabSetup = new NewLabSetup();
  const westgard = new WestgardRule();
  const analyteSettings = new AnalyteSettings();
  const pointData = new PointDataEntry();
  let multiplyL1, multiplyL2, firstAddL1, firstAddL2, secondAddL1,
    thirdAddL1, fourthAddL1, fifthAddL1, sixthAddL1, seventhAddL1, l1Value;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 2: To verify if the rejection is shown for 7T Rule @P1', function () {
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
    westgard.selectRule('7-T', 'reject').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = 0;
    multiplyL2 = 0;
    firstAddL1 = 0.01;
    firstAddL2 = 0;
    secondAddL1 = 0.02;
    thirdAddL1 = 0.03;
    fourthAddL1 = 0.04;
    fifthAddL1 = 0.05;
    sixthAddL1 = 0.06;
    seventhAddL1 = 0.07;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
      firstAddL1, firstAddL2).then(function (newData) {
        l1Value = newData[0];
        console.log(l1Value);
        pointData.clickHideData().then(function (dataHidden) {
          expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (linkClicked) {
          expect(linkClicked).toBe(true);
        });
        pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        analyteSettings.comparePointValueLevel1().then(function (comparison) {
          expect(comparison).toBe(true);
        });
        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
          secondAddL1, firstAddL2).then(function (newData) {
            l1Value = newData[0];
            console.log(l1Value);
            pointData.clickHideData().then(function (dataHidden) {
              expect(dataHidden).toBe(true);
            });
            pointData.clickManuallyEnterData().then(function (linkClicked) {
              expect(linkClicked).toBe(true);
            });
            pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
              expect(dataEntered).toBe(true);
            });
            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
              expect(submitClicked).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
              expect(valuesVerified).toBe(true);
            });
            pointData.clickShowData().then(function (showDataClicked) {
              expect(showDataClicked).toBe(true);
            });
            analyteSettings.comparePointValueLevel1().then(function (comparison) {
              expect(comparison).toBe(true);
            });
            analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
              thirdAddL1, firstAddL2).then(function (newData) {
                l1Value = newData[0];
                console.log(l1Value);
                pointData.clickHideData().then(function (dataHidden) {
                  expect(dataHidden).toBe(true);
                });
                pointData.clickManuallyEnterData().then(function (linkClicked) {
                  expect(linkClicked).toBe(true);
                });
                pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                  expect(dataEntered).toBe(true);
                });
                pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                  expect(submitClicked).toBe(true);
                });
                newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                  expect(analyte).toBe(true);
                });
                newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                  expect(analyte).toBe(true);
                });
                pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                  expect(valuesVerified).toBe(true);
                });
                pointData.clickShowData().then(function (showDataClicked) {
                  expect(showDataClicked).toBe(true);
                });
                analyteSettings.comparePointValueLevel1().then(function (comparison) {
                  expect(comparison).toBe(true);
                });
                analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                  fourthAddL1, firstAddL2).then(function (newData) {
                    l1Value = newData[0];
                    console.log(l1Value);
                    pointData.clickHideData().then(function (dataHidden) {
                      expect(dataHidden).toBe(true);
                    });
                    pointData.clickManuallyEnterData().then(function (linkClicked) {
                      expect(linkClicked).toBe(true);
                    });
                    pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                      expect(dataEntered).toBe(true);
                    });
                    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                      expect(submitClicked).toBe(true);
                    });
                    newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                      expect(analyte).toBe(true);
                    });
                    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                      expect(analyte).toBe(true);
                    });
                    pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                      expect(valuesVerified).toBe(true);
                    });
                    pointData.clickShowData().then(function (showDataClicked) {
                      expect(showDataClicked).toBe(true);
                    });
                    analyteSettings.comparePointValueLevel1().then(function (comparison) {
                      expect(comparison).toBe(true);
                    });
                    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                      fifthAddL1, firstAddL2).then(function (newData) {
                        l1Value = newData[0];
                        console.log(l1Value);
                        pointData.clickHideData().then(function (dataHidden) {
                          expect(dataHidden).toBe(true);
                        });
                        pointData.clickManuallyEnterData().then(function (linkClicked) {
                          expect(linkClicked).toBe(true);
                        });
                        pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                          expect(dataEntered).toBe(true);
                        });
                        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                          expect(submitClicked).toBe(true);
                        });
                        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                          expect(analyte).toBe(true);
                        });
                        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                          expect(analyte).toBe(true);
                        });
                        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                          expect(valuesVerified).toBe(true);
                        });
                        pointData.clickShowData().then(function (showDataClicked) {
                          expect(showDataClicked).toBe(true);
                        });
                        analyteSettings.comparePointValueLevel1().then(function (comparison) {
                          expect(comparison).toBe(true);
                        });
                        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                          sixthAddL1, firstAddL2).then(function (newData) {
                            l1Value = newData[0];
                            console.log(l1Value);
                            pointData.clickHideData().then(function (dataHidden) {
                              expect(dataHidden).toBe(true);
                            });
                            pointData.clickManuallyEnterData().then(function (linkClicked) {
                              expect(linkClicked).toBe(true);
                            });
                            pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                              expect(dataEntered).toBe(true);
                            });
                            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                              expect(submitClicked).toBe(true);
                            });
                            newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                              expect(analyte).toBe(true);
                            });
                            newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                              expect(analyte).toBe(true);
                            });
                            pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                              expect(valuesVerified).toBe(true);
                            });
                            pointData.clickShowData().then(function (showDataClicked) {
                              expect(showDataClicked).toBe(true);
                            });
                            analyteSettings.comparePointValueLevel1().then(function (comparison) {
                              expect(comparison).toBe(true);
                            });
                            analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                              seventhAddL1, firstAddL2).then(function (newData) {
                                l1Value = newData[0];
                                console.log(l1Value);
                                pointData.clickHideData().then(function (dataHidden) {
                                  expect(dataHidden).toBe(true);
                                });
                                pointData.clickManuallyEnterData().then(function (linkClicked) {
                                  expect(linkClicked).toBe(true);
                                });
                                pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                                  expect(dataEntered).toBe(true);
                                });
                                pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                                  expect(submitClicked).toBe(true);
                                });
                                newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                                  expect(analyte).toBe(true);
                                });
                                newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                                  expect(analyte).toBe(true);
                                });
                                pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                                  expect(valuesVerified).toBe(true);
                                });
                                analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
                                  expect(displayed).toBe(true);
                                });
                                pointData.clickShowData().then(function (showDataClicked) {
                                  expect(showDataClicked).toBe(true);
                                });
                                analyteSettings.comparePointValueLevel1().then(function (comparison) {
                                  expect(comparison).toBe(false);
                                });
                              });
                          });
                      });
                  });
              });
          });
      });
  });

  it('Test case 7: To verify if the warning is shown for 7T Rule @P1', function () {
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
    westgard.selectRule('7-T', 'warning').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = 0;
    multiplyL2 = 0;
    firstAddL1 = -0.01;
    firstAddL2 = 0;
    secondAddL1 = -0.02;
    thirdAddL1 = -0.03;
    fourthAddL1 = -0.04;
    fifthAddL1 = -0.05;
    sixthAddL1 = -0.06;
    seventhAddL1 = -0.07;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
      firstAddL1, firstAddL2).then(function (newData) {
        l1Value = newData[0];
        console.log(l1Value);
        pointData.clickHideData().then(function (dataHidden) {
          expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (linkClicked) {
          expect(linkClicked).toBe(true);
        });
        pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        analyteSettings.comparePointValueLevel1().then(function (comparison) {
          expect(comparison).toBe(true);
        });
        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
          secondAddL1, firstAddL2).then(function (newData) {
            l1Value = newData[0];
            console.log(l1Value);
            pointData.clickHideData().then(function (dataHidden) {
              expect(dataHidden).toBe(true);
            });
            pointData.clickManuallyEnterData().then(function (linkClicked) {
              expect(linkClicked).toBe(true);
            });
            pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
              expect(dataEntered).toBe(true);
            });
            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
              expect(submitClicked).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
              expect(valuesVerified).toBe(true);
            });
            pointData.clickShowData().then(function (showDataClicked) {
              expect(showDataClicked).toBe(true);
            });
            analyteSettings.comparePointValueLevel1().then(function (comparison) {
              expect(comparison).toBe(true);
            });
            analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
              thirdAddL1, firstAddL2).then(function (newData) {
                l1Value = newData[0];
                console.log(l1Value);
                pointData.clickHideData().then(function (dataHidden) {
                  expect(dataHidden).toBe(true);
                });
                pointData.clickManuallyEnterData().then(function (linkClicked) {
                  expect(linkClicked).toBe(true);
                });
                pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                  expect(dataEntered).toBe(true);
                });
                pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                  expect(submitClicked).toBe(true);
                });
                newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                  expect(analyte).toBe(true);
                });
                newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                  expect(analyte).toBe(true);
                });
                pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                  expect(valuesVerified).toBe(true);
                });
                pointData.clickShowData().then(function (showDataClicked) {
                  expect(showDataClicked).toBe(true);
                });
                analyteSettings.comparePointValueLevel1().then(function (comparison) {
                  expect(comparison).toBe(true);
                });
                analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                  fourthAddL1, firstAddL2).then(function (newData) {
                    l1Value = newData[0];
                    console.log(l1Value);
                    pointData.clickHideData().then(function (dataHidden) {
                      expect(dataHidden).toBe(true);
                    });
                    pointData.clickManuallyEnterData().then(function (linkClicked) {
                      expect(linkClicked).toBe(true);
                    });
                    pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                      expect(dataEntered).toBe(true);
                    });
                    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                      expect(submitClicked).toBe(true);
                    });
                    newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                      expect(analyte).toBe(true);
                    });
                    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                      expect(analyte).toBe(true);
                    });
                    pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                      expect(valuesVerified).toBe(true);
                    });
                    pointData.clickShowData().then(function (showDataClicked) {
                      expect(showDataClicked).toBe(true);
                    });
                    analyteSettings.comparePointValueLevel1().then(function (comparison) {
                      expect(comparison).toBe(true);
                    });
                    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                      fifthAddL1, firstAddL2).then(function (newData) {
                        l1Value = newData[0];
                        console.log(l1Value);
                        pointData.clickHideData().then(function (dataHidden) {
                          expect(dataHidden).toBe(true);
                        });
                        pointData.clickManuallyEnterData().then(function (linkClicked) {
                          expect(linkClicked).toBe(true);
                        });
                        pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                          expect(dataEntered).toBe(true);
                        });
                        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                          expect(submitClicked).toBe(true);
                        });
                        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                          expect(analyte).toBe(true);
                        });
                        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                          expect(analyte).toBe(true);
                        });
                        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                          expect(valuesVerified).toBe(true);
                        });
                        pointData.clickShowData().then(function (showDataClicked) {
                          expect(showDataClicked).toBe(true);
                        });
                        analyteSettings.comparePointValueLevel1().then(function (comparison) {
                          expect(comparison).toBe(true);
                        });
                        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                          sixthAddL1, firstAddL2).then(function (newData) {
                            l1Value = newData[0];
                            console.log(l1Value);
                            pointData.clickHideData().then(function (dataHidden) {
                              expect(dataHidden).toBe(true);
                            });
                            pointData.clickManuallyEnterData().then(function (linkClicked) {
                              expect(linkClicked).toBe(true);
                            });
                            pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                              expect(dataEntered).toBe(true);
                            });
                            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                              expect(submitClicked).toBe(true);
                            });
                            newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                              expect(analyte).toBe(true);
                            });
                            newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                              expect(analyte).toBe(true);
                            });
                            pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                              expect(valuesVerified).toBe(true);
                            });
                            pointData.clickShowData().then(function (showDataClicked) {
                              expect(showDataClicked).toBe(true);
                            });
                            analyteSettings.comparePointValueLevel1().then(function (comparison) {
                              expect(comparison).toBe(true);
                            });
                            analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                              seventhAddL1, firstAddL2).then(function (newData) {
                                l1Value = newData[0];
                                console.log(l1Value);
                                pointData.clickHideData().then(function (dataHidden) {
                                  expect(dataHidden).toBe(true);
                                });
                                pointData.clickManuallyEnterData().then(function (linkClicked) {
                                  expect(linkClicked).toBe(true);
                                });
                                pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                                  expect(dataEntered).toBe(true);
                                });
                                pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                                  expect(submitClicked).toBe(true);
                                });
                                newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                                  expect(analyte).toBe(true);
                                });
                                newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                                  expect(analyte).toBe(true);
                                });
                                pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                                  expect(valuesVerified).toBe(true);
                                });
                                analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
                                  expect(displayed).toBe(true);
                                });
                                pointData.clickShowData().then(function (showDataClicked) {
                                  expect(showDataClicked).toBe(true);
                                });
                                analyteSettings.comparePointValueLevel1().then(function (comparison) {
                                  expect(comparison).toBe(true);
                                });
                              });
                          });
                      });
                  });
              });
          });
      });
  });

  it('Test case 13: To verify if any value can be entered after disabling 7T Rule @P1', function () {
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
    westgard.selectRule('7-T', 'disabled').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    multiplyL1 = 0;
    multiplyL2 = 0;
    firstAddL1 = 0.01;
    firstAddL2 = 0;
    secondAddL1 = 0.02;
    thirdAddL1 = 0.03;
    fourthAddL1 = 0.04;
    fifthAddL1 = 0.05;
    sixthAddL1 = 0.06;
    seventhAddL1 = 0.07;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
      firstAddL1, firstAddL2).then(function (newData) {
        l1Value = newData[0];
        console.log(l1Value);
        pointData.clickHideData().then(function (dataHidden) {
          expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (linkClicked) {
          expect(linkClicked).toBe(true);
        });
        pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
          expect(dataEntered).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        analyteSettings.comparePointValueLevel1().then(function (comparison) {
          expect(comparison).toBe(true);
        });
        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
          secondAddL1, firstAddL2).then(function (newData) {
            l1Value = newData[0];
            console.log(l1Value);
            pointData.clickHideData().then(function (dataHidden) {
              expect(dataHidden).toBe(true);
            });
            pointData.clickManuallyEnterData().then(function (linkClicked) {
              expect(linkClicked).toBe(true);
            });
            pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
              expect(dataEntered).toBe(true);
            });
            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
              expect(submitClicked).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
              expect(valuesVerified).toBe(true);
            });
            pointData.clickShowData().then(function (showDataClicked) {
              expect(showDataClicked).toBe(true);
            });
            analyteSettings.comparePointValueLevel1().then(function (comparison) {
              expect(comparison).toBe(true);
            });
            analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
              thirdAddL1, firstAddL2).then(function (newData) {
                l1Value = newData[0];
                console.log(l1Value);
                pointData.clickHideData().then(function (dataHidden) {
                  expect(dataHidden).toBe(true);
                });
                pointData.clickManuallyEnterData().then(function (linkClicked) {
                  expect(linkClicked).toBe(true);
                });
                pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                  expect(dataEntered).toBe(true);
                });
                pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                  expect(submitClicked).toBe(true);
                });
                newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                  expect(analyte).toBe(true);
                });
                newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                  expect(analyte).toBe(true);
                });
                pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                  expect(valuesVerified).toBe(true);
                });
                pointData.clickShowData().then(function (showDataClicked) {
                  expect(showDataClicked).toBe(true);
                });
                analyteSettings.comparePointValueLevel1().then(function (comparison) {
                  expect(comparison).toBe(true);
                });
                analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                  fourthAddL1, firstAddL2).then(function (newData) {
                    l1Value = newData[0];
                    console.log(l1Value);
                    pointData.clickHideData().then(function (dataHidden) {
                      expect(dataHidden).toBe(true);
                    });
                    pointData.clickManuallyEnterData().then(function (linkClicked) {
                      expect(linkClicked).toBe(true);
                    });
                    pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                      expect(dataEntered).toBe(true);
                    });
                    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                      expect(submitClicked).toBe(true);
                    });
                    newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                      expect(analyte).toBe(true);
                    });
                    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                      expect(analyte).toBe(true);
                    });
                    pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                      expect(valuesVerified).toBe(true);
                    });
                    pointData.clickShowData().then(function (showDataClicked) {
                      expect(showDataClicked).toBe(true);
                    });
                    analyteSettings.comparePointValueLevel1().then(function (comparison) {
                      expect(comparison).toBe(true);
                    });
                    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                      fifthAddL1, firstAddL2).then(function (newData) {
                        l1Value = newData[0];
                        console.log(l1Value);
                        pointData.clickHideData().then(function (dataHidden) {
                          expect(dataHidden).toBe(true);
                        });
                        pointData.clickManuallyEnterData().then(function (linkClicked) {
                          expect(linkClicked).toBe(true);
                        });
                        pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                          expect(dataEntered).toBe(true);
                        });
                        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                          expect(submitClicked).toBe(true);
                        });
                        newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                          expect(analyte).toBe(true);
                        });
                        newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                          expect(analyte).toBe(true);
                        });
                        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                          expect(valuesVerified).toBe(true);
                        });
                        pointData.clickShowData().then(function (showDataClicked) {
                          expect(showDataClicked).toBe(true);
                        });
                        analyteSettings.comparePointValueLevel1().then(function (comparison) {
                          expect(comparison).toBe(true);
                        });
                        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                          sixthAddL1, firstAddL2).then(function (newData) {
                            l1Value = newData[0];
                            console.log(l1Value);
                            pointData.clickHideData().then(function (dataHidden) {
                              expect(dataHidden).toBe(true);
                            });
                            pointData.clickManuallyEnterData().then(function (linkClicked) {
                              expect(linkClicked).toBe(true);
                            });
                            pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                              expect(dataEntered).toBe(true);
                            });
                            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                              expect(submitClicked).toBe(true);
                            });
                            newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                              expect(analyte).toBe(true);
                            });
                            newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                              expect(analyte).toBe(true);
                            });
                            pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                              expect(valuesVerified).toBe(true);
                            });
                            pointData.clickShowData().then(function (showDataClicked) {
                              expect(showDataClicked).toBe(true);
                            });
                            analyteSettings.comparePointValueLevel1().then(function (comparison) {
                              expect(comparison).toBe(true);
                            });
                            analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2,
                              seventhAddL1, firstAddL2).then(function (newData) {
                                l1Value = newData[0];
                                console.log(l1Value);
                                pointData.clickHideData().then(function (dataHidden) {
                                  expect(dataHidden).toBe(true);
                                });
                                pointData.clickManuallyEnterData().then(function (linkClicked) {
                                  expect(linkClicked).toBe(true);
                                });
                                pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                                  expect(dataEntered).toBe(true);
                                });
                                pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                                  expect(submitClicked).toBe(true);
                                });
                                newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte) {
                                  expect(analyte).toBe(true);
                                });
                                newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte) {
                                  expect(analyte).toBe(true);
                                });
                                pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                                  expect(valuesVerified).toBe(true);
                                });
                                analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
                                  expect(displayed).toBe(false);
                                });
                                analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
                                  expect(displayed).toBe(false);
                                });
                                pointData.clickShowData().then(function (showDataClicked) {
                                  expect(showDataClicked).toBe(true);
                                });
                                analyteSettings.comparePointValueLevel1().then(function (comparison) {
                                  expect(comparison).toBe(true);
                                });
                              });
                          });
                      });
                  });
              });
          });
      });
  });
});
