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
let jsonData, jsonData2;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/PBI-237115-UpdateLocation_1.json').then(function (data) {
  jsonData = data;
});

library.parseJson('./JSON_data/PBI-237115-UpdateLocation_2.json').then(function (data2) {
  jsonData2 = data2;
});

describe("PBI 237115:- Update Location", function () {
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

  it("TC#3: To verify that the changes made to the Location fields are not saved if the user clicks on Cancel Button", function () {
    library.logStep("TC#3: To verify that the changes made to the Location fields are not saved if the user clicks on Cancel Button");
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
    manager.clickFirstLocation().then(function (clickedFirstLocation) {
      expect(clickedFirstLocation).toBe(true);
    });
    manager.selectUNTierAndInstalledProduct(jsonData).then(function (selectedUNTierAndInstalledProduct) {
      expect(selectedUNTierAndInstalledProduct).toBe(true);
    });
    manager.selectConnTierAndInstalledProduct(jsonData).then(function (selectedConnTierAndInstalledProduct) {
      expect(selectedConnTierAndInstalledProduct).toBe(true);
    });
    manager.selectQCTierAndInstalledProduct(jsonData).then(function (selectedQCTierAndInstalledProduct) {
      expect(selectedQCTierAndInstalledProduct).toBe(true);
    });
    manager.updateLocationDetails(jsonData).then(function (updatedLocationDetails) {
      expect(updatedLocationDetails).toBe(true);
    });
    manager.clickCancelUpdateButton().then(function (clickedCancelUpdateButton) {
      expect(clickedCancelUpdateButton).toBe(true);
    });
    manager.verifyExitWithoutSavingPopupDisplayed().then(function (verifiedExitWithoutSavingPopupDisplayed) {
      expect(verifiedExitWithoutSavingPopupDisplayed).toBe(true);
    });
    manager.clickOnExitWithoutSavingBtn().then(function (clickedOnExitWithoutSavingBtn) {
      expect(clickedOnExitWithoutSavingBtn).toBe(true);
    });
    manager.clickFirstLocation().then(function (clickedFirstLocation) {
      expect(clickedFirstLocation).toBe(true);
    });
    manager.verifyUpdatedTextFieldValuesLocation(jsonData2).then(function (updatedTextFieldValues) {
      expect(updatedTextFieldValues).toBe(true);
    });
    manager.verifyUNIPFValue(jsonData2.UnityNextTier_Option, jsonData2.UN_InstalledProductField).then(function (verifiedUNIPFValue) {
      expect(verifiedUNIPFValue).toBe(true);
    });
    manager.verifyConnIPFValue(jsonData2.ConnectivityTier_Option2, jsonData2.CN_InstalledProductField).then(function (verifiedCNIPFValue) {
      expect(verifiedCNIPFValue).toBe(true);
    });
    manager.verifyQCIPFValue(jsonData2.QCLotViewer_Option, jsonData2.QC_InstalledProductField).then(function (verifiedQCIPFValue) {
      expect(verifiedQCIPFValue).toBe(true);
    });
    manager.verifyUpdatedDropdownValuesLocation(jsonData2).then(function (updatedDDValues) {
      expect(updatedDDValues).toBe(true);
    });
  });

  it("TC#5: To verify the functionality of Exit Without Saving button on Save Data Popup from Update Location Page", function () {
    library.logStep("TC#5: To verify the functionality of Exit Without Saving button on Save Data Popup from Update Location Page");
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
    manager.clickFirstLocation().then(function (clickedFirstLocation) {
      expect(clickedFirstLocation).toBe(true);
    });
    manager.selectUNTierAndInstalledProduct(jsonData).then(function (selectedUNTierAndInstalledProduct) {
      expect(selectedUNTierAndInstalledProduct).toBe(true);
    });
    manager.selectConnTierAndInstalledProduct(jsonData).then(function (selectedConnTierAndInstalledProduct) {
      expect(selectedConnTierAndInstalledProduct).toBe(true);
    });
    manager.selectQCTierAndInstalledProduct(jsonData).then(function (selectedQCTierAndInstalledProduct) {
      expect(selectedQCTierAndInstalledProduct).toBe(true);
    });
    manager.updateLocationDetails(jsonData).then(function (updatedLocationDetails) {
      expect(updatedLocationDetails).toBe(true);
    });
    manager.clickCloseUpdateLocation().then(function (clickedCloseUpdateLocation) {
      expect(clickedCloseUpdateLocation).toBe(true);
    });
    manager.verifyExitWithoutSavingPopupDisplayed().then(function (verifiedExitWithoutSavingPopupDisplayed) {
      expect(verifiedExitWithoutSavingPopupDisplayed).toBe(true);
    });
    manager.clickOnExitWithoutSavingBtn().then(function (clickedOnExitWithoutSavingBtn) {
      expect(clickedOnExitWithoutSavingBtn).toBe(true);
    });
    manager.clickFirstLocation().then(function (clickedFirstLocation) {
      expect(clickedFirstLocation).toBe(true);
    });
    manager.verifyUpdatedTextFieldValuesLocation(jsonData2).then(function (updatedTextFieldValues) {
      expect(updatedTextFieldValues).toBe(true);
    });
    manager.verifyUNIPFValue(jsonData2.UnityNextTier_Option, jsonData2.UN_InstalledProductField).then(function (verifiedUNIPFValue) {
      expect(verifiedUNIPFValue).toBe(true);
    });
    manager.verifyConnIPFValue(jsonData2.ConnectivityTier_Option2, jsonData2.CN_InstalledProductField).then(function (verifiedCNIPFValue) {
      expect(verifiedCNIPFValue).toBe(true);
    });
    manager.verifyQCIPFValue(jsonData2.QCLotViewer_Option, jsonData2.QC_InstalledProductField).then(function (verifiedQCIPFValue) {
      expect(verifiedQCIPFValue).toBe(true);
    });
    manager.verifyUpdatedDropdownValuesLocation(jsonData2).then(function (updatedDDValues) {
      expect(updatedDDValues).toBe(true);
    });
  });

  it("TC#1: To verify that the user is able to update the Location from Account details screen", function () {
    library.logStep("TC#1: To verify that the user is able to update the Location from Account details screen");
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
    manager.clickFirstLocation().then(function (clickedFirstLocation) {
      expect(clickedFirstLocation).toBe(true);
    });
    manager.selectUNTierAndInstalledProduct(jsonData).then(function (selectedUNTierAndInstalledProduct) {
      expect(selectedUNTierAndInstalledProduct).toBe(true);
    });
    manager.selectConnTierAndInstalledProduct(jsonData).then(function (selectedConnTierAndInstalledProduct) {
      expect(selectedConnTierAndInstalledProduct).toBe(true);
    });
    manager.selectQCTierAndInstalledProduct(jsonData).then(function (selectedQCTierAndInstalledProduct) {
      expect(selectedQCTierAndInstalledProduct).toBe(true);
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
    manager.verifyUNIPFValue(jsonData.UnityNextTier_Option, jsonData.UN_InstalledProductField).then(function (verifiedUNIPFValue) {
      expect(verifiedUNIPFValue).toBe(true);
    });
    manager.verifyConnIPFValue(jsonData.ConnectivityTier_Option2, jsonData.CN_InstalledProductField).then(function (verifiedCNIPFValue) {
      expect(verifiedCNIPFValue).toBe(true);
    });
    manager.verifyQCIPFValue(jsonData.QCLotViewer_Option, jsonData.QC_InstalledProductField).then(function (verifiedQCIPFValue) {
      expect(verifiedQCIPFValue).toBe(true);
    });
    manager.verifyUpdatedDropdownValuesLocation(jsonData).then(function (updatedDDValues) {
      expect(updatedDDValues).toBe(true);
    });
  });

  it("TC#2: To verify that the user is able to update the Location from Location Listing screen", function () {
    library.logStep("TC#2: To verify that the user is able to update the Location from Location Listing screen");
    library.logStep("TC#4: To verify the functionality of Save Data button on Save Data Popup from Update Location Page");
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickLocationTab().then(function (clickedLocationTab) {
      expect(clickedLocationTab).toBe(true);
    });
    manager.clickFirstLabLocationTab().then(function (clickedFirstLabLocationTab) {
      expect(clickedFirstLabLocationTab).toBe(true);
    });
    manager.selectUNTierAndInstalledProduct(jsonData2).then(function (selectedUNTierAndInstalledProduct) {
      expect(selectedUNTierAndInstalledProduct).toBe(true);
    });
    manager.selectConnTierAndInstalledProduct(jsonData2).then(function (selectedConnTierAndInstalledProduct) {
      expect(selectedConnTierAndInstalledProduct).toBe(true);
    });
    manager.selectQCTierAndInstalledProduct(jsonData2).then(function (selectedQCTierAndInstalledProduct) {
      expect(selectedQCTierAndInstalledProduct).toBe(true);
    });
    manager.updateLocationDetails(jsonData2).then(function (updatedLocationDetails) {
      expect(updatedLocationDetails).toBe(true);
    });
    manager.clickCloseUpdateLocation().then(function (clickedCloseUpdateLocation) {
      expect(clickedCloseUpdateLocation).toBe(true);
    });
    manager.verifyExitWithoutSavingPopupDisplayed().then(function (verifiedExitWithoutSavingPopupDisplayed) {
      expect(verifiedExitWithoutSavingPopupDisplayed).toBe(true);
    });
    manager.clickOnSaveAndExitBtn().then(function (clickedOnSaveAndExitBtn) {
      expect(clickedOnSaveAndExitBtn).toBe(true);
    });
    manager.clickFirstLabLocationTab().then(function (clickedFirstLabLocationTab) {
      expect(clickedFirstLabLocationTab).toBe(true);
    });
    manager.verifyUpdatedTextFieldValuesLocation(jsonData2).then(function (updatedTextFieldValues) {
      expect(updatedTextFieldValues).toBe(true);
    });
    manager.verifyUNIPFValue(jsonData2.UnityNextTier_Option, jsonData2.UN_InstalledProductField).then(function (verifiedUNIPFValue) {
      expect(verifiedUNIPFValue).toBe(true);
    });
    manager.verifyConnIPFValue(jsonData2.ConnectivityTier_Option2, jsonData2.CN_InstalledProductField).then(function (verifiedCNIPFValue) {
      expect(verifiedCNIPFValue).toBe(true);
    });
    manager.verifyQCIPFValue(jsonData2.QCLotViewer_Option, jsonData2.QC_InstalledProductField).then(function (verifiedQCIPFValue) {
      expect(verifiedQCIPFValue).toBe(true);
    });
    manager.verifyUpdatedDropdownValuesLocation(jsonData2).then(function (updatedDDValues) {
      expect(updatedDDValues).toBe(true);
    });
  });
});
