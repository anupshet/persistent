//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/advancedlj-210197-test.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: PBI 210197: Implement "Y-axis" dropdown and request cumulative mean/SD when selected. Display the cumulative mean and SD on the primary Y-axis', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const advancedLj=new AdvancedLJ();
  let imageName,details;
  const time='October 10, 2021';

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      browser.sleep(10000);
      expect(loggedIn).toBe(true);
    });
    advancedLj.setBrowserDateTime(time).then(function (set) {
      expect(set).toBe(true);
  });
  });

  afterEach(function () {
    advancedLj.verifyImageComparison(imageName,details).then(async function (clicked) {
      await expect(clicked).toBe(true);
    });
    out.signOut();
  });

  it('Test Case 1: To verify Y-axis dropdown presence and its options.', function () {
    imageName=jsonData.image1;
    details='Eval mean, cumulative mean and z-score are present in y-axis dropdown options.';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyYaxisDropdownPresent().then(function (present) {
      expect(present).toBe(true);
    });
    advancedLj.verifyYaxisDropdownOptions().then(function (present) {
      expect(present).toBe(true);
    });
  });
  it('Test Case 2: To verify by default eval mean option is selected in y-axis dropdown', function () {
    imageName=jsonData.image2;
    details='By default eval mean option is selected';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.verifyYAxisDefaultState().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 3: To verify plot charts , when cumulative mean option is selected.', function () {
    imageName=jsonData.image3;
    details='Plot charts are displayed as per cumulative mean';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectYaxisDropdownValue('Cumulative mean').then(function (selected) {
      expect(selected).toBe(true);
    });
  });
  it('Test Case 4: To verify plot charts , when evaluation mean option is selected. @P1', function () {
    imageName=jsonData.image4;
    details='Plot charts are displayed as per evaluation mean';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    }) ;
  });
});
