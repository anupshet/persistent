/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/LoadMultiPointE2E.json').then(function(data) {
  jsonData = data;
});

describe('Multi Point Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const newLabSetup = new NewLabSetup();
  const library = new BrowserLibrary();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AmrutaUsername,
      jsonData.AmrutaPassword, jsonData.AmrutaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Load Multi Point Control Level E2E', function () {
    library.logStep('Load Multi Point Control Level E2E Start');
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    let testStart;
    let endTime;
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    }).then(function () {
      testStart = new Date().getTime();
    }).then(function () {
      newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
        expect(navigate).toBe(true);
      }).then(function() {
        endTime = new Date().getTime();
      }).then(function () {
        const totalTime = endTime - testStart;
        library.logStep('Total time ' + totalTime + ' milleseconds');
      });
    }).then(function () {
      library.logStep('Load Multi Point Control Level E2E End');
    });
  });

});
