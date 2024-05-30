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
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/PBI-235957-AddLocation.json').then(function (data) {
  jsonData = data;
});

describe("Add Location PBI", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  it("TC#1:Verify that on LOCATIONS's page, for selected group in drop down 'Add Location' button available for users against Location(S) label",
    function () {
      library.logStep("TC#1:Verify that on LOCATIONS's page, for selected group in drop down 'Add Location' button available for users against Location(S) label");
      dashBoard.goToAccountManagementpage().then(function (status) {
        expect(status).toBe(true);
      });
      manager.clickAccountTab().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyAddLocationButton().then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  it("TC#2:Verify that on Add location page below two sections should be available 'License Information' &'Location Information'", function () {
    library.logStep("TC#2:Verify that on Add location page below two sections should be available 'License Information' &'Location Information'");
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyAddLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.ClickAddLocationBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyLicenseInformationSecUI_AddLocation().then(function (displayed) {
      expect(displayed).toBe(true)
    });
    manager.verifyLocationInformationSecUI_AddLocation().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('TC#3:Verify maximum characters allowed for below fields:ShipToAccount,SoldtoAccount,LabName,Address1,Address2,City,Zip Code,State,Lab Contact First,Lab Contact Last,Lab Contact Email' +
    'TC#4:Verify that appropriate validation message shown for entering duplicate email in Lab Contact Email.' +
    'TC#5:Verify that appropriate validation message shown for entering invalid email in Lab Contact Email.',
    function () {
      library.logStep("TC#3:Verify maximum characters allowed for below fields:ShipToAccount,SoldtoAccount,LabName,Address1,Address2,City,Zip Code,State,Lab Contact First,Lab Contact Last,Lab Contact Email");
      library.logStep("TC#4:Verify that appropriate validation message shown for entering duplicate email in Lab Contact Email.");
      library.logStep("TC#5:Verify that appropriate validation message shown for entering invalid email in Lab Contact Email.");
      dashBoard.goToAccountManagementpage().then(function (status) {
        expect(status).toBe(true);
      });
      manager.clickAccountTab().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyAddLocationButton().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForShipTo1(jsonData.DummyShipTo).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForSoldTo(jsonData.DummySoldTo).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForLabName(jsonData.DummyLabName).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForLabAddress2(jsonData.DummyAddressCreateAccount2).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForLabAddress(jsonData.DummyAddressCreateAccount1).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForLabCity(jsonData.DummyCityCreateAccount).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForFirstName(jsonData.DummyLabContactFirstName).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForLastName(jsonData.DummyLabContactLastName).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForState(jsonData.DummyStateCreateAccount).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldLengthForZip(jsonData.DummyZipCreateAccount).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyFieldEmail(jsonData.DummyLabContactEmail).then(function (verified) {
        expect(verified).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });

  it("TC#6:Verify that after entering all data/partial data user tries to close the add location form then pop up should be displayed about save data or not. ", function () {
    library.logStep("TC#6:Verify that after entering all data/partial data user tries to close the add location form then pop up should be displayed about save data or not.");
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyAddLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.ClickAddLocationBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.addOrderNumber().then(function (added) {
      expect(added).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('TC#7:Verify that from "Add location " form if user click on "Cancel" button then he should get navigated to location listing page.', function () {
    library.logStep('TC#7:Verify that from "Add location " form if user click on "Cancel" button then he should get navigated to location listing page.');
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyAddLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.ClickAddLocationBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickCancelButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('TC#8:Verify that if user selected Essentials from Unity Next tier  drop down then new text field with name "Installed product#" should be displayed.' +
    'TC#9:Verify that if user selected "UN Connect"option from "Connectivity  Tier"  drop down then new text field with name "Installed product#" should be displayed.' +
    'TC#11:Verify that if user selected "Yes "option from "QC Lot Viewer"  drop down then new text field with name "Installed product#" should be displayed.', function () {
      library.logStep('TC#8:Verify that if user selected Essentials from Unity Next tier  drop down then new text field with name "Installed product#" should be displayed.');
      library.logStep('TC#9:Verify that if user selected "UN Connect"option from "Connectivity  Tier"  drop down then new text field with name "Installed product#" should be displayed.')
      library.logStep('TC#11:Verify that if user selected "Yes "option from "QC Lot Viewer"  drop down then new text field with name "Installed product#" should be displayed.');
      dashBoard.goToAccountManagementpage().then(function (status) {
        expect(status).toBe(true);
      });
      manager.clickAccountTab().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyAddLocationButton().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.ClickAddLocationBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyInstalledProductField_ForEssentialsOption_InUnityNextTierDrpDwn(jsonData.UnityNextTier_Option).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.verifyInstalledProductField_ForUNConnectOption_InConnectivityTierDrpDwn(jsonData.ConnectivityTier_Option2).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.verifyInstalledProductField_ForYesOption_InQCLotViewerDrpDwn(jsonData.QCLotViewer_Option).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });

  it('TC#10:Verify that "Transformers List" drop down options should be displayed only when user select "UN Upload" option from "Connectivity Tier" drop down field.', function () {
    library.logStep('TC#10:Verify that "Transformers List" drop down options should be displayed only when user select "UN Upload" option from "Connectivity Tier" drop down field.');
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyAddLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.ClickAddLocationBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyTranformerDropdownIsDisabled_ForUNConnect().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.ClickAddLocationBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyTranformerDropdownIsEnabled_ForUNUpload().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyExitWithoutSavingPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickOnExitWithoutSavingBtn().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('TC#12:Verify that for Assign Date by default todays date should be displayed', function () {
    library.logStep('TC#12:Verify that for Assign Date by default todays date should be displayed');
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyAddLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.ClickAddLocationBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyAssignDateValue_AddLocation().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it("TC#13:Verify that 'License Length(optional)' field should have option from 1 to 72 months", function () {
    library.logStep("TC#13:Verify that 'License Length(optional)' field should have option from 1 to 72 months");
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyAddLocationButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.ClickAddLocationBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.verifyLicenseDropdownValues_AddLocation().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickCloseButton_FromAddLocationForm().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it("TC#14:Verify location get added successfully for valid data", function () {
    library.logStep("TC#14:Verify location get added successfully for valid data");
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.clickLOCATIONSBtn_AccountsPage().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.SelectGroup_AccountInformationTab(jsonData.Group1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
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
  });
});




