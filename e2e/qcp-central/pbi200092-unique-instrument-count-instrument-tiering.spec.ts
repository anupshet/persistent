/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { QcpCentral } from './page-objects/qcp-base-page.po';
import { InstrumentTiering } from './page-objects/tiering/instrument-tiering.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./e2e/qcp-central/test-data/pbi200092-instrument-tiering.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: PBI 200092 - Instrument Tiering - Unique Instrument count should be displayed', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const tiering = new InstrumentTiering();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: To Verify that Unique count is displayed after Including Instrument', function () {
    library.logStep('Test Case 1: To Verify that Unique count is displayed after Including Instrument');
    library.logStep('Test Case 2: To Verify that Unique count is displayed after deleting Inclusion');
    let temp, expectedCount;
    tiering.getIncludedCount(jsonData.GroupName).then(function (txt) {
      temp = txt;
      expect(txt).not.toBe('undefined');
      tiering.clickOnGroupName(jsonData.GroupName).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.verifyInclusionAdded(jsonData.Instrument, jsonData.All, jsonData.All, jsonData.All).then(function (verified) {
        expect(verified).toBe(true);
      });
      tiering.selectManufacturer(jsonData.Manufacturer).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectInstrument(jsonData.Instrument).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectProduct(jsonData.Product).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectMethod(jsonData.Method).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectAnalyte(jsonData.Analyte).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectIncludeRdb().then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.clickSubmitBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.verifyInclusionAdded(jsonData.Instrument, jsonData.Product, jsonData.Method, jsonData.Analyte).then(function (verified) {
        expect(verified).toBe(true);
      });
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      expectedCount = temp;
      tiering.verifyIncludeInstrumentIsUnique(jsonData.GroupName, expectedCount).then(function (verified) {
        expect(verified).toBe(true);
      });
      tiering.clickOnGroupName(jsonData.GroupName).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.clickDeleteInclusion(jsonData.Instrument, jsonData.Product, jsonData.Method, jsonData.Analyte).then(function (deleted) {
        expect(deleted).toBe(true);
      });
      tiering.clickConfirmDelete().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.clickOkOnDeletedMessage().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.verifyIncludeInstrumentIsUnique(jsonData.GroupName, expectedCount).then(function (verified) {
        expect(verified).toBe(true);
      });
    });
  });

  it('Test Case 3: To Verify that Unique count is displayed after Exclusion Instrument', function () {
    library.logStep('Test Case 3: To Verify that Unique count is displayed after Exclusion Instrument');
    library.logStep('Test Case 4: To Verify that Unique count is displayed after deleting Exclusion');
    let temp, expectedCount;
    tiering.getExcludeCount(jsonData.GroupName).then(function (txt) {
      temp = txt;
      expect(txt).not.toBe('undefined');
      tiering.clickOnGroupName(jsonData.GroupName).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.verifyExclusionAdded
        (jsonData.InstrumentAlreadyExcluded, jsonData.All, jsonData.All, jsonData.AnalyteExluded).then(function (verified) {
          expect(verified).toBe(true);
        });
      tiering.selectManufacturer(jsonData.Manufacturer).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectInstrument(jsonData.InstrumentAlreadyExcluded).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectProduct(jsonData.ProductExcluded).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectMethod(jsonData.MethodExcluded).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectAnalyte(jsonData.ExcludeAnalye).then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.selectExcludeRdb().then(function (selected) {
        expect(selected).toBe(true);
      });
      tiering.clickSubmitBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.verifyExclusionAdded
        (jsonData.InstrumentAlreadyExcluded, jsonData.ProductExcluded, jsonData.MethodExcluded, jsonData.ExcludeAnalye)
        .then(function (verified) {
          expect(verified).toBe(true);
        });
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      expectedCount = temp;
      tiering.verifyExcludeInstrumentIsUnique(jsonData.GroupName, expectedCount).then(function (verified) {
        expect(verified).toBe(true);
      });
      tiering.clickOnGroupName(jsonData.GroupName).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.clickDeleteExclusion
        (jsonData.InstrumentAlreadyExcluded, jsonData.ProductExcluded, jsonData.MethodExcluded, jsonData.ExcludeAnalye)
        .then(function (deleted) {
          expect(deleted).toBe(true);
        });
      tiering.clickConfirmDelete().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.expandMainMenu(jsonData.MainMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      qcp.selectSubMenu(jsonData.SubMenu).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      tiering.verifyExcludeInstrumentIsUnique(jsonData.GroupName, expectedCount).then(function (verified) {
        expect(verified).toBe(true);
      });
    });
  });
});
