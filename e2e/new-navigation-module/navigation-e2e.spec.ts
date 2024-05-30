/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Navigation.json').then(function (data) {
  jsonData = data;
});


describe('Test Suite: New Navigation', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dashboard = new Dashboard();
  const library = new BrowserLibrary();
  const navigation = new NewNavigation();
  const labsetup = new NewLabSetup();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  // TC 1,2
  it('Test case 1: To verify that the root node does not have a back button', function () {
    library.logStep('Test case 1: To verify that the root node does not have a back button');
    library.logStep('Test case 2: To verify the functionality of Close Button & Hamburger button');
    navigation.verifyBackButtonNotPresent().then(function (backArrowNotDisplayed) {
      expect(backArrowNotDisplayed).toBe(true);
    });
    navigation.verifyCloseButton().then(function (closeButtonDisplayed) {
      expect(closeButtonDisplayed).toBe(true);
    });
    navigation.clickCloseButton().then(function (closeClicked) {
      expect(closeClicked).toBe(true);
    });
    navigation.verifyHumbergerIconDisplayed().then(function (hamDisplayed) {
      expect(hamDisplayed).toBe(true);
    });
    navigation.clickHamburger().then(function (hamClicked) {
      expect(hamClicked).toBe(true);
    });
    navigation.verifyCloseButton().then(function (closeButtonDisplayed) {
      expect(closeButtonDisplayed).toBe(true);
    });
  });

  // P1
  // TC 3,4,5,6,7,11,13,15,18
  it('Test case 3: To verify that clicking on the department shows the configured instruments @P1', function () {
    library.logStep('Test case 3: To verify that clicking on the department shows the configured instruments');
    library.logStep('Test case 4: To verify that clicking on the Instrument shows the configured Controls');
    library.logStep('Test case 5: To verify that clicking on the Control shows the configured analytes');
    library.logStep('Test case 6: To verify that clicking on the Analyte shows the Data Entry Page');
    library.logStep('Test case 7: To verify the functionality of Back Arrow');
    library.logStep('Test case 11: To verify that the default view for Instrument, Control & Analyte is Data Table');
    library.logStep('Test case 13: To verify that for the lab location, the list of departments on the top level shown on the dashboard view');
    library.logStep('Test case 15: To check that the "Test Results" or "Reports" are displayed on the instrument level');
    library.logStep('Test case 18:To verify the navigation tool tips');
    // Navigate to dept
    navigation.verifyItemDisplayed(jsonData.Dept1).then(function (deptDisplayed) {
      expect(deptDisplayed).toBe(true);
    });
    labsetup.navigateTO(jsonData.Dept1).then(function (navigatedDept) {
      expect(navigatedDept).toBe(true);
    });
    navigation.verifyItemDisplayed(jsonData.Instr1).then(function (instDisplayed) {
      expect(instDisplayed).toBe(true);
    });
    navigation.verifyItemAndBackButton(jsonData.Dept1).then(function (verified1) {
      expect(verified1).toBe(true);
    });
    navigation.verifyTestResultsAndReportsTab().then(function (reportsForDept) {
      expect(reportsForDept).toBe(false);
    });
    // Navigate to Inst
    labsetup.navigateTO(jsonData.Instr1).then(function (navigatedInst) {
      expect(navigatedInst).toBe(true);
    });
    navigation.verifyItemDisplayed(jsonData.Control1).then(function (conDisplayed) {
      expect(conDisplayed).toBe(true);
    });
    navigation.verifyItemAndBackButton(jsonData.Instr1).then(function (verified2) {
      expect(verified2).toBe(true);
    });
    navigation.verifyControlInstrumentDataTable().then(function (controlDataTable) {
      expect(controlDataTable).toBe(true);
    });
    navigation.verifyTestResultsAndReportsTab().then(function (reportsForInst) {
      expect(reportsForInst).toBe(true);
    });
    // Navigate to Control
    labsetup.navigateTO(jsonData.Control1).then(function (navigatedCon) {
      expect(navigatedCon).toBe(true);
    });
    navigation.verifyItemDisplayed(jsonData.Analyte1).then(function (analyteDisplayed) {
      expect(analyteDisplayed).toBe(true);
    });
    navigation.verifyItemAndBackButton(jsonData.Control1).then(function (verified3) {
      expect(verified3).toBe(true);
    });
    navigation.verifyControlInstrumentDataTable().then(function (controlDataTable) {
      expect(controlDataTable).toBe(true);
    });
    navigation.verifyTestResultsAndReportsTab().then(function (reportsForControl) {
      expect(reportsForControl).toBe(false);
    });
    // Navigate to Analyte
    labsetup.navigateTO(jsonData.Analyte1).then(function (navigatedInst) {
      expect(navigatedInst).toBe(true);
    });
    navigation.verifyDataEntryPageAnalyte().then(function (verified) {
      expect(verified).toBe(true);
    });
    navigation.verifyTestResultsAndReportsTab().then(function (reportsForAnalyte) {
      expect(reportsForAnalyte).toBe(false);
    });
    // Navigate to Control
    navigation.verifyToolTip(jsonData.AnalyteControlPageBackButtonTooltip).then(function (tooltipVerifiedAnalyte) {
      expect(tooltipVerifiedAnalyte).toBe(true);
    });
    navigation.clickBackArrow().then(function (backArrowClicked) {
      expect(backArrowClicked).toBe(true);
    });
    navigation.verifyItemDisplayed(jsonData.Analyte1).then(function (analyteDisplayed) {
      expect(analyteDisplayed).toBe(true);
    });
    navigation.verifyItemAndBackButton(jsonData.Control1).then(function (verified3) {
      expect(verified3).toBe(true);
    });
    navigation.verifyControlInstrumentDataTable().then(function (controlDataTable) {
      expect(controlDataTable).toBe(true);
    });
    // Navigate to Inst
    navigation.verifyToolTip(jsonData.AnalyteControlPageBackButtonTooltip).then(function (tooltipVerifiedControl) {
      expect(tooltipVerifiedControl).toBe(true);
    });
    navigation.clickBackArrow().then(function (backArrowClicked) {
      expect(backArrowClicked).toBe(true);
    });
    navigation.verifyItemDisplayed(jsonData.Control1).then(function (analyteDisplayed) {
      expect(analyteDisplayed).toBe(true);
    });
    navigation.verifyItemAndBackButton(jsonData.Instr1).then(function (verified3) {
      expect(verified3).toBe(true);
    });
    navigation.verifyControlInstrumentDataTable().then(function (controlDataTable) {
      expect(controlDataTable).toBe(true);
    });
    // Navigate to dept
    navigation.verifyToolTip(jsonData.InstrumentPageBackButtonTooltip).then(function (tooltipVerifiedInst) {
      expect(tooltipVerifiedInst).toBe(true);
    });
    navigation.clickBackArrow().then(function (backArrowClicked) {
      expect(backArrowClicked).toBe(true);
    });
    navigation.verifyItemDisplayed(jsonData.Instr1).then(function (analyteDisplayed) {
      expect(analyteDisplayed).toBe(true);
    });
    navigation.verifyItemAndBackButton(jsonData.Dept1).then(function (verified3) {
      expect(verified3).toBe(true);
    });
    // Navigate to Dashboard
    navigation.verifyToolTip(jsonData.DepartmentPageBackButtonTooltip).then(function (tooltipVerifiedDept) {
      expect(tooltipVerifiedDept).toBe(true);
    });
    navigation.clickBackArrow().then(function (backArrowClicked) {
      expect(backArrowClicked).toBe(true);
    });
    navigation.verifyItemDisplayed(jsonData.Dept1).then(function (analyteDisplayed) {
      expect(analyteDisplayed).toBe(true);
    });
    navigation.verifyBackButtonNotPresent().then(function (backArrowNotDisplayed) {
      expect(backArrowNotDisplayed).toBe(true);
    });
  });

  // P1
  it('Test case 8: To verify the functionality of Breadcrumb @P1', function () {
    labsetup.navigateTO(jsonData.Dept1).then(function (navigatedDept) {
      expect(navigatedDept).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instr1).then(function (navigatedInst) {
      expect(navigatedInst).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control1).then(function (navigatedCon) {
      expect(navigatedCon).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte1).then(function (navigatedInst) {
      expect(navigatedInst).toBe(true);
    });
    navigation.verifyLinksInBreadcrum(jsonData.Labname, jsonData.Dept1, jsonData.Instr1).then(function (verified) {
      expect(verified).toBe(true);
    });
    navigation.clickBreadcrum(jsonData.Instr1).then(function (breadcrumbClicked) {
      expect(breadcrumbClicked).toBe(true);
    });
    navigation.verifyItemDisplayed(jsonData.Control1).then(function (conDisplayed) {
      expect(conDisplayed).toBe(true);
    });
    navigation.verifyItemAndBackButton(jsonData.Instr1).then(function (verified2) {
      expect(verified2).toBe(true);
    });
    navigation.verifyControlInstrumentDataTable().then(function (controlDataTable) {
      expect(controlDataTable).toBe(true);
    });
    navigation.verifyTestResultsAndReportsTab().then(function (reportsForInst) {
      expect(reportsForInst).toBe(true);
    });
  });

  it('Test case 10:To verify that clicking on the Unity Next should display the Dashboard page', function () {
    library.logStep('Test case 10:To verify that clicking on the Unity Next should display the Dashboard page');
    labsetup.navigateTO(jsonData.Dept1).then(function (navigatedDept) {
      expect(navigatedDept).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instr1).then(function (navigatedDept) {
      expect(navigatedDept).toBe(true);
    });
    dashboard.clickUnityNext().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    navigation.verifyBackButtonNotPresent().then(function (backArrowNotDisplayed) {
      expect(backArrowNotDisplayed).toBe(true);
    });
  });

  // TC 9,12
  it('Test case 12: To verify if the custom name for Instrument & Control is displayed above and default name'
    + ' below it in small gray text', function () {
      library.logStep('Test case 12: To verify if the custom name for Instrument & Control is displayed above and default name'
        + ' below it in small gray text');
      library.logStep('Test case 9:To verify that clicking on the Control that does not have analytes configured will show '
        + 'the Analyte setup screen');
      labsetup.navigateTO(jsonData.Dept1).then(function (navigatedDept) {
        expect(navigatedDept).toBe(true);
      });
      navigation.verifyInstrumentCustomName(jsonData.InstrumentCustomName, jsonData.InstrumentActualName).then(function (instDisplayed) {
        expect(instDisplayed).toBe(true);
      });
      labsetup.navigateTO(jsonData.InstrumentCustomName).then(function (navigatedInst) {
        expect(navigatedInst).toBe(true);
      });
      // tslint:disable-next-line: max-line-length
      navigation.verifyControlCustomName(jsonData.ControlCustomName, jsonData.ControlActualName, jsonData.LotNumber).then(function (controlDisplayed) {
        expect(controlDisplayed).toBe(true);
      });
      labsetup.navigateTO(jsonData.ControlCustomName).then(function (navigatedInst) {
        expect(navigatedInst).toBe(true);
      });
      navigation.verifyAnalyteSetUpScreen().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

  // P1
  it('Test case 14: To verify if there are no departments, the list of instruments is the top level shown on the dashboard page @P1', function () {
    library.logStep('Test case 14: To verify if there are no departments, the list of instruments is the top level shown on the dashboard page');
    library.logStep('Test case 17:After clicking on Bio-Rad logo, the user will be navigated to Bio-Rad.com');
    out.signOut().then(function (signedOut) {
      expect(signedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username1, jsonData.Password1, jsonData.FirstName1).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    navigation.verifyInstrumentCustomName(jsonData.Instrument3CustomName, jsonData.Instrument3ActualName).then(function (instDisplayed) {
      expect(instDisplayed).toBe(true);
    });
    navigation.verifyBioRadLogoNavigation().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 17:After clicking on Bio-Rad logo, the user will be navigated to Bio-Rad.com', function () {
    library.logStep('Test case 17:After clicking on Bio-Rad logo, the user will be navigated to Bio-Rad.com');
    navigation.verifyBioRadLogoNavigation().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
