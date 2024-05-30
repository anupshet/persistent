/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { NewLabDepartment } from '../page-objects/new-lab-department-e2e.po';
import { AddControl } from '../page-objects/new-labsetup-add_Control-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { SingleSummary } from '../page-objects/single-summary.po';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';


const fs = require('fs');
let jsonData;


const library=new BrowserLibrary();
library.parseJson('./JSON_data/Settings-spec3.json').then(function(data) {
  jsonData = data;
})

describe('Test Suite: Settings', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const deptSetup = new NewLabDepartment();
  const labsetup = new NewLabSetup();
  const control = new AddControl();
  const analyte = new AddAnalyte();
  const pointData = new PointDataEntry();
  const analyteSettings = new AnalyteSettings();
  const singleSummary = new SingleSummary();
  const westgard = new WestgardRule();
  const multiPoint = new MultiPointDataEntryInstrument();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      browser.sleep(10000);
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });
  //  Dependencies (Until lab setup for this suite is automated)
  //
  //  Delete Automation 2 Dept if available
  //  Add Automation > Architect c4000 > Assyed Chemistry > Ammonia
  //  Keep Summary data on for Ammonia
  //  Delete data from Automation > Architect c4000 > Assyed Chemistry >Iron
  //  Remove SPC rules from Automation > Architect c4000 > Assyed Chemistry >Iron
  //  Remove Automation 1 >Advia 1200 > Pediatric > Calcium
  //  Add Automation 1 >Advia 1200 > Anemia
  //  Add at least one data in Automation 1 >Advia 1200 > Pediatric >Glucose

  // TC 132, 133 & 138 clubbed here
  it('Test Case 132: To verify Summary Data Entry Toggle on Edit Analyte Page', function () {
    library.logStep('Test Case 132: To verify Summary Data Entry Toggle on Edit Analyte Page');
    library.logStep('Test Case 133: To Verify that On Disabling Summary Data Toggle will populate the SPC Rules section to RHS of Edit Analyte Page');
    library.logStep('Test Case 138: To verify cancel button functionality.');
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte2).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.isSummaryEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    // analyteSettings.clickSummaryToggleButton().then(function (clickedToggle) {
    //   expect(clickedToggle).toBe(true);
    // });
    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    analyteSettings.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(false);
    });
  });


  // Iron
  // TC 140, 134, 142, 143, 145, 155, 156  clubbed here
  it('Test Case 140: Verify Reagent manufacturer dropdown on edit analyte Page', function () {
    library.logStep('Test Case 134: To Verify that On Enabling  Summary Data Toggle will not display the SPC Rules section on Edit Analyte Page');
    library.logStep('Test Case 140: Verify Reagent manufacturer dropdown on edit analyte Page');
    library.logStep('Test Case 142: Verify Calibrator manufacturer dropdown on edit analyte Page');
    library.logStep('Test Case 143: Verify Calibrator dropdown on edit analyte Page');
    library.logStep('Test Case 145: Verify method value on edit analyte Page');
    library.logStep('Test Case 155: Verify Reagent Lot Dropdown on edit analyte Page is disabled');
    library.logStep('Test Case 156: Verify Calibrator Lot Dropdown on edit analyte Page is disabled');
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte1).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcComponent) {
      expect(spcComponent).toBe(true);
    });
    analyteSettings.verifyReagentManufacturerDisabled().then(function (disabledDD) {
      expect(disabledDD).toBe(true);
    });
    analyteSettings.verifyCalibratorManufacturerDisabled().then(function (disabledDD) {
      expect(disabledDD).toBe(true);
    });
    analyteSettings.verifyCalibratorDisabled().then(function (disabledDD) {
      expect(disabledDD).toBe(true);
    });
    analyteSettings.verifyMethodDisabled().then(function (disabledDD) {
      expect(disabledDD).toBe(true);
    });
    analyteSettings.verifyReagentLotDisabled().then(function (disabledDD) {
      expect(disabledDD).toBe(true);
    });
    analyteSettings.verifyCalibratorLotDisabled().then(function (disabledDD) {
      expect(disabledDD).toBe(true);
    });
  });


  //  Iron
  // TC 141 & 144 clubbed here
  it('Test Case 141: Verify Reagent dropdown on edit analyte Page', function () {
    library.logStep('Test Case 141: Verify Reagent dropdown on edit analyte Page');
    library.logStep('Test Case 144: Verify Unit of measure dropdown on edit analyte Page');
    // let reagValue: any;
    let unitValue: any;
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte1).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    // analyteSettings.verifySortingSelectAnotherReagent().then(function (selectedValue) {
    //   console.log('selectedValue is: ' + selectedValue);
    //   reagValue = selectedValue;
    //   console.log('Reagent Value in scope: ' + reagValue);
    //   expect(selectedValue).toBeDefined();  // .not.toBeNull();

    analyteSettings.verifySortingSelectAnotherUnit().then(function (selectedValue1) {
      unitValue = selectedValue1;
      expect(unitValue).not.toBeNull();

      analyteSettings.clickUpdateButton().then(function (updateClicked) {
        expect(updateClicked).toBe(true);
      });
      setting.goToHomePage().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (dept) {
        expect(dept).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (inst) {
        expect(inst).toBe(true);
      });
      setting.navigateTO(jsonData.Control1).then(function (prod) {
        expect(prod).toBe(true);
      });
      setting.navigateTO(jsonData.C1Analyte1).then(function (result) {
        expect(result).toBe(true);
      });

      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      // console.log('Value out of scope: ' + reagValue);
      // analyteSettings.verifySelectedReagent(reagValue).then(function (verified) {
      //   expect(verified).toBe(true);
      // });
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });
      // setting.selectFirstReagent().then(function (verified) {
      //   expect(verified).toBe(true);
      // });
      // analyteSettings.clickUpdateButton().then(function (updateClicked) {
      //   expect(updateClicked).toBe(true);
      // });
    // });
  });
  });

  //  TC 146 & 148 here
  it('Test Case 146: Verify Decimal places dropdown of edit Analyte window', function () {
    library.logStep('Test Case 146: Verify Decimal places dropdown of edit Analyte window');
    library.logStep('Test Case 148: To verify levels in use of edit analyte window');
    const oldDec = '2';
    const newDec = '3';
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte1).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.uncheckLevel2Checkbox().then(function (deselected) {
      expect(deselected).toBe(true);
    });
    setting.selectDecimalPlaces(newDec).then(function (selectedValue) {
      expect(selectedValue).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (enterDataClicked) {
      expect(enterDataClicked).toBe(true);
    });
    analyteSettings.verifyLevel2NotDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.goToHomePage().then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte1).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.verifySelectedDecimal(newDec).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.selectDecimalPlaces(oldDec).then(function (selectedValue) {
      expect(selectedValue).toBe(true);
    });
    analyteSettings.checkLevel2Checkbox().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
    });
  });


  //  Ammonia
  it('Test Case 149: Verify Summary data toggle button of edit analyte window', function () {
    library.logStep('Test Case 149: Verify Summary data toggle button of edit analyte window');
    library.logStep('Test Case 137: Verify that SPC Rules Selected for one Analyte will not affect other Sibling Analyte in the Same Control');
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte2).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    // analyteSettings.clickSummaryToggleButton().then(function (clickedToggle) {
    //   expect(clickedToggle).toBe(true);
    // });
    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
    });
    //  pointData.verifyPointEntryPage(jsonData.C1Analyte2).then(function (pageVerified) {
    //    expect(pageVerified).toBe(false);
    //  });
    setting.goToHomePage().then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte2).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickManuallyEnterData().then(function (enterDataClicked) {
      expect(enterDataClicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    // analyteSettings.clickSummaryToggleButton().then(function (clickedToggle) {
    //   expect(clickedToggle).toBe(true);
    // });
    setting.disablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
    });
  });

  it('Test Case 157: Verify that after updating analyte detail on Edit analyte page will also be updated on Analyte information Popup',
   function () {
    library.logStep('Test Case 157: Verify that after updating analyte detail on Edit analyte page will also be updated on Analyte information Popup');
    let unitValue: any;
    setting.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (prod) {
      expect(prod).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte1).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.verifySortingSelectAnotherUnit().then(function (selectedValue1) {
      unitValue = selectedValue1;
      console.log('Unitvalue: ' + unitValue);
      expect(unitValue).not.toBeNull();
      analyteSettings.clickUpdateButton().then(function (updateClicked) {
        expect(updateClicked).toBe(true);
      });
      setting.goToHomePage().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (dept) {
        expect(dept).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (inst) {
        expect(inst).toBe(true);
      });
      setting.navigateTO(jsonData.Control1).then(function (prod) {
        expect(prod).toBe(true);
      });
      setting.navigateTO(jsonData.C1Analyte1).then(function (result) {
        expect(result).toBe(true);
      });
      // Add method to verify info icon
      setting.clickOnInfoIcon().then(function (result) {
        expect(result).toBe(true);
      });
      setting.verifyUnitDisplayedOnInfoTooltip(unitValue).then(function (result) {
        expect(result).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });
     });
    });

});
