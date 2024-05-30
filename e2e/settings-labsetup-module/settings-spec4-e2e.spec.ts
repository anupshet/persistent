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
library.parseJson('./JSON_data/Settings-spec4.json').then(function(data) {
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


  it('Test case 2: To verify that after logging in, a user with User Roles permission is presented a blank content area.', function () {
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
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isInstrumentPageDisplayedToUser(jsonData.Instrument).then(function (navigated) {
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
    setting.clickOnEditThisAnalyteLink().then(function (navigated) {
      expect(navigated).toBe(false);
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

  //  Iron
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
