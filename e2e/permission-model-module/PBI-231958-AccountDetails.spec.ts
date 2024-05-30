/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccoutManager } from '../page-objects/account-management-e2e.po';

let jsonData;

const library = new BrowserLibrary();
const AccountManagement = new AccoutManager();
const fs = require('fs');
library.parseJson('./JSON_data/PBI-231958-AccountDetails.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Account and Location management', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1:To verify location button is present for the accounts', function () {
    AccountManagement.navigateToAccountManagement().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    AccountManagement.verifyAccountManagementPageDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    AccountManagement.verfyLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);;
    });
  });

  it('Test case 2:To verify clicking on "location" button of a account opens account information dialog for that account', function () {
    AccountManagement.navigateToAccountManagement().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    AccountManagement.verifyAccountManagementPageDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    AccountManagement.verfyLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);;
    });
    AccountManagement.verifyLocationBtnFunctionality(jsonData.AccountInfoPageHeading).then(function (displayed) {
      expect(displayed).toBe(true);;
    });
  });

  it('Test case 3:To verify UI components of account information dialog', function () {
    AccountManagement.navigateToAccountManagement().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    AccountManagement.verifyAccountManagementPageDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    AccountManagement.verfyLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);;
    });
    AccountManagement.verifyLocationBtnFunctionality(jsonData.AccountInfoPageHeading).then(function (displayed) {
      expect(displayed).toBe(true);;
    });
    AccountManagement.verifyUIofAccountInfo().then(function (displayed) {
      expect(displayed).toBe(true);;
    });
  });

  it('Test case 4:To verify "no group" message is diaplayed for accounts with zero groups', function () {
    AccountManagement.navigateToAccountManagement().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    AccountManagement.verifyAccountManagementPageDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    AccountManagement.verfyLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);;
    });
    AccountManagement.verifyNoGroupMessageDisplayed(jsonData.NoGroupMessage).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
});
