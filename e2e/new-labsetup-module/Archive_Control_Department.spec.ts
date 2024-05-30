/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';
import { ConnectivityNew } from '../page-objects/connectivity-new-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';


const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/Archive_Control.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: To verify archive functionality for controls', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const labsetup = new NewLabSetup();
  let flagForIEBrowser: boolean;
  const setting = new Settings();
  const archivingLots = new ArchivingLots();
  const connect = new ConnectivityNew();
  const out = new LogOut();

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

  it('To archive control and verify the archive functionlaity', function () {
    const deptName = jsonData.deptName;
    const instName = jsonData.instName;
    const cntrlName = jsonData.cntrlName;
    const analyte = jsonData.analyteName;
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.clickArchiveToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(cntrlName).then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyDataTablePageGreyedOut().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(analyte).then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyEditLinkEnabled(jsonData.analyteN).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.verifySettingPageGreyedOut().then(function (verified) {
      expect(verified).toBe(true);
    });
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(cntrlName).then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyDataTablePageGreyedOut().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(analyte).then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyDataTablePageGreyedOut().then(function (verified) {
      expect(verified).toBe(true);
    });
  });


  it('To un-archive control and verify the un-archive functionlaity', function () {
    const deptName = jsonData.deptName;
    const instName = jsonData.instName;
    const cntrlName = jsonData.cntrlName;
    const analyte = jsonData.analyteName;
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.clickUnarchiveToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(cntrlName).then(function (verified) {
      expect(verified).toBe(false);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyDataTablePageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });
    archivingLots.verifyleftNavigationGreyedOut(analyte).then(function (verified) {
      expect(verified).toBe(false);
    });
    labsetup.navigateTO(analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyEditLinkEnabled(jsonData.analyteN).then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });
    archivingLots.verifySettingPageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyleftNavigationGreyedOut(cntrlName).then(function (verified) {
      expect(verified).toBe(false);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyDataTablePageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });
    archivingLots.verifyleftNavigationGreyedOut('Ferritin').then(function (verified) {
      expect(verified).toBe(false);
    });
    labsetup.navigateTO(analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    archivingLots.verifyDataTablePageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });
  });

  it('To archive Department and verify the archive functionlaity', function () {
    const deptName = jsonData.deptName;
    const instName = jsonData.instName;
    const cntrlName = jsonData.cntrlName;
    const analyte = jsonData.analyteName;
    const instName1 = jsonData.instName1;
    const instName2 = jsonData.instName2;

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyDeptCardsDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.expandDeptCard(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.clickArchiveToggleForDept().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    archivingLots.verifyleftNavigationGreyedOut(deptName).then(function (verified) {
      expect(verified).toBe(true);
    });

    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.verifyleftNavigationGreyedOut(instName).then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifyleftNavigationGreyedOut(instName1).then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifyleftNavigationGreyedOut(instName2).then(function (verified) {
      expect(verified).toBe(true);
    });

    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.verifyDataTablePageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyleftNavigationGreyedOut(cntrlName).then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifyEditLinkEnabled(jsonData.instrument).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifySettingPageGreyedOut().then(function (verified) {
      expect(verified).toBe(true);
    });

    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.verifyEditLinkEnabled(jsonData.control).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifySettingPageGreyedOut().then(function (verified) {
      expect(verified).toBe(true);
    });

    labsetup.navigateTO(analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.verifyEditLinkEnabled(jsonData.analyte).then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifySettingPageGreyedOut().then(function (verified) {
      expect(verified).toBe(true);
    });

    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });

    loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });

    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    archivingLots.verifyleftNavigationGreyedOut(deptName).then(function (verified) {
      expect(verified).toBe(true);
    });

    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

  });


  it('To un-archive Department and verify the un-archive functionlaity', function () {
    const deptName = jsonData.deptName;
    const instName = jsonData.instName;
    const cntrlName = jsonData.cntrlName;
    const analyte = jsonData.analyteName;
    const instName1 = jsonData.instName1;
    const instName2 = jsonData.instName2;

    setting.goToDeptSettings().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    archivingLots.clickArchiveItemToggle().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    setting.verifyDeptCardsDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.expandDeptCard(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.clickUnArchiveToggleForDept().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    /* archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    }); */

    archivingLots.verifyleftNavigationGreyedOut(deptName).then(function (verified) {
      expect(verified).toBe(false);
    });

    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.verifyleftNavigationGreyedOut(instName).then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyleftNavigationGreyedOut(instName1).then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyleftNavigationGreyedOut(instName2).then(function (verified) {
      expect(verified).toBe(false);
    });

    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.verifyDataTablePageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyleftNavigationGreyedOut(cntrlName).then(function (verified) {
      expect(verified).toBe(false);
    });

    archivingLots.verifyEditLinkEnabled('Instrument').then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnEditThisInstrumentLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifySettingPageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });

    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.verifyEditLinkEnabled('Control').then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnEditThisControlLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifySettingPageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });

    labsetup.navigateTO(analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    archivingLots.verifyEditLinkEnabled('Analyte').then(function (verified) {
      expect(verified).toBe(true);
    });

    setting.clickOnEditThisAnalyteLink().then(function (verified) {
      expect(verified).toBe(true);
    });

    archivingLots.verifySettingPageGreyedOut().then(function (verified) {
      expect(verified).toBe(false);
    });

    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });

    loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });

    archivingLots.verifyArchiveItemToggleDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });

    archivingLots.verifyleftNavigationGreyedOut(deptName).then(function (verified) {
      expect(verified).toBe(false);
    });

    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });

  });
});
