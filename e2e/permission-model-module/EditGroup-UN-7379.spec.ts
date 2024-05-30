/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const manager = new AccoutManager();

let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/PBI-234802-AddGroup.json').then(function (data) {
  jsonData = data;
});

describe("PBI 234802 - Implement add group functionality", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  var groupName: string;

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    groupName = 'Autotest-' + library.generateRandomNumber(jsonData.sampleGroupName, jsonData.groupNameTextSize);
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 1 : Verify Edit group form is displayed', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.verifyEditGroupOptionsAreDisplayed().then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test Case 2 : Veirfy edited group name is displayed'+
     'Test Case 3 : Verify editing and adding duplicate group name is not allowed', function () {
      console.log("Group Name is : " + groupName)
      dashBoard.goToAccountManagementpage().then(function (status) {
        expect(status).toBe(true);
      });
      manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
        expect(clicked).toBe(true);
      })
      manager.clickOnEditGroup(jsonData.existingGroupName).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.addGroupName(groupName).then(function (added) {
        expect(added).toBe(true);
      });
      manager.clickOnChangeGroupNameBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyNewlyAddedOrUpdatedGroupIsDisplayed(groupName).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.clickOnEditGroup(groupName).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.addGroupName(groupName).then(function (added) {
        expect(added).toBe(true);
      });
      manager.verifyErrorMsgForDuplicateGroup().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });



  it('Test Case 4 : Verify "You have unsaved changes" popup is displayed while editing group and navigating away' +
    'Test Case 5 : Verify group name is not updated if click on Don\'t Save while navigating away from UI', function () {
      dashBoard.goToAccountManagementpage().then(function (status) {
        expect(status).toBe(true);
      });
      manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
        expect(clicked).toBe(true);
      })
      manager.clickOnEditGroup(jsonData.existingGroupName).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.addGroupName(groupName).then(function (added) {
        expect(added).toBe(true);
      });
      manager.clickOnCloseGroupForm().then(function (added) {
        expect(added).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyNewlyAddedOrUpdatedGroupIsDisplayed(groupName).then(function (clicked) {
        expect(clicked).toBe(false);
      });
    });

  it('Test Case 6 : Verify group name is updated if click on Save while navigating away from UI', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.clickOnEditGroup(jsonData.existingGroupName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.addGroupName(groupName).then(function (added) {
      expect(added).toBe(true);
    });
    manager.clickOnCloseGroupForm().then(function (added) {
      expect(added).toBe(true);
    });
    manager.verifyExitWithoutSavingPopupDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    manager.clickOnSaveAndExitBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyNewlyAddedOrUpdatedGroupIsDisplayed(groupName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 7 : Verify group name does not allow more than 50 characters in the name field', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    })
    manager.clickOnEditGroup(jsonData.existingGroupName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyFieldLengthForGroupName(jsonData.DummyGroupName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
})
