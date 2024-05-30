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
library.parseJson('./JSON_data/RestartFloat_DiffReagent.json').then(function(data) {
  jsonData = data;
});

describe('PBI 193925: Change in Float Evaluation and SD logic', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const newLabSetup = new NewLabSetup();
  const westgard = new WestgardRule();
  const analyteSettings = new AnalyteSettings();
  const pointData = new PointDataEntry();
  const newSetting = new InheritedSettings();
  const setting = new Settings();

  let multiplyL1, multiplyL2, firstAddL1, firstAddL2, secondAddL1,l2Value,
    thirdAddL1, fourthAddL1, fifthAddL1,secondAddL2, thirdAddL2, fourthAddL2, fifthAddL2, sixthAddL1, seventhAddL1, eighthAddL1, ninethAddL1, tenthAddL1, eleventhAddL1, twelfthAddL1, l1Value;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: Verify for same reagent lot(slide gen) Z score is getting calculated after selected float point values once restart float is enabled', function () {
    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });

    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterPointValues(12, 13).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });

    pointData.enterPointValues(12.01,13.01).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    pointData.clickManuallyEnterDataWhenEdit().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    multiplyL1 = 1;
    multiplyL2 = 1;
    firstAddL1 = 0.1;
    secondAddL1 = 0.2;
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
      pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.Analyte2).then(function (reagent1) {
        expect(reagent1).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.Analyte1).then(function (reagent2) {
        expect(reagent2).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      newLabSetup.waitForSummaryStatistics().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      pointData.ClickOnEditDialogueButtonOnTestLevel(l1Value).then(function (result) {
        expect(result).toBe(true);
      });

      pointData.clickonrestartFloatIcon().then(function (result) {
        expect(result).toBe(true);
      });
      pointData.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
        expect(submitUpdatesClicked).toBe(true);
      });
      analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
        expect(ZscoreDisplayed1).toBe(true);
      });
      analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
        expect(ZscoreDisplayed1).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
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
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (reagent1) {
          expect(reagent1).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte1).then(function (reagent2) {
          expect(reagent2).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        newLabSetup.waitForSummaryStatistics().then(function (displayed) {
          expect(displayed).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
          expect(ZscoreDisplayed1).toBe(false);
        });
        analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
          expect(ZscoreDisplayed1).toBe(false);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });

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
          pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
          });
          newLabSetup.navigateTO(jsonData.Analyte2).then(function (reagent1) {
            expect(reagent1).toBe(true);
          });
          newLabSetup.navigateTO(jsonData.Analyte1).then(function (reagent2) {
            expect(reagent2).toBe(true);
          });
          pointData.clickShowData().then(function (showDataClicked) {
            expect(showDataClicked).toBe(true);
          });
          newLabSetup.waitForSummaryStatistics().then(function (displayed) {
            expect(displayed).toBe(true);
          });
          pointData.clickShowData().then(function (showDataClicked) {
            expect(showDataClicked).toBe(true);
          });
          pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
            expect(valuesVerified).toBe(true);
          });
          analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
            expect(ZscoreDisplayed1).toBe(true);
          });
          analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
            expect(ZscoreDisplayed1).toBe(true);
          });

        });
      });
    });
  });

  it('Test case 2: Verify Z score is getting calculated irrespective of reagent lot after selected float point values once restart float is enabled.', function () {
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte3).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });

    multiplyL1 = 1;
    multiplyL2 = 1;
    firstAddL1 = 0.1;
    secondAddL1 = 0.2;
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
      pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
      });
      setting.navigateTO(jsonData.Analyte2).then(function (reagent1) {
        expect(reagent1).toBe(true);
      });
      setting.navigateTO(jsonData.Analyte3).then(function (reagent2) {
        expect(reagent2).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      newLabSetup.waitForSummaryStatistics().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      pointData.ClickOnEditDialogueButtonOnTestLevel(l1Value).then(function (result) {
        expect(result).toBe(true);
      });
      pointData.clickonrestartFloatIcon().then(function (result) {
        expect(result).toBe(true);
      });
      pointData.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
        expect(submitUpdatesClicked).toBe(true);
      });
      analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
        expect(ZscoreDisplayed1).toBe(true);
      });
      analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
        expect(ZscoreDisplayed1).toBe(true);
      });
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
        pointData.selectReagentLotAtDataEntry(jsonData.SlideGen1).then(function (clicked) {
          expect(clicked).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte2).then(function (reagent1) {
          expect(reagent1).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte3).then(function (reagent2) {
          expect(reagent2).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        newLabSetup.waitForSummaryStatistics().then(function (displayed) {
          expect(displayed).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
          expect(ZscoreDisplayed1).toBe(false);
        });
        analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
          expect(ZscoreDisplayed1).toBe(false);
        });

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
          pointData.selectReagentLotAtDataEntry(jsonData.SlideGen2).then(function (clicked) {
            expect(clicked).toBe(true);
          });
          pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
          });
          setting.navigateTO(jsonData.Analyte2).then(function (reagent1) {
            expect(reagent1).toBe(true);
          });
          setting.navigateTO(jsonData.Analyte3).then(function (reagent2) {
            expect(reagent2).toBe(true);
          });
          pointData.clickShowData().then(function (showDataClicked) {
            expect(showDataClicked).toBe(true);
          });
          newLabSetup.waitForSummaryStatistics().then(function (displayed) {
            expect(displayed).toBe(true);
          });
          pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
            expect(valuesVerified).toBe(true);
          });
          analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
            expect(ZscoreDisplayed1).toBe(false);
          });
          analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
            expect(ZscoreDisplayed1).toBe(false);
          });

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
            pointData.selectReagentLotAtDataEntry(jsonData.SlideGen3).then(function (selected) {
              expect(selected).toBe(true);
            });
            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
              expect(submitClicked).toBe(true);
            });
            setting.navigateTO(jsonData.Analyte2).then(function (reagent1) {
              expect(reagent1).toBe(true);
            });
            setting.navigateTO(jsonData.Analyte3).then(function (reagent2) {
              expect(reagent2).toBe(true);
            });
            pointData.clickShowData().then(function (showDataClicked) {
              expect(showDataClicked).toBe(true);
            });
            newLabSetup.waitForSummaryStatistics().then(function (displayed) {
              expect(displayed).toBe(true);
            });
            pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
              expect(valuesVerified).toBe(true);
            });
            analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
              expect(ZscoreDisplayed1).toBe(true);
            });
            analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
              expect(ZscoreDisplayed1).toBe(true);
            });
          });
        });
      });
    });
  });


  it('Test case 3: Verify restart float is not considering the rejected point in float point values for calculating Z score irrespective of reagent lot. @P1', function () {
    newLabSetup.navigateTODept(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte2).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    westgard.selectRule('1-0.99', 'reject').then(function (selected) {
      expect(selected).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    // pointData.clickManuallyEnterData().then(function (linkClicked) {
    //   expect(linkClicked).toBe(true);
    // });
    // pointData.enterPointValues(12, 13).then(function (dataEntered) {
    //   expect(dataEntered).toBe(true);
    // });
    // pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
    //   expect(submitClicked).toBe(true);
    // });
    // pointData.clickManuallyEnterDataWhenEdit().then(function (linkClicked) {
    //   expect(linkClicked).toBe(true);
    // });
    // pointData.clickManuallyEnterData().then(function (linkClicked) {
    //   expect(linkClicked).toBe(true);
    // });
    // pointData.enterPointValues(12.01,13.01).then(function (dataEntered) {
    //   expect(dataEntered).toBe(true);
    // });
    // pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
    //   expect(submitClicked).toBe(true);
    // });
    // pointData.clickManuallyEnterDataWhenEdit().then(function (linkClicked) {
    //   expect(linkClicked).toBe(true);
    // });

    multiplyL1 = 1;
    multiplyL2 = 1;
    firstAddL1 = 3.1;
    secondAddL1 = 3.2;
    thirdAddL1 = 3.3;
    fourthAddL1 = 3.4;
    fifthAddL1 = 3.5;
    firstAddL2 = 4.1;
    secondAddL2 = 4.2;
    thirdAddL2 = 4.3;
    fourthAddL2 = 4.4;
    fifthAddL2 = 4.5;
    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, firstAddL1, firstAddL2).then(function (newData) {
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
      setting.navigateTO(jsonData.Analyte1).then(function (reagent1) {
        expect(reagent1).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.Analyte2).then(function (reagent2) {
        expect(reagent2).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      newLabSetup.waitForSummaryStatistics().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
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
      pointData.ClickOnEditDialogueButtonOnTestLevel(l1Value).then(function (result) {
        expect(result).toBe(true);
      });
      pointData.clickonrestartFloatIcon().then(function (result) {
        expect(result).toBe(true);
      });
      pointData.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
        expect(submitUpdatesClicked).toBe(true);
      });
      analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
        expect(ZscoreDisplayed1).toBe(true);
      });
      analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
        expect(ZscoreDisplayed1).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, secondAddL1, secondAddL2).then(function (newData) {
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
        setting.navigateTO(jsonData.Analyte1).then(function (reagent1) {
          expect(reagent1).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.Analyte2).then(function (reagent2) {
          expect(reagent2).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        newLabSetup.waitForSummaryStatistics().then(function (displayed) {
          expect(displayed).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
          expect(ZscoreDisplayed1).toBe(false);
        });
        analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
          expect(ZscoreDisplayed1).toBe(false);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });

        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, thirdAddL1,thirdAddL2).then(function (newData) {
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
          setting.navigateTO(jsonData.Analyte1).then(function (reagent1) {
            expect(reagent1).toBe(true);
          });
          newLabSetup.navigateTO(jsonData.Analyte2).then(function (reagent2) {
            expect(reagent2).toBe(true);
          });
          pointData.clickShowData().then(function (showDataClicked) {
            expect(showDataClicked).toBe(true);
          });
          newLabSetup.waitForSummaryStatistics().then(function (displayed) {
            expect(displayed).toBe(true);
          });
          pointData.clickShowData().then(function (showDataClicked) {
            expect(showDataClicked).toBe(true);
          });
          pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
            expect(valuesVerified).toBe(true);
          });
          analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
            expect(ZscoreDisplayed1).toBe(false);
          });
          analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
            expect(ZscoreDisplayed1).toBe(false);
          });
          pointData.clickShowData().then(function (showDataClicked) {
            expect(showDataClicked).toBe(true);
          });

          analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, fourthAddL1, fourthAddL2).then(function (newData) {
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
            setting.navigateTO(jsonData.Analyte1).then(function (reagent1) {
              expect(reagent1).toBe(true);
            });
            newLabSetup.navigateTO(jsonData.Analyte2).then(function (reagent2) {
              expect(reagent2).toBe(true);
            });
            pointData.clickShowData().then(function (showDataClicked) {
              expect(showDataClicked).toBe(true);
            });
            newLabSetup.waitForSummaryStatistics().then(function (displayed) {
              expect(displayed).toBe(true);
            });
            pointData.clickShowData().then(function (showDataClicked) {
              expect(showDataClicked).toBe(true);
            });
            pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
              expect(valuesVerified).toBe(true);
            });
            analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
              expect(ZscoreDisplayed1).toBe(true);
            });
            analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
              expect(ZscoreDisplayed1).toBe(true);
            });
            pointData.clickShowData().then(function (showDataClicked) {
              expect(showDataClicked).toBe(true);
            });
          });
        });
      });
    });
  });
  it('Test case 4: Verify restart float is considering the warning point in float point values for calculating Z score irrespective of reagent lot.', function () {
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte2).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
   // if above test case run
    // westgard.selectRule('1-0.99', 'disabled').then(function (selected) {
    //   expect(selected).toBe(true);
    // });
    newSetting.setWarnRule('1-').then(function (verified) {
      expect(verified).toBe(true);
    });
    westgard.setValueRange('0.01').then(function (valueRange) {
      expect(valueRange).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiplyL1 = 1;
    multiplyL2 = 1;
    firstAddL1 = 3.1;
    secondAddL1 = 3.2;
    thirdAddL1 = 3.3;
    fourthAddL1 = 3.4;
    fifthAddL1 = 3.5;
    firstAddL2 = 4.1;
    secondAddL2 = 4.2;
    thirdAddL2 = 4.3;
    fourthAddL2 = 4.4;
    fifthAddL2 = 4.5;

    analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, firstAddL1, firstAddL2).then(function (newData) {
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
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
      });
      setting.navigateTO(jsonData.Analyte1).then(function (reagent1) {
        expect(reagent1).toBe(true);
      });
      setting.navigateTO(jsonData.Analyte2).then(function (reagent2) {
        expect(reagent2).toBe(true);
      });
      pointData.clickShowData().then(function (showDataClicked) {
        expect(showDataClicked).toBe(true);
      });
      newLabSetup.waitForSummaryStatistics().then(function (displayed) {
        expect(displayed).toBe(true);
      });

      pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l1Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      analyteSettings.isWarningDisplayed(l2Value).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      pointData.ClickOnEditDialogueButtonOnTestLevel(l1Value).then(function (result) {
        expect(result).toBe(true);
      });
      pointData.clickonrestartFloatIcon().then(function (result) {
        expect(result).toBe(true);
      });
      pointData.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
        expect(submitUpdatesClicked).toBe(true);
      });
      analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
        expect(ZscoreDisplayed1).toBe(true);
      });
      analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
        expect(ZscoreDisplayed1).toBe(true);
      });

      analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, secondAddL1, secondAddL2).then(function (newData) {
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
        pointData.selectReagentLotAtDataEntry(jsonData.SlideGen21).then(function (clicked) {
          expect(clicked).toBe(true);
        });
        pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
          expect(submitClicked).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte1).then(function (reagent1) {
          expect(reagent1).toBe(true);
        });
        setting.navigateTO(jsonData.Analyte2).then(function (reagent2) {
          expect(reagent2).toBe(true);
        });
        pointData.clickShowData().then(function (showDataClicked) {
          expect(showDataClicked).toBe(true);
        });
        newLabSetup.waitForSummaryStatistics().then(function (displayed) {
          expect(displayed).toBe(true);
         });
        pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
          expect(valuesVerified).toBe(true);
        });
        analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
          expect(ZscoreDisplayed1).toBe(false);
        });
        analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
          expect(ZscoreDisplayed1).toBe(false);
        });

        analyteSettings.getCalculatedValuesForBothLevelsFromCumulativeValues(multiplyL1, multiplyL2, thirdAddL1,thirdAddL2).then(function (newData) {
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
            pointData.selectReagentLotAtDataEntry(jsonData.SlideGen22).then(function (clicked) {
              expect(clicked).toBe(true);
            });
            pointData.clickOnSendToPeerGrpButton().then(function (submitClicked) {
              expect(submitClicked).toBe(true);
            });
            setting.navigateTO(jsonData.Analyte1).then(function (reagent1) {
              expect(reagent1).toBe(true);
            });
            setting.navigateTO(jsonData.Analyte2).then(function (reagent2) {
              expect(reagent2).toBe(true);
            });
            pointData.clickShowData().then(function (showDataClicked) {
              expect(showDataClicked).toBe(true);
            });
            newLabSetup.waitForSummaryStatistics().then(function (displayed) {
              expect(displayed).toBe(true);
            });
            pointData.verifyEnteredPointValues(l1Value,l2Value).then(function (valuesVerified) {
              expect(valuesVerified).toBe(true);
            });
            analyteSettings.isZscoreDisplayed(l1Value).then(function (ZscoreDisplayed1) {
              expect(ZscoreDisplayed1).toBe(true);
            });
            analyteSettings.isZscoreDisplayed(l2Value).then(function (ZscoreDisplayed1) {
              expect(ZscoreDisplayed1).toBe(true);
            });
          });
        });
     });
  });
});
