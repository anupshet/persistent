/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';
import { ConnectivityNew } from '../page-objects/connectivity-new-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { DuplicateLots1 } from '../page-objects/Duplicate_Lots1.po';

const library = new BrowserLibrary();

const fs = require('fs');
let jsonData;

library.parseJson('./JSON_data/Duplicate_Lot.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: To verify archive functionality for controls', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const labsetup = new NewLabSetup();
  let flagForIEBrowser: boolean;
  const setting = new Settings();
  const archivingLots = new ArchivingLots();
  const connect = new ConnectivityNew();
  const out = new LogOut();
  const duplicateLot = new DuplicateLots1();

  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
    });
  });

 /*  beforeEach(function () {
    loginEvent.loginToApplicationToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  }); */

  /* afterEach(function () {
    out.signOut();
  }); */

  it('To Verify QCP', function () {
    const deptName = jsonData.deptName;

    /* duplicateLot.testQCPAddManufacturer().then(function(clicked){
      expect(clicked).toBe(true);
    }) */

    loginEvent.loginToApplicationToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });
});
