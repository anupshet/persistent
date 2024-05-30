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
library.parseJson('./JSON_data/Settings-spec1.json').then(function(data) {
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

  // Test case 1,3,4,46,47 clubbed here
  it('Test case 1: To verify that after logging in, the administrator is presented with the dashboard and the ability to choose to navigate to the department settings screen', function () {
    library.logStep('Test case 1: To verify that after logging in, the administrator is presented with the dashboard and the ability to choose to navigate to the department settings screen');
    library.logStep('Test case 3: To verify that the admin user is able to navigate to the Department settings by clicking on Lab name on Dashboard Page');
    library.logStep('Test case 4: To verify that the user is able to see the Department cards on Department Settings page');
    library.logStep('Test case 46: To verify the functionality of "+ ADD A DEPARTMENT" link');
    library.logStep('Test case 47: To verify that after clicking on Lab Name, Settings page should be displayed.');
    setting.isDashboardDisplayed(jsonData.FirstName, jsonData.LabName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickOnAddADepartmentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    deptSetup.addFirstDepartmentName(jsonData.NewDeptName1).then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.selectManagerNameValue().then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.clickAddDepartmentsButton().then(function (added) {
      expect(added).toBe(true);
    });
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifySavedComponent(jsonData.NewDeptName1).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifySavedComponent(jsonData.Department).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeptCardsDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  // Test case 7,8,9,35,48,49,61,66 & 68 clubbed here
  it('Test case 35: To verify that after adding an instrument from department screen, instrument should get added and instrument name should display in left nav', function () {
    library.logStep('Test case 7: To verify that, Each Department card should have Department name, add an instrument link etc.');
    library.logStep('Test case 8: To verify that upon expanding the Department card, the user should be able to update the Department');
    library.logStep('Test case 9: To verify the functionality of "ADD AN INSTRUMENT" link');
    library.logStep('Test case 35: To verify that after adding an instrument from department screen, instrument should get added and instrument name should display in left nav');
    library.logStep('Test case 48: To verify on clicking expander arrow of department, options to edit department should be displayed. ');
    library.logStep('Test case 49: To Verify UI of Edit Department Popup');
    library.logStep('Test case 61: To verify on adding new instrument count value gets incremented');
    library.logStep('Test case 66: To verify after adding new instrument, it should get added in correct department.');
    library.logStep('Test case 68: Verify add new instrument functionality from edit department card.');
    const instrument = new Array();
    instrument.push(jsonData.NewInstManufacturer1);
    instrument.push(jsonData.NewInstModel1);
    let oldCount = 0;
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyDeptCardUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.getInstCount(jsonData.NewDeptName1).then(function (val) {
      oldCount = +val;
      expect(val).not.toBeNull();
    });
    setting.clickOnAddInstLinkForSpecificDept(jsonData.NewDeptName1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyAddInstrumentPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.addInstrument(instrument).then(function (added) {
      expect(added).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewDeptName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifySavedComponent(jsonData.NewInstModel1).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.goToDeptSettings().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.getInstCount(jsonData.NewDeptName1).then(function (val) {
      console.log('Instrument Count Incremented after instrument addition. New count is: ' + val);
      library.logStep('Instrument Count Incremented after instrument addition. New count is: ' + val);
      expect(val).toBe(oldCount + 1);
    });
  });

  // Defect raised for Edge
  // TC 36, 69, 110 clubbed here
  it('Test case 36: To verify that after adding a control from instrument screen, control should get added and control name should display in left nav', function () {
    library.logStep('Test case 36: To verify that after adding a control from instrument screen, control should get added and control name should display in left nav');
    library.logStep('Test case 69: Verify add new control functionality from edit instrument  window.');
    library.logStep('Test case 110: To verify after adding new control, it should get added in correct department.');
    setting.navigateTO(jsonData.NewDeptName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewInstModel1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnAddControlLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    setting.selectControl(jsonData.NewControlName1).then(function (selected) {
      expect(selected).toBe(true);
    });
    setting.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    setting.selectControlLotNumber(jsonData.NewControlLotNumber1).then(function (selected) {
      expect(selected).toBe(true);
    });
    setting.clickAddControlButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.goToDeptSettings().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewDeptName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewInstModel1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifySavedComponent(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  //  Defect raised for IE & Edge
  // TC 37 & 70 clubbed here
  it('Test case 37: To verify that after adding an analyte from control screen,  analyte should get added and analyte name should display in left nav', function () {
    library.logStep('Test case 37: To verify that after adding an analyte from control screen, analyte should get added and analyte name should display in left nav');
    library.logStep('Test case 70: Verify add new analyte functionality from edit control window.');
    library.logStep('Test case 130: To verify after adding new analyte, it should get added in correct control.');
    library.logStep('Test case 154: To verify after adding new analyte, it should get added in correct control.');
    const levels = 2;
    setting.navigateTO(jsonData.NewDeptName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewInstModel1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewControlName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnAddAnalyteLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.selectAnalyteName(jsonData.NewAnalyte1).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectReagent(jsonData.NewAnalyteReagent1).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectCalibrator(jsonData.NewAnalyteCalibrator1).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit(jsonData.NewAnalyteUnit, '1').then(function (unitSelected) {
      expect(unitSelected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (cancelled) {
      expect(cancelled).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    // library.refreshBrowser();
    setting.navigateTO(jsonData.NewDeptName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewInstModel1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewControlName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifySavedComponent(jsonData.NewAnalyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  // TC 59, 53 & 54 clubbed here
  it('Test case 59: Verify update department functionality. ', function () {
    library.logStep('Test case 59: Verify update department functionality. ');
    library.logStep('Test case 53: Verify Manager Name field on edit Departments Page');
    library.logStep('Test case 54: Verify Manager name drop down');
    const newName = jsonData.NewDepTempName1;
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.NewDeptName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.changeDeptName(newName).then(function (added) {
      expect(added).toBe(true);
    });
    setting.changeDeptManager().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateDeptBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(newName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isDeptUpdated(newName).then(function (verified) {
      expect(verified).toBe(true);
    });
    // setting.changeDeptName(jsonData.NewDeptName1).then(function (added) {
    //   expect(added).toBe(true);
    // });
    // setting.clickUpdateDeptBtn().then(function (clicked) {
    //   expect(clicked).toBe(true);
    // });
  });

  // TC 38, 139 & 152 clubbed here
  it('Test case 38: To verify that an analyte which does not have data can be deleted and after deletion the user is navigated to the control level', function () {
    library.logStep('Test case 38: To verify that an analyte which does not have data can be deleted and after deletion the user is navigated to the control level');
    library.logStep('Test Case 139: To verify Delete button functionality.');
    library.logStep('Test Case 152: To verify on clicking delete button, analyte should be deleted.');
    setting.navigateTO(jsonData.NewDepTempName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewInstModel1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewControlName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewAnalyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnDeleteBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyComponentNotDisplayed(jsonData.NewAnalyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  // TC 40, 127 & 128 clubbed here
  it('Test case 40: To verify that a control which does not have analytes configured can be deleted and after deletion the user is navigated to the instrument level', function () {
    library.logStep('Test case 40: To verify that a control which does not have analytes configured can be deleted and after deletion the user is navigated to the instrument level');
    library.logStep('Test case 127: Verify delete confirmation popup UI.');
    library.logStep('Test case 128: To verify on clicking delete button, CONTROL should be deleted.');
    setting.navigateTO(jsonData.NewDepTempName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewInstModel1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewControlName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyDeletePopupUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyComponentNotDisplayed(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  // Clubbed TC 42, 87 & 108
  it('Test case 42: To verify that an instrument which does not have controls configured can be deleted and after deletion the user is navigated to the department level', function () {
    library.logStep('Test case 42: To verify that an instrument which does not have controls configured can be deleted and after deletion the user is navigated to the department level');
    library.logStep('Test case 87: To verify Delete button functionality.');
    library.logStep('Test case 108: To verify on clicking delete button instrument should be deleted.');
    setting.navigateTO(jsonData.NewDepTempName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewInstModel1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnDeleteBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // setting.verifyComponentNotDisplayed(jsonData.NewInstModel1).then(function (verified) {
    //   expect(verified).toBe(true);
    // });
    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.NewDepTempName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyComponentNotDisplayed(jsonData.NewInstModel1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  // clubbed 44, 51, 63, 64, 65, 107, 109, 151,153 here
  it('Test case 63: Verify delete confirmation popup UI.', function () {
    library.logStep('Test case 44: To verify that a department which does not have instruments configured can be deleted and after deletion the user is navigated to the lab location level');
    library.logStep('Test case 51: To verify that a department which does not have instruments configured can be deleted and after deletion the user is navigated to the lab location level');
    library.logStep('Test case 63: Verify delete confirmation popup UI.');
    library.logStep('Test case 64: To verify on clicking delete button, department should be deleted.');
    library.logStep
    ('Test case 65: To verify on clicking cancel button of delete confirmation popup, delete confirmation popup disappears.');
    library.logStep('Test case 107: Verify delete confirmation popup UI.');
    library.logStep
    ('Test case 109: To verify on clicking cancel button of delete confirmation popup, delete confirmation popup disappears.');
    library.logStep
    ('Test case 129: To verify on clicking cancel button of delete confirmation popup, delete confirmation popup disappears.');
    library.logStep('Test Case 151: Verify delete confirmation popup UI.');
    library.logStep('Test Case 153:To verify on clicking cancel button of delete confirmation popup, delete confirmation popup disappears');
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.NewDepTempName1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyDeletePopupUI().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickCancelOnDeleteConfirmation().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnDeleteBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyComponentNotDisplayed(jsonData.NewDepTempName1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
