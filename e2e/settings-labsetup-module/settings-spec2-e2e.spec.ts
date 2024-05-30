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
library.parseJson('./JSON_data/Settings-spec2.json').then(function(data) {
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

  // TC 27, 30, 105, 131, 150 clubbed
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

  // Could not execute - Unable to change the custom name of instrument once saved - Bug id 165572
  it('Test case 102: Verify update instrument functionality. ', function () {
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
    // library.refreshBrowser();
    //  setting.clickOnBackArrow().then(function (clicked) {
    //    expect(clicked).toBe(true);
    //  });
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

    // Anemia
  // Not working on IE because of Bug - 170040
  it('Test case 126: Verify update control functionality.', function () {
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
    // setting.goToHomePage().then(function (navigated) {
    //   expect(navigated).toBe(true);
    // });
    // setting.refreshPage().then(function (navigated) {
    //   expect(navigated).toBe(true);
    // });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    // library.refreshBrowser();
    //  setting.clickOnBackArrow().then(function (clicked) {
    //    expect(clicked).toBe(true);
    //  });
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
});
