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

library.parseJson('./JSON_data/WR12x_2.json').then(function(data) {
  jsonData = data;
});



describe('Westgard Rules:- 12x', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const analyteSettings = new AnalyteSettings();
  const out = new LogOut();
  const pointData = new PointDataEntry();
  const newLabSetup = new NewLabSetup();
  const library = new BrowserLibrary();
  let multiplyL1, multiplyL2, firstAddL1, firstAddL2, secondAddL1, thirdAddL1, fourthAddL1, fifthAddL1, l1Value;
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

  it('Test Case 9:- To check if the Rejection is shown for the data which violates the 12x rule for values above Mean (within run)',
    function () {
      library.logStep('Test Case 9:- To check if the Rejection is shown for the data which violates the 12x rule for values above Mean (within run)');
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
      analyteSettings.selectKxRule('12x', 'reject').then(function (rule1Selected) {
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
      firstAddL1 = 0.01;
      firstAddL2 = 0;
      secondAddL1 = 0.02;
      thirdAddL1 = 0.03;
      fourthAddL1 = 0.04;
      fifthAddL1 = 0.05;
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
          pointData.clickSubmitButton().then(function (submitClicked) {
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
            // tslint:disable-next-line: no-shadowed-variable
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
              pointData.clickSubmitButton().then(function (submitClicked) {
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
                // tslint:disable-next-line: no-shadowed-variable
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
                  pointData.clickSubmitButton().then(function (submitClicked) {
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
                    // tslint:disable-next-line: no-shadowed-variable
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
                      pointData.clickSubmitButton().then(function (submitClicked) {
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
                        // tslint:disable-next-line: no-shadowed-variable
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
                          pointData.clickSubmitButton().then(function (submitClicked) {
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
                            // tslint:disable-next-line: no-shadowed-variable
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
                              pointData.clickSubmitButton().then(function (submitClicked) {
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
                                // tslint:disable-next-line: no-shadowed-variable
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
                                  pointData.clickSubmitButton().then(function (submitClicked) {
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
                                    // tslint:disable-next-line: no-shadowed-variable
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
                                      pointData.clickSubmitButton().then(function (submitClicked) {
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
                                        // tslint:disable-next-line: no-shadowed-variable
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
                                          pointData.clickSubmitButton().then(function (submitClicked) {
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
                                            // tslint:disable-next-line: no-shadowed-variable
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
                                              pointData.clickSubmitButton().then(function (submitClicked) {
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
                                                // tslint:disable-next-line: no-shadowed-variable
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
                                                  pointData.clickSubmitButton().then(function (submitClicked) {
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
                                                  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1,
                                                    // tslint:disable-next-line: no-shadowed-variable
                                                    multiplyL2, firstAddL1, firstAddL2).then(function (newData) {
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
                                                      pointData.clickSubmitButton().then(function (submitClicked) {
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
                    });
                });
            });
        });
    });
});
