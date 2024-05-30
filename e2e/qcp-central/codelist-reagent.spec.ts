/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary} from '../utils/browserUtil';
import { QcpCentral } from './page-objects/qcp-base-page.po';


const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./e2e/qcp-central/test-data/codelist-manufacturer.json').then(function(data) {
  jsonData = data;
});
describe('Test Suite: Settings', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();

  beforeEach(function () {

    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

    it('CodeList - Verify Reagent Page', function () {
    library.logStep('CodeList - Verify Reagent Page');
    qcp.expandMainMenu('Code List ').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectSubMenuOption('Reagents' , 'Reagents').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // Need to add UI verification
    qcp.selectManufacturer('Bio-rad').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.verifyTableFilteredWithManufacturer('Bio-rad').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed('25').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers('25').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.addSearchItemName('Test-Reagent').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // Need to add Searched & Filtered

  });



});
