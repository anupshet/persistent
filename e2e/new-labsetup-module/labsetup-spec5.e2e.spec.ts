/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { NewLabDepartment } from '../page-objects/new-lab-department-e2e.po';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
import { AddControl } from '../page-objects/new-labsetup-add_Control-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { Feedback } from '../page-objects/new-lab-feedback-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';


const library = new BrowserLibrary();

const fs = require('fs');
const fileToUpload = '../resources/filename.txt';
const invaliFileWExt = '../resources/invalidFileExtenstion.json';
const fileMaxSize = '../resources/FileOver8MB.pdf';
let jsonData;


library.parseJson('./JSON_data/NewLabSetupAddAnalyte2.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: New Lab Setup', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const labsetupDept = new NewLabDepartment();
  const control = new AddControl();
  const analyte = new AddAnalyte();
  const feedback = new Feedback();
  const navigation = new NewNavigation();
  let flagForIEBrowser: boolean;
  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
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

  it('Test Case 67:Verify that the user can follow steps for instrument creation for another department,'
    + ' by selecting it from left navigation', function () {
      const toDept = 'dept3';
      const createdName = jsonData.Instrument1Model2;
      const customName = jsonData.Instrument1CustomName2;
      labsetup.navigateTO(toDept).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.addInstrument(jsonData.Instrument1ManufacturerName2,
        jsonData.Instrument1Model2, jsonData.Instrument1CustomName2, jsonData.Instrument1SerialNo2).then(function (added) {
          expect(added).toBe(true);
        });
      labsetup.clickAddInstrumentsButton().then(function (click) {
        expect(click).toBe(true);
      });
      if (flagForIEBrowser === true) {
      labsetup.goToListOfDepartments().then(function (navigatedToDept) {
        expect(navigatedToDept).toBe(true);
      });
      labsetup.navigateTO(toDept).then(function (navigated) {
        expect(navigated).toBe(true);
      });
       }
      labsetup.verifyInstrumentControlAnalyteCreated(customName).then(function (cleared) {
        expect(cleared).toBe(true);
      });
      labsetup.verifyInsrumentNameDisplayedUnderneathCustomName(createdName).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });


  it('Test case 83: Verify that the user can follow steps for control creation for another instrument,'
    + ' by selecting it from left navigation ', function () {
      const depName = jsonData.Dept3Name;
      const instName = jsonData.Instrument1CustomName2;
      const controlName = jsonData.ControlName2;
      const lotNumber = jsonData.ControlLotNumber2;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated1) {
        expect(navigated1).toBe(true);
      });
      control.clickOnFirstControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(controlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstLotNumberList().then(function (result2) {
        expect(result2).toBe(true);
      });
      control.selectControlLotNumber(lotNumber).then(function (selected2) {
        expect(selected2).toBe(true);
      });
      control.enterDataControlName(jsonData.ControlCustomName2).then(function (selected3) {
        expect(selected3).toBe(true);
      });
      control.clickAddControlButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.verifyInstrumentControlAnalyteCreated(jsonData.ControlCustomName2).then(function (created) {
        expect(created).toBe(true);
      });
      labsetup.verifyInsrumentControlNameDisplayedUnderneathCustomName(controlName).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });


  it('Test case 122  : Verify that Levels in use selected at the time of Analyte adding should match with '
    + 'levels in use on Multi Summary & Multi Point Data Entry Page  ', function () {
      // tslint:disable-next-line:no-shadowed-variable
      const unit = jsonData.Unit5;
      const analyteName3 = jsonData.AnalyteName5;
      const depName = jsonData.Dept3Name;
      const instName = jsonData.Instrument1CustomName2;
      const contName = jsonData.ControlCustomName2;
      const levels = jsonData.Level1;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(contName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      analyte.selectLevelInUse(levels).then(function (checked) {
        expect(checked).toBe(true);
      });
      analyte.selectAnalyteName(analyteName3).then(function (selected) {
        expect(selected).toBe(true);
      });
      analyte.selectUnit(unit, '1').then(function (units) {
        expect(units).toBe(true);

      });
      analyte.clickAddAnalyteButton().then(function (cancelled) {
        expect(cancelled).toBe(true);
      });
      labsetup.navigateTO(depName).then(function (navigated2) {
        expect(navigated2).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated2) {
        expect(navigated2).toBe(true);
      });
      labsetup.navigateTO(contName).then(function (navigated2) {
        expect(navigated2).toBe(true);
      });
      labsetup.navigateTO(analyteName3).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      analyte.verifyNumberOfLevelDisplayed(levels).then(function (level) {
        expect(level).toBe(true);
      });
      analyte.clickEditThisAnalyteLink().then(function (editLvl) {
        expect(editLvl).toBe(true);
      });
      analyte.clickSummaryEntryToggle().then(function (toggle) {
        expect(toggle).toBe(true);
      });
      analyte.clickUpdateButton().then(function (update) {
        expect(update).toBe(true);
      });
      analyte.verifyNumberOfLevelDisplayedPoint(levels).then(function (level) {
        expect(level).toBe(true);
      });
    });

  it('Test case 123  : To verify that, the user is able to add multiple analytes.', function () {
    const unit = jsonData.Unit5;
    const analyteName6 = jsonData.AnalyteName6;
    const analyteName7 = jsonData.AnalyteName7;
    const depName = jsonData.Dept3Name;
    const instName = jsonData.Instrument1CustomName2;
    const contName = jsonData.ControlCustomName2;
    const levels = '2';
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickEditThisControlLink().then(function (edit) {
      expect(edit).toBe(true);
    });
    control.clickAddAnAnalyteLink().then(function (addAnalyteLink) {
      expect(addAnalyteLink).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.selectAnalyteName(analyteName6).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectAnalyteName(analyteName7).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (addclick) {
      expect(addclick).toBe(true);
    });
    if (flagForIEBrowser === true) {
    labsetup.goToListOfDepartments().then(function (navigatedToDept) {
      expect(navigatedToDept).toBe(true);
    });
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
      }
    labsetup.verifyInstrumentControlAnalyteCreated(analyteName6).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(analyteName7).then(function (analyte2) {
      expect(analyte2).toBe(true);
    });
  });

  it('Test case 124  : To verify that, the user can create analytes in another control.', function () {
    const analyteName8 = jsonData.AnalyteName8;
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const contName = jsonData.ControlName;
    const levels = '1';
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickEditThisControlLink().then(function (edit) {
      expect(edit).toBe(true);
    });
    control.clickAddAnAnalyteLink().then(function (addAnalyteLink) {
      expect(addAnalyteLink).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.selectAnalyteName(analyteName8).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit('g/L', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (addclick) {
      expect(addclick).toBe(true);
    });
    if (flagForIEBrowser === true) {
    labsetup.goToListOfDepartments().then(function (navigatedToDept) {
      expect(navigatedToDept).toBe(true);
    });
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    }
    labsetup.verifyInstrumentControlAnalyteCreated(analyteName8).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
  });


  it('Test case 125  : To verify that, the user can create analytes in control present in different instrument.', function () {
    const analyteName9 = jsonData.AnalyteName9;
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1CustomName2;
    const contName = jsonData.ControlName5;
    const levels = '1';
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(contName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber('34000').then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickAddControlButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.selectAnalyteName(analyteName9).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit('%', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (addclick) {
      expect(addclick).toBe(true);
    });
    if (flagForIEBrowser === true) {
    labsetup.goToListOfDepartments().then(function (navigatedToDept) {
      expect(navigatedToDept).toBe(true);
    });
    }
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(analyteName9).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
  });

  it('Test case 135: Verify that the Departments in Left Navigation are alphabetically sorted.', function () {
    const depName = jsonData.Dept1Name;
    labsetup.clickLabName().then(function (labName) {
      expect(labName).toBe(true);
    });
    labsetup.clickAddADepartment().then(function (addDept) {
      expect(addDept).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.Dept11).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.addThirdDeptName(jsonData.Dept12).then(function (dept3NameAdded) {
      expect(dept3NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.clickAddDepartmentsButton().then(function (addDeptClicked) {
      expect(addDeptClicked).toBe(true);
    });
    labsetup.verifyLeftNavigationListSorted().then(function (sorted) {
      expect(sorted).toBe(true);
    });
  });

  it('Test case 136: Verify that the Instruments in Left Navigation are alphabetically sorted   .', function () {
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.clickAddAnInstrument().then(function (addInstru) {
      expect(addInstru).toBe(true);
    });
    labsetup.addInstrument(jsonData.Instrument2ManufacturerName, jsonData.Instrument2Model, '', '').then(function (added1) {
      expect(added1).toBe(true);
    });
    labsetup.addInstrument(jsonData.Instrument3ManufacturerName, jsonData.Instrument3Model, '', '').then(function (added1) {
      expect(added1).toBe(true);
    });
    labsetup.clickAddInstrumentsButton().then(function (click) {
      expect(click).toBe(true);
    });
    labsetup.verifyLeftNavigationListSorted().then(function (sorted) {
      expect(sorted).toBe(true);
    });
  });

  it('Test case 137: Verify that the Controls in Left Navigation are alphabetically sorted.', function () {
    const depName = jsonData.Dept1Name;
    const instrName = jsonData.Instrument1Model;
    const control1 = jsonData.Control5;
    const lot1 = jsonData.ControlLot5;
    const control2 = jsonData.Control6;
    const lot2 = jsonData.ControlLot6;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instrName).then(function (navigated1) {
      expect(navigated1).toBe(true);
    });
    labsetup.clickEditThisInstrument().then(function (clickEdit) {
      expect(clickEdit).toBe(true);
    });
    control.clickAddControlLink().then(function (addInstru) {
      expect(addInstru).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(control1).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(lot1).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickAddControlButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.verifyLeftNavigationListSorted().then(function (sorted) {
      expect(sorted).toBe(true);
    });
  });
});
