/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';
import { LocationListing } from '../page-objects/location-listing-e2e.po';

const manager = new AccoutManager();
const accountsTab = new AccountsListing();
const locationListing = new LocationListing();
const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();

library.parseJson('./JSON_data/Account&LocationsManagementPermissions_UN10601.json').then(function(data) {
  jsonData = data;
});



describe('Test suite: 10601', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const userManage = new UserManagement();
  const library = new BrowserLibrary();

  afterEach(function () {
    out.signOut();
  });


  it('Test case 1 : Verify that for account user manager role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for account user manager role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.AccountUserManager_Username, jsonData.AccountUserManager_Password, jsonData.AccountUserManager_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });


  it('Test case 2 : Verify that for Lab user Manager role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Lab user Manager role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LabUserManager_Username, jsonData.LabUserManager_Password, jsonData.LabUserManager_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });


  it('Test case 3 : Verify that for Lab Supervisor role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Lab Supervisor role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LabUserSupervisor_Username, jsonData.LabUserSupervisor_Password, jsonData.LabUserSupervisor_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });


  it('Test case 4 : Verify that for Lab Tech role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Lab Tech role role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LeadTech_Username, jsonData.LeadTech_Password, jsonData.LeadTech_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });

  it('Test case 5 : Verify that for Tech role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Tech role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.Tech_Username, jsonData.Tech_Password, jsonData.Tech_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });

  it('Test case 6 : Verify that for Lot viewer sales role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Lot viewer sales role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LotViewerSales_Username, jsonData.LotViewerSales_Password, jsonData.LotViewerSales_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  })

  it('Test case 7 : Verify that for Account User Manager+Supervisor role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Account User Manager+Supervisor role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.AccountUserManager_Supervisor_Username, jsonData.AccountUserManager_Supervisor_Password, jsonData.AccountUserManager_Supervisor_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    });


  });

  it('Test case 8 : Verify that for Account User Manager+Lab User Manager+Lab Supervisor role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Account User Manager+Lab User Manager+Lab Supervisor role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.AccountUserManager_LabUserManager_Supervisor_Username, jsonData.AccountUserManager_LabUserManager_Supervisor_Password, jsonData.AccountUserManager_LabUserManager_Supervisor_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });


  it('Test case 9 : Verify that for Lab User Manager+Lab Supervisor role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Lab User Manager+Lab Supervisor role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LabUserManager_Supervisor_Username, jsonData.LabUserManager_Supervisor_Password, jsonData.LabUserManager_Supervisor_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });

  it('Test case 10 : Verify that for Lab User Manager+Lead Tech role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Lab User Manager+Lead Tech role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LabUserManager_LeadTech_Username, jsonData.LabUserManager_LeadTech_Password, jsonData.LabUserManager_LeadTech_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });


  it('Test case 11 : Verify that for Lab User Manager+Tech role "Account & Location Management" menu should not be available.', function () {

    library.logStep("Verify that for Lab User Manager+Tech role 'Account & Location Management' menu should not be available.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.LabUserManager_Tech_Username, jsonData.LabUserManager_Tech_Password, jsonData.LabUserManager_Tech_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyNoAccessToAccountLocationManagementMenu().then(function(noaccessed){
    expect(noaccessed).toBe(true);
    })


  });






  it("Test case 12:Verify that for Bio-Rad user manager role below 'Add Account' button should be enabled and able to add account."+
  "Test case 13:Verify that for Bio-Rad user manager role below 'Edit Account' button should be enabled and able to update account."+
  "Test case 14:Verify that for Bio-Rad user manager role delete icon should  be enabled which is  displayed against the account which has 0 count of locations and able to delete that account."+
  "Test case 15:Verify that Bio-Rad User manager user should be able to view newly created account."+
  "Test case 16:Verify that Bio-Rad User manager user should be able to view Account Listing page",function(){
    library.logStep("Verify that for Bio-Rad user manager role below 'Add Account' button should be enabled and able to add account.");
    library.logStep("Verify that for Bio-Rad user manager role below 'Edit Account' button should be enabled and able to update account.");
    library.logStep("Verify that for Bio-Rad user manager role delete icon should  be enabled which is  displayed against the account which has 0 count of locations and able to delete that account.");
    library.logStep("Verify that Bio-Rad User manager user should be able to view newly created account.");
    library.logStep("Verify that Bio-Rad User manager user should be able to view Account Listing page.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.BioRadUserManager_Username, jsonData.BioRadUserManager_Password, jsonData.BioRadUserManager_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyAccessToAccountLocationManagementMenu().then(function(accessed){
    expect(accessed).toBe(true);
    })

    dashBoard.goToAccountManagementpage().then(function(clicked){
    expect(clicked).toBe(true);
    })

    //Add
    manager.clickAddAccountButton().then(function (btnClicked) {
    expect(btnClicked).toBe(true);
    });

    manager.addAccountValidDetails(jsonData).then(function (detailsAdded) {
        expect(detailsAdded).toBe(true);
    });

    manager.clickAddAccountSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
    });

    accountsTab.selectSearchCatagory(jsonData.AccountNameColumn).then(function (selected) {
      expect(selected).toBe(true);
    });

    accountsTab.searchAndVerify(jsonData.KeywordAccount, jsonData.ColumnNo1).then(function (verified) {
      expect(verified).toBe(true);
    });

    //Edit
    manager.goToEditLabAccount().then(function (btnClicked) {
      expect(btnClicked).toBe(true);
    });

    manager.updateLabAccountDetails(jsonData).then(function (update) {
      expect(update).toBe(true);
    });

    manager.clickUpdateAccountButton().then(function (update) {
      expect(update).toBe(true);

    });

    //Delete
    dashBoard.goToAccountManagementpage().then(function(clicked){
      expect(clicked).toBe(true);
    })


    manager.clickDeleteIconWithZeroLoc().then(function (btnClicked) {
      expect(btnClicked).toBe(true);
    });

    manager.clickOnConfirmDeleteLocation().then(function (btnClicked) {
      expect(btnClicked).toBe(true);
    });

    manager.verifyAccountsDeleted().then(function (btnClicked) {
      expect(btnClicked).toBe(true);
    });


  });


  it("Test case 17:Verify that Bio-Rad user manager should  be able to do add group"+
  "Test case 18:Verify that Bio-Rad user manager should  be able to do edit group"+
  "Test case 19:Verify that Bio-Rad user manager should  be able to do delete group ",function(){

    library.logStep("Verify that Bio-Rad user manager should  be able to do add group");
    library.logStep("Verify that Bio-Rad user manager should  be able to do edit group");
    library.logStep("Verify that Bio-Rad user manager should  be able to do delete group");


    loginEvent.loginToApplication(jsonData.URL, jsonData.BioRadUserManager_Username, jsonData.BioRadUserManager_Password, jsonData.BioRadUserManager_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyAccessToAccountLocationManagementMenu().then(function(accessed){
    expect(accessed).toBe(true);
    })

    dashBoard.goToAccountManagementpage().then(function(clicked){
    expect(clicked).toBe(true);
    })

    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    //Add Group
    manager.clickOnAddGroup().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.addGroupName(jsonData.groupName).then(function (added) {
      expect(added).toBe(true);
    });
    manager.clickOnAddGroupBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyNewlyAddedGroupIsDisplayed(jsonData.groupName).then(function (clicked) {
      expect(clicked).toBe(true);
    });

    //Edit Group
    manager.clickOnEditGroup(jsonData.groupName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.addGroupName(jsonData.UpdategroupName).then(function (added) {
      expect(added).toBe(true);
    });
    manager.clickOnChangeGroupNameBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyNewlyAddedOrUpdatedGroupIsDisplayed(jsonData.groupName).then(function (clicked) {
      expect(clicked).toBe(true);
    });

    //Delete Group

  });

  it("Test case 20:Verify that Bio-Rad user manager should  be able to do add location"+
  "Test case 21:Verify that Bio-Rad user manager should  be able to do edit location"+
  "Test case 22:Verify that Bio-Rad user manager should  be able to do delete location "
  +"Test case 23:Verify that Bio-Rad user manager should be able to view location that is newly created.",function(){

    library.logStep("Verify that Bio-Rad user manager should  be able to do add location");
    library.logStep("Verify that Bio-Rad user manager should  be able to do edit location");
    library.logStep("Verify that Bio-Rad user manager should  be able to do delete location");
    library.logStep("Verify that Bio-Rad user manager should be able to view location that is newly created.");


    loginEvent.loginToApplication(jsonData.URL, jsonData.BioRadUserManager_Username, jsonData.BioRadUserManager_Password, jsonData.BioRadUserManager_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyAccessToAccountLocationManagementMenu().then(function(accessed){
    expect(accessed).toBe(true);
    })

    dashBoard.goToAccountManagementpage().then(function(clicked){
    expect(clicked).toBe(true);
    })

    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
      expect(clicked).toBe(true);
    });

    //Add Location
    manager.verifyAddLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.ClickAddLocationBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.addLocationValidDetails(jsonData).then(function (detailsAdded) {
      expect(detailsAdded).toBe(true);
    });
    manager.clickAddLocationButton_OnAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    //Edit Location
    manager.clickFirstLocation().then(function (clickedFirstLocation) {
      expect(clickedFirstLocation).toBe(true);
    });
    manager.selectUNTierAndInstalledProduct(jsonData).then(function (selectedUNTierAndInstalledProduct) {
      expect(selectedUNTierAndInstalledProduct).toBe(true);
    });

    manager.updateLocationDetails(jsonData).then(function (updatedLocationDetails) {
      expect(updatedLocationDetails).toBe(true);
    });
    manager.clickUpdateLocationButton().then(function (clickedUpdateLocationButton) {
      expect(clickedUpdateLocationButton).toBe(true);
    });
    manager.clickFirstLocation().then(function (clickedFirstLocation) {
      expect(clickedFirstLocation).toBe(true);
    });
    manager.verifyUpdatedTextFieldValuesLocation(jsonData).then(function (updatedTextFieldValues) {
      expect(updatedTextFieldValues).toBe(true);
    });

    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });



  });

  it("Test case 24:Verify that Bio-Rad User Manager should able to view Location Listing page from LOCATIONS tab.",function(){
    library.logStep("Verify that Bio-Rad User Manager should able to view Location Listing page from LOCATIONS tab.");

    loginEvent.loginToApplication(jsonData.URL, jsonData.BioRadUserManager_Username, jsonData.BioRadUserManager_Password, jsonData.BioRadUserManager_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyAccessToAccountLocationManagementMenu().then(function(accessed){
    expect(accessed).toBe(true);
    })

    dashBoard.goToAccountManagementpage().then(function(clicked){
    expect(clicked).toBe(true);
    })


    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyColumnsUnderLocationTab(jsonData.expectedColumns).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it("Test case 25:Verify that CTS user should be able to view Account Listing page"+
  "Test case 26:Verify that CTS user should able to view Account detail page",function(){

    library.logStep("Verify that CTS user should be able to view Account Listing page");
    library.logStep("Verify that CTS user should able to view Account detail page");

    loginEvent.loginToApplication(jsonData.URL, jsonData.CTSUser_Username, jsonData.CTSUser_Password, jsonData.CTSUser_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyAccessToAccountLocationManagementMenu().then(function(accessed){
    expect(accessed).toBe(true);
    })

    dashBoard.goToAccountManagementpage().then(function(clicked){
    expect(clicked).toBe(true);
    })

    manager.verifyAccountLocationManagementPageUI().then(function (AccountLocationManagementPage) {
      expect(AccountLocationManagementPage).toBe(true);
    });

  });


  it("Test case 27:Verify that CTS user should be able to view Location Listing page"+
  "Test case 28:Verify that CTS user should able to view Location detail page",function(){

    library.logStep("Verify that CTS user should be able to view Location Listing page");
    library.logStep("Verify that CTS user should able to view Location detail page");

    loginEvent.loginToApplication(jsonData.URL, jsonData.CTSUser_Username, jsonData.CTSUser_Password, jsonData.CTSUser_FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });

    dashBoard.VerifyAccessToAccountLocationManagementMenu().then(function(accessed){
    expect(accessed).toBe(true);
    })

    dashBoard.goToAccountManagementpage().then(function(clicked){
    expect(clicked).toBe(true);
    })

    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });

    locationListing.verifyColumnsUnderLocationTab(jsonData.expectedColumns).then(function (status) {
      expect(status).toBe(true);
    });

  })





  })


