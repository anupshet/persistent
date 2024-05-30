/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
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

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Settings.json').then(function (data) {
  jsonData = data;
});

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

  // P1
  it('Test case 2: To verify that after logging in, a user with User Roles permission is presented a blank content area. @P1', function () {
    library.logStep('Test case 2: To verify that after logging in, a user with User Roles permission is presented a blank content area.');
    library.logStep('Test case 10: To verify that after clicking on Department, list of instruments should be displayed on the left navigation.');
    library.logStep('Test case 11: To verify that upon clicking on an instrument, instrument data table page is displayed along with the link "Edit This Instrument" for an admin user');
    library.logStep('Test case 12: Verify that upon clicking on an instrument, instrument data table page the link to "Edit This Instrument" will not be displayed for user role');
    library.logStep('Test case 13: To verify that upon clicking on an instrument, instrument data table page is displayed, for a user with User Role permission');
    library.logStep('Test case 20: Verify that upon clicking on an Control, Control data table page the link to "Edit This Control" will not be displayed for user role');
    library.logStep('Test case 21: To verify that Upon clicking on a control, control data table page is displayed, for a user with User Role permission');
    library.logStep('Test case 28: Verify that upon clicking on an Analyte, Analyte data table page the link to "Edit This Analyte" will not be displayed for user role');
    library.logStep('Test case 29: To verify that upon clicking on an analyte, analyte data table page is displayed, for a user with User Role permission');
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameUser,
      jsonData.PasswordUser, jsonData.FirstNameUser).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    setting.isDashboardDisplayed(jsonData.FirstName, jsonData.LabName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(false);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isInstrumentPageDisplayedToUser(jsonData.Instrument2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(false);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isControlPageDisplayedToUser(jsonData.Control2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (navigated) {
      expect(navigated).toBe(false);
    });
    setting.navigateTO(jsonData.C2Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isAnalytePageDisplayedToUser(jsonData.C2Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.verifyEditThisAnalyteLinkIsPresent().then(function (navigated) {
      expect(navigated).toBe(false);
    });
  });

  // TC 19, 22, 104, 111, 118, 120 & 121 covered in below TC
  it('Test case 22: To verify that upon clicking on link "Edit This Control" the admin user should be able to update the Control',
    function () {
      library.logStep('Test case 22: To verify that upon clicking on link "Edit This Control" the admin user should be able to update the Control');
      library.logStep('Test case 19: To verify that Upon clicking on a control, control data table page is displayed, along with link "Edit This Control" for an admin user');
      library.logStep('Test case 104: To verify on clicking  return to data link of edit control functionality. ');
      library.logStep('Test case 111: To Verify UI of Edit Control Popup');
      library.logStep('Test case 118: To verify cancel button functionality');
      library.logStep('Test case 120: Verify Bio-Rad control dropdown on edit Control Page');
      library.logStep('Test case 121: Verify  Lot dropdown on edit Control Page');
      setting.navigateTO(jsonData.Department).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.navigateTO(jsonData.Control2).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.clickOnEditThisControlLink().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.isEditControlPageDisplayed(jsonData.Control2).then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.verifyEditControlPage(jsonData.Control2).then(function (verified) {
        expect(verified).toBe(true);
      });
      control.enterDataControlName(jsonData.NewInstCustomName1).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      control.clickOnCancel().then(function (selected) {
        expect(selected).toBe(true);
      });
      setting.verifyCancelonEditControl().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickReturnToDataLink().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.isControlPageDisplayed(jsonData.Control2).then(function (navigated) {
        expect(navigated).toBe(true);
      });
    });

  // TC 27, 30, 105, 131, 150 clubbed  add glucose analyte
  it('Test case 27: To verify that upon clicking on an analyte, analyte data table page is displayed, along with link "Edit This Analyte" for an admin user', function () {
    library.logStep('Test case 27: To verify that upon clicking on an analyte, analyte data table page is displayed, along with link "Edit This Analyte" for an admin user');
    library.logStep('Test case 105: To verify on clicking  return to data link of edit Analyte functionality. ');
    library.logStep('Test case 30: To verify that upon clicking on link "Edit This Analyte" the user should be able to update the Analyte');
    library.logStep('Test Case 131: To Verify UI of Edit Analyte Popup');
    library.logStep('Test Case 150: Verify update analyte functionality. ');
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.C2Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isAnalytePageDisplayed(jsonData.C2Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isEditAnalytePageDisplayed(jsonData.C2Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    analyteSettings.verifyAnalyteSettingsPage(jsonData.C2Analyte1).then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isAnalytePageDisplayed(jsonData.C2Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });

  // Test case 7,8,9,35,48,49,61,66 & 68 clubbed here Automation 2 delete instrument
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

  // Defect raised for Edge  44360 lot added
  // TC 36, 69, 110 clubbed here
  it('Test case 36: To verify that after adding a control from instrument screen, control should get added and control name should display in left nav', function () {
    library.logStep('Test case 36: To verify that after adding a control from instrument screen, control should get added and control name should display in left nav');
    library.logStep('Test case 69: Verify add new control functionality from edit instrument  window.');
    library.logStep('Test case 110: To verify after adding new control, it should get added in correct department.');
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
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
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifySavedComponent(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  //  Defect raised for IE & Edge
  // TC 37 & 70 clubbed here  automation2 calcium craete
  it('Test case 37: To verify that after adding an analyte from control screen,  analyte should get added and analyte name should display in left nav', function () {
    library.logStep('Test case 37: To verify that after adding an analyte from control screen, analyte should get added and analyte name should display in left nav');
    library.logStep('Test case 70: Verify add new analyte functionality from edit control window.');
    library.logStep('Test case 130: To verify after adding new analyte, it should get added in correct control.');
    library.logStep('Test case 154: To verify after adding new analyte, it should get added in correct control.');
    const levels = 2;
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigated) {
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
    analyte.selectUnit(jsonData.NewAnalyteUnit, '1').then(function (unitSelected) {
      expect(unitSelected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (cancelled) {
      expect(cancelled).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifySavedComponent(jsonData.NewAnalyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 39: To verify that Analyte having data can not be deleted', function () {
    library.logStep('Test case 39: To verify that Analyte having data can not be deleted');
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.C2Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isDataSaved().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconNotDisplayed().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 41: To verify that a control which have analytes configured can not be deleted', function () {
    library.logStep('Test case 41: To verify that a control which have analytes configured can not be deleted');
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isDataSaved().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconNotDisplayed().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  // TC 45 clubbed here
  it('Test case 50: To verify cancel button functionality.', function () {
    library.logStep('Test case 50: To verify cancel button functionality.');
    library.logStep('Test case 45: To verify that a department which have instruments configured can not be deleted');
    const newName = jsonData.NewDepTempName1;
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyInstAvailableInDept(jsonData.Department).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconNotDisplayed().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.changeDeptName(newName).then(function (added) {
      expect(added).toBe(true);
    });
    setting.changeDeptManager().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickCancelDeptCard().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyDeptCardDisplayedSavedVal(jsonData.Department).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  // P1
  // TC 59, 53 & 54 clubbed here
  it('Test case 59: Verify update department functionality. @P1', function () {
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
  });

  // TC 14, 43, 71, 88, 89, 90, 103 clubbed here
  it('Test case 71: To Verify UI of Edit Instrument Page', function () {
    library.logStep('Test case 14: To verify that upon clicking on link "Edit This Instrument" the user should be able to update the Instrument.');
    library.logStep('Test case 43: To verify that an instrument which have controls configured can not be deleted');
    library.logStep('Test case 71: To Verify UI of Edit Instrument Page');
    library.logStep('Test case 88: To verify cancel button functionality on edit Instrument Page');
    library.logStep('Test case 89: Verify instrument manufacturer dropdown on edit Instrument  Page');
    library.logStep('Test case 90: Verify instrument model dropdown on edit Instrument  Page');
    library.logStep('Test case 103: To verify on clicking  return to data link of edit instrument functionality. ');
    const newCustName = jsonData.NewInstCustomName1;
    const newSerialNum = jsonData.NewInstSerialNum1;
    setting.navigateTO(jsonData.Department).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.isEditInstrumentPageDisplayed(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditInstrumentUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconNotDisplayed().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyManufacturerFieldDisabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyModelFieldDisabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.changeCustomNameInstrument(newCustName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.changeSerialNumInstrument(newSerialNum).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickCancelDeptCard().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isInstrumentPageDisplayed(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });

  // Test case 91, 92, 93, 95, 96, 97 are clubbed here
  it('Test case 91: Verify Custom Name field on edit Instrument Page', function () {
    library.logStep('Test case 91: Verify Custom Name field on edit Instrument Page');
    library.logStep('Test case 92: Verify that user should not be able to add more than 16 characters in Custom Name Field field on Edit Instrument Page');
    library.logStep('Test case 93: Verify that user should not be able to add Numbers and special characters in Custom Name field on Edit Instrument Page');
    library.logStep('Test case 95: Verify Serial Number field on edit Instrument Page');
    library.logStep('Test case 96: Verify that user should not be able to add more than 50 characters in Serial Number Field field on Edit Instrument Page');
    library.logStep('Test case 97: Verify that user can be able to add Numbers and  characters in Serial Number field on Edit Instrument Page');
    setting.navigateTO(jsonData.Department).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.verifyCustomNameValidation(jsonData.SerialNoMaxCharacter, jsonData.SerialNoSpecialCharacter).then(function (entered) {
      expect(entered).toBe(true);
    });
    labsetup.verifySerialNoValidation(jsonData.SerialNoMaxCharacter, jsonData.SerialNoSpecialCharacter).then(function (entered) {
      expect(entered).toBe(true);
    });
    setting.clickCancelDeptCard().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  // P1
  // Could not execute - Unable to change the custom name of instrument once saved - Bug id 165572
  it('Test case 102: Verify update instrument functionality. @P1', function () {
    library.logStep('Test case 102: Verify update instrument functionality. ');
    const newCustName = jsonData.NewInstCustomName1;
    const newSerialNum = jsonData.NewInstSerialNum1;
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.changeCustomNameInstrument(newCustName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.changeSerialNumInstrument(newSerialNum).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateInstrumentBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifySavedComponent(newCustName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(newCustName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.changeCustomNameInstrument(jsonData.Instrument).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.changeSerialNumInstrument(newSerialNum).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateInstrumentBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  // TC 38, 139 & 152 clubbed here
  it('Test case 38: To verify that an analyte which does not have data can be deleted and after deletion the user is navigated to the control level', function () {
    library.logStep('Test case 38: To verify that an analyte which does not have data can be deleted and after deletion the user is navigated to the control level');
    library.logStep('Test Case 139: To verify Delete button functionality.');
    library.logStep('Test Case 152: To verify on clicking delete button, analyte should be deleted.');
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigated) {
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

  // TC 40, 127 & 128 clubbed here--------2nd pediatric select
  it('Test case 40: To verify that a control which does not have analytes configured can be deleted and after deletion the user is navigated to the instrument level', function () {
    library.logStep('Test case 40: To verify that a control which does not have analytes configured can be deleted and after deletion the user is navigated to the instrument level');
    library.logStep('Test case 127: Verify delete confirmation popup UI.');
    library.logStep('Test case 128: To verify on clicking delete button, CONTROL should be deleted.');
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.NewControlName2).then(function (navigated) {
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
    setting.verifyComponentNotDisplayed(jsonData.NewControlName2).then(function (verified) {
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

  // P1
  // Anemia
  it('Test case 126: Verify update control functionality. @P1', function () {
    library.logStep('Test case 126: Verify update control functionality.');
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control3).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.changeCustomNameInstrument(jsonData.ContCustomName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifySavedComponent(jsonData.ContCustomName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.ContCustomName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.changeCustomNameInstrument(jsonData.Control3).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  // TC 132, 133 & 138 clubbed here
  // P1
  it('Test Case 132: To verify Summary Data Entry Toggle on Edit Analyte Page @P1', function () {
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
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });
    });
  });

  // P1
  //  TC 146 & 148 here
  it('Test Case 146: Verify Decimal places dropdown of edit Analyte window @P1', function () {
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
    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
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
    setting.navigateTO(jsonData.C1Analyte2).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickManuallyEnterData().then(function (enterDataClicked) {
      expect(enterDataClicked).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    setting.disablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (updateClicked) {
      expect(updateClicked).toBe(true);
    });
  });

  // P1
  it('Test Case 157: Verify that after updating analyte detail on Edit analyte page will also be updated on Analyte information Popup @P1',
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

  it('Test Case 135: Verify that Summary Toggle will be disabled On Edit Analyte page if data is already available in the Analyte',
    function () {
      library.logStep('Test Case 135: Verify that Summary Toggle will be disabled On Edit Analyte page if data is already available in the Analyte');
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
      pointData.clickHideData().then(function (dataHidden) {
        expect(dataHidden).toBe(true);
      });
      pointData.clickManuallyEnterData().then(function (linkClicked) {
        expect(linkClicked).toBe(true);
      });
      pointData.enterPointValues(1.25, 1.27).then(function (dataEntered) {
        expect(dataEntered).toBe(true);
      });
      pointData.clickSubmitButton().then(function (submitClicked) {
        expect(submitClicked).toBe(true);
      });
      setting.navigateTO(jsonData.C1Analyte1).then(function (result) {
        expect(result).toBe(true);
      });
      pointData.verifyEnteredPointValues(1.25, 1.27).then(function (valuesVerified) {
        expect(valuesVerified).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      setting.verifySummaryRadioDisabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      setting.clickReturnToDataLink().then(function (result) {
        expect(result).toBe(true);
      });
      multiPoint.clearAllTestsData(jsonData.C1Analyte1).then(function (navigate) {
        expect(navigate).toBe(true);
      });
    });
});
