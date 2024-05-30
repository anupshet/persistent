/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { DynamicReport } from '../page-objects/UN-15363DynamicReportAt.po';

let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/UN-15363DynamicReportAt.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test suite: Track User activity for Reports activity.', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const dynamicreport = new DynamicReport();


  beforeEach(async function () {
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName, jsonData.Password, jsonData.FirstName).then(function (result) {
      expect(result).toBe(true);
    });
  });

  afterEach(async function () {
    await out.signOut();
    await browser.manage().deleteAllCookies();
  });

  it('Verify Audit trail when user create report and save the report with corrective action', async () => {
    await dashBoard.selectSidebarOption(jsonData.departmentName);
    await dashBoard.selectSidebarOption(jsonData.instrumentName);
    await dashBoard.clickOnReportsTab();
    await dashBoard.selectReportType(jsonData.reportType);
    let count = await dashBoard.getNotificationCount();
    await library.clearPerformanceLogs();
    await dashBoard.createReport();
    await dashBoard.closeCreateReportsPopUp();
    let flag = await dashBoard.checkNotificationCountPresent(count + 1);
    expect(flag).toBe(true);
    flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.createReportPayload, jsonData.AuditTrailAPIStatusCode);
    expect(flag).toBe(true);
    flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.createReportPayload);
    expect(flag).toBe(true);
    await dashBoard.clickNotificationBellIcon();
    await library.clearPerformanceLogs();
    await dashBoard.clickFirstNotification();
    await library.clearPerformanceLogs();
    await dynamicreport.enterCorrectiveActions(jsonData.correctiveactioncomment);
    await dynamicreport.clickOnSaveButton();
    await dynamicreport.VerifyPopUpAfterSaving();
    flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.savereportatcall, jsonData.AuditTrailAPIStatusCode);
    expect(flag).toBe(true);
    flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.savereportatcall);
    expect(flag).toBe(true);

  });
  it('To Verify Audit Trail API Call when user preview and download the report from past report tab', async () => {
    await dashBoard.selectSidebarOption(jsonData.departmentName);
    await dashBoard.selectSidebarOption(jsonData.instrumentName);
    await dynamicreport.clickOnPastReportTab();
    await library.clearPerformanceLogs();
    await dynamicreport.clickonPastReportsPreviewbutton();
    let flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.previewPastReportatcall, jsonData.NotificationAPISuccessStatusCode);
    expect(flag).toBe(true);
    flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.previewPastReportatcall);
    expect(flag).toBe(true);
    await dynamicreport.clickCloseIconOnPastReportsPreviewForm();
    await library.clearPerformanceLogs();
    await dynamicreport.clickOnDownloadButton();
    flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.downloadatcall, jsonData.NotificationAPISuccessStatusCode);
    expect(flag).toBe(true);
    flag = await library.verifyPayloadDataAndValidTime(jsonData.AuditTrailAPI, jsonData.downloadatcall);
    expect(flag).toBe(true);
  });
});
