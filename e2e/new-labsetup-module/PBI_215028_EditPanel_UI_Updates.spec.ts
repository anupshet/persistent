/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { Panels } from '../page-objects/panels-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { MultiSummary1 } from '../page-objects/multi-summary.po';
import { BrowserLibrary} from '../utils/browserUtil';

const fs = require('fs');

let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/PBI_215028_EditPanel_UI_Updates.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: PBI 215028 - Edit Panel screen UI updates', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  let flagForIEBrowser: boolean;
  const setting = new Settings();
  const panels = new Panels();
  const navigation = new NewNavigation();
  const multiSummary = new MultiSummary1();
  var panelName;
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
    panelName = 'Auto-' + library.generateRandomNumber(jsonData.samplePanelName,jsonData.panelTextSize);
  });

  afterEach(function () {
    out.signOut();
  });

  it('Verify "X" to close Edit panel screen icon is displayed', function () {
    panels.clickOnAddPanel().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.verifyCloseButtonIsDisplayed().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.clickEditThisPanelLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.verifyCloseButtonIsDisplayed().then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });

  it('Verify user is able to exit the Edit Panel screen by clicking on "X" and' +
  'navigate back to the previous screen (Panels MDE) If no changes are made', function () {
    panels.clickOnAddPanel().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.clickOnCloseButton().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    navigation.verifyHumbergerIconDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.clickEditThisPanelLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.clickOnCloseButton().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    panels.verifyPanelsMDEDashboardPageDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Verify user is getting "You have unsaved data" popup by clicking on "X" icon If there are changes are made in edit panel', function () {
    console.log('Panel Name is ++++++> ',panelName)
    panels.clickOnAddPanel().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.enterPanelName(panelName).then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.clickOnCloseButton().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    multiSummary.verifyNavigateAwayModelUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clickDontSaveData().then(function (dontsave) {
      expect(dontsave).toBe(true);
    });
  });

  it('Verify changes are not saved when user clicks on "DONT SAVE DATA".', function () {
    console.log('Panel Name is ++++++> ',panelName)
    panels.clickOnAddPanel().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.enterPanelName(panelName).then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.selectItems(jsonData.Department, 'false', 'true').then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.clickOnCloseButton().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    multiSummary.clickDontSaveData().then(function (dontsave) {
      expect(dontsave).toBe(true);
    });
    panels.verifyPanelCreated(panelName).then(function (removeItem) {
      expect(removeItem).toBe(false);
    });
  });

  it('Verify changes are saved when user clicks on ""SAVE DATA AND LEAVE PAGE"".', function () {
    panels.clickOnAddPanel().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.enterPanelName(panelName).then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.selectItems(jsonData.Department, 'false', 'true').then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.clickOnCloseButton().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    multiSummary.clickSaveData().then(function (dontsave) {
      expect(dontsave).toBe(true);
    });
    panels.verifyPanelCreated(panelName).then(function (created) {
      expect(created).toBe(true);
    });
  });
});
