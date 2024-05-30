/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Connectivity } from '../page-objects/connectivity-mapping-e2e.po';
import { SlidgenSchedulerE2E } from '../page-objects/slideGenScheduler-e2e.po';
import { ConnectivityEnhancment } from '../page-objects/connectivity-enhancments-e2e.po';

const fs = require('fs');

let jsonData;
fs.readFile('./JSON_data/Feature-224983-ConnectivityEnhancment.json', (err, data) => {
  if (err) { throw err; }
  const newLabSetup = JSON.parse(data);
  jsonData = newLabSetup;
});

let pdfParser = require("pdf2json");
fs.readFile("C:/Users/nitin_ghugare/Downloads/Dimension EXL-81287822022.pdf", (err, pdfBuffer) => {
  if (!err) {
    pdfParser.parseBuffer(pdfBuffer);
    console.log(pdfParser.parseBuffer(pdfBuffer))
  }
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Feature 224983 -  Add Configuration tab and content for transformers and edge box configurations', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  let flagForIEBrowser: boolean;
  const connectivity = new Connectivity();
  const slideGenScheduler = new SlidgenSchedulerE2E();
  //const library = new BrowserLibrary();
  const connectivityEnhancment = new ConnectivityEnhancment();

  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
    });
  });
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 1 : To verify Configurations tab is displayed ', function () {
    /* connectivityEnhancment.readPDF().then(function (dispalyed) {
      expect(dispalyed).toBe(true);
    }); */


    /* connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });

    library.browseFileToUpload("UFFT.csv").then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.selectRadioBtnYes().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.clickOnTBDBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.navigateToCategory('updated').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    slideGenScheduler.verifyAnalytesDisplayed().then(function (dispalyed) {
      expect(dispalyed).toBe(true);
    }); */



  });
});
