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

  it('Test case 1: To verify that ' +
  'the root node does not have a back button and the functionality of Close Button & Hamburger button', function () {
    navigation.verifyLeftNavigationAndCloseBtn(jsonData.Deptartment1, jsonData.Deptartment2).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

  it('Test case 2: To verify the functionality of Close Button & Hamburger button', function () {
    navigation.verifyCloseButton().then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
    navigation.verifyHumbergerIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

  // Test case 8 (steps 1-5 covered in below TC)
  const labsetup = new NewLabSetup();
  it('Test case 3: To verify that clicking on the department shows the configured instruments', function () {
    const toDept = jsonData.Deptartment1;
    labsetup.navigateTO(toDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    navigation.verifyListOfInstrumentControlsAndAnalytes(jsonData.Instr1, jsonData.Instrument1,
      jsonData.Instrument2, 'instruments').then(function (verified) {
        expect(verified).toBe(true);
        dashBoard.waitForElement();
      }).then(function () {
        dashBoard.waitForElement();
        navigation.verifyDeptAndBackButtonOnIntsrScreen(jsonData.Deptartment1).then(function (verified) {
          expect(verified).toBe(true);
          dashBoard.waitForElement();
        });
      });
  });

  // Test case 8 (steps 1-5 covered in below TC)
  it('Test case 4: To verify that clicking on the Instrument shows the configured Controls', function () {
    const toDept = jsonData.Deptartment1;
    labsetup.navigateTO(toDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    const instrument = jsonData.Instr1;
    labsetup.navigateTO(instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    navigation.verifyListOfInstrumentControlsAndAnalytes(jsonData.C1,
      jsonData.Control2, jsonData.Control3, 'controls').then(function (verified) {
        expect(verified).toBe(true);
        dashBoard.waitForElement();
      }).then(function () {
        dashBoard.waitForElement();
        navigation.verifyDeptAndBackButtonOnControlScreen(jsonData.Deptartment1, jsonData.Instr1).then(function (verified) {
          expect(verified).toBe(true);
          dashBoard.waitForElement();
        });
      });

  });

  // Test case 8 (steps 1-5 covered in below TC)
  it('Test case 5: To verify that clicking on the Control shows the configured analytes', function () {
    const toDept = jsonData.Deptartment1;
    labsetup.navigateTO(toDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    const instrument = jsonData.Instr1;
    labsetup.navigateTO(instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    const control = jsonData.C1;
    labsetup.navigateTO(control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    navigation.verifyListOfInstrumentControlsAndAnalytes(
      jsonData.Analyte1, jsonData.Analyte2, '', 'analytes').then(function (verified) {
        expect(verified).toBe(true);
        dashBoard.waitForElement();
      })
      .then(function () {
        dashBoard.waitForElement();
        navigation.verifyDeptAndBackButtonOnAnalyteScreen(jsonData.Deptartment1, jsonData.Instr1, jsonData.C1).then(function (verified) {
          expect(verified).toBe(true);
          dashBoard.waitForElement();
        });
      });

  });


  it('Test case 6: To verify that clicking on the Analyte shows the Data Entry Page', function () {
    const toDept = jsonData.Deptartment1;
    labsetup.navigateTO(toDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    const instrument = jsonData.Instr1;
    labsetup.navigateTO(instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    const control = jsonData.C1;
    labsetup.navigateTO(control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    navigation.verifyDataEntryPage(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

  it('Test case 7: To verify the functionality of Back Arrow', function () {
    navigation.verifyBackButtonFunctionality(jsonData.Deptartment1, jsonData.Instr1, jsonData.C1,
      jsonData.Analyte1, jsonData.Labname).then(function (verified) {
        expect(verified).toBe(true);
        dashBoard.waitForElement();
      });
  });

  // test steps(1-5) are covered in TC 3,4,5
  it('Test case 8:To verify the functionality of Breadcrumb ', function () {
    navigation.verifyLInksInBreadcrum(jsonData.Deptartment1, jsonData.Instr1, jsonData.C1,
      jsonData.Analyte1, jsonData.Labname).then(function (verified) {
        expect(verified).toBe(true);
        dashBoard.waitForElement();
      });
  });


  it('Test case 9:To verify that clicking on the Control that does not have analytes configured will show '
    + 'the Analyte setup screen ', function () {
      navigation.verifyAnalyteSetUpScreen(jsonData.Deptartment1, jsonData.Instr1, jsonData.Control2).then(function (verified) {
        expect(verified).toBe(true);
        dashBoard.waitForElement();
      });
    });


  it('Test case 10:To verify that clicking on the Unity Next should display the Dashboard page ', function () {
    navigation.verifyDashboardPage(jsonData.Deptartment1, jsonData.Instr1).then(function (verified) {
      expect(verified).toBe(true);
      dashBoard.waitForElement();
    });
  });

});
