/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { DuplicateLot } from '../page-objects/duplicate-lot-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { CustomSortOrder } from '../page-objects/Select-SortOrder.po';
import { Locations } from 'e2e/page-objects/locations-e2e.po';


const fs = require('fs');
let jsonData;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Audit trail UN-11080', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const labsetup = new NewLabSetup();
  const location = new Locations();
  const duplicateLot = new DuplicateLot();
  const setting = new Settings();
  const customSortOrder = new CustomSortOrder();

  library.parseJson('./JSON_data/DashboardActivity-UN-11080.json').then(function (data) {
    jsonData = data;
  });

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1 : Verify Audit Trail API request when expiring lots card is viewed from dashboard', function () {
    labsetup.verifyExpiringLotCards().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.clickOnProductNameOnExpiringLotCard(jsonData.RepetativeLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload1, jsonData.statusCode1);

  });

  it('Test case 2 : Verify Audit Trail API request when expiring lots card is viewed from dashboard on changing location', function () {

    labsetup.verifyExpiringLotCards().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.clickOnProductNameOnExpiringLotCard(jsonData.RepetativeLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload2, jsonData.statusCode2);

    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location2).then(function (result) {
      expect(result).toBe(true);
    });

    labsetup.verifyExpiringLotCards().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.clickOnProductNameOnExpiringLotCard(jsonData.RepetativeLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload3, jsonData.statusCode3);

  });

  it('Test case 3 : Verify Audit Trail API request on renewing expiring lot from dashbaord', function () {

    labsetup.verifyExpiringLotCards().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.clickOnProductNameOnExpiringLotCard(jsonData.RepetativeLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    duplicateLot.clickLotNumberDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.FutureLot).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
    });

    duplicateLot.clickStartNewLotButtonOnOverlay().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload4, jsonData.statusCode4);

  });

  it('Test case 4 : Verify Audit Trail API request on renewing expiring lot from dashbaord', function () {

    labsetup.verifyExpiringLotCards().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.clickOnProductNameOnExpiringLotCard(jsonData.RepetativeLot).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    duplicateLot.clickLotNumberDropdown().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.FutureLot).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
    });

    duplicateLot.clickStartNewLotButtonOnOverlay().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload5, jsonData.statusCode5);

  });

  it('Test case 6 : Verify Audit Trail API request while navigated to Panel', function () {

    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload6, jsonData.statusCode6);

  });

  it('Test case 7 : Verify Audit Trail API request on sorting panels from dashboard', function () {

    customSortOrder.clickOnSortButton(jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.customSortItems(jsonData.PanelAnalyte1, jsonData.PanelAnalyte2).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnDoneBtn().then(function (verified) {
      expect(verified).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API, jsonData.inputpayload7, jsonData.statusCode7);

  });

});
