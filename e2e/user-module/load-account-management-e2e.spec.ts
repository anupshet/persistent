/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;


const library=new BrowserLibrary();
library.parseJson('./JSON_data/LoadAccountMgmtE2E.json').then(function(data) {
  jsonData = data;
})


describe('Load Account Management E2E', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const userManage = new UserManagement();
  const library = new BrowserLibrary();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername, jsonData.AdminPassword, jsonData.AdminFirstName);
  });

  afterEach(function () {
    out.signOut();
  });

  it('Load Account Management E2E', function () {
    library.logStep('Load Account Management E2E Start');

    // Real test starts here, so timer starts here
    const testStart = new Date().getTime();
    let endTime;

    dashBoard.goToUserManagementpage().then(function (status) {
      expect(status).toBe(true);
      endTime = new Date().getTime();
    }).then(function () {
      const totalTime = endTime - testStart;
      library.logStep('Total time ' + totalTime + ' milleseconds');
    });

    library.logStep('Load Account Management E2E End');
  });
});
