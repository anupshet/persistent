/*
* Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
*/
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { Connectivity } from '../page-objects/connectivity-mapping-e2e.po';
import { ConnectivityEnhancment } from '../page-objects/connectivity-enhancments-e2e.po';
import { ConnectivityNew } from '../page-objects/connectivity-new-e2e.po';
import { SlidgenSchedulerE2E } from '../page-objects/slideGenScheduler-e2e.po';

let jsonData;

const library = new BrowserLibrary();
const connectivity = new Connectivity();
const connectivity2 = new ConnectivityNew();
const connectivityEnhancment = new ConnectivityEnhancment();
const slideGenScheduler = new SlidgenSchedulerE2E();

library.parseJson('./JSON_data/testPermissions.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: UN-10410 : test permssion', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();


  it('Test case 1 : Verify connectivity module for Account User Manager role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.AUMUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });

    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(false);
    });

    out.signOut();
  });

  it('Test case 2 : Verify connectivity module for Lab User Manager role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.LUMUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });

    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(false);
    });

    out.signOut();
  });

  it('Test case 3 : Verify connectivity module for Lab supervisor role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.LSUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnConfigureButtonOfTransformer(jsonData.TransformerName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.updateTransformer(jsonData.UpdateConfigurationEntity, jsonData.UpdatedConfigurationName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnSaveBtn().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity2.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity2.clickOnRefreshStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(jsonData.FileName).then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.clickOnUploadBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode, jsonData.Dept1Instr, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    out.signOut();
  });

  it('Test case 4 : Verify connectivity module for Lab Technician role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.LTUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnConfigureButtonOfTransformer(jsonData.TransformerName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.updateTransformer(jsonData.UpdateConfigurationEntity, jsonData.UpdatedConfigurationName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnSaveBtn().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity2.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity2.clickOnRefreshStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(jsonData.FileName).then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.clickOnUploadBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode, jsonData.Dept1Instr, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    out.signOut();
  });

  it('Test case 5 : Verify connectivity module for Technician role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.TUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnConfigureButtonOfTransformer(jsonData.TransformerName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.updateTransformer(jsonData.UpdateConfigurationEntity, jsonData.UpdatedConfigurationName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity2.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity2.clickOnRefreshStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(jsonData.FileName).then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.clickOnUploadBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode, jsonData.Dept1Instr, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    out.signOut();
  });

  it('Test case 6 : Verify connectivity module for Account User Manager and Lab Supervisor role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.AumLsUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnConfigureButtonOfTransformer(jsonData.TransformerName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.updateTransformer(jsonData.UpdateConfigurationEntity, jsonData.UpdatedConfigurationName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity2.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity2.clickOnRefreshStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(jsonData.FileName).then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.clickOnUploadBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode, jsonData.Dept1Instr, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    out.signOut();
  });

  it('Test case 7 : Verify connectivity module for Account User Manager, Lab User Manager and Lab Supervisor role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.AumLumLsUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnConfigureButtonOfTransformer(jsonData.TransformerName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.updateTransformer(jsonData.UpdateConfigurationEntity, jsonData.UpdatedConfigurationName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity2.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity2.clickOnRefreshStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(jsonData.FileName).then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.clickOnUploadBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode, jsonData.Dept1Instr, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    out.signOut();
  });

  it('Test case 8 : Verify connectivity module for Lab User Manager and Lab Technician role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.LSUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnConfigureButtonOfTransformer(jsonData.TransformerName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.updateTransformer(jsonData.UpdateConfigurationEntity, jsonData.UpdatedConfigurationName).then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity2.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity2.clickOnRefreshStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(jsonData.FileName).then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.clickOnUploadBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode, jsonData.Dept1Instr, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    out.signOut();
  });

  it('Test case 9 : Verify connectivity module for Lab User Manager and Technician role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.LSUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnConfigureButtonOfTransformer(jsonData.TransformerName).then(function (conn) {
      expect(conn).toBe(false);
    });
    connectivity2.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity2.clickOnRefreshStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(jsonData.FileName).then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.clickOnUploadBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode, jsonData.Dept1Instr, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    out.signOut();
  });

  it('Test case 10 : Verify connectivity module for CTS role', function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.LSUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivityEnhancment.clickOnConfigureButtonOfTransformer(jsonData.TransformerName).then(function (conn) {
      expect(conn).toBe(false);
    });
    connectivity2.verifyStatusPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity2.clickOnRefreshStatus().then(function (verified) {
      expect(verified).toBe(false);
    });
    library.browseFileToUpload(jsonData.FileName).then(function (verified) {
      expect(verified).toBe(false);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode, jsonData.Dept1Instr, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(false);
    });
    out.signOut();
  });
});
