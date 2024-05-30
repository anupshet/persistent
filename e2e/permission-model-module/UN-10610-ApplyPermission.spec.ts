/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { EvalMeanSD } from '../page-objects/EvalMeanSD-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { NewLabDepartment } from '../page-objects/new-lab-department-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { AddControl } from '../page-objects/new-labsetup-add_Control-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';


let jsonData;

const library = new BrowserLibrary();
const accountsTab = new AccountsListing();
const dashBoard = new Dashboard();
const setting = new Settings();
const archivingLots = new ArchivingLots()
const analyteSettings = new AnalyteSettings()
const evalMeanSD = new EvalMeanSD()
const pointData = new PointDataEntry()
const deptSetup = new NewLabDepartment();
const analyte = new AddAnalyte();
const control = new AddControl();
const navigation = new NewNavigation();

let NewDeptName1 = "";


const fs = require('fs');
library.parseJson('./JSON_data/UN-10610-ApplyPermission.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Users Role Access', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  afterEach(function () {
    out.signOut();
  });

  //------------Account User Manager role------------------

  it("Test case 1: Verify the 'Configuration lab setup ' for Account User Manager role", async () => {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AccUserManager, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(false);
    });
  });

  //---------------Lab User Manager role-------------

  it("Test case 2: Verify the 'Configuration lab setup ' for Lab user Manager role", async () => {

    loginEvent.loginToApplication(jsonData.URL, jsonData.LabUserManager, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(false);
    });

  });

  //-------------------Lot Viewer Sales---------------------------

  it("Test case 3: Verify the  'Configuration lab setup ' for Lot Viewer Sales role", async () => {
    loginEvent.loginToApplication(jsonData.URL, jsonData.LotViewrSales, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(false);
    });

  });

  //-----------------Bio-Rad Manager----------------------------

  it("Test case 4: Verify the 'Configuration lab setup 'for Bio-Rad Manager role", async () => {

    loginEvent.loginToApplication(jsonData.URL, jsonData.BioRadManager, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(false);
    });
  });



  //------------------For Lab Supervisor---------------------------

  it('Test case 1 : Verify Configuration lab setup module For LabSupervisor', async () => {

    library.logStep("TC#2: Verify that user able to 'Add Department'");
    library.logStep("TC#3: Verify that user able to 'Add Instrument'");
    library.logStep("TC#4: Verify that user able to 'Add Control'");
    library.logStep("TC#5: Verify that user able to 'Add Analyte'");


    loginEvent.loginToApplication(jsonData.URL, jsonData.LabSupervisor, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    //Add Dept

    setting.clickOnAddADepartmentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    NewDeptName1 = await dashBoard.newModifiedName(jsonData.NewDeptName1)

    deptSetup.addFirstDepartmentName(NewDeptName1).then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.selectManagerNameValue().then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.clickAddDepartmentsButton().then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(NewDeptName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyAddInstrumentPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.addInstrument(jsonData.NewInstManufacturer1, jsonData.NewInstModel1).then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(jsonData.NewInstModel1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add control

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

    setting.verifySavedComponent(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });


    analyte.selectLevelInUse(jsonData.levels).then(function (checked) {
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
    setting.navigateTO(NewDeptName1).then(function (navigated) {
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

  it("Test case 6: Verify that user able to edit 'Department' For LabSupervisor", async () => {
    library.logStep("TC#6: Verify that user able to edit 'Department'");
    library.logStep("TC#7: Verify that user able to edit 'Instrument'");
    library.logStep("TC#8: Verify that user able to edit 'Control'");
    library.logStep("TC#9: Verify that user able to edit 'Analyte'");
    library.logStep("TC#13:Verify Delete Analyte permission");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LabSupervisor, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const newName = await dashBoard.newModifiedName(jsonData.editDeptName)

    setting.expandDeptCard(jsonData.editDeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.changeDeptName(newName).then(function (added) {
      expect(added).toBe(true);
    });

    setting.clickUpdateDeptBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    setting.verifySavedComponent(newName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(newName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    const newCustNameInstru = await dashBoard.newModifiedName(jsonData.Instrument)

    setting.changeCustomNameInstrument(newCustNameInstru).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateInstrumentBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifySavedComponent(newCustNameInstru).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    //Verify Edit Control

    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    const newCustNameControl = await dashBoard.newModifiedName(jsonData.Control)

    control.enterDataControlName(newCustNameControl).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifySavedComponent(newCustNameControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    //Analyte

    setting.navigateTO(jsonData.Analyte).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });

    analyteSettings.verifySortingSelectAnotherUnit().then(function (selectedValue1) {
      let unitValue = selectedValue1;
      expect(unitValue).not.toBeNull();
      analyteSettings.clickUpdateButton().then(function (updateClicked) {
        expect(updateClicked).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });

      //Verify Delete

      setting.verifyDeleteIconDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickOnDeleteBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      setting.verifyDeletePopupUI().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickCancelOnDeleteConfirmation().then(function (verified) {
        expect(verified).toBe(true);
      });

    });

  });

  it('Test case 10 :  Verify Delete Department permission For LabSupervisor', async () => {
    library.logStep("TC#11: Verify Delete Instrument permission");
    library.logStep("TC#12: Verify Delete Control permission");


    loginEvent.loginToApplication(jsonData.URL, jsonData.LabSupervisor, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.DepartmentWithoughtInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
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
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyComponentNotDisplayed(jsonData.DepartmentWithoughtInstrument).then(function (verified) {
      expect(verified).toBe(true);
    });

    //Delete Instrument

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.navigateTO(jsonData.DepartmentWithoughtAnalyteAndControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnDeleteBtn().then(function (clicked) {
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
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyComponentNotDisplayed(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });


    //Delete Contol

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentWithoughtAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyDeletePopupUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickCancelOnDeleteConfirmation().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyComponentNotDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });

  });

  it("Test case 14: Verify User has Access to Instrument settings link For LabSupervisor", async () => {

    library.logStep("TC#14: Verify User has Access to Instrument settings link");
    library.logStep("TC#15: Verify User has Access to Control Settings link  (Decimal places,Levels in use,Point/Summary selection)");
    library.logStep("TC#16: Verify User has Access to Analyte settings link (Decimal places,Levels in use,Point/Summary selection) ");
    library.logStep("TC#18: Verify User able to see Rules at (At Control and Analyte level)");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LabSupervisor, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
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
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyControlSettings_UpdateMethod().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyAnalyteSettings_UpdatedMethod().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    analyteSettings.clickReturnToDataLink().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });

  //-----------------------------for leadTech role----------------------

  xit('Test case 1 : Verify Configuration lab setup  module for LeadTechRole', async () => {

    library.logStep("TC#2: Verify that user able to 'Add Department'");
    library.logStep("TC#3: Verify that user able to 'Add Instrument'");
    library.logStep("TC#4: Verify that user able to 'Add Control'");
    library.logStep("TC#5: Verify that user able to 'Add Analyte'");


    loginEvent.loginToApplication(jsonData.URL, jsonData.LeadTechRole, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    //Add Dept

    setting.clickOnAddADepartmentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    NewDeptName1 = await dashBoard.newModifiedName(jsonData.NewDeptName1)

    deptSetup.addFirstDepartmentName(NewDeptName1).then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.selectManagerNameValue().then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.clickAddDepartmentsButton().then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(NewDeptName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyAddInstrumentPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.addInstrument(jsonData.NewInstManufacturer1, jsonData.NewInstModel1).then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(jsonData.NewInstModel1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add control

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

    setting.verifySavedComponent(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add analyte

    analyte.selectLevelInUse(jsonData.levels).then(function (checked) {
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
    setting.navigateTO(NewDeptName1).then(function (navigated) {
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

  xit("Test case 6: Verify that user able to edit 'Department' for LeadTechRole", async () => {
    library.logStep("TC#6: Verify that user able to edit 'Department'");
    library.logStep("TC#7: Verify that user able to edit 'Instrument'");
    library.logStep("TC#8: Verify that user able to edit 'Control'");
    library.logStep("TC#9: Verify that user able to edit 'Analyte'");
    library.logStep("TC#13:  Verify Delete Analyte permission");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LeadTechRole, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const newName = await dashBoard.newModifiedName(jsonData.editDeptName)

    setting.expandDeptCard(jsonData.editDeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.changeDeptName(newName).then(function (added) {
      expect(added).toBe(true);
    });

    setting.clickUpdateDeptBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    setting.verifySavedComponent(newName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(newName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    const newCustNameInstru = await dashBoard.newModifiedName(jsonData.Instrument)

    setting.changeCustomNameInstrument(newCustNameInstru).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateInstrumentBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifySavedComponent(newCustNameInstru).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    //Verify Edit Control
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    const newCustNameControl = await dashBoard.newModifiedName(jsonData.Control)

    control.enterDataControlName(newCustNameControl).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifySavedComponent(newCustNameControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    //Analyte

    setting.navigateTO(jsonData.Analyte).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });

    analyteSettings.verifySortingSelectAnotherUnit().then(function (selectedValue1) {
      let unitValue = selectedValue1;
      expect(unitValue).not.toBeNull();
      analyteSettings.clickUpdateButton().then(function (updateClicked) {
        expect(updateClicked).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });

      //Verify Delete

      setting.verifyDeleteIconDisplayed().then(function (verified) {
        expect(verified).toBe(false);
      });
    });
  });

  xit('Test case 10 :  Verify Delete Department permission for LeadTechRole', async () => {
    library.logStep("TC#11: Verify Delete Instrument permission");
    library.logStep("TC#12: Verify Delete Control permission");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LeadTechRole, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.DepartmentWithoughtInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.navigateTO(jsonData.DepartmentWithoughtAnalyteAndControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    //Delete Analyte

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentWithoughtAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });
  });

  xit("Test case 14: Verify User has Access to Instrument settings link for LeadTechRole", async () => {

    library.logStep("TC#14: Verify User has Access to Instrument settings link");
    library.logStep("TC#15: Verify User has Access to Control Settings link  (Decimal places,Levels in use,Point/Summary selection)");
    library.logStep("TC#16: Verify User has Access to Analyte settings link (Decimal places,Levels in use,Point/Summary selection) ");
    library.logStep("TC#18: Verify User able to see Rules at (At Control and Analyte level)");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LeadTechRole, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
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
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyControlSettings_UpdateMethod().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyAnalyteSettings_UpdatedMethod().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    analyteSettings.clickReturnToDataLink().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });

  //----------------------LUM + LS role------------------------------

  xit('Test case 1 : Verify Configuration lab setup  module for LUM + LS role ', async () => {

    library.logStep("TC#2: Verify that user able to 'Add Department'");
    library.logStep("TC#3: Verify that user able to 'Add Instrument'");
    library.logStep("TC#4: Verify that user able to 'Add Control'");
    library.logStep("TC#5: Verify that user able to 'Add Analyte'");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    //Add Dept

    setting.clickOnAddADepartmentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    NewDeptName1 = await dashBoard.newModifiedName(jsonData.NewDeptName1)

    deptSetup.addFirstDepartmentName(NewDeptName1).then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.selectManagerNameValue().then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.clickAddDepartmentsButton().then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(NewDeptName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyAddInstrumentPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.addInstrument(jsonData.NewInstManufacturer1, jsonData.NewInstModel1).then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(jsonData.NewInstModel1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add control

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

    setting.verifySavedComponent(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add analyte

    analyte.selectLevelInUse(jsonData.levels).then(function (checked) {
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
    setting.navigateTO(NewDeptName1).then(function (navigated) {
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

  xit("Test case 6: Verify that user able to edit 'Department' for LUM + LS role", async () => {
    library.logStep("TC#6: Verify that user able to edit 'Department'");
    library.logStep("TC#7: Verify that user able to edit 'Instrument'");
    library.logStep("TC#8: Verify that user able to edit 'Control'");
    library.logStep("TC#9: Verify that user able to edit 'Analyte'");
    library.logStep("TC#13:  Verify Delete Analyte permission");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const newName = await dashBoard.newModifiedName(jsonData.editDeptName)

    setting.expandDeptCard(jsonData.editDeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.changeDeptName(newName).then(function (added) {
      expect(added).toBe(true);
    });

    setting.clickUpdateDeptBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    setting.verifySavedComponent(newName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(newName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    const newCustNameInstru = await dashBoard.newModifiedName(jsonData.Instrument)

    setting.changeCustomNameInstrument(newCustNameInstru).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateInstrumentBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifySavedComponent(newCustNameInstru).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    //Verify Edit Control
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });

    const newCustNameControl = await dashBoard.newModifiedName(jsonData.Control)

    control.enterDataControlName(newCustNameControl).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifySavedComponent(newCustNameControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    //Analyte

    setting.navigateTO(jsonData.Analyte).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });

    analyteSettings.verifySortingSelectAnotherUnit().then(function (selectedValue1) {
      let unitValue = selectedValue1;
      expect(unitValue).not.toBeNull();
      analyteSettings.clickUpdateButton().then(function (updateClicked) {
        expect(updateClicked).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });

      //Verify Delete

      setting.verifyDeleteIconDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickOnDeleteBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      setting.verifyDeletePopupUI().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickCancelOnDeleteConfirmation().then(function (verified) {
        expect(verified).toBe(true);
      });

    });

  });

  xit('Test case 10 :  Verify Delete Department permission for LUM + LS role', async () => {
    library.logStep("TC#11: Verify Delete Instrument permission");
    library.logStep("TC#12: Verify Delete Control permission");


    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.DepartmentWithoughtInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
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
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyComponentNotDisplayed(jsonData.DepartmentWithoughtInstrument).then(function (verified) {
      expect(verified).toBe(true);
    });

    //Delete Instrument

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.navigateTO(jsonData.DepartmentWithoughtAnalyteAndControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnDeleteBtn().then(function (clicked) {
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
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyComponentNotDisplayed(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });


    //Delete Contol

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentWithoughtAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyDeletePopupUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickCancelOnDeleteConfirmation().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyComponentNotDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });

  });

  xit("Test case 14: Verify User has Access to Instrument settings link for LUM + LS role", async () => {

    library.logStep("TC#14: Verify User has Access to Instrument settings link");
    library.logStep("TC#15: Verify User has Access to Control Settings link  (Decimal places,Levels in use,Point/Summary selection)");
    library.logStep("TC#16: Verify User has Access to Analyte settings link (Decimal places,Levels in use,Point/Summary selection) ");
    library.logStep("TC#18: Verify User able to see Rules at (At Control and Analyte level)");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
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
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    analyteSettings.verifyControlSettingsUpdate().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    analyteSettings.verifyAnalyteSettingsUpdated().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    analyteSettings.clickReturnToDataLink().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });


  //-----------------------------For LUM + LT role----------------------

  xit('Test case 1 : Verify Configuration lab setup  module for LUM + LT role', async () => {

    library.logStep("TC#2: Verify that user able to 'Add Department'");
    library.logStep("TC#3: Verify that user able to 'Add Instrument'");
    library.logStep("TC#4: Verify that user able to 'Add Control'");
    library.logStep("TC#5: Verify that user able to 'Add Analyte'");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LT, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    //Add Dept

    setting.clickOnAddADepartmentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    NewDeptName1 = await dashBoard.newModifiedName(jsonData.NewDeptName1)

    deptSetup.addFirstDepartmentName(NewDeptName1).then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.selectManagerNameValue().then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.clickAddDepartmentsButton().then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(NewDeptName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyAddInstrumentPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.addInstrument(jsonData.NewInstManufacturer1, jsonData.NewInstModel1).then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(jsonData.NewInstModel1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add control

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

    setting.verifySavedComponent(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add analyte

    analyte.selectLevelInUse(jsonData.levels).then(function (checked) {
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
    setting.navigateTO(NewDeptName1).then(function (navigated) {
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

  xit("Test case 6: Verify that user able to edit 'Department' for LUM + LT role", async () => {
    library.logStep("TC#6: Verify that user able to edit 'Department'");
    library.logStep("TC#7: Verify that user able to edit 'Instrument'");
    library.logStep("TC#8: Verify that user able to edit 'Control'");
    library.logStep("TC#9: Verify that user able to edit 'Analyte'");
    library.logStep("TC#13:  Verify Delete Analyte permission");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LT, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    let timestampp = library.createTimeStamp();

    const newName = await dashBoard.newModifiedName(jsonData.editDeptName)

    setting.expandDeptCard(jsonData.editDeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.changeDeptName(newName).then(function (added) {
      expect(added).toBe(true);
    });

    setting.clickUpdateDeptBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    setting.verifySavedComponent(newName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(newName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    const newCustNameInstru = await dashBoard.newModifiedName(jsonData.Instrument)

    setting.changeCustomNameInstrument(newCustNameInstru).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateInstrumentBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifySavedComponent(newCustNameInstru).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    //Verify Edit Control
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    const newCustNameControl = await dashBoard.newModifiedName(jsonData.Control)

    control.enterDataControlName(newCustNameControl).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifySavedComponent(newCustNameControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    //Analyte

    setting.navigateTO(jsonData.Analyte).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });

    analyteSettings.verifySortingSelectAnotherUnit().then(function (selectedValue1) {
      let unitValue = selectedValue1;
      expect(unitValue).not.toBeNull();
      analyteSettings.clickUpdateButton().then(function (updateClicked) {
        expect(updateClicked).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });

      //Verify Delete

      setting.verifyDeleteIconDisplayed().then(function (verified) {
        expect(verified).toBe(false);
      });
    });
  });

  xit('Test case 10 :  Verify Delete Department permission for LUM + LT role', async () => {
    library.logStep("TC#11: Verify Delete Instrument permission");
    library.logStep("TC#12: Verify Delete Control permission");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LT, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.DepartmentWithoughtInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.navigateTO(jsonData.DepartmentWithoughtAnalyteAndControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    //Delete Analyte

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentWithoughtAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });
  });

  xit("Test case 14: Verify User has Access to Instrument settings link for LUM + LT role", async () => {

    library.logStep("TC#14: Verify User has Access to Instrument settings link");
    library.logStep("TC#15: Verify User has Access to Control Settings link  (Decimal places,Levels in use,Point/Summary selection)");
    library.logStep("TC#16: Verify User has Access to Analyte settings link (Decimal places,Levels in use,Point/Summary selection) ");
    library.logStep("TC#18: Verify User able to see Rules at (At Control and Analyte level)");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_LT, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
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
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    analyteSettings.verifyControlSettingsUpdate().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    analyteSettings.verifyAnalyteSettingsUpdated().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    analyteSettings.clickReturnToDataLink().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });

  //--------------AUM + LS------------------------------------

  xit('Test case 1 : Verify Configuration lab setup  module for AUM + LS role ', async () => {

    library.logStep("TC#2: Verify that user able to 'Add Department'");
    library.logStep("TC#3: Verify that user able to 'Add Instrument'");
    library.logStep("TC#4: Verify that user able to 'Add Control'");
    library.logStep("TC#5: Verify that user able to 'Add Analyte'");



    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    //Add Dept

    setting.clickOnAddADepartmentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    NewDeptName1 = await dashBoard.newModifiedName(jsonData.NewDeptName1)

    deptSetup.addFirstDepartmentName(NewDeptName1).then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.selectManagerNameValue().then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.clickAddDepartmentsButton().then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(NewDeptName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyAddInstrumentPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.addInstrument(jsonData.NewInstManufacturer1, jsonData.NewInstModel1).then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(jsonData.NewInstModel1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add control

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

    setting.verifySavedComponent(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add analyte

    analyte.selectLevelInUse(jsonData.levels).then(function (checked) {
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
    setting.navigateTO(NewDeptName1).then(function (navigated) {
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

  xit("Test case 6: Verify that user able to edit 'Department' for AUM + LS role", async () => {
    library.logStep("TC#6: Verify that user able to edit 'Department'");
    library.logStep("TC#7: Verify that user able to edit 'Instrument'");
    library.logStep("TC#8: Verify that user able to edit 'Control'");
    library.logStep("TC#9: Verify that user able to edit 'Analyte'");
    library.logStep("TC#13:  Verify Delete Analyte permission");

    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const newName = await dashBoard.newModifiedName(jsonData.editDeptName)

    setting.expandDeptCard(jsonData.editDeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.changeDeptName(newName).then(function (added) {
      expect(added).toBe(true);
    });

    setting.clickUpdateDeptBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    setting.verifySavedComponent(newName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(newName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    const newCustNameInstru = await dashBoard.newModifiedName(jsonData.Instrument)

    setting.changeCustomNameInstrument(newCustNameInstru).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateInstrumentBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifySavedComponent(newCustNameInstru).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    //Verify Edit Control


    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    const newCustNameControl = await dashBoard.newModifiedName(jsonData.Control)

    control.enterDataControlName(newCustNameControl).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifySavedComponent(newCustNameControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    //Analyte

    setting.navigateTO(jsonData.Analyte).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });

    analyteSettings.verifySortingSelectAnotherUnit().then(function (selectedValue1) {
      let unitValue = selectedValue1;
      expect(unitValue).not.toBeNull();
      analyteSettings.clickUpdateButton().then(function (updateClicked) {
        expect(updateClicked).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });

      //Verify Delete

      setting.verifyDeleteIconDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickOnDeleteBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      setting.verifyDeletePopupUI().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickCancelOnDeleteConfirmation().then(function (verified) {
        expect(verified).toBe(true);
      });

    });

  });

  xit('Test case 10 :  Verify Delete Department permission for AUM + LS role', async () => {
    library.logStep("TC#11: Verify Delete Instrument permission");
    library.logStep("TC#12: Verify Delete Control permission");


    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.DepartmentWithoughtInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
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
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyComponentNotDisplayed(jsonData.DepartmentWithoughtInstrument).then(function (verified) {
      expect(verified).toBe(true);
    });

    //Delete Instrument

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.navigateTO(jsonData.DepartmentWithoughtAnalyteAndControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnDeleteBtn().then(function (clicked) {
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
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyComponentNotDisplayed(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });


    //Delete Contol

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentWithoughtAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyDeletePopupUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickCancelOnDeleteConfirmation().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyComponentNotDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });

  });

  xit("Test case 14: Verify User has Access to Instrument settings link for AUM + LS role", async () => {

    library.logStep("TC#14: Verify User has Access to Instrument settings link");
    library.logStep("TC#15: Verify User has Access to Control Settings link  (Decimal places,Levels in use,Point/Summary selection)");
    library.logStep("TC#16: Verify User has Access to Analyte settings link (Decimal places,Levels in use,Point/Summary selection) ");
    library.logStep("TC#18: Verify User able to see Rules at (At Control and Analyte level)");

    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
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
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    analyteSettings.verifyControlSettingsUpdate().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    analyteSettings.verifyAnalyteSettingsUpdated().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    analyteSettings.clickReturnToDataLink().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });

  //--------------------------AUM+LUM+LS Role-------------------------------------------


  xit('Test case 1 : Verify Configuration lab setup  module for AUM +LUM + LS role ', async () => {

    library.logStep("TC#2: Verify that user able to 'Add Department'");
    library.logStep("TC#3: Verify that user able to 'Add Instrument'");
    library.logStep("TC#4: Verify that user able to 'Add Control'");
    library.logStep("TC#5: Verify that user able to 'Add Analyte'");


    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    //Add Dept

    setting.clickOnAddADepartmentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    NewDeptName1 = await dashBoard.newModifiedName(jsonData.NewDeptName1)

    deptSetup.addFirstDepartmentName(NewDeptName1).then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.selectManagerNameValue().then(function (added) {
      expect(added).toBe(true);
    });
    deptSetup.clickAddDepartmentsButton().then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(NewDeptName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyAddInstrumentPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.addInstrument(jsonData.NewInstManufacturer1, jsonData.NewInstModel1).then(function (added) {
      expect(added).toBe(true);
    });

    setting.verifySavedComponent(jsonData.NewInstModel1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add control

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

    setting.verifySavedComponent(jsonData.NewControlName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //add analyte

    analyte.selectLevelInUse(jsonData.levels).then(function (checked) {
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
    setting.navigateTO(NewDeptName1).then(function (navigated) {
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

  xit("Test case 6: Verify that user able to edit 'Department' for AUM +LUM + LS role", async () => {
    library.logStep("TC#6: Verify that user able to edit 'Department'");
    library.logStep("TC#7: Verify that user able to edit 'Instrument'");
    library.logStep("TC#8: Verify that user able to edit 'Control'");
    library.logStep("TC#9: Verify that user able to edit 'Analyte'");
    library.logStep("TC#13:  Verify Delete Analyte permission");

    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const newName = await dashBoard.newModifiedName(jsonData.editDeptName)

    setting.expandDeptCard(jsonData.editDeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.changeDeptName(newName).then(function (added) {
      expect(added).toBe(true);
    });

    setting.clickUpdateDeptBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    setting.verifySavedComponent(newName).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(newName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });

    const newCustNameInstru = await dashBoard.newModifiedName(jsonData.Instrument)
    setting.changeCustomNameInstrument(newCustNameInstru).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateInstrumentBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifySavedComponent(newCustNameInstru).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    //Verify Edit Control
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });

    const newCustNameControl = await dashBoard.newModifiedName(jsonData.Control)

    control.enterDataControlName(newCustNameControl).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickUpdateControlBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    navigation.clickBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifySavedComponent(newCustNameControl).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    //Analyte

    setting.navigateTO(jsonData.Analyte).then(function (result) {
      expect(result).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });

    analyteSettings.verifySortingSelectAnotherUnit().then(function (selectedValue1) {
      let unitValue = selectedValue1;
      expect(unitValue).not.toBeNull();
      analyteSettings.clickUpdateButton().then(function (updateClicked) {
        expect(updateClicked).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.verifySelectedUnit(unitValue).then(function (verified) {
        expect(verified).toBe(true);
      });

      //Verify Delete

      setting.verifyDeleteIconDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickOnDeleteBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      setting.verifyDeletePopupUI().then(function (verified) {
        expect(verified).toBe(true);
      });
      setting.clickCancelOnDeleteConfirmation().then(function (verified) {
        expect(verified).toBe(true);
      });

    });

  });

  xit('Test case 10 : Verify Delete Department permission for AUM +LUM + LS role', async () => {
    library.logStep("TC#11: Verify Delete Instrument permission");
    library.logStep("TC#12: Verify Delete Control permission");


    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.DepartmentWithoughtInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
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
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyComponentNotDisplayed(jsonData.DepartmentWithoughtInstrument).then(function (verified) {
      expect(verified).toBe(true);
    });

    //Delete Instrument

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.navigateTO(jsonData.DepartmentWithoughtAnalyteAndControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnDeleteBtn().then(function (clicked) {
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
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyComponentNotDisplayed(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });


    //Delete Contol

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentWithoughtAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyDeletePopupUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickCancelOnDeleteConfirmation().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickDeleteButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.clickConfirmOnDeleteConfirmation().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.verifyComponentNotDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });

  });

  xit("Test case 14: Verify User has Access to Instrument settings link for AUM +LUM + LS role", async () => {

    library.logStep("TC#14: Verify User has Access to Instrument settings link");
    library.logStep("TC#15: Verify User has Access to Control Settings link  (Decimal places,Levels in use,Point/Summary selection)");
    library.logStep("TC#16: Verify User has Access to Analyte settings link (Decimal places,Levels in use,Point/Summary selection) ");
    library.logStep("TC#18: Verify User able to see Rules at (At Control and Analyte level)");

    loginEvent.loginToApplication(jsonData.URL, jsonData.AUM_LUM_LS, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.verifyConfigurationLabSetup().then(function (labSetup) {
      expect(labSetup).toBe(true);
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
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.isEditControlPageDisplayed(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    analyteSettings.verifyControlSettingsUpdate().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    analyteSettings.verifyAnalyteSettingsUpdated().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    archivingLots.verifyArchiveToggleDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.enablePointDataEntry().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    analyteSettings.clickReturnToDataLink().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });

   //-----------------------------For Tech role----------------------

   it("Test case 1: Verify User has Access to  settings links for TechRole", async () => {

    library.logStep("TC#1: Verify User has Access to Instrument settings link");
    library.logStep("TC#2: Verify User has Access to Control Settings link  (Decimal places,Levels in use,Point/Summary selection)");
    library.logStep("TC#3: Verify User has Access to Analyte settings link (Decimal places,Levels in use,Point/Summary selection) ");
    library.logStep("TC#4: Verify User able to see Rules at (At Control and Analyte level)");
    library.logStep("TC#5:  Verify TechRole does not see Delete ion at Analyte level");

    loginEvent.loginToApplication(jsonData.URL, jsonData.TechRole, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
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
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    setting.verifyArchiveToggleDisplayed_inViewOnlyState().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyEditControlPage_ForViewOnly(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyArchiveToggleDisplayed_inViewOnlyState().then(function (verified) {
      expect(verified).toBe(true);
    });

   analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyEditAnalytePage_ForViewOnly().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    setting.verifyArchiveToggleDisplayed_inViewOnlyState().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);

  });

    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    analyteSettings.clickReturnToDataLink().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });
  it('Test case 6 :  Verify TechRole does not see Delete ions at any level', async () => {
    library.logStep("TC#6: Verify TechRole does not see Delete ion at Department level");
    library.logStep("TC#7: Verify TechRole does not see Delete ion at Instrument level");
    library.logStep("TC#8: Verify TechRole does not see Delete ion at Control level");

    loginEvent.loginToApplication(jsonData.URL, jsonData.TechRole, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.DepartmentWithoughtInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.navigateTO(jsonData.DepartmentWithoughtAnalyteAndControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    //Delete Analyte

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentWithoughtAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });
  });

 //-----------------------------for LUM+Tech role----------------------


  it("Test case 1: Verify User has Access to  settings links for LUM+TechRole", async () => {

    library.logStep("TC#1: Verify User has Access to Instrument settings link");
    library.logStep("TC#2: Verify User has Access to Control Settings link  (Decimal places,Levels in use,Point/Summary selection)");
    library.logStep("TC#3: Verify User has Access to Analyte settings link (Decimal places,Levels in use,Point/Summary selection) ");
    library.logStep("TC#4: Verify User able to see Rules at (At Control and Analyte level)");
    library.logStep("TC#5:  Verify LUM+TechRole does not see Delete ion at Analyte level");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_T, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
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
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    setting.verifyArchiveToggleDisplayed_inViewOnlyState().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyEditControlPage_ForViewOnly(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyArchiveToggleDisplayed_inViewOnlyState().then(function (verified) {
      expect(verified).toBe(true);
    });
   analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.verifyEditAnalytePage_ForViewOnly().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    setting.verifyArchiveToggleDisplayed_inViewOnlyState().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    analyteSettings.verifySPCRulesComponentDisplayed().then(function (spcSectionDisplayed) {
      expect(spcSectionDisplayed).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.verifyEvalMeanSdPage(2).then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    evalMeanSD.clickCloseEvalMeanSD().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });

    analyteSettings.clickReturnToDataLink().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });
  it('Test case 6 : Verify LUM+TechRole does not see Delete ion at any level', async () => {
    library.logStep("TC#6: Verify LUM+TechRole does not see Delete ion at Department level");
    library.logStep("TC#7: Verify LUM+TechRole does not see Delete ion at Instrument level");
    library.logStep("TC#8: Verify LUM+TechRole does not see Delete ion at Control level");
    loginEvent.loginToApplication(jsonData.URL, jsonData.LUM_T, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.DepartmentWithoughtInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.navigateTO(jsonData.DepartmentWithoughtAnalyteAndControl).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });

    //Delete Analyte

    setting.goToHomePage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentWithoughtAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.verifyDeleteIconDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });
  });




});


