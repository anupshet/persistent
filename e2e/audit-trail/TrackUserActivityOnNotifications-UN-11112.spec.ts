/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/TrackUserActivityOnNotifications-UN-11112.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test suite: Track Users Activity On Notifications', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();


  beforeEach(async function () {
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName, jsonData.Password, jsonData.FirstName).then(function (result) {
      expect(result).toBe(true);
    });
  });

  afterEach(async function () {
    await out.signOut();
    await browser.manage().deleteAllCookies();
  });

  it('To Verify Audit Trail API Call when Notification Window is accessed through Bell Icon ', async () => {
     await dashBoard.selectSidebarOption(jsonData.departmentName);
     await dashBoard.selectSidebarOption(jsonData.instrumentName);
     await dashBoard.clickOnReportsTab();
     await dashBoard.selectReportType(jsonData.reportType);
     let count = await dashBoard.getNotificationCount();
     await dashBoard.createReport();
     await dashBoard.closeCreateReportsPopUp();
     let flag = await dashBoard.checkNotificationCountPresent(count + 1);
     expect(flag).toBe(true);
    await library.clearPerformanceLogs();
    await dashBoard.clickNotificationBellIcon();
    flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadAccessNotification, jsonData.NotificationAPISuccessStatusCode);
    expect(flag).toBe(true);

  });

  it('To Verify Audit Trail API Call when Notification is selected', async () => {
     await dashBoard.selectSidebarOption(jsonData.departmentName);
     await dashBoard.selectSidebarOption(jsonData.instrumentName);
     await dashBoard.clickOnReportsTab();
     await dashBoard.selectReportType(jsonData.reportType);
     let count = await dashBoard.getNotificationCount();
     await dashBoard.createReport();
     await dashBoard.closeCreateReportsPopUp();
     let flag = await dashBoard.checkNotificationCountPresent(count + 1);
     expect(flag).toBe(true);
    await dashBoard.clickNotificationBellIcon();
    await library.clearPerformanceLogs();
    await dashBoard.clickFirstNotification();
    flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadNotificationSelected, jsonData.NotificationAPISuccessStatusCode);
    expect(flag).toBe(true);
  });

  it('To Verify Audit Trail API Call when individual notification is cleared by clicking "X"', async () => {
     await dashBoard.selectSidebarOption(jsonData.departmentName);
     await dashBoard.selectSidebarOption(jsonData.instrumentName);
     await dashBoard.clickOnReportsTab();
     await dashBoard.selectReportType(jsonData.reportType);
     let count = await dashBoard.getNotificationCount();
     await dashBoard.createReport();
     await dashBoard.closeCreateReportsPopUp();
     let flag = await dashBoard.checkNotificationCountPresent(count + 1);
     expect(flag).toBe(true);
    await dashBoard.clickNotificationBellIcon();
    await library.clearPerformanceLogs();
    await dashBoard.clearFirstNotification();
    flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadClearIndividualNotification, jsonData.NotificationAPISuccessStatusCode);
    expect(flag).toBe(true);
  });

  it('To Verify Audit Trail API Call all notifications are removed by clicking "Clear All"', async () => {
     await dashBoard.selectSidebarOption(jsonData.departmentName);
     await dashBoard.selectSidebarOption(jsonData.instrumentName);
     await dashBoard.clickOnReportsTab();
     await dashBoard.selectReportType(jsonData.reportType);
     let count = await dashBoard.getNotificationCount();
     await dashBoard.createReport();
     await dashBoard.closeCreateReportsPopUp();
     let flag = await dashBoard.checkNotificationCountPresent(count + 1);
     expect(flag).toBe(true);
    await dashBoard.clickNotificationBellIcon();
    await library.clearPerformanceLogs();
    await dashBoard.clearAllNotifications();
    flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadClearAllNotification, jsonData.NotificationAPISuccessStatusCode);
    expect(flag).toBe(true);
  });
});
