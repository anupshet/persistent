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

library.parseJson('./JSON_data/NewLabSetupAddControl.json').then(function(data) {
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


  // // // // Test Cases 69, 71 are clubbed here
  it('Test case 70: Verify the UI Components on Add Control Screen', function () {
    library.logStep('Test case 70: Verify the UI Components on Add Control Screen');
    library.logStep('Test case 72: Verify Control Name dropdown on Add Control Page');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    const selectDropdown = jsonData.DropDownNameForSortingControl;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.verifyAddControlPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    control.verifyDefaultControlsDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.verifyListSortedAlphabetically(selectDropdown).then(function (status) {
      expect(status).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyLotnumberDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    control.verifyCustomNameDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });


  // // TC 74 is covered here
  it('Test case 73: Verify Lot Number dropdown on Add Control Page', function () {
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    const lotNumber = jsonData.ControlLotNumber;
    library.logStep('Test case 73: Verify Lot Number dropdown on Add Control Page');
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(lotNumber).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyAddControlButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
  });

  it('Test case 75: Verify that user will not be able to add more than 50 characters in Custom Name Field on Add Control Page',
    function () {
      const depName = jsonData.Dept1Name;
      const instName = jsonData.Instrument1Model;
      const cntrlName = jsonData.ControlName;
      const lotNumber = jsonData.ControlLotNumber;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      control.clickOnFirstControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(cntrlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstLotNumberList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControlLotNumber(lotNumber).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.enterDataControlName(jsonData.CustomNameMaxCharacter).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.verifyCustomNameMaxLength().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

  it('Test case 77: Verify that user is able to add more Controls by clicking on Another Control? Link', function () {
    log4jsconfig.log().info('Test case 77: Verify that user is able to add more Controls by clicking on Another Control? Link');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.addAnotherControl().then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyAnotherControlAdded().then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  // Test case 78 covered here
  it('Test case 79: Verify that newly added 4 Control fields will be removed after clicking on Cancel Button on Add Control Page',
    function () {
      const depName = jsonData.Dept1Name;
      const instName = jsonData.Instrument1Model;
      const cntrlName = jsonData.ControlName;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      control.addAnotherControl().then(function (selected) {
        expect(selected).toBe(true);
      });
      control.verifyAnotherControlAdded().then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(cntrlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnCancel().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      control.verifyDefaultControlsDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

  it('Test case 80: Verify that Control will be added on by adding Control Details in 3rd Control Field'
    + ' on Add Control Page', function () {
      const depName = jsonData.Dept1Name;
      const instName = jsonData.Instrument1Model;
      const cntrlName = jsonData.ControlName;
      const lotNumber = jsonData.ControlLotNumber;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      control.clickOnThirdControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(cntrlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstLotNumberList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControlLotNumber(lotNumber).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.verifyAddControlButtonEnabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
    });

  it('Test case 81: Verify that Clicking on Cancel Button will clear the form on Add Control Page', function () {
    log4jsconfig.log().info('Test case 81: Verify that Clicking on Cancel Button will clear the form on Add Control Page');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    const lotNumber = jsonData.ControlLotNumber;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(lotNumber).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyAddControlButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    control.clickOnCancel().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    control.verifyAddControlButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

  it('Test case 82: Verify that Control can be added on Add Control Page', function () {
    library.logStep('Test case 82: Verify that Control can be added on Add Control Page');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    const lotNumber = jsonData.ControlLotNumber;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (Navigated2) {
      expect(Navigated2).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(lotNumber).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickAddControlButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(cntrlName).then(function (created1) {
      expect(created1).toBe(true);
    });
  });

});
