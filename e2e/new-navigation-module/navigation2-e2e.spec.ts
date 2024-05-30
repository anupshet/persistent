/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Navigation.json').then(function(data) {
  jsonData = data;
});



describe('Test Suite: New Navigation', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dashBoard = new Dashboard();
  const navigation = new NewNavigation();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 11:To verify that the default view for Instrument, Control & Analyte is Data Table ', function () {
    navigation.verifyDataTableDisplayed(jsonData.Deptartment1, jsonData.Instr1, jsonData.C1, jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });


  it('Test case 12: To verify if the custom name for Instrument & Control is displayed above and default name'
    + ' below it in small gray text', function () {
      navigation.verifyInstrModelControlName(jsonData.Deptartment1, jsonData.Instr1, jsonData.C1,
        jsonData.InstrModel1, jsonData.ControlName1).then(function (verified) {
          expect(verified).toBe(true);
          dashBoard.waitForElement();
        });
    });


  it('Test case 14: To verify if there are no departments, the list of instruments is the top level shown'
    + ' on the dashboard page', function () {
      out.signOut();
      console.log('details:' + jsonData.Username1, jsonData.Password1, jsonData.FirstName1);
      loginEvent.loginToApplication(jsonData.URL, jsonData.Username1, jsonData.Password1, jsonData.FirstName1).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      }).then(function () {
        navigation.verifyInstrwithNoDept(jsonData.Instrument3).then(function (verified) {
          expect(verified).toBe(true);
          dashBoard.waitForElement();
        });
      });
    });

  it('Test case 15: To check that the "Test Results" or "Reports" are displayed on the instrument level'
    + ' and not displayed on department, control or analyte level', function () {
      navigation.verifyTestResultReports(jsonData.Deptartment1, jsonData.Instr1, jsonData.C1, jsonData.Analyte1).then(function (verified) {
        expect(verified).toBe(true);
        dashBoard.waitForElement();
      });
    });


  it('Test case 16: To check that the SPC page is accessible by the settings icon next to the headline name'
    + ' for the analyte and not to the instrument & control', function () {
      navigation.verifySPCRulesPage(jsonData.Deptartment1, jsonData.Instrument1, jsonData.CONTR2,
        jsonData.Analyte4).then(function (verified) {
          expect(verified).toBe(true);
          dashBoard.waitForElement();
        });
    });

  it('Test case 17:After clicking on Bio-Rad logo, the user will be navigated to Bio-Rad.com', function () {
    navigation.verifyBioRadLogoNavigation().then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

  it('Test case 18:To verify the navigation tool tips', function () {
    navigation.verifyToolTips(jsonData.Deptartment1, jsonData.Instr1, jsonData.C1, jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

});
