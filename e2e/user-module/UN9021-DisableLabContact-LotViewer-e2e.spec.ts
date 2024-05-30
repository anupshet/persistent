/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';

const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();

library.parseJson('./JSON_data/UN9021_DisableContactLotViewer.json').then(function(data) {
  jsonData = data;
});



describe('Test suite: UN9021_Disable Lab contact field if it is Lot Viewer Admin', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const userManage = new UserManagement();
  const manager = new AccoutManager();
  const library = new BrowserLibrary();
  const accountsTab = new AccountsListing();


  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
        jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
            expect(loggedIn).toBe(true);
        });
  });

    afterEach(function () {
        out.signOut();
    });


    it('TC#1:Verify that for doing Edit Account if that respective account has lotviewer contact details added then on Edit Account form , Lab Contact Email, First Name and Last Name field should be disabled',function(){
        library.logStep("TC#1:Verify that for doing Edit Account if that respective account has lotviewer contact details added then on Edit Account form , Lab Contact Email, First Name and Last Name field should be disabled'");

        dashBoard.goToAccountManagementpage().then(function(status){
          expect(status).toBe(true);
        })

        manager.clickAccountTab().then(function(clicked){
          expect(clicked).toBe(true);
        })

        accountsTab.selectSearchCatagory(jsonData.AccountNameColumn).then(function(selected){
          expect(selected).toBe(true);
        })

        accountsTab.searchAndVerify(jsonData.KeywordAccount, jsonData.ColumnNo1).then(function (verified) {
          expect(verified).toBe(true);
        })

        manager.clickOnSearchedAccountName(jsonData.Group1).then(function(clicked){
          expect(clicked).toBe(true);
        })

        manager.verifyContactFieldsDisabled_EditAccount().then(function(clicked){
          expect(clicked).toBe(true);
        })

        manager.clickCancelButton().then(function(clicked){
          expect(clicked).toBe(true);
        })


    });



    it('TC#2:Verify that for doing Edit Location if that respective location has lotviewer contact details added then on Edit Location form , Lab Contact Email, First Name and Last Name field should be disabled',function(){
      library.logStep('TC#2:Verify that for doing Edit Location if that respective location has lotviewer contact details added then on Edit Location form , Lab Contact Email, First Name and Last Name field should be disabled');


      dashBoard.goToAccountManagementpage().then(function(status){
        expect(status).toBe(true);
      })

      manager.clickAccountTab().then(function(clicked){
        expect(clicked).toBe(true);
      })

      accountsTab.selectSearchCatagory(jsonData.AccountNameColumn).then(function(selected){
        expect(selected).toBe(true);
      })

      accountsTab.searchAndVerify(jsonData.KeywordAccount, jsonData.ColumnNo1).then(function (verified) {
        expect(verified).toBe(true);
      })

      manager.clickLOCATIONSBtn_AccountsPage().then(function(clicked){
        expect(clicked).toBe(true);
      })



      manager.clickOnLocationName().then(function(clicked){
        expect(clicked).toBe(true);
      })

      manager.verifyContactFieldsDisabled_EditLocation().then(function(clicked){
        expect(clicked).toBe(true);
      })

      manager.clickCancelButton().then(function(clicked){
        expect(clicked).toBe(true);
      })



    });


})
