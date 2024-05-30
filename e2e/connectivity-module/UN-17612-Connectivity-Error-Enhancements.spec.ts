/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { ConnectivityNew } from '../page-objects/connectivity-new-e2e.po';
import { Connectivity } from '../page-objects/connectivity-mapping-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/UN-17612-Connectivity-Error-Enhancements.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Connectivity', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const connect = new ConnectivityNew();
  const connectivity = new Connectivity();
  const labsetup = new NewLabSetup();
  beforeEach(async function () {
    await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: Verify user can see error message when Transformer Error occurs', async function () {
    await connect.navigateToConnectivity();
    await connect.selectTransformer(jsonData.TransformerName);
    await library.browseFileToUpload(jsonData.TransformerErrorFile);
    await connect.clickUploadButton();
    await connect.clickRefresh();
    await connect.clickErrorDetails();
    await connect.verifyTransformerErrorTitleDisplayed();
  });

  it('Test case 2: Verify user can see error message when Import Error occurs', async function () {
    await connect.navigateToConnectivity();
    await connect.selectTransformer(jsonData.TransformerName);
    await library.browseFileToUpload(jsonData.ImportErrorFile);
    await connect.clickUploadButton();
    await connect.clickRefresh();
    await connect.clickErrorDetails();
    await connect.verifyImportErrorTitleDisplayed();
  });

  it('Test case 3: Verify user can see Hierarchy when Import Error occurs', async function () {
    await connect.navigateToConnectivity();
    await connect.selectTransformer(jsonData.TransformerName);
    await library.browseFileToUpload(jsonData.ImportErrorFile);
    await connect.clickUploadButton();
    await connect.clickRefresh();
    await connect.clickErrorDetails();
    await connect.verifyHierarchy(jsonData.HierarchyText);
  });

  it('Test case 4: Verify user can see number of results in front of error message', async function () {
    await connect.navigateToConnectivity();
    await connect.selectTransformer(jsonData.TransformerName);
    await library.browseFileToUpload(jsonData.ImportErrorFile);
    await connect.clickUploadButton();
    await connect.clickRefresh();
    await connect.clickErrorDetails();
    let msg = await connect.getErrorMessage();
    expect(msg).toEqual(jsonData.ImportErrorMessage);
  });

});
