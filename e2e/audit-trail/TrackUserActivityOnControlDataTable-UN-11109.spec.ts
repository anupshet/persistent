/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountLabUser } from '../page-objects/users-e2e.po';
import { LocationListing } from '../page-objects/location-listing-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/TrackUserActivityOnControlDataTable-UN-11109.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test suite: Track Users Activity On Control Data Table', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const userManagement = new AccountLabUser();
  const locationsTab = new LocationListing();
  const userMgmt = new UserManagement();


  beforeEach(async function () {
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName, jsonData.Password, jsonData.FirstName).then(function (result) {
      expect(result).toBe(true);
    });
  });

  afterEach(async function () {
    await out.signOut();
    await browser.manage().deleteAllCookies();
  });

  it('To Verify Audit Trail API Call when Data is entered from the Control Data Table', async () => {
    await dashBoard.selectSidebarOption(jsonData.departmentName);
    await dashBoard.selectSidebarOption(jsonData.instrumentName);
    await dashBoard.enterData(jsonData.controlLot, jsonData.data);
    await dashBoard.showOptions(jsonData.controlLot);
    await dashBoard.selectCorrectiveAction(jsonData.controlLot, jsonData.correctiveAction);
    await dashBoard.addComment(jsonData.controlLot, jsonData.comment);
    await library.clearPerformanceLogs();
    await dashBoard.sendToPeerGroup();
    let flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.dataEntryPayload, jsonData.AuditTrailAPIStatusCode);
    expect(flag).toBe(true);
  });
  
  it('To Verify Audit Trail API Call when new lot is started from the Expired Lot from the Control Data Table', async () => {
    await dashBoard.selectSidebarOption(jsonData.departmentName);
    await dashBoard.selectSidebarOption(jsonData.instrumentName);
    await dashBoard.clickStartNewLotWithLot(jsonData.startNewLotNumber);
    await dashBoard.selectLot(jsonData.selectNewLot);
    await library.clearPerformanceLogs();
    await dashBoard.clickStartNewLot();
    let flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.startNewLotPayLoad, jsonData.AuditTrailAPIStatusCode);
    expect(flag).toBe(true);
  });


});
