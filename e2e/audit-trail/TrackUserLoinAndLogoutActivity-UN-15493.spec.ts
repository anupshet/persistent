/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Locations } from '../page-objects/Locations-e2e.po';

const fs = require('fs');
let jsonData;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Connectivity', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const location = new Locations();

  library.parseJson('./JSON_data/testAPI.json').then(function (data) {
    jsonData = data;
  });

  beforeEach(function () {
   
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1 : Verify that  the user successful login information is captured.', function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode);

  });

  it('Test case 2 : Verify that  the user manual logout information is captured by user navigating to the User Management for logout.', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    out.signOut();

    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode);

  });


  it('Test case 3 : Verify that  user Change location information is captured.', function () {

    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode);
    location.selectLocationFromDropdown(jsonData.Location).then(function (result) {
      expect(result).toBe(true);
    });
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.loginChangeLocationPayload,jsonData.statusCode);
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.logoutChangeLocationPayload,jsonData.statusCode);

  });

});
