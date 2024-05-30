/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { TransformerAdministrator } from './page-objects/migration/transformer-administrator.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';


const fs = require('fs');
let jsonData;


const fileToUpload = '../resources/filename.txt';
const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/transformerAdministrator.json').then(function(data) {
  jsonData = data;
});

describe('QCPCentral Transformer Administrator Test Suite', function () {
  browser.waitForAngularEnabled(false);
  const newLabSetup = new NewLabSetup();
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  const qcp = new QcpCentral();
  const qcpTA = new TransformerAdministrator();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.DEVURL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test case 1: To Verify Manage System Transformers Page Details', function () {
    library.logStep('Test case 1: To Verify Manage System Transformers Page Details');
    qcp.expandMainMenu(jsonData.Menu).then(function (navigatedToMenu) {
      expect(navigatedToMenu).toBe(true);
    });
    qcp.selectSubMenu(jsonData.SubMenu).then(function (navigatedToSubMenu) {
      expect(navigatedToSubMenu).toBe(true);
    });
    qcpTA.verifyPageHeader().then(function (headerVerified) {
      expect(headerVerified).toBe(true);
    });
    qcpTA.verifyRadioButtons().then(function (optionsVerified) {
      expect(optionsVerified).toBe(true);
    });
    qcpTA.verifyGoButton().then(function (goDisplayed) {
      expect(goDisplayed).toBe(true);
    });
    qcpTA.clickMSTRB().then(function (MSTRBClicked) {
      expect(MSTRBClicked).toBe(true);
    });
    qcpTA.clickGoButton().then(function (goClicked) {
      expect(goClicked).toBe(true);
    });
    qcpTA.verifyMSTHeader().then(function (MSTHeader) {
      expect(MSTHeader).toBe(true);
    });
    qcpTA.verifyTIActive().then(function (TIActive) {
      expect(TIActive).toBe(true);
    });
    qcpTA.verifyTRTI().then(function (TRTI) {
      expect(TRTI).toBe(true);
    });
    qcpTA.verifyTITableHeaders().then(function (TRTIHeaders) {
      expect(TRTIHeaders).toBe(true);
    });
    qcpTA.verifyTITableBody().then(function (tableBody) {
      expect(tableBody).toBe(true);
    });
    qcpTA.clickTICount().then(function (countClicked) {
      expect(countClicked).toBe(true);
    });
    qcpTA.verifyTLLActive().then(function (TLLActive) {
      expect(TLLActive).toBe(true);
    });
    qcpTA.verifyTransformerNameLabel().then(function (labelCorrect) {
      expect(labelCorrect).toBe(true);
    });
    qcpTA.verifyTLLTableHeaders().then(function (TLLColumnName) {
      expect(TLLColumnName).toBe(true);
    });
    qcpTA.verifyTLLRowsCountCorrect().then(function (labCountCorrect) {
      expect(labCountCorrect).toBe(true);
    });
    qcpTA.clickTRI().then(function (TRIClicked) {
      expect(TRIClicked).toBe(true);
    });
    qcpTA.clickRetrieveTransformersTRI().then(function (retrieveClicked) {
      expect(retrieveClicked).toBe(true);
    });
    qcpTA.verifyTRITableHeaders().then(function (TRIColumns) {
      expect(TRIColumns).toBe(true);
    });
    qcpTA.getTRITableCount().then(function (TRICount) {
      expect(TRICount).toBe(true);
    });
    qcpTA.clickInstallTRI().then(function (InstallClicked) {
      expect(InstallClicked).toBe(true);
    });
    qcpTA.getTRITableCount().then(function (TRICount) {
      expect(TRICount).toBe(true);
    });
  });

  it('Test case 2: Verify Manage Customer Transformers Page Details', function () {
    library.logStep('Test case 2: Verify Manage Customer Transformers Page Details');
    qcp.expandMainMenu(jsonData.Menu).then(function (navigatedToMenu) {
      expect(navigatedToMenu).toBe(true);
    });
    qcp.selectSubMenu(jsonData.SubMenu).then(function (navigatedToSubMenu) {
      expect(navigatedToSubMenu).toBe(true);
    });
    qcpTA.verifyPageHeader().then(function (headerVerified) {
      expect(headerVerified).toBe(true);
    });
    qcpTA.verifyRadioButtons().then(function (optionsVerified) {
      expect(optionsVerified).toBe(true);
    });
    qcpTA.verifyGoButton().then(function (goDisplayed) {
      expect(goDisplayed).toBe(true);
    });
    qcpTA.clickMCTRB().then(function (MCTRBClicked) {
      expect(MCTRBClicked).toBe(true);
    });
    qcpTA.enterAccountNumber(jsonData.AccountNumber).then(function (entered) {
      expect(entered).toBe(true);
    });
    qcpTA.clickGoButton().then(function (goClicked) {
      expect(goClicked).toBe(true);
    });
    qcpTA.verifyMCTHeader().then(function (MCTHeader) {
      expect(MCTHeader).toBe(true);
    });
    qcpTA.verifyMCTTableHeaders().then(function (tableHeaderVerified) {
      expect(tableHeaderVerified).toBe(true);
    });
    qcpTA.clickDownloadTXML().then(function (downloadClicked) {
      expect(downloadClicked).toBe(true);
    });
    /*
    qcpTA.clickUploadTXML().then(function (uploadClicked) {
      expect(uploadClicked).toBe(true);
    });
    newLabSetup.browseFileToUpload(fileToUpload).then(function(uploaded){
      expect(uploaded).toBe(true);
    });*/
  });

  it('Test case 3: Verify Migration menu options are disabled for QCP Daily User', function () {
    library.logStep('Test case 3: Verify Migration menu options are disabled for QCP Daily User');
    out.signOutQCP().then(function (signedOut) {
      expect(signedOut).toBe(true);
    });
    loginEvent.loginToQCP(jsonData.DEVURL, jsonData.DailyUsername, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.Menu).then(function (navigatedToMenu) {
      expect(navigatedToMenu).toBe(true);
    });
    qcpTA.verifySubMenusDisabled(jsonData.SubMenu).then(function (submenuDisabled) {
      expect(submenuDisabled).toBe(true);
    });
  });

  it('Test case 3: Verify Migration menu options are disabled for Marketing User', function () {
    library.logStep('Test case 3: Verify Migration menu options are disabled for Marketing User');
    out.signOutQCP().then(function (signedOut) {
      expect(signedOut).toBe(true);
    });
    loginEvent.loginToQCP(jsonData.DEVURL, jsonData.MarketingUsername, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.Menu).then(function (navigatedToMenu) {
      expect(navigatedToMenu).toBe(true);
    });
    qcpTA.verifySubMenusDisabled(jsonData.SubMenu).then(function (submenuDisabled) {
      expect(submenuDisabled).toBe(true);
    });
  });
});
