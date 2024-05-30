/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Locations } from '../page-objects/Locations-e2e.po';



let jsonData;
const library = new BrowserLibrary();
const locations = new Locations();

library.parseJson('./JSON_data/MultiLocation_US_7836_37.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: US_7836_7837 - Display lab with a multi location for LAB USER', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
    });
  });
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameLab, jsonData.PasswordLab, jsonData.FirstNameLab).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 1 : To verify that The default location displayed for a user when logging is the default location set in user management.',function () {
    locations.verifyDefaultLocation(jsonData.defaultLocation1).then(function (present) {
      expect(present).toBe(true);
    });
    locations.verifyMultiLocationIcon().then(function (present) {
      expect(present).toBe(true);
    });
  });

  it('Test Case 2 : To verify that when Labuser selects location then selected lab location name, related title information and location hierarchy elements  to be updated according to location.'+
  'Test case 3 : To verify that when there are multiple group then user will be presented with Group name(s) in collapsed manner with icon ">" for each group (LAB user)'+
  'Test case 4: To verify that clicking on ">" icon in front of group will display location under that group for Labuser' +
  'Test case 6: To verify that when Labuser clicks on a different location should load Unity Next for selected location and name shown next to the icon should change to the selected lab.',function () {
    locations.openLocationDropdown().then(function (present) {
      expect(present).toBe(true);
    });
    locations.selectGroupFromDropdown(jsonData.Group2).then(function (status) {
      expect(status).toBe(true);
    });
    locations.selectLocationFromGroup(jsonData.Location4).then(function (status) {
      expect(status).toBe(true);
    });
    locations.verifyDefaultLocation(jsonData.Location4).then(function (present) {
      expect(present).toBe(true);
    });
    locations.verifyDeptforLocation(jsonData.DeptName2).then(function (present) {
      expect(present).toBe(true);
    });

  });

  it('Test Case 5 :To verify that Labuser can expand to view the list of locations of a single group at a time only.',function () {
    locations.openLocationDropdown().then(function (present) {
      expect(present).toBe(true);
    });
    locations.singleGroupExpanded().then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test Case 7 :To verify that Groups and Locations Name listed should be 50 characters long for Labuser.'+
  'Test case 8: To verify that Groups and then locations under presented in alphabetical order for Labuser'+
  'Test case 9 : To verify that when there is single group then user will be presented with Group name without icon ">" for group (Lab user)',function () {
    locations.openLocationDropdown().then(function (present) {
      expect(present).toBe(true);
    });
    locations.isValidGroupName().then(function (status) {
      expect(status).toBe(true);
    });
    locations.isGroupsSorted().then(function (status) {
      expect(status).toBe(true);
    });
    locations.isGroupLocationsSorted().then(function (status) {
      expect(status).toBe(true);
    });
    out.signOut();
    loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameSingleGroupLabuser, jsonData.PasswordLab, jsonData.FirstNameSingleGroupLabuser).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    locations.openLocationDropdown().then(function (present) {
      expect(present).toBe(true);
    });
    locations.verifyExpandIconPresent().then(function (present) {
      expect(present).toBe(false);
    });
  });
});
