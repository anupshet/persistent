/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions, protractor } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { NewLabDepartment } from '../page-objects/new-lab-department-e2e.po';
import { AddControl } from '../page-objects/new-labsetup-add_Control-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const library = new BrowserLibrary();
const fs = require('fs');
let jsonData;

library.parseJson('./JSON_data/Sanity.json').then(function(data) {
  jsonData = data;
});


describe('Sanity Suite', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const labsetupDept = new NewLabDepartment();
  const control = new AddControl();
  const analyte = new AddAnalyte();
  const userManagement = new UserManagement();
  const dashBoard = new Dashboard();
  const pointData = new PointDataEntry();
  const newLabSetup = new NewLabSetup();
  const analyteSettings = new AnalyteSettings();

  let afterEachFlag;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    if (afterEachFlag === true) {
      out.signOut();
    }
  });

   it('Lab Setup & Edit Analyte', function () {

    afterEachFlag = true;
    library.logStep('Lab Setup & Edit Analyte');
    labsetupDept.addFirstDepartmentName(jsonData.Department).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.verifyAddDeptButtonEnabled().then(function (addDeptEnabled) {
      expect(addDeptEnabled).toBe(true);
    });
    labsetupDept.clickAddDepartmentsButton().then(function (addDeptClicked) {
      expect(addDeptClicked).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(jsonData.Department).then(function (added) {
      expect(added).toBe(true);
    });
    labsetup.addInstrument(jsonData.Instrument1ManufacturerName, jsonData.Instrument1Model, ' ', ' ').then(function (added) {
      expect(added).toBe(true);
    });
    labsetup.clickAddInstrumentsButton().then(function (click) {
      expect(click).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(jsonData.Instrument).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(jsonData.Control).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(jsonData.ControlLotNumber).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickAddControlButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(jsonData.Control).then(function (created) {
      expect(created).toBe(true);
    });
    analyte.select2LevelsAnalyte().then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.selectAnalyteName(jsonData.Analyte).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectReagent(jsonData.Reagent).then(function (reagentSelected) {
      expect(reagentSelected).toBe(true);
    });
    analyte.selectUnit(jsonData.Unit, '1').then(function (unitSelected) {
      expect(unitSelected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (addedAnalyte) {
      expect(addedAnalyte).toBe(true);
      browser.sleep(5000);
      library.logStep('Lab Setup Completed');
    });
    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navifatedAnalyte) {
      expect(navifatedAnalyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    analyteSettings.clickSummaryToggleButton().then(function (clickedToggle) {
      expect(clickedToggle).toBe(true);
    });
    analyteSettings.spcRulesDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    analyteSettings.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
      browser.sleep(15000);
      library.logStep('Edit Analyte Done');
    });
  });

   /* it('Point Data Entry, Report Generation & Point Data Deletion', function () {
    afterEachFlag = true;
    library.logStep('Point Data Entry, Report Generation & Point Data');
    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navifatedAnalyte) {
      expect(navifatedAnalyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterPointValues(9, 10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navifatedAnalyte) {
      expect(navifatedAnalyte).toBe(true);
    });
    pointData.verifyEnteredPointValues(9, 10).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
      library.logStep('Point Data Entered');
    });
    dashBoard.clickUnityNext().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    reports.clickReportsTab().then(function (clickedReports) {
      expect(clickedReports).toBe(true);
    });
    reports.clickCreateReportButton().then(function (clickedCreate) {
      expect(clickedCreate).toBe(true);
    });
    reports.verifyReportCreated().then(function (reportCreated) {
      expect(reportCreated).toBe(true);
    });
    reports.clickCloseReportButton().then(function (reportClosed) {
      expect(reportClosed).toBe(true);
    });
    reports.verifyCreateButtonDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
      library.logStep('Report Creation Validated');
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.clickEnteredValuesRow().then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.verifyConfirmDeletePopup().then(function (verifyConfirmDeletePopup) {
      expect(verifyConfirmDeletePopup).toBe(true);
    });
    pointData.clickConfirmDeleteButton().then(function (confirmDeleteButtonClicked) {
      expect(confirmDeleteButtonClicked).toBe(true);
      browser.sleep(15000);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigateAnalyte) {
      expect(navigateAnalyte).toBe(true);
    });
    pointData.enteredDataRowExists().then(function (dataExists) {
      expect(dataExists).toBe(false);
      library.logStep('Point Data Deleted');
    });
  });

  it('Lab Setup Deletion', function () {
    afterEachFlag = true;
    library.logStep('Lab Setup Deletion');
    newLabSetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnDeleteBtn().then(function (clicked) {
      expect(clicked).toBe(true);
      library.logStep('Analyte Deleted');
    });
    setting.verifySavedComponent(jsonData.Control).then(function (verified) {
      expect(verified).toBe(true);
    });
    dashBoard.clickUnityNext().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnDeleteBtn().then(function (clicked) {
      expect(clicked).toBe(true);
      library.logStep('Control Deleted');
    });
    setting.verifySavedComponent(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });
    dashBoard.clickUnityNext().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnDeleteBtn().then(function (clicked) {
      expect(clicked).toBe(true);
      library.logStep('Instrument Deleted');
    });
    setting.verifyComponentNotDisplayed(jsonData.Instrument).then(function (verified) {
      expect(verified).toBe(true);
    });
    dashBoard.clickUnityNext().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.expandDeptCard(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnDeleteBtn().then(function (clicked) {
      expect(clicked).toBe(true);
      library.logStep('Department Deleted');
    });
    setting.verifyComponentNotDisplayed(jsonData.Department).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('User Creation', function () {
    afterEachFlag = true;
    library.logStep('User Creation');
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const fname = jsonData.NewUserFirstName + timestamp;
    const lname = jsonData.NewUserLastName + timestamp;
    const admin = 'admin';
    const email = jsonData.NewUserEmail + timestamp + '@gmail.com';
    userManagement.addUser(fname, lname, email, admin).then(function (status) {
      expect(status).toBe(true);
      library.logStep('New User Created');
    });
  });

  it('Verify QC lot viewer for sales user', function () {
    afterEachFlag = false;
    out.signOut();
    loginEvent.loginToApplication(jsonData.DevURL, jsonData.SalesUser,
      jsonData.SalesPassword, jsonData.SalesFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    qcLotViewer.clickQCLotViewerCard().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcLotViewer.verifyLotViewerWindow().then(function (windowDisplayed) {
      expect(windowDisplayed).toBe(true);
    });
    qcLotViewer.verifyLotDetailsTableDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    qcLotViewer.logout().then(function (logout) {
      expect(logout).toBe(true);
    });
  }); */

});
