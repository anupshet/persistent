/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';
import { Locations } from '../page-objects/Locations-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
const locations = new Locations();



let jsonData;
const library = new BrowserLibrary();
const archivingLots = new ArchivingLots();

library.parseJson('./JSON_data/Archive_Multilocation_US_7588.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: US_7588 - Archive with Multi-locations', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();

  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
    });
  });
  afterEach(function () {
    out.signOut();
  });


  it('Test Case 1 : Verify existing user without multi location is able to see archive toggle when user login and it has archive item in it.' +
    'Test case 2: Verify user is able to see archive toggle when user with single location login and it has archive item in it.', function () {
      loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });

      locations.verifyDefaultLocation(jsonData.defaultLocation1).then(function (present) {
        expect(present).toBe(true);
      });
      archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      archivingLots.clickArchiveItemToggle().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      archivingLots.verifyleftNavigationGreyedOut(jsonData.deptName).then(function (verified) {
        expect(verified).toBe(true);
      });
    });

  it('Test Case 3 : Verify user is able to see archive toggle when user with multi location login and it has archive item in it.', function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username2, jsonData.Password2, jsonData.FirstName2).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    locations.verifyDefaultLocation(jsonData.defaultLocation2).then(function (present) {
      expect(present).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.navigateTO(jsonData.deptName2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(jsonData.instName2).then(function (verified) {
      expect(verified).toBe(true);
    });
  });


  it('Test Case 4 : Verify user is not able to see archive toggle when user with single location login and it do not have archieve item.', function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username3, jsonData.Password3, jsonData.FirstName3).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    locations.verifyDefaultLocation(jsonData.defaultLocation3).then(function (present) {
      expect(present).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
  });

  it('Test Case 5 :Verify user is not able to see archive toggle when user with multi location login and it do not have archieve item.', function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username4, jsonData.Password4, jsonData.FirstName4).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    locations.verifyDefaultLocation(jsonData.defaultLocation4).then(function (present) {
      expect(present).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
  });

  it('Test Case 6 : Verify archive item shown are correctly displayed when user change to location which do not have archive item.', function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username2, jsonData.Password2, jsonData.FirstName2).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    locations.verifyDefaultLocation(jsonData.defaultLocation2).then(function (present) {
      expect(present).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.navigateTO(jsonData.deptName2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(jsonData.instName2).then(function (verified) {
      expect(verified).toBe(true);
    });
    locations.openLocationDropdown().then(function (present) {
      expect(present).toBe(true);
    });
    locations.selectGroupFromDropdown(jsonData.Group2).then(function (status) {
      expect(status).toBe(true);
    });
    locations.selectLocationFromGroup(jsonData.Location2).then(function (status) {
      expect(status).toBe(true);
    });
    locations.verifyDefaultLocation(jsonData.Location2).then(function (present) {
      expect(present).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
  });

  it('Test Case 7 : Verify archive item shown are correctly displayed when user change to location which have archive item.', function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username5, jsonData.Password5, jsonData.FirstName5).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    locations.verifyDefaultLocation(jsonData.defaultLocation5).then(function (present) {
      expect(present).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    locations.openLocationDropdown().then(function (present) {
      expect(present).toBe(true);
    });
    locations.selectLocationFromDropdown(jsonData.Location5).then(function (status) {
      expect(status).toBe(true);
    });
    locations.verifyDefaultLocation(jsonData.Location5).then(function (present) {
      expect(present).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.navigateTO(jsonData.deptName5).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.instName5).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ctrlName5).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(jsonData.analyteName5).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
