/**
* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
*/
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { NewLabDepartment } from '../page-objects/new-lab-department-e2e.po';
import { AddControl } from '../page-objects/new-labsetup-add_Control-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { Locations } from '../page-objects/locations-e2e.po';

let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/WelcomeScreen-PBI-191316.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: PBI 191316 - Implement Welcome screen with the listed selections for the initial lab setup', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const labsetupDept = new NewLabDepartment();
  const control = new AddControl();
  const analyte = new AddAnalyte();
  const setting = new Settings();
  const analyteSettings = new AnalyteSettings();
  const inheritedSettings = new InheritedSettings();
  const location = new Locations();
  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
    });
  });
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 1 : Verify welcome screen is displayed for new location added' +
    'Test Case 2 : Verify welcome screen UI is displayed for the new account' +
    'Test Case 3 : To verify options are selected by default on welcome screen', function () {
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location1).then(function (result) {
      expect(result).toBe(true);
    });
    labsetup.verifyWelcomeScreenUI().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.verifyWelcomeUIOptionsSelectedByDefault().then(function (selected) {
      expect(selected).toBe(true);
    });
    labsetup.veriifyLetsGoBtnIsEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    labsetup.verifyWelcomeScreenUI().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.verifyWelcomeUIOptionsSelectedByDefault().then(function (selected) {
      expect(selected).toBe(true);
    });
    labsetup.veriifyLetsGoBtnIsEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
  });

  it('Test Case 4 : To verify data entry type selected on welcome screen reflects on control and analyte setting screen for that location' +
    'Test Case 5 : Verify Select reagent and calibrator lot checkboxes on add analyte are not displayed for that location' +
    'when "Unity can track..." option is selected to Yes on welcome screen for that location', function () {
      location.openLocationDropdown().then(function (result) {
        expect(result).toBe(true);
      });
      location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
        expect(result).toBe(true);
      });
      location.selectLocationFromDropdown(jsonData.Location1).then(function (result) {
        expect(result).toBe(true);
      });
      labsetup.clickOnLetsGoBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetupDept.addFirstDepartmentName(jsonData.Dept).then(function (dept1NameAdded) {
        expect(dept1NameAdded).toBe(true);
      });
      labsetupDept.verifySelectManagerUser().then(function (singleUser) {
        expect(singleUser).toBe(true);
      });
      labsetupDept.clickAddDepartmentsButton().then(function (addDeptClicked) {
        expect(addDeptClicked).toBe(true);
      });
      labsetup.selectManufacturerName(jsonData.ManufacturerName).then(function (select) {
        expect(select).toBe(true);
      });
      labsetup.selectInstrumentName(jsonData.Instrument1Model).then(function (select) {
        expect(select).toBe(true);
      });
      labsetup.clickAddInstrumentsButton().then(function (click) {
        expect(click).toBe(true);
      });
      control.clickOnFirstControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(jsonData.controlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstLotNumberList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControlLotNumber(jsonData.lotNumber).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickAddControlButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.verifySelectReagentLotNoCheckboxIsdisplayed().then(function (NotEnabled) {
        expect(NotEnabled).toBe(false);
      });
      labsetup.verifySelectCalibratorLotNoCheckboxIsDisplayed().then(function (NotEnabled) {
        expect(NotEnabled).toBe(false);
      });
      analyte.selectAnalyteName(jsonData.AnalyteName).then(function (selected) {
        expect(selected).toBe(true);
      });
      analyte.selectUnit(jsonData.UnitOfMeasure, '1').then(function (selected) {
        expect(selected).toBe(true);
      });
      analyte.clickAddAnalyteButton().then(function (cancelled) {
        expect(cancelled).toBe(true);
      });
      setting.goToHomePage().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(jsonData.Dept).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(jsonData.Instrument1Model).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(jsonData.controlName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.clickOnEditThisControlLink().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      analyteSettings.isSummaryEnabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      labsetup.navigateTO(jsonData.AnalyteName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.isSummaryEnabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
    });
  it('Test Case 6 : Verify selected decimal places at welcome screen are displayed on control/analyte setting page for that location', function () {
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName2).then(function (result) {
      expect(result).toBe(true);
    });
    //For this location the settings should be different
    location.selectLocationFromDropdown(jsonData.Location2).then(function (result) {
      expect(result).toBe(true);
    });
    labsetup.navigateTO(jsonData.Dept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument1Model).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.controlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    inheritedSettings.verifyDecimalPlaceSelected(jsonData.SelectedDecimal).then(function (verified) {
      expect(verified).toBe(false);
    });
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location1).then(function (result) {
      expect(result).toBe(true);
    });
    labsetup.navigateTO(jsonData.Dept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument1Model).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.controlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    inheritedSettings.verifyDecimalPlaceSelected(jsonData.SelectedDecimal).then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(jsonData.AnalyteName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    inheritedSettings.verifyDecimalPlaceSelected(jsonData.SelectedDecimal).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test Case 7 : To verify selected options reflects on control and analyte at add or settings page for that location' +
    'Test Case 8 : Verify "We have no departments" option allows to add instrument without department for that location', function () {
      location.openLocationDropdown().then(function (result) {
        expect(result).toBe(true);
      });
      location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
        expect(result).toBe(true);
      });
      location.selectLocationFromDropdown(jsonData.Location3).then(function (result) {
        expect(result).toBe(true);
      });
      labsetup.selectDataEntryType(jsonData.DataEntryType).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.selectIsGroupedByDept(jsonData.GroupedByDept).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.selecttrackByCR(jsonData.TrackByCR).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.selectDecimalPoints(jsonData.SelectedDecimal2).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.clickOnLetsGoBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.selectManufacturerName(jsonData.ManufacturerName).then(function (select) {
        expect(select).toBe(true);
      });
      labsetup.selectInstrumentName(jsonData.Instrument1Model).then(function (select) {
        expect(select).toBe(true);
      });
      labsetup.clickAddInstrumentsButton().then(function (click) {
        expect(click).toBe(true);
      });
      control.clickOnFirstControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(jsonData.controlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstLotNumberList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControlLotNumber(jsonData.lotNumber).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickAddControlButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.verifySelectReagentLotNoCheckboxIsdisplayed().then(function (status) {
        expect(status).toBe(true);
      });
      labsetup.verifySelectCalibratorLotNoCheckboxIsDisplayed().then(function (NotEnabled) {
        expect(NotEnabled).toBe(true);
      });
      analyte.selectAnalyteName(jsonData.AnalyteName).then(function (selected) {
        expect(selected).toBe(true);
      });
      analyte.selectUnit(jsonData.UnitOfMeasure, '1').then(function (selected) {
        expect(selected).toBe(true);
      });
      analyte.clickAddAnalyteButton().then(function (cancelled) {
        expect(cancelled).toBe(true);
      });
      setting.goToHomePage().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(jsonData.Instrument1Model).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(jsonData.controlName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.clickOnEditThisControlLink().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      analyteSettings.isSummaryEnabled().then(function (enabled) {
        expect(enabled).toBe(false);
      });
      inheritedSettings.verifyDecimalPlaceSelected(jsonData.SelectedDecimal2).then(function (verified) {
        expect(verified).toBe(true);
      });
      labsetup.navigateTO(jsonData.AnalyteName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
        expect(clickedEditLink).toBe(true);
      });
      analyteSettings.isSummaryEnabled().then(function (enabled) {
        expect(enabled).toBe(false);
      });
      inheritedSettings.verifyDecimalPlaceSelected(jsonData.SelectedDecimal2).then(function (verified) {
        expect(verified).toBe(true);
      });
    });
});
