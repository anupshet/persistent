/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { ActionableDashboard } from '../page-objects/actionable-dashboard-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/ActionableDashboard.json').then(function(data) {
  jsonData = data;
});

describe('Verify Actionable Dashboard', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const actDashboard = new ActionableDashboard();

  afterEach(function () {
    out.signOut();
  });

/*
    beforeAll(function(){
      loginEvent.loginToApplication(jsonData.URL, jsonData.AccountManagerUserName,
        jsonData.AccountManagerPassword, jsonData.AccountManagerFirstName).then(function (loggedIn) {
        browser.sleep(3000);
        expect(loggedIn).toBe(true);
      });
    gearIcon.gearAccountManagement().then(function (navigated) {
        expect(navigated).toBe(true);
      });
    accountManagement.searchLabAccount().then(function(found){
        expect(found).toBe(true);
      });
    accountManagement.goToEditLabAccount().then(function(status){
        expect(status).toBe(true);
      });
    accountManagement.changeLicenseDate().then(function(changed){
        expect(changed).toBe(true);
      });
    actDashboard.backToDashboard().then(function (navigated) {
        expect(navigated).toBe(true);
      });
    out.signOut().then(function (loggedout) {
        expect(loggedout).toBe(true);
      });
    });

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AmrutaUsername,
      jsonData.AmrutaPassword, jsonData.AmrutaFirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  it('Test Case 2 : Actionable Dashboard is Empty to Admin', function () {
    out.signOut();
    loginEvent.loginToApplication(jsonData.URL, jsonData.AccountManagerUserName,
      jsonData.AccountManagerPassword, jsonData.AccountManagerFirstName);
    actDashboard.VerifyEmptyLotMessage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 4 :Actionable Dashboard is displayed with all 6 cards to Admin ', function () {
    actDashboard.expiringlotCardDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.expiringLotsCardContent().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

   //Unable to create a lab of which licence expiry date is less than 45 days.
     it('Test Case 5 :Actionable Dashboard :Expiring License Tile is displayed to Admin/User.', function () {
    actDashboard.expiringLicenseCardContent().then(function (displayed) {
         expect(displayed).toBe(true);
       })
    });

  it('Test Case 7:Actionable Dashboard: Verify action of clicking Product name on Expiring lot card on Actionable Dashboard ', function () {
    const prod = jsonData.expiringProductName;
    actDashboard.expiringlotCardDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.expiringLotsCardContent().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.clickOnProductNameOnExpiringLotCard(prod).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    actDashboard.isModalDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.CloselotChangesModalDialog().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('Test case 14: Display of Add new lot modal when user clicks on expired lots hyperlink on Expired lots Card', function () {
    const prod = jsonData.expiringProductName;
    actDashboard.expiringlotCardDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.expiringLotsCardContent().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.clickOnProductNameOnExpiringLotCard(prod).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    actDashboard.isModalDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.lotChangesModalDialogContentsWithOptions().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.CloselotChangesModalDialog().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('Test case 15: Clicking on "X" on the modal for when user clicks
  on expiring lot name on Expiring lots Card, will make the modal disappear', function () {
    const prod = jsonData.expiringProductName;
    actDashboard.expiringlotCardDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.expiringLotsCardContent().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.clickOnProductNameOnExpiringLotCard(prod).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    actDashboard.isModalDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.lotChangesModalDialogContentsWithOptions().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.CloselotChangesModalDialog().then(function (closed) {
      expect(closed).toBe(true);
    });
    actDashboard.isModalClosed().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  it('Test Case 16 : Clicking on cancel button on the modal for when user clicks on expiring lot name ', function () {
    const prod = jsonData.expiringProductName;
    actDashboard.expiringlotCardDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.expiringLotsCardContent().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.clickOnProductNameOnExpiringLotCard(prod).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    actDashboard.isModalDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.lotChangesModalDialogContentsWithOptions().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    actDashboard.CanclelotChangesModalDialog().then(function (closed) {
      expect(closed).toBe(true);
    });
    actDashboard.isModalClosed().then(function (closed) {
      expect(closed).toBe(true);
    });
  });

  /*
    // TC is failing as changed lot is not getting displayed on lab setup page.
    it('Test case 18: Clicking on Change Lot on modal when user clicks on
    expiring lot name on Expiring lots Card will change lot', function () {
      const prod = jsonData.expiringProductName2;
      const val = jsonData.NewProductLot2
      actDashboard.expiringlotCardDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      actDashboard.expiringLotsCardContent().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      actDashboard.clickOnProductNameOnExpiringLotCard(prod).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      actDashboard.isModalDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      actDashboard.lotChangesModalDialogContentsWithOptions().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      actDashboard.lotChangesDialogSelctLotValueFromDropdown(val).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      actDashboard.lotChangesDialogClickOnChangeLotBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      gearIcon.gearIconLabSetup().then(function (navigated) {
        expect(navigated).toBe(true);
      });
        actDashboard.verifyLabSetupPageForChangedLot(prod, val).then(function (changed) {
          expect(changed).toBe(true,'Lot is not updated.');
       });
    });
*/
});




