/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { ConnectivityNew } from '../page-objects/connectivity-new-e2e.po';
import { Connectivity } from '../page-objects/connectivity-mapping-e2e.po';
import { Locations } from 'e2e/page-objects/locations-e2e.po';

const fs = require('fs');
let jsonData; 


jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Track Users activity in Connectivity: Status and Mapping', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const location = new Locations();
  const connect = new ConnectivityNew();
  const connectivity = new Connectivity();

  library.parseJson('./JSON_data/testAPI.json').then(function (data) {
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

  it('Test case 1 : Verify Audit Trail API request when file is uploaded and clicked on status button to navigate to status page', function () {
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode);

  });

  it('Test case 2 : Verify Audit Trail API request when navigated to mapping page', function () {
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity.clickMappingTab().then(function (mappingTab) {
      expect(mappingTab).toBe(true);
    });
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode);

  });

  it('Test case 3 : Verify Audit Trail API request on mapping instrument codes', function () {
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity.clickMappingTab().then(function (mappingTab) {
      expect(mappingTab).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstCodeToMap1, jsonData.Dept1Instr11, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode);

  });

  it('Test case 3 : Verify Audit Trail API request on mapping product codes', function () {
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity.clickMappingTab().then(function (mappingTab) {
      expect(mappingTab).toBe(true);
    });
    connect.clickProducts().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.ProdCodeToMap1, jsonData.Dept1Prod11, 'Product').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode);

  });

  it('Test case 3 : Verify Audit Trail API request on mapping analyte codes', function () {
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity.clickMappingTab().then(function (mappingTab) {
      expect(mappingTab).toBe(true);
    });
    connect.clickTests().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.TestCodeToMap1, jsonData.Dept1Test11, 'Test').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode);

  });

 
});
