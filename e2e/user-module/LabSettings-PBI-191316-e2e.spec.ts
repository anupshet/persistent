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
 import { Dashboard } from '../page-objects/dashboard-e2e.po';
 import { LabSettings } from '../page-objects/lab-settings-e2e.po';
 import { AccoutManager } from '../page-objects/account-management-e2e.po';




 let jsonData;
 const library = new BrowserLibrary();
 const dashBoard = new Dashboard();
 const labSettings = new LabSettings();

 library.parseJson('./JSON_data/PBI-191316-LabSettings.json').then(function (data) {
   jsonData = data;
 });

 describe('Test Suite: PBI 7148 -7164 - Implement Lab settings (Gear icon) , Update Add Analyte screen for Lab setup', function () {
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
   const manager = new AccoutManager();

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

   it('Test Case 1 : Verify after clicking on Lab Settings option, Lab default setting popup will be shown.',function () {
       labSettings.goToLabSettings().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isLabSettingsDisplayed().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.clickOnCloseFromPopup().then(function (closed) {
         expect(closed).toBe(true);
       });
     });

     it('Test Case 2 : Verify default values shown for the fields in the Lab default settings popup' +
     'Test Case 3: Verify after clicking on Close button, Lab default settings popup should be closed without saving the changes',function () {
       labSettings.goToLabSettings().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isLabSettingsDisplayed().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isCorrectDefaultValueDisplayed().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.changeDefaultValues().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.clickOnCloseFromPopup().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.goToLabSettings().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isCorrectDefaultValueDisplayed().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.clickOnCloseFromPopup().then(function (status) {
         expect(status).toBe(true);
       });
     });

     it('Test Case 4 : Verify after clicking on CONFIRM button, changes are saved successfully in the system' +
     'Test Case 5 : To verify data entry type selected(Point) on Lab settings reflects on newly added control and analyte setting screen'+
     'Test Case 6 : Verify Select reagent and calibrator lot checkboxes on add analyte are not displayed when "track reagent and calibrator lot" option is selected to YES on Lab settings',function () {
       labSettings.goToLabSettings().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isLabSettingsDisplayed().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.selectPointOptions().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.selectYesOptions().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.clickOnConfirmFromPopup().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.goToLabSettings().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isPointValueSelected().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isYesSelected().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.clickOnCloseFromPopup().then(function (status) {
         expect(status).toBe(true);
       });
       setting.navigateTO(jsonData.DeptName).then(function (dept) {
         expect(dept).toBe(true);
       });
       setting.navigateTO(jsonData.InstName).then(function (inst) {
         expect(inst).toBe(true);
       });
       control.clickAddControlLink().then(function (result) {
         expect(result).toBe(true);
       });
       control.clickOnFirstControlList().then(function (result) {
         expect(result).toBe(true);
       });
       control.selectControl(jsonData.cntrlName).then(function (selected) {
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
       labSettings.verifySelectReagentLotNoCheckboxIsdisplayed().then(function (NotEnabled) {
         expect(NotEnabled).toBe(false);
       });
       labSettings.verifySelectCalibratorLotNoCheckboxIsDisplayed().then(function (NotEnabled) {
         expect(NotEnabled).toBe(false);
       });
       analyte.selectAnalyteName(jsonData.analyteName).then(function (selected) {
         expect(selected).toBe(true);
       });
       analyte.selectReagent(jsonData.Reagent).then(function (cancelled) {
         expect(cancelled).toBe(true);
       });
       analyte.clickAddAnalyteButton().then(function (cancelled) {
         expect(cancelled).toBe(true);
       });
       setting.navigateTO(jsonData.DeptName).then(function (dept) {
         expect(dept).toBe(true);
       });
       setting.navigateTO(jsonData.InstName).then(function (inst) {
         expect(inst).toBe(true);
       });
       setting.navigateTOControlLot(jsonData.lotNumber).then(function (dept) {
         expect(dept).toBe(true);
       });

       setting.clickOnEditThisControlLink().then(function (navigated) {
         expect(navigated).toBe(true);
       });
       analyteSettings.isSummaryEnabled().then(function (enabled) {
         expect(enabled).toBe(false);
       });
       labsetup.navigateTO(jsonData.analyteName).then(function (navigated) {
         expect(navigated).toBe(true);
       });
       setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
         expect(clickedEditLink).toBe(true);
       });
       analyteSettings.isSummaryEnabled().then(function (enabled) {
         expect(enabled).toBe(false);
       });

     });

     it('Test case 7 : Verify Select reagent and calibrator lot checkboxes on add analyte are displayed when "track reagent and calibrator lot" option is selected to NO on Lab settings',function () {
       dashBoard.goToLabSettings().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isLabSettingsDisplayed().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.selectNoOptions().then(function (status) {
         expect(status).toBe(true);
       });
       analyteSettings.selectDecimal(jsonData.DefaultDecimal).then(function (enabled) {
         expect(enabled).toBe(true);
       });
       labSettings.clickOnConfirmFromPopup().then(function (status) {
         expect(status).toBe(true);
       });
       dashBoard.goToLabSettings().then(function (status) {
         expect(status).toBe(true);
       });
       labSettings.isYesSelected().then(function (status) {
         expect(status).toBe(false);
       });
       analyteSettings.isDecimalSelected(jsonData.DefaultDecimal).then(function (status) {
         expect(status).toBe(true);
       });

       labSettings.clickOnCloseFromPopup().then(function (status) {
         expect(status).toBe(true);
       });
       setting.navigateTO(jsonData.DeptName).then(function (dept) {
         expect(dept).toBe(true);
       });
       setting.navigateTO(jsonData.InstName).then(function (inst) {
         expect(inst).toBe(true);
       });
       control.clickAddControlLink().then(function (result) {
         expect(result).toBe(true);
       });
       control.clickOnFirstControlList().then(function (result) {
         expect(result).toBe(true);
       });
       control.selectControl(jsonData.cntrlName).then(function (selected) {
         expect(selected).toBe(true);
       });
       control.clickOnFirstLotNumberList().then(function (result) {
         expect(result).toBe(true);
       });
       control.selectControlLotNumber(jsonData.lotNumber1).then(function (selected) {
         expect(selected).toBe(true);
       });
       control.clickAddControlButton().then(function (clicked) {
         expect(clicked).toBe(true);
       });
       labsetup.verifySelectReagentLotNoCheckboxIsdisplayed().then(function (NotEnabled) {
         expect(NotEnabled).toBe(true);
       });
       labsetup.verifySelectCalibratorLotNoCheckboxIsDisplayed().then(function (NotEnabled) {
         expect(NotEnabled).toBe(true);
       });
       analyte.selectAnalyteName(jsonData.analyteName).then(function (selected) {
         expect(selected).toBe(true);
       });
       analyte.selectReagent(jsonData.Reagent).then(function (status) {
         expect(status).toBe(true);
       });
       analyte.MethodFieldDisplayed().then(function (status) {
         expect(status).toBe(false);
       });
       analyte.clickAddAnalyteButton().then(function (cancelled) {
         expect(cancelled).toBe(true);
       });
     });


     it('Test Case 8 :Verify selected decimal places at Lab setting are displayed on control/analyte setting page',function () {
       setting.navigateTO(jsonData.DeptName).then(function (dept) {
         expect(dept).toBe(true);
       });
       setting.navigateTO(jsonData.InstName).then(function (inst) {
         expect(inst).toBe(true);
       });
       setting.navigateTOControlLot(jsonData.lotNumber1).then(function (dept) {
         expect(dept).toBe(true);
       });
       setting.clickOnEditThisControlLink().then(function (navigated) {
         expect(navigated).toBe(true);
       });
       inheritedSettings.verifyDecimalPlaceSelected(jsonData.DefaultDecimal).then(function (verified) {
         expect(verified).toBe(true);
       });
       labsetup.navigateTO(jsonData.analyteName).then(function (navigated) {
         expect(navigated).toBe(true);
       });
       setting.clickOnEditThisAnalyteLink().then(function (clickedEditLink) {
         expect(clickedEditLink).toBe(true);
       });
       inheritedSettings.verifyDecimalPlaceSelected(jsonData.DefaultDecimal).then(function (verified) {
         expect(verified).toBe(true);
       });
     });
 });
