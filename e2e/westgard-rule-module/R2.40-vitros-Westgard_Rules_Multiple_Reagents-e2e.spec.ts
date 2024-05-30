//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { MultiPoint } from '../page-objects/multi-point.po';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;
const library=new BrowserLibrary();
library.parseJson('./JSON_data/Westgard_Rules_Multiple_Reagents.json').then(function(data) {
  jsonData = data;
});


describe('Westgard Rules for Vitros', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const newLabSetup = new NewLabSetup();
  const westgard = new WestgardRule();
  const analyteSettings = new AnalyteSettings();
  const pointData = new PointDataEntry();
  const multiPoint = new MultiPoint();
  const nav = new NewNavigation();
  const newSetting = new InheritedSettings();
  const setting = new Settings();

  let multiplyL1, multiplyL2, firstAddL1, secondAddL1,l2Value,
    thirdAddL1, fourthAddL1, fifthAddL1, sixthAddL1, seventhAddL1, eighthAddL1, ninethAddL1, tenthAddL1, eleventhAddL1, twelfthAddL1, l1Value;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });
  it('Test case 1: To verify if the warning is shown for 7x Rule for diffrent reagent on analyte page @P2', function () {
    setting.navigateTODept(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
      expect(analyte1).toBe(true);
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
    setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });

    multiplyL1 = 0;
    firstAddL1 = 0.01;
    secondAddL1 = 0.02;
    thirdAddL1 = 0.03;
    fourthAddL1 = 0.04;
    fifthAddL1 = 0.05;
    sixthAddL1 = 0.06;
    seventhAddL1 = 0.07;

    analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
      firstAddL1).then(function (newData) {
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
        setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.waitForSummaryStatistics().then(function (displayed) {
          expect(displayed).toBe(true);
        });
        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.comparePointValueLevel1().then(function (comparison) {
          expect(comparison).toBe(true);
        });
        analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
          secondAddL1).then(function (newData) {
            l1Value = newData[0];
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
            setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte) {
              expect(analyte).toBe(true);
            });
            newLabSetup.waitForSummaryStatistics().then(function (displayed) {
              expect(displayed).toBe(true);
            });
            pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
              expect(valuesVerified).toBe(true);
            });
            analyteSettings.comparePointValueLevel1().then(function (comparison) {
              expect(comparison).toBe(true);
            });

            analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
              thirdAddL1).then(function (newData) {
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
                setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
                  expect(analyte).toBe(true);
                });
                setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte) {
                  expect(analyte).toBe(true);
                });
                newLabSetup.waitForSummaryStatistics().then(function (displayed) {
                  expect(displayed).toBe(true);
                });
                pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                  expect(valuesVerified).toBe(true);
                });
                analyteSettings.comparePointValueLevel1().then(function (comparison) {
                  expect(comparison).toBe(true);
                });
                analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
                  fourthAddL1).then(function (newData) {
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
                    setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
                      expect(analyte).toBe(true);
                    });
                    setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte) {
                      expect(analyte).toBe(true);
                    });
                    newLabSetup.waitForSummaryStatistics().then(function (displayed) {
                      expect(displayed).toBe(true);
                    });
                    pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                      expect(valuesVerified).toBe(true);
                    });
                    analyteSettings.comparePointValueLevel1().then(function (comparison) {
                      expect(comparison).toBe(true);
                    });
                    analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
                      fifthAddL1).then(function (newData) {
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
                        setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
                          expect(analyte).toBe(true);
                        });
                        setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte) {
                          expect(analyte).toBe(true);
                        });
                        newLabSetup.waitForSummaryStatistics().then(function (displayed) {
                          expect(displayed).toBe(true);
                        });
                        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                          expect(valuesVerified).toBe(true);
                        });
                        analyteSettings.comparePointValueLevel1().then(function (comparison) {
                          expect(comparison).toBe(true);
                        });
                        analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
                          sixthAddL1).then(function (newData) {
                            l1Value = newData[0];
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
                            setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
                              expect(analyte).toBe(true);
                            });
                            setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte) {
                              expect(analyte).toBe(true);
                            });
                            newLabSetup.waitForSummaryStatistics().then(function (displayed) {
                              expect(displayed).toBe(true);
                            });
                            pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                              expect(valuesVerified).toBe(true);
                            });
                            analyteSettings.comparePointValueLevel1().then(function (comparison) {
                              expect(comparison).toBe(true);
                            });

                            analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
                              seventhAddL1).then(function (newData) {
                                l1Value = newData[0];
                                pointData.clickHideData().then(function (dataHidden) {
                                  expect(dataHidden).toBe(true);
                                });
                                pointData.clickManuallyEnterData().then(function (linkClicked) {
                                  expect(linkClicked).toBe(true);
                                });
                                pointData.enterPointValueLevel1(l1Value).then(function (dataEntered) {
                                  expect(dataEntered).toBe(true);
                                });
                                pointData.clickShowOptions().then(function (clicked) {
                                  expect(clicked).toBe(true);
                                });
                                pointData.selectReagentLotAtDataEntry(jsonData.SlideGen1).then(function (clicked) {
                                  expect(clicked).toBe(true);
                                });
                                pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                                  expect(submitClicked).toBe(true);
                                });
                                setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
                                  expect(analyte).toBe(true);
                                });
                                setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte) {
                                  expect(analyte).toBe(true);
                                });
                                newLabSetup.waitForSummaryStatistics().then(function (displayed) {
                                  expect(displayed).toBe(true);
                                });
                                pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                                  expect(valuesVerified).toBe(true);
                                });
                                analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
                                  expect(displayed).toBe(true);
                                });
                                analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
                                  expect(displayed).toBe(false);
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


  it('Test case 2: To verify if the rejection is shown for 8x Rule for diffrent reagent/slidegen on analyte page @P1', function () {
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.selectKxRule('8x', 'reject').then(function (rule1Selected) {
      expect(rule1Selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });

    multiplyL1 = 0;
    eighthAddL1 = 0.08;
    analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
      eighthAddL1).then(function (newData) {
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
        pointData.clickShowOptions().then(function (clicked) {
          expect(clicked).toBe(true);
        });
        pointData.selectReagentLotAtDataEntry(jsonData.SlideGen2).then(function (clicked) {
          expect(clicked).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
          expect(analyte1).toBe(true);
        });
        pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.comparePointValueLevel1().then(function (comparison) {
          expect(comparison).toBe(false);
        });
      });
    });

it('Test case 3: To verify if the warning is shown for 9x Rule for diffrent reagent/slidegen at control level @P1', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
    expect(analyte1).toBe(true);
  });
  pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
    expect(clickedEditLink).toBe(true);
  });
  analyteSettings.selectKxRule('9x', 'warning').then(function (rule1Selected) {
    expect(rule1Selected).toBe(true);
  });
  analyteSettings.clickUpdateButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
    expect(analyte1).toBe(true);
  });

   multiplyL1 = 0;
   eighthAddL1 = 0.08;
   ninethAddL1 = 0.09;
   analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
    eighthAddL1).then(function (newData) {
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
      setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
        expect(analyte1).toBe(true);
      });
      pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });

      analyteSettings.comparePointValueLevel1().then(function (comparison) {
        expect(comparison).toBe(true);
      });

      analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
        ninethAddL1).then(function (newData) {
          l1Value = newData[0];
          console.log(l1Value);
          newLabSetup.clickBackArrow().then(function (backarrowclicked) {
            expect(backarrowclicked).toBe(true);
          });
          multiPoint.clickManuallyEnterData().then(function (result) {
            expect(result).toBe(true);
          });
          const dataMap = new Map<string, string>();
          const val = l1Value;
          dataMap.set('11', val);
          multiPoint.enterValues(dataMap).then(function (result) {
            expect(result).toBe(true);
          });
          pointData.clickShowOptions().then(function (clicked) {
            expect(clicked).toBe(true);
          });
          pointData.selectReagentLotAtDataEntry(jsonData.SlideGen3).then(function (clicked) {
            expect(clicked).toBe(true);
          });
          pointData.clickOnSendToPeerGrpButton().then(function (result) {
            expect(result).toBe(true);
          });
          multiPoint.verifyEnteredValueWarnedByRule(val, "9-X[W]", 1).then(function (result) {
            expect(result).toBe(true);
          });
        });
      });
  });

  it('Test case 4: To verify if the rejection is shown for 10x Rule for diffrent reagent at control level @P1', function () {
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });

    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.selectKxRule('10x', 'reject').then(function (rule1Selected) {
      expect(rule1Selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });

    multiplyL1 = 1;
    tenthAddL1 = 0.10;
    analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
      tenthAddL1).then(function (newData) {
        l1Value = newData[0];
        console.log(l1Value);
        newLabSetup.clickBackArrow().then(function (backarrowclicked) {
          expect(backarrowclicked).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (result) {
          expect(result).toBe(true);
        });
        const dataMap = new Map<string, string>();
        const val = l1Value;
        dataMap.set('11', val);
        multiPoint.enterValues(dataMap).then(function (result) {
          expect(result).toBe(true);
        });
        pointData.clickShowOptions().then(function (clicked) {
          expect(clicked).toBe(true);
        });
        pointData.selectReagentLotAtDataEntry(jsonData.SlideGen4).then(function (clicked) {
          expect(clicked).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (result) {
          expect(result).toBe(true);
        });
        multiPoint.verifyEnteredValueRejectByRule(val, '10-X', 1).then(function (rejected) {
          expect(rejected).toBe(true);
        });
      });
    });
    it('Test case 5: To verify if the Warning is shown for 12x Rule for diffrent reagent at instrument level @P1', function () {
      setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
        expect(dept).toBe(true);
      });
      setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
        expect(inst).toBe(true);
      });
      setting.navigateTO(jsonData.ProductName).then(function (prod) {
        expect(prod).toBe(true);
      });
      setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
        expect(analyte1).toBe(true);
      });
      pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.selectKxRule('12x', 'warning').then(function (rule1Selected) {
        expect(rule1Selected).toBe(true);
      });
      analyteSettings.clickUpdateButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
        expect(analyte1).toBe(true);
      });

      multiplyL1 = 0;
      tenthAddL1 = 0.10;
      eleventhAddL1 = 0.11;
      twelfthAddL1 = 0.12;
      analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
        tenthAddL1).then(function (newData) {
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
          pointData.clickShowOptions().then(function (clicked) {
            expect(clicked).toBe(true);
          });
          pointData.selectReagentLotAtDataEntry(jsonData.SlideGen5).then(function (clicked) {
            expect(clicked).toBe(true);
          });
          pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
          });
          setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
            expect(analyte).toBe(true);
          });
          setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
            expect(analyte1).toBe(true);
          });
          pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
            expect(valuesVerified).toBe(true);
          });
          analyteSettings.comparePointValueLevel1().then(function (comparison) {
            expect(comparison).toBe(true);
          });
          analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
            eleventhAddL1).then(function (newData) {
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
              pointData.clickShowOptions().then(function (clicked) {
                expect(clicked).toBe(true);
              });
              pointData.selectReagentLotAtDataEntry(jsonData.SlideGen1).then(function (clicked) {
                expect(clicked).toBe(true);
              });
              pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
                expect(submitClicked).toBe(true);
              });
              setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
                expect(analyte).toBe(true);
              });
              setting.navigateTO(jsonData.AnalyteReagent1).then(function (analyte1) {
                expect(analyte1).toBe(true);
              });
              pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                expect(valuesVerified).toBe(true);
              });
              analyteSettings.comparePointValueLevel1().then(function (comparison) {
                expect(comparison).toBe(true);
              });
              analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
                twelfthAddL1).then(function (newData) {
                  l1Value = newData[0];
                  console.log(l1Value);
                  newLabSetup.clickBackArrow().then(function (backarrowclicked) {
                    expect(backarrowclicked).toBe(true);
                  });
                  newLabSetup.clickBackArrow().then(function (backarrowclicked) {
                    expect(backarrowclicked).toBe(true);
                  });
                  multiPoint.clickManuallyEnterData().then(function (result) {
                    expect(result).toBe(true);
                  });
                  const dataMap = new Map<string, string>();
                  const val = l1Value;
                  dataMap.set('11', val);
                  multiPoint.enterValues(dataMap).then(function (result) {
                    expect(result).toBe(true);
                  });
                  pointData.clickShowOptions().then(function (clicked) {
                    expect(clicked).toBe(true);
                  });
                  pointData.selectReagentLotAtDataEntry(jsonData.SlideGen2).then(function (clicked) {
                    expect(clicked).toBe(true);
                  });
                  multiPoint.clickSubmitButton().then(function (result) {
                    expect(result).toBe(true);
                  });
                  multiPoint.verifyEnteredValueWarnedByRule(val, "12-X[W]", 1).then(function (warned) {
                    expect(warned).toBe(true);
                  });
                });
            });
        });
    });

it('Test case 6: To verify if the Warning is shown for 3-1s Rule for diffrent reagent at instrument level', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent3).then(function (analyte1) {
    expect(analyte1).toBe(true);
  });
  pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
    expect(clickedEditLink).toBe(true);
  });
  westgard.selectRule('3-1s', 'warning').then(function (selected) {
    expect(selected).toBe(true);
  });
  analyteSettings.clickUpdateButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiplyL1 = 1;
  firstAddL1 = 0.10;
  secondAddL1 = 0.20;
  thirdAddL1 = 0.30;

  analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
    firstAddL1).then(function (newData) {
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
      pointData.clickShowOptions().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      pointData.selectReagentLotAtDataEntry(jsonData.SlideGen31).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
      });
      setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      setting.navigateTO(jsonData.AnalyteReagent3).then(function (analyte1) {
        expect(analyte1).toBe(true);
      });
      newLabSetup.waitForSummaryStatistics().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.comparePointValueLevel1().then(function (comparison) {
        expect(comparison).toBe(true);
      });

      pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });

      analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
        secondAddL1).then(function (newData) {
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

          pointData.clickShowOptions().then(function (clicked) {
            expect(clicked).toBe(true);
          });
          pointData.selectReagentLotAtDataEntry(jsonData.SlideGen32).then(function (clicked) {
            expect(clicked).toBe(true);
          });
          pointData.clickSubmitButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
          });
          setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
            expect(analyte).toBe(true);
          });
          setting.navigateTO(jsonData.AnalyteReagent3).then(function (analyte1) {
            expect(analyte1).toBe(true);
          });
          newLabSetup.waitForSummaryStatistics().then(function (displayed) {
            expect(displayed).toBe(true);
          });
          analyteSettings.comparePointValueLevel1().then(function (comparison) {
            expect(comparison).toBe(true);
          });
          pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
            expect(valuesVerified).toBe(true);
          });
          analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
            thirdAddL1).then(function (newData) {
              l1Value = newData[0];
              console.log(l1Value);
              newLabSetup.clickBackArrow().then(function (backarrowclicked) {
                expect(backarrowclicked).toBe(true);
              });
              newLabSetup.clickBackArrow().then(function (backarrowclicked) {
                expect(backarrowclicked).toBe(true);
              });
              multiPoint.clickManuallyEnterData().then(function (result) {
                expect(result).toBe(true);
              });
              const dataMap = new Map<string, string>();
              const val = l1Value;
              dataMap.set('31', val);
              multiPoint.enterValues(dataMap).then(function (result) {
                expect(result).toBe(true);
              });
              pointData.clickShowOptions().then(function (clicked) {
                expect(clicked).toBe(true);
              });
              pointData.selectReagentLotAtDataEntry(jsonData.SlideGen33).then(function (clicked) {
                expect(clicked).toBe(true);
              });
              multiPoint.clickSubmitButton().then(function (result) {
                expect(result).toBe(true);
              });
              multiPoint.verifyEnteredValueWarnedByRule(val, "3-1s[W]", 3).then(function (warned) {
                expect(warned).toBe(true);
              });
              setting.navigateTO(jsonData.ProductName).then(function (prod) {
                expect(prod).toBe(true);
              });
              setting.navigateTO(jsonData.AnalyteReagent3).then(function (analyte1) {
                expect(analyte1).toBe(true);
              });
              newLabSetup.waitForSummaryStatistics().then(function (displayed) {
                expect(displayed).toBe(true);
              });
              analyteSettings.comparePointValueLevel1().then(function (comparison) {
                expect(comparison).toBe(true);
              });
            });
        });
    });
});


it('Test case 7: To verify if the Rejection is shown for 4-1s Rule for diffrent reagent at control level', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent3).then(function (analyte1) {
    expect(analyte1).toBe(true);
  });
  pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
    expect(clickedEditLink).toBe(true);
  });
  westgard.selectRule('4-1s', 'reject').then(function (selected) {
    expect(selected).toBe(true);
  });
  analyteSettings.clickUpdateButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiplyL1 = 1;
  fourthAddL1 = 0.04;
  analyteSettings.getCalculatedValuesForSingleLevelFromCumulativeValues(multiplyL1,
    fourthAddL1).then(function (newData) {
      l1Value = newData[0];
      console.log(l1Value);
      newLabSetup.clickBackArrow().then(function (backarrowclicked) {
        expect(backarrowclicked).toBe(true);
      });
      multiPoint.clickManuallyEnterData().then(function (result) {
        expect(result).toBe(true);
      });
      const dataMap = new Map<string, string>();
      const val = l1Value;
      dataMap.set('31', val);
      multiPoint.enterValues(dataMap).then(function (result) {
        expect(result).toBe(true);
      });

      pointData.clickShowOptions().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      pointData.selectReagentLotAtDataEntry(jsonData.SlideGen34).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiPoint.clickSubmitButton().then(function (result) {
        expect(result).toBe(true);
      });
      multiPoint.verifyEnteredValueRejectByRule(val, "4-1s", 3).then(function (rejected) {
        expect(rejected).toBe(true);
      });
      setting.navigateTO(jsonData.AnalyteReagent3).then(function (analyte1) {
        expect(analyte1).toBe(true);
      });
      newLabSetup.waitForSummaryStatistics().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.comparePointValueNotUpdatedLevel1().then(function (comparison) {
        expect(comparison).toBe(true);
      });
    });
  });

  it('Test case 8: To verify if the rejection is shown for R-4s Rule for diffrent reagent on analyte page', function () {
    setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent4).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    westgard.selectRule('R-4s', 'reject').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiplyL1 = 2;
    multiplyL2 = 2;
    firstAddL1 = 2;
    secondAddL1 = -2;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, firstAddL1, secondAddL1).then(function (newData) {
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
      pointData.clickShowOptions().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      pointData.selectReagentLotAtDataEntry(jsonData.SlideGen41).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
      });
        setting.navigateTO(jsonData.AnalyteReagent2).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        setting.navigateTO(jsonData.AnalyteReagent4).then(function (analyte) {
          expect(analyte).toBe(true);
        });
        newLabSetup.waitForSummaryStatistics().then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.comparePointValues().then(function (comparison) {
          expect(comparison).toBe(false);
        });
        pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });
        analyteSettings.isRejectionDisplayed(l2Value).then(function (displayed) {
          expect(displayed).toBe(true);
        });

      });
  });


it('Test case 1: To verify 1-2s lot for analytes having multiple reagent lot analyte level', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent5).then(function (analyte1) {
    expect(analyte1).toBe(true);
  });
  setting.clickOnEditThisAnalyteLink().then(function (navigated) {
    expect(navigated).toBe(true);
  });
  westgard.selectRule('1-3.00', 'disabled').then(function (selected) {
    expect(selected).toBe(true);
  });
  newSetting.setWarnRule('1-').then(function (verified) {
    expect(verified).toBe(true);
  });
  westgard.setValueRange('2.00').then(function (valueRange) {
    expect(valueRange).toBe(true);
  });
  setting.clickUpdateControlBtn().then(function (clicked) {
    expect(clicked).toBe(true);
  });

  multiplyL1 = 2.00;
  const addL1 = 0.02;

  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1, addL1).then(function (newData) {
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

    pointData.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.selectReagentLotAtDataEntry(jsonData.SlideGen51).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent2).then(function (reagent1) {
      expect(reagent1).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent5).then(function (reagent2) {
      expect(reagent2).toBe(true);
    });
    newLabSetup.waitForSummaryStatistics().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    pointData.clickShowData().then(function (showDataClicked) {
      expect(showDataClicked).toBe(true);
    });
    pointData.verifyEnteredPointValuesLvl1(l1Value).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    analyteSettings.compareReason(l1Value, '1-2s[W]').then(function (reasonDisplayed1) {
      expect(reasonDisplayed1).toBe(true);
    });
  });
});

it('Test case 2: To verify 1-3s lot for analytes having multiple reagent lot analyte level', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent5).then(function (analyte1) {
    expect(analyte1).toBe(true);
  });
  setting.clickOnEditThisAnalyteLink().then(function (navigated) {
    expect(navigated).toBe(true);
  });
  westgard.selectRule('1-2.00', 'disabled').then(function (selected) {
    expect(selected).toBe(true);
  });
  westgard.selectRule('1-3.00', 'reject').then(function (selected) {
    expect(selected).toBe(true);
  });
  setting.clickUpdateControlBtn().then(function (clicked) {
    expect(clicked).toBe(true);
  });

  multiplyL1 = 3.99;
  const addL1 = 0.01;
  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1, addL1).then(function (newData) {
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

    pointData.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.selectReagentLotAtDataEntry(jsonData.SlideGen52).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent2).then(function (reagent1) {
      expect(reagent1).toBe(true);
    });
    setting.navigateTO(jsonData.AnalyteReagent5).then(function (reagent2) {
      expect(reagent2).toBe(true);
    });
    newLabSetup.waitForSummaryStatistics().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    pointData.clickShowData().then(function (showDataClicked) {
      expect(showDataClicked).toBe(true);
    });
    pointData.verifyEnteredPointValuesLvl1(l1Value).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    analyteSettings.compareReason(l1Value, '1-3s').then(function (reasonDisplayed1) {
      expect(reasonDisplayed1).toBe(true);
    });
  });
});

it('Test case 3: To verify 2-2s reject rule for analytes having multiple reagent lot analyte level on control level data entry.', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent5).then(function (analyte1) {
    expect(analyte1).toBe(true);
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
  multiplyL1 = 2.00;
  const addL1 = 0.04;
  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1, addL1).then(function (newData) {
    l1Value = newData[0];
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    nav.clickBackArrow().then(function (clickBack) {
      expect(clickBack).toBe(true);
    });
    pointData.clickManuallyMultiEntryEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterMultiPointValue('51', l1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });

    pointData.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.selectReagentLotAtDataEntry(jsonData.SlideGen53).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    analyteSettings.verifyValueRejectedAndReasonOnMultiEntryPage(l1Value, '2-2s').then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
});

it('Test case 4: To verify 2-2s warn rule for analytes having multiple reagent lot analyte level on Intrument level data entry.', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent5).then(function (analyte1) {
    expect(analyte1).toBe(true);
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
  multiplyL1 = 2.00;
  const addL1 = 0.01;
  const twoaddL1 = 0.04;
  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1, addL1).then(function (newData) {
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

    pointData.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.selectReagentLotAtDataEntry(jsonData.SlideGen51).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
     setting.navigateTO(jsonData.AnalyteReagent2).then(function (reagent1) {
      expect(reagent1).toBe(true);
    });
     setting.navigateTO(jsonData.AnalyteReagent5).then(function (reagent2) {
      expect(reagent2).toBe(true);
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


        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1, twoaddL1).then(function (newData) {
          l1Value = newData[0];
          pointData.clickHideData().then(function (dataHidden) {
            expect(dataHidden).toBe(true);
          });
          nav.clickBackArrow().then(function (clickBack) {
            expect(clickBack).toBe(true);
          });
          nav.clickBackArrow().then(function (clickBack) {
            expect(clickBack).toBe(true);
          });
          pointData.clickManuallyMultiEntryEnterData().then(function (linkClicked) {
            expect(linkClicked).toBe(true);
          });
          pointData.enterMultiPointValue('51', l1Value).then(function (dataEntered) {
            expect(dataEntered).toBe(true);
          });

          pointData.clickShowOptions().then(function (clicked) {
            expect(clicked).toBe(true);
          });
          pointData.selectReagentLotAtDataEntry(jsonData.SlideGen52).then(function (clicked) {
            expect(clicked).toBe(true);
          });
          multiPoint.clickSubmitButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
          });
          analyteSettings.verifyValueRejectedAndReasonOnMultiEntryPage(l1Value, '2-2s[W]').then(function (displayed) {
            expect(displayed).toBe(true);
          });
        });
  });
});

it('Test case 1: To verify 1-0.01s rule for analytes having multiple reagent lot at control level', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.Analyte6).then(function (Analyte6) {
    expect(Analyte6).toBe(true);
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
  multiplyL1 = 0.10;
  const addL1 = 0.01;

  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1, addL1).then(function (newData) {
    l1Value = newData[0];
    nav.clickBackArrow().then(function (clickBack) {
      expect(clickBack).toBe(true);
    });
    pointData.clickManuallyMultiEntryEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterMultiPointValue('61', l1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });

    pointData.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.selectReagentLotAtDataEntry(jsonData.SlideGen61).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    multiPoint.verifyEnteredValueWarnedByRule(l1Value, "1-0.01s[W]", 6).then(function (result) {
      expect(result).toBe(true);
    });
  });

});

it('Test case 1: To verify 1-9.99s rule for analytes having multiple reagent lot at instrument level', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.Analyte6).then(function (Analyte6) {
    expect(Analyte6).toBe(true);
  });
  setting.clickOnEditThisAnalyteLink().then(function (navigated) {
    expect(navigated).toBe(true);
  });
  westgard.selectRule('1-9.99', 'reject').then(function (selected) {
    expect(selected).toBe(true);
  });
  setting.clickUpdateControlBtn().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiplyL1 = 9.99;
  const addL1 = 0.01;

  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1, addL1).then(function (newData) {
    l1Value = newData[0];
    nav.clickBackArrow().then(function (clickBack) {
      expect(clickBack).toBe(true);
    });
    nav.clickBackArrow().then(function (clickBack) {
      expect(clickBack).toBe(true);
    });
    pointData.clickManuallyMultiEntryEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterMultiPointValue('61', l1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });

    pointData.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.selectReagentLotAtDataEntry(jsonData.SlideGen62).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    multiPoint.verifyEnteredValueWarnedByRule(l1Value, "1-9.99s", 6).then(function (result) {
      expect(result).toBe(true);
    });
  });
});
it('Test case 2: To verify if the rejection is shown for 7T Rule analyte level', function () {
  setting.navigateTO(jsonData.DepartmentName).then(function (dept) {
    expect(dept).toBe(true);
  });
  setting.navigateTO(jsonData.InstrumentName).then(function (inst) {
    expect(inst).toBe(true);
  });
  setting.navigateTO(jsonData.ProductName).then(function (prod) {
    expect(prod).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent31).then(function (analyte1) {
    expect(analyte1).toBe(true);
  });
  pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
    expect(clickedEditLink).toBe(true);
  });
  newSetting.rejectRule('7-T').then(function (selected) {
    expect(selected).toBe(true);
  });
  analyteSettings.clickUpdateButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  setting.navigateTO(jsonData.AnalyteReagent31).then(function (analyte1) {
    expect(analyte1).toBe(true);
  });
  multiplyL1 = 1;
  firstAddL1 = 0.01;
  secondAddL1 = 0.02;
  thirdAddL1 = 0.03;
  fourthAddL1 = 0.04;
  fifthAddL1 = 0.05;
  sixthAddL1 = 0.06;
  seventhAddL1 = 0.07;
  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1,
    firstAddL1).then(function (newData) {
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

    pointData.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.selectReagentLotAtDataEntry(jsonData.SlideGen1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
      });
      newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent21).then(function (analyte) {
        expect(analyte).toBe(true);
      });
      newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent31).then(function (analyte) {
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
      analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1,
        firstAddL1).then(function (newData) {
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
          newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent21).then(function (analyte) {
            expect(analyte).toBe(true);
          });
          newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent31).then(function (analyte) {
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
          analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1,
            firstAddL1).then(function (newData) {
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
              newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent21).then(function (analyte) {
                expect(analyte).toBe(true);
              });
              newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent31).then(function (analyte) {
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
              analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1,
                firstAddL1).then(function (newData) {
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
                  newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent21).then(function (analyte) {
                    expect(analyte).toBe(true);
                  });
                  newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent31).then(function (analyte) {
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
                  analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1,
                    firstAddL1).then(function (newData) {
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
                      newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent21).then(function (analyte) {
                        expect(analyte).toBe(true);
                      });
                      newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent31).then(function (analyte) {
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
                      analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1,
                        firstAddL1).then(function (newData) {
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
                          newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent21).then(function (analyte) {
                            expect(analyte).toBe(true);
                          });
                          newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent31).then(function (analyte) {
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
                          analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValuesL1(multiplyL1,
                            firstAddL1).then(function (newData) {
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

                              pointData.clickShowOptions().then(function (clicked) {
                                expect(clicked).toBe(true);
                              });
                              pointData.selectReagentLotAtDataEntry(jsonData.SlideGen1).then(function (clicked) {
                                expect(clicked).toBe(true);
                              });
                              pointData.clickSubmitButton().then(function (submitClicked) {
                                expect(submitClicked).toBe(true);
                              });
                              newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent21).then(function (analyte) {
                                expect(analyte).toBe(true);
                              });
                              newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent31).then(function (analyte) {
                                expect(analyte).toBe(true);
                              });
                              pointData.verifyEnteredPointValueLevel1(l1Value).then(function (valuesVerified) {
                                expect(valuesVerified).toBe(true);
                              });
                              analyteSettings.isRejectionDisplayed(l1Value).then(function (displayed) {
                                expect(displayed).toBe(true);
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
