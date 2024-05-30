import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/advancedlj-210285-test.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: PBI 210285: Display number of peer/method instruments', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const advancedLj=new AdvancedLJ();
  let imageName,details;
  const time='November 10, 2021';

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
 
  it('Test Case 1: To verify peer number of instruments displayed for the valid configuration of instrument-control-analyte for 30 days timeframe', function () {
    imageName=jsonData.image1;
    details='Peer Instruments for 30 days is displayed.';
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
    advancedLj.clickComparisonDD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectComparisonDD('Peer mean').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickRangeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectRangeDropdownValues('30 days').then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 2: To verify peer number of instruments displayed for the valid configuration of instrument-control-analyte for 60 days timeframe', function () {
    imageName=jsonData.image2;
    details='Peer Instruments for 60 days is displayed.';
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
    advancedLj.clickComparisonDD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectComparisonDD('Peer mean').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickRangeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectRangeDropdownValues('60 days').then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 3: To verify peer number of instruments displayed for the valid configuration of instrument-control-analyte for 90 days timeframe', function () {
    imageName=jsonData.image3;
    details='Peer Instruments for 90 days is displayed.';
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
    advancedLj.clickComparisonDD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectComparisonDD('Peer mean').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickRangeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectRangeDropdownValues('90 days').then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 4: To verify peer number of instruments displayed for the valid configuration of instrument-control-analyte for cumulative', function () {
    imageName=jsonData.image4;
    details='Peer Instruments for cumulative is displayed.';
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
    advancedLj.clickComparisonDD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectComparisonDD('Peer mean').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickRangeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectRangeDropdownValues('Cumulative').then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 5: To verify method number of instruments displayed for the valid configuration of control-analyte its method for 30 days timeframe', function () {
    imageName=jsonData.image5;
    details='Method Instruments for 30 days is displayed.';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickComparisonDD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectComparisonDD('Method mean').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickRangeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectRangeDropdownValues('30 days').then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 6: To verify method number of instruments displayed for the valid configuration of control-analyte its method for 60 days timeframe', function () {
    imageName=jsonData.image6;
    details='Method Instruments for 60 days is displayed.';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickComparisonDD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectComparisonDD('Method mean').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickRangeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectRangeDropdownValues('60 days').then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 7: To verify method number of instruments displayed for the valid configuration of control-analyte its method for 90 days timeframe', function () {
    imageName=jsonData.image7;
    details='Method Instruments for 90 days is displayed.';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickComparisonDD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectComparisonDD('Method mean').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickRangeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectRangeDropdownValues('90 days').then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test Case 8: To verify method number of instruments displayed for the valid configuration of control-analyte for cumulative', function () {
    imageName=jsonData.image8;
    details='Method Instruments for cumulative is displayed.';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickComparisonDD().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectComparisonDD('Method mean').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickRangeDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectRangeDropdownValues('Cumulative').then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
});