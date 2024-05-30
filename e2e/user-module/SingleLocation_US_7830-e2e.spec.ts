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

library.parseJson('./JSON_data/SingleLocation_US_7830.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: US_7830 - Display lab with a single location', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
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
  it('Test Case 1 : To verify that UI displays the single location assigned to the user.' +
    'Test Case 2 : To verify that location dropdown is not displayed when there is only 1 location' +
    'Test Case 4 : To verify that UI displays the single location assigned to the user.(Lab User)', function () {
      locations.verifyDefaultLocation(jsonData.Location1).then(function (status) {
        expect(status).toBe(true);
      });
      locations.openLocationDropdown().then(function (status) {
        expect(status).toBe(false);
      });
      out.signOut();
      loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameLab, jsonData.PasswordLab, jsonData.FirstNameLab).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
      locations.verifyDefaultLocation(jsonData.Location1).then(function (status) {
        expect(status).toBe(true);
      });
    });

  it('Test Case 3 : To verify that expected Icon as per zepline is displayed for single location .', function () {
    locations.verifySingleLocationIcon().then(function (present) {
      expect(present).toBe(true);
    });
  });
});
