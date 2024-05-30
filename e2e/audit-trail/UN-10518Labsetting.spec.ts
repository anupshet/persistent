/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { LabSettings } from '../page-objects/lab-settings-e2e.po';
import { defaultlabsetting } from '../page-objects/UN-10518LabSetting.po'

let jsonData, flag;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/UN-10518Labsetting.json').then(function (data) {
  jsonData = data;
});
describe('Test suite: Track Users activity on Unity Next for Default Lab setting', function () {
  browser.waitForAngularEnabled(false);
  const library = new BrowserLibrary();
  const labSettings = new LabSettings();
  const DefaultlabSettings = new defaultlabsetting();
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  beforeEach(async function () {
    await loginEvent.loginToApplication(jsonData.URL, jsonData.username, jsonData.password, jsonData.FirstName).then(function (result) {
    });
  });
  afterEach(async function () {
    await out.signOut();
    await browser.manage().deleteAllCookies();
  });
  it('Test case 1:Verify Audit Trail API Call When user update the labsetting  from default labsetting form.', async () => {
    library.logStep('Verify AT when user update the data entry from Summary to Point');
    library.logStep('Verify AT when user update track reagent and calibrator lot from Yes to NO.');
    library.logStep('Verify AT when user update Decimal point from 2 to 4');
    DefaultlabSettings.goToLabSettings().then(function (status) {
      expect(status).toBe(true);
    });
    DefaultlabSettings.selectPointOptions().then(function (status) {
      expect(status).toBe(true);
    });
    DefaultlabSettings.selectNoOptions().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectDecimal(jsonData.SelectedDecimal2).then(function (enabled) {
      expect(enabled).toBe(true);
    });
    await library.clearPerformanceLogs();
    labSettings.clickOnConfirmFromPopup().then(function (status) {
      expect(status).toBe(true);
    });
    let json = await library.getPayLoad(jsonData.AuditTrailAPI);
    flag = await library.compareJsonValuesValidTime(jsonData.updateAtCallForLabSetting, json);
    expect(flag).toBe(true);
  });
  it('Test case 2:Verify Audit Trail API Call When user update the labsetting  from default labsetting form.', async () => {
    library.logStep('Verify AT when user update the data entry from Summary to Point');
    library.logStep('Verify AT when user update track reagent and calibrator lot from No to yes.');
    library.logStep('Verify AT when user update Decimal point from 4 to 2');
    DefaultlabSettings.goToLabSettings().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectSummaryOptions().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectYesOptions().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectDecimal(jsonData.SelectedDecimal).then(function (enabled) {
      expect(enabled).toBe(true);
    });
    await library.clearPerformanceLogs();
    labSettings.clickOnConfirmFromPopup().then(function (status) {
      expect(status).toBe(true);
    });
    let json = await library.getPayLoad(jsonData.AuditTrailAPI);
    console.log(json);
    flag = await library.compareJsonValuesValidTime(jsonData.updateAtCallForLabsetting1, json);
    expect(flag).toBe(true);
  });
});
