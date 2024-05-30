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

library.parseJson('./JSON_data/NewLabSetupAddDepartment.json').then(function(data) {
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

  // // Test Case 21, 22, 23, 26, 27 are clubbed here
  it('Test case 22: Verify Add Department UI Components', function () {
    library.logStep('Test case 22: Verify Add Department UI Components');
    library.logStep('Test case 26: Verify Department Name Field on Add Departments Page');
    library.logStep('Test case 29: Verify Manager Name dropdown on Add Departments Page');
    labsetupDept.verifyDepartmentSetupPage(jsonData.LabName).then(function (pageValidation) {
      expect(pageValidation).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.InvalidDept1).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.deptNameFieldValidation().then(function (fieldValidation) {
      expect(fieldValidation).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.verifyAddDeptButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labsetupDept.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.Dept1Name).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.verifyAddDeptButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labsetupDept.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });

  });


  // // Test Case 33 & 34 are clubbed here
  it('Test case 30: Verify that user is able to add more departments by clicking on Another Department? Link', function () {
    library.logStep('Test case 30: Verify that user is able to add more departments by clicking on Another Department? Link');
    library.logStep('Test case 32: Verify that Clicking on Cancel Button will clear the form on Add Department Page');
    labsetupDept.verifyCountOfDepartmentFields().then(function (countDept) {
      expect(countDept).toBe(3);
    });
    labsetupDept.clickAnotherDepartmentLink().then(function (anotherDeptLinkClicked) {
      expect(anotherDeptLinkClicked).toBe(true);
    });
    labsetupDept.verifyCountOfDepartmentFields().then(function (countDept) {
      expect(countDept).toBe(4);
    });
    labsetupDept.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.Dept1Name).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.verifyAddDeptButtonEnabled().then(function (addDeptEnabled) {
      expect(addDeptEnabled).toBe(true);
    });
    labsetupDept.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    labsetupDept.firstDeptNameFieldBlank().then(function (blank) {
      expect(blank).toBe(true);
    });
    labsetupDept.verifyDepartmentSetupPage(jsonData.LabName).then(function (pageValidation) {
      expect(pageValidation).toBe(true);
    });
  });


  it('Test case 34: Verify that newly added 4 Department fields will be removed after clicking on Cancel Button on Add Department Page',
    function () {
      labsetupDept.clickAnotherDepartmentLink().then(function (added1) {
        expect(added1).toBe(true);
      });
      labsetupDept.clickAnotherDepartmentLink().then(function (added2) {
        expect(added2).toBe(true);
      });
      labsetupDept.clickAnotherDepartmentLink().then(function (added3) {
        expect(added3).toBe(true);
      });
      labsetupDept.clickAnotherDepartmentLink().then(function (added4) {
        expect(added4).toBe(true);
      });
      labsetupDept.verifyCountOfDepartmentFields().then(function (count) {
        expect(count).toBe(7);
      });
      labsetupDept.addFirstDepartmentName(jsonData.Dept1Name).then(function (dept1NameAdded) {
        expect(dept1NameAdded).toBe(true);
      });
      labsetupDept.verifySelectManagerUser().then(function (singleUser) {
        expect(singleUser).toBe(true);
      });
      labsetupDept.clickCancelButton().then(function (cancelClicked) {
        expect(cancelClicked).toBe(true);
      });
      labsetupDept.verifyDepartmentSetupPage(jsonData.LabName).then(function (pageValidation) {
        expect(pageValidation).toBe(true);
      });
    });

  // Test Case 35 & 36 are clubbed here
  it('Test case 36: Verify that Department can be added on Add Department Page', function () {
    log4jsconfig.log().info('Test case 36: Verify that Department can be added on Add Department Page');
    labsetupDept.addFirstDepartmentName(jsonData.Dept1Name).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.addThirdDeptName(jsonData.Dept3Name).then(function (dept3NameAdded) {
      expect(dept3NameAdded).toBe(true);
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
    labsetup.verifyInstrumentControlAnalyteCreated(jsonData.Dept1Name).then(function (added) {
      expect(added).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(jsonData.Dept3Name).then(function (added) {
      expect(added).toBe(true);
    });
  });

});
