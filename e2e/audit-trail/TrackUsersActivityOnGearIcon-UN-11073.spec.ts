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
import {LabSettings} from '../page-objects/lab-settings-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/TrackUsersActivityOnGearIcon-UN-11073.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test suite: Track Users activity on Gear icon', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const userManagement = new AccountLabUser();
  const locationsTab = new LocationListing();
  const userMgmt = new UserManagement();
  const labSettings= new LabSettings();


  beforeEach(async function () {
    await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName, jsonData.Password, jsonData.FirstName).then(function (result) {
      expect(result).toBe(true);
    });
  });

  afterEach(async function () {
    await out.signOut();
    await browser.manage().deleteAllCookies();
  });


  it('Verify Audit Trail API Call when User Management Window is accessed through Gear Icon.', async () => {
    await library.clearPerformanceLogs();
    await userManagement.goToUserManagement();
    
    
    let flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadGearIcon, jsonData.AuditTrailAPIStatusCode);
    expect(flag).toBe(true);
  });
  
  it('Verify Audit Trail API Call when User Created.', async () => {
    await library.clearPerformanceLogs();
    await userManagement.goToUserManagement();
    await library.clearPerformanceLogs();
    await userManagement.clickAddUser();
    await library.clearPerformanceLogs();
    await userManagement.enterAddUserDetails(jsonData.FirstName,jsonData.LastName,jsonData.Email,jsonData.Role);
    await userManagement.clickAddButton();
    
    let flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadAddUser, jsonData.AuditTrailAPIStatusCode);
    expect(flag).toBe(true);
  });

  it('Verify Audit Trail API Call when existing User "Role" Updated.', async () => {
    await library.clearPerformanceLogs();
    await userManagement.goToUserManagement();
    await library.clearPerformanceLogs();
    await userManagement.selectUserFromUserList(jsonData.FirstName+" "+jsonData.LastName);
    await userManagement.openRolesDropdown();
    await userManagement.selectUserRole(jsonData.Role1);
    await userManagement.clickUpdateButton();
    
    let flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadUpdateAddUser, jsonData.AuditTrailAPIStatusCode);
    expect(flag).toBe(true);
  });
  it('Verify Audit Trail API Call when existing User Deleted.', async () => {
    await library.clearPerformanceLogs();
    await userManagement.goToUserManagement();
    await library.clearPerformanceLogs();
    await userManagement.selectUserFromUserList(jsonData.FirstName+" "+jsonData.LastName);
    await userManagement.clickDeleteAndConfirmButton();
    
    let flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadDeleteUser, jsonData.AuditTrailAPIStatusCode);
    expect(flag).toBe(true);
  });

  it('Verify Audit Trail API Call when Lab Setting Window is accessed through Gear Icon.', async () => {
    await library.clearPerformanceLogs();
    //await labSettings.goToLabSettings();
    await userManagement.ClickLabSettings();
    library.waitTillLoading();
    browser.sleep(15000);
    let flag = await library.verifyAPIStatusAndPayloadStructure(jsonData.AuditTrailAPI, jsonData.payLoadLabSetting, jsonData.AuditTrailAPIStatusCode);
    
    expect(flag).toBe(true);
  });
 


});
