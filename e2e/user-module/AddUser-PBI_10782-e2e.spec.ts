/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccountLabUser } from '../page-objects/users-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/AddUser-PBI_10782.json').then(function (data) {
  jsonData = data;
});



describe('Test suite: ADD USER - 10782', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const users = new AccountLabUser();
  const library = new BrowserLibrary();
  const accountsTab = new AccountsListing();

  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
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


  it('TC 1: Verify after Clicking on ADD A User should present a form with First Name,Last Name,Email,Role fields. All are mandatory.' +
    'TC 2: Verify error message is shown for the duplicate email id.', function () {
      dashBoard.goToUserManagementpage().then(function (result) {
        expect(result).toBe(true);
      });
      users.clickAddUser().then(function (status) {
        expect(status).toBe(true);
      });
      users.verifyAddUserFields().then(function (status) {
        expect(status).toBe(true);
      });
      users.clickAddUser().then(function (status) {
        expect(status).toBe(true);
      });
      users.verifyErrorMessageForExistingUser(jsonData.FirstName, jsonData.LastName, jsonData.existingEmail, jsonData.RoleTech).then(function (status) {
        expect(status).toBe(true);
      });

    });


  it("TC 3: Verify role dropdown is displayed with all valid options.", function () {
  library.logStep('TC 24: Verify in role dropdown Account User Manager option should be visible only when Logged in user is Account manager')
  library.logStep('TC 25: Verify role dropdown is displayed with below 4 options for Lab User Manager.')

    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    users.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    users.verifyRoleDropdownLabUser("LabUser").then(function (status) {
      expect(status).toBe(true);
    });
    out.signOut();

    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    users.verifyRoleDropdownLabUser("AccountUser").then(function (status) {
      expect(status).toBe(true);
    });
  });


  it("TC 4: Verify user is able to select only single option from Technician,Lead Technician,Lab Supervisor roles. Once any 1 option is selected other two should be disabled.", function () {
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    users.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    users.openRolesDropdown().then(function (status) {
      expect(status).toBe(true);
    });
    users.selectUserRole(jsonData.RoleTech).then(function (status) {
      expect(status).toBe(true);
    });
    users.verifyTechRoleField(jsonData.RoleTech).then(function (status) {
      expect(status).toBe(true);
    });
    users.selectUserRole(jsonData.RoleTech).then(function (status) {
      expect(status).toBe(true);
    });
    users.selectUserRole(jsonData.RoleLeadTech).then(function (status) {
      expect(status).toBe(true);
    });
    users.verifyTechRoleField(jsonData.RoleLeadTech).then(function (status) {
      expect(status).toBe(true);
    });
    users.selectUserRole(jsonData.RoleLeadTech).then(function (status) {
      expect(status).toBe(true);
    });
    users.selectUserRole(jsonData.RoleLabSupervisor).then(function (status) {
      expect(status).toBe(true);
    });
    users.verifyTechRoleField(jsonData.RoleLabSupervisor).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('TC 5:Verify user is able to Add new user with roles as Lab Supervisor and Lab User Manager.', function () {
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    users.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    users.enterAddUserDetails(jsonData.FirstName, jsonData.LastName, jsonData.Email2, jsonData.RoleLabSupervison_User).then(function (status) {
      expect(status).toBe(true);
    });
    users.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
});

  it('TC 6:Verify user is able to Add new user with roles as Technician and Account User Manager.', function () {
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    users.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    users.enterAddUserDetails(jsonData.FirstName, jsonData.LastName, jsonData.Email, jsonData.RoleTech_AccountManager).then(function (status) {
      expect(status).toBe(true);
    });
    users.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
});

  it('TC 7:Verify user is able to Add new user with roles as Technician and Account User Manager and Lab user manager.', function () {
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    users.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    users.enterAddUserDetails(jsonData.FirstName, jsonData.LastName, jsonData.Email, jsonData.RoleTech_Lab_AccountManager).then(function (status) {
      expect(status).toBe(true);
    });
    users.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
});


  it('TC 8:Verify in Locations dropdown Default lab location is greyed out and listed.'+
  'TC 9 : Verify when multiple locations are present then Locations dropdown first item(location name,dept name) is greyed out and listed.', function () {
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    users.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    users.verifyDefaultLocIsGrey().then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('TC 11: Verify clicking on ADD button adds new user.', function () {
    dashBoard.goToUserManagementpage().then(function (result) {
      expect(result).toBe(true);
    });
    users.clickAddUser().then(function (status) {
      expect(status).toBe(true);
    });
    users.enterAddUserDetails(jsonData.FirstName, jsonData.LastName, jsonData.NewEmailEverytime, jsonData.RoleLabUser).then(function (status) {
      expect(status).toBe(true);
    });
    users.clickAddButton().then(function (status) {
      expect(status).toBe(true);
    });
    accountsTab.selectSearchCatagory(jsonData.locationCategoryName).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.NewEmailEverytime, "2").then(function (verified) {
    expect(verified).toBe(true);
    });
  });

it('TC 12: Verify in Role field when user select Lab Supervisor role other roles (Technician, Lead Technician) should be disabled.'+
'TC 13 : Verify unchecking the selected Lab Supervisor role enabled the other 2 disabled roles.', function () {
  dashBoard.goToUserManagementpage().then(function (result) {
    expect(result).toBe(true);
  });
  users.clickAddUser().then(function (status) {
    expect(status).toBe(true);
  });
  users.openRolesDropdown().then(function (status) {
    expect(status).toBe(true);
  });
  users.selectUserRole(jsonData.RoleLabSupervisor).then(function (status) {
    expect(status).toBe(true);
  });
  users.verifyTechRoleField(jsonData.RoleLabSupervisor).then(function (status) {
    expect(status).toBe(true);
  });
  users.selectUserRole(jsonData.RoleLabSupervisor).then(function (status) {
    expect(status).toBe(true);
  });
  users.verifyTechRoleField(jsonData.RoleLabSupervisor).then(function (status) {
    expect(status).toBe(true);
  });

});
it('TC 16:Verify clicking on CANCEL button will close the form.', function () {
  dashBoard.goToUserManagementpage().then(function (result) {
    expect(result).toBe(true);
  });
  users.clickAddUser().then(function (status) {
    expect(status).toBe(true);
  });
  users.enterAddUserDetails(jsonData.FirstName, jsonData.LastName, jsonData.NewEmailEverytime, jsonData.RoleLabUser).then(function (status) {
    expect(status).toBe(true);
  });
  users.clickCancelButton().then(function (status) {
    expect(status).toBe(true);
  });
  users.isfieldClear().then(function (status) {
    expect(status).toBe(true);
  });

});

it('TC 17:Verify clicking on X button will close the form.', function () {
  dashBoard.goToUserManagementpage().then(function (result) {
    expect(result).toBe(true);
  });
  users.clickAddUser().then(function (status) {
    expect(status).toBe(true);
  });
  users.clickCloseButton().then(function (status) {
    expect(status).toBe(true);
  });
  users.verifyAddUserDisplayed().then(function (status) {
    expect(status).toBe(false);
  });

});

it('TC 18:Verify if user clicks on ‘X’ when some selections were made then user should be presented with Exit message.', function () {
  dashBoard.goToUserManagementpage().then(function (result) {
    expect(result).toBe(true);
  });
  users.clickAddUser().then(function (status) {
    expect(status).toBe(true);
  });
  users.enterAddUserDetails(jsonData.FirstName, jsonData.LastName, jsonData.NewEmailEverytime2, jsonData.RoleLabUser).then(function (status) {
    expect(status).toBe(true);
  });
  users.clickCloseButton().then(function (status) {
    expect(status).toBe(true);
  });
  users.verifyexitPopupMsgDisplayed().then(function (status) {
    expect(status).toBe(true);
  });

});
it('TC 19:Verify for Lab User Manager access can be given to specific department.', function () {

  library.logStep('TC 20 : Verify for Lab User Manager access can be given to multiple locations and specific departments within the selected location.');
  library.logStep('TC 21 : Verify when user expand Location then list of Departments under the Location is shown.');

  dashBoard.goToUserManagementpage().then(function (result) {
    expect(result).toBe(true);
  });
  users.clickAddUser().then(function (status) {
    expect(status).toBe(true);
  });
  users.enterAddUserDetails(jsonData.FirstName, jsonData.LastName, jsonData.NewEmailEverytime3, jsonData.RoleLabUser).then(function (status) {
    expect(status).toBe(true);
  });
  users.expandGroupOrLocation(jsonData.Groupname1).then(function (status) {
    expect(status).toBe(true);
  });
  users.expandGroupOrLocation(jsonData.Location1).then(function (status) {
    expect(status).toBe(true);
  });
  users.selectDeptOrLoc(jsonData.DeptSelect1).then(function (status) {
    expect(status).toBe(true);
  });

});

it('TC 22:Verify after selecting location from dropdown all the department under location is get selected.', function () {
  library.logStep('TC 23 : Verify after selecting location from dropdown all the department under location is get selected and user is able to unselect the department as needed.');

  dashBoard.goToUserManagementpage().then(function (result) {
    expect(result).toBe(true);
  });
  users.clickAddUser().then(function (status) {
    expect(status).toBe(true);
  });
  users.enterAddUserDetails(jsonData.FirstName, jsonData.LastName, jsonData.NewEmailEverytime3, jsonData.RoleLabUser).then(function (status) {
    expect(status).toBe(true);
  });
  users.openLocationsDropdown().then(function (status) {
    expect(status).toBe(true);
  });
  users.expandGroupOrLocation(jsonData.Groupname1).then(function (status) {
    expect(status).toBe(true);
  });
  users.selectDeptOrLoc(jsonData.Location2).then(function (status) {
    expect(status).toBe(true);
  });
  users.isLocSelected(jsonData.Groupname1).then(function (status) {
    expect(status).toBe(true);
  });

 });
});


