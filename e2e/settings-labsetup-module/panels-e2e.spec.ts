/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { MultiPoint } from '../page-objects/multi-point.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { Panels } from '../page-objects/panels-e2e.po';
import { ArchivingLots } from '../page-objects/archiving-lots-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

const fs = require('fs');
let jsonData;


const library=new BrowserLibrary();
library.parseJson('./JSON_data/Panels.json').then(function(data) {
  jsonData = data;
})

describe('Test Suite: Panels', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const setting = new Settings();
  const library = new BrowserLibrary();
  const newSetting = new InheritedSettings();
  const newLabSetup = new NewLabSetup();
  const multiPoint = new MultiPoint();
  const pointData = new PointDataEntry();
  const navigation = new NewNavigation();
  const panel = new Panels();
  const panels = new Panels();
  const archive = new ArchivingLots();
  const dashboard = new Dashboard();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 19: To verify that the Data can added/edited/deleted for an analyte using the Panel', function () {
    library.logStep('Test case 19: To verify that the Data can added/edited/deleted for an analyte using the Panel');
    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.clickHideData().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
    });
    pointData.enterPointValues('1.10', '2.10').then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.verifyEnteredPointValues('1.10', '2.10').then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    pointData.clickEnteredValuesRow().then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    pointData.isEditDialogDisplayed().then(function (editDialogDisplayed) {
      expect(editDialogDisplayed).toBe(true);
    });
    pointData.enterPointValuesEditDialog('3.10', '3.50').then(function (valuesEnteredInEditDialogBox) {
      expect(valuesEnteredInEditDialogBox).toBe(true);
    });
    pointData.clickSubmitUpdatesButton().then(function (submitUpdatesButtonClicked) {
      expect(submitUpdatesButtonClicked).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.verifyEnteredPointValues('3.10', '3.50').then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.verifyConfirmDeletePopup().then(function (verifyConfirmDeletePopup) {
      expect(verifyConfirmDeletePopup).toBe(true);
    });
    pointData.clickConfirmDeleteButton().then(function (confirmDeleteButtonClicked) {
      expect(confirmDeleteButtonClicked).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte1).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.enteredDataRowExists().then(function (dataExists) {
      expect(dataExists).toBe(false);
    });
  });

  it('Test case 31: To verify that the Archived analyte is not displayed on Create Panel screen', function () {
    library.logStep('Test case 31: To verify that the Archived analyte is not displayed on Create Panel screen');
    library.logStep('Test case 32: To verify that the Archived analyte cannot be added to a Panel');
    library.logStep('Test case 33: To verify that the user should be able to remove Analyte which is present in the Panel and which is in archived state.');
    panels.clickOnAddPanel().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.enterPanelName('TestPanel1').then(function (entered) {
      expect(entered).toBe(true);
    });
    archive.clickArchiveItemToggle().then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.selectItems(jsonData.Department, 'true', jsonData.Department).then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.selectItems(jsonData.Instrument, 'true', jsonData.Instrument).then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.selectItems(jsonData.Control, 'true', jsonData.Control).then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.verifyArchivedAnalyteDisplayed(jsonData.ArchivedAnalyte).then(function (entered) {
      expect(entered).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.clickEditThisPanelLink().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panels.clickRemoveIcon(jsonData.ArchivedAnalyte).then(function (entered) {
      expect(entered).toBe(true);
    });
    panels.clickCancelButton().then(function (entered) {
      expect(entered).toBe(true);
    });
  });

  it('Test case 9: Verify that an Analyte can be removed from the Panel items using the X button', function () {
    library.logStep('Test case 9: Verify that an Analyte can be removed from the Panel items using the X button.');
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameOne).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.DepartmentName1, 'false', 'true').then(function (select) {
      expect(select).toBe(true);
    });
    panel.clickRemoveIcon(jsonData.Analyte1).then(function (removeItem) {
      expect(removeItem).toBe(true);
    });
    panel.verifyItemsRemovedFromPanelItem(jsonData.Analyte1).then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.clickCancelButton().then(function (cancelBtn) {
      expect(cancelBtn).toBe(true);
    });
  });

  it('Test case 10: Verify that user is not able to create a Panel with no analytes.', function () {
    library.logStep('Test case 10: Verify that user is not able to create a Panel with no analytes..');
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameOne).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.DepartmentName1, 'false', 'true').then(function (select) {
      expect(select).toBe(true);
    });
    panel.clickRemoveIcon(jsonData.Analyte1).then(function (removeItem) {
      expect(removeItem).toBe(true);
    });
    panel.clickRemoveIcon(jsonData.Analyte2).then(function (removeItem) {
      expect(removeItem).toBe(true);
    });
    panel.verifySaveButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    // panel.clickSaveButton().then(function (clicked) {
    //   expect(clicked).toBe(true);
    // });
    // panel.verifyErrorMessageDisplayed(jsonData.ErrorMessage).then(function (removeItem) {
    //   expect(removeItem).toBe(true);
    // });
  });

  it('Test case 11: Verify that user is able to create a Panel.', function () {
    library.logStep('Test case 11: Verify that user is able to create a Panel.');
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameOne).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.DepartmentName1, 'false', 'true').then(function (select) {
      expect(select).toBe(true);
    });
    panel.clickSaveButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    panel.verifyPanelCreated(jsonData.PanelNameOne).then(function (removeItem) {
      expect(removeItem).toBe(false);
    });
  });

  it('Test case 12: Verify the functionality of Cancel button on Add Panel UI.', function () {
    library.logStep('Test case 12: Verify the functionality of Cancel button on Add Panel UI.');
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameTwo).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.DepartmentName1, 'false', 'true').then(function (select) {
      expect(select).toBe(true);
    });
    panel.clickCancelButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    panel.verifyPanelCreated(jsonData.PanelNameTwo).then(function (removeItem) {
      expect(removeItem).toBe(false);
    });
  });

  it('Test case 13: Verify the functionality of the Exit Without Saving button.', function () {
    library.logStep('Test case 13: Verify the functionality of the Exit Without Saving button.');
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameTwo).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.DepartmentName1, 'false', 'true').then(function (select) {
      expect(select).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentName2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    multiPoint.verifyModalComponent().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiPoint.clickDontSaveBtn().then(function (withoutSaving) {
      expect(withoutSaving).toBe(true);
    });
    panel.verifyPanelCreated(jsonData.PanelName).then(function (withoutSaving) {
      expect(withoutSaving).toBe(false);
    });
  });


  it('Test case 14: Verify the functionality of the Save and Exit button.', function () {
    library.logStep('Test case 14: Verify the functionality of the Save and Exit button.');
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameTwo).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.DepartmentName1, 'false', 'true').then(function (select) {
      expect(select).toBe(true);
    });
    setting.navigateTO(jsonData.DepartmentName2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    multiPoint.verifyModalComponent().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiPoint.clickSaveAndLeaveBtn().then(function (save) {
      expect(save).toBe(true);
    });
    panel.verifyPanelCreated(jsonData.PanelNameTwo).then(function (withoutSaving) {
      expect(withoutSaving).toBe(true);
    });
  });


  it('Test case 15: Verify that a Panel with the name same as an Existing Panel is not created.', function () {
    library.logStep('Test case 15: Verify that a Panel with the name same as an Existing Panel is not created.');
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameOne).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.DepartmentName1, 'false', 'true').then(function (select) {
      expect(select).toBe(true);
    });
    panel.verifyErrorMessageDisplayed(jsonData.ErrorMessage).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    panel.verifySaveButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

  it('Test case 18: To verify that the Analyte info can be seen for the Analyte in the Panel.', function () {
    library.logStep('Test case 18: To verify that the Analyte info can be seen for the Analyte in the Panel.');
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelName).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.DepartmentName, false, jsonData.AnalyteName1).then(function (select) {
      expect(select).toBe(true);
    });
    panel.verifyInfoIconInSelectedItemList(jsonData.AnalyteName).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 28: Verify the functionality of the Exit Without Saving button on edit panel page.', function () {
    library.logStep('Test case 28: Verify the functionality of the Exit Without Saving button on edit panel page.');
    newLabSetup.navigateTO(jsonData.PanelNameOne).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panel.clickEditThisPanelLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameEdit).then(function (entered) {
      expect(entered).toBe(true);
    });
    navigation.clickBackArrow().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    multiPoint.verifyModalComponent().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiPoint.clickDontSaveBtn().then(function (withoutSaving) {
      expect(withoutSaving).toBe(true);
    });
    panel.verifyPanelCreated(jsonData.PanelName).then(function (withoutSaving) {
      expect(withoutSaving).toBe(false);
    });
  });

  it('Test case 29: Verify the functionality of the Save and Exit button on edit panel page.', function () {
    library.logStep('Test case 29: Verify the functionality of the Save and Exit button on edit panel page.');
    newLabSetup.navigateTO(jsonData.PanelNameOne).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panel.clickEditThisPanelLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameEdit).then(function (entered) {
      expect(entered).toBe(true);
    });
    navigation.clickBackArrow().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    multiPoint.verifyModalComponent().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiPoint.clickSaveAndLeaveBtn().then(function (Saving) {
      expect(Saving).toBe(true);
    });
    panel.verifyPanelCreated(jsonData.PanelNameEdit).then(function (created) {
      expect(created).toBe(true);
    });
  });

  it('Test case 27:Verify the functionality of Cancel button on Edit Panel UI.', function () {
    library.logStep('Test case 27: Verify the functionality of Cancel button on Edit Panel UI.');
    newLabSetup.navigateTO(jsonData.PanelNameTwo).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panel.clickEditThisPanelLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameEdit2).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.clickCancelButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    navigation.clickBackArrow().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    panel.verifyPanelCreated(jsonData.PanelNameEdit2).then(function (removeItem) {
      expect(removeItem).toBe(false);
    });
  });

  it('Test case 37: To verify that the panels can be added for labs without department.', function () {
    library.logStep('Test case 37:To verify that the panels can be added for labs without department.');
    out.signOut();
    // tslint:disable-next-line: max-line-length
    loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameWithoutDept, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    panel.clickOnAddPanel().then(function (clickAddPanel) {
      expect(clickAddPanel).toBe(true);
    });
    panel.enterPanelName(jsonData.PanelNameWithoutDept).then(function (entered) {
      expect(entered).toBe(true);
    });
    panel.selectItems(jsonData.InstrumentName, false, jsonData.AnalyteName1).then(function (select) {
      expect(select).toBe(true);
    });
    panel.clickSaveButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    panel.verifyPanelCreated(jsonData.PanelNameWithoutDept).then(function (removeItem) {
      expect(removeItem).toBe(false);
    });
  });

  // Need 1 Panel to be created already
  it('Test case 20: To verify that the User can Navigate to Analyte Settings page using the Panel', function () {
    library.logStep('Test case 20: To verify that the User can Navigate to Analyte Settings page using the Panel');
    newLabSetup.navigateTO(jsonData.PanelName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PanelAnalyte1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });
    setting.isEditAnalytePageDisplayed(jsonData.PanelAnalyte1).then(function (editPageDisplayed) {
      expect(editPageDisplayed).toBe(true);
    });
  });

  // Need 1 Panel to be created already
  it('Test case 21: To verify Edit Panel UI', function () {
    library.logStep('Test case 21: To verify Edit Panel UI');
    newLabSetup.navigateTO(jsonData.PanelName).then(function (dept) {
      expect(dept).toBe(true);
    });
    panels.clickEditThisPanelLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    panels.verifyEditPanelPageUI().then(function (editPageUIVerified) {
      expect(editPageUIVerified).toBe(true);
    });
  });

  it('Test case 23: To verify that the user should be able to remove selected Analyte from Edit Panel page', function () {
    library.logStep('Test case 22: To verify that the user should be able to change the sorting of the Analytes from Edit Panel page');
    library.logStep('Test case 23: To verify that the user should be able to remove selected Analyte from Edit Panel page');
    library.logStep('Test case 25: To verify that the user should be able to add new Analytes to the Panel from Edit Panel page');
    library.logStep('Test case 26: To verify that the user is able to update the Panel using Save Button on Edit Panel Page');
    newLabSetup.navigateTO(jsonData.PanelName1).then(function (dept) {
      expect(dept).toBe(true);
    });
    panels.clickEditThisPanelLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    panels.rearrangePanelItems(1, 2).then(function (resorting) {
      expect(resorting).toBe(true);
    });
    panels.verifyItemsRearranged(jsonData.PanelAnalyte1, 2).then(function (resorted) {
      expect(resorted).toBe(true);
    });
    panels.clickRemoveIcon(jsonData.PanelAnalyte1).then(function (removeIconClicked) {
      expect(removeIconClicked).toBe(true);
    });
    panels.selectItems(jsonData.PanelInst, 'true', 'true').then(function (selectedItem) {
      expect(selectedItem).toBe(true);
    });
    panels.VerifyItemSelected(jsonData.PanelAnalyte2).then(function (selectedItem) {
      expect(selectedItem).toBe(true);
    });
    panels.clickSaveButton().then(function (saveClicked) {
      expect(saveClicked).toBe(true);
    });
  });

  it('Test case 24: To verify that the user should not be able to save the Empty Panel from Edit Panel page', function () {
    library.logStep('Test case 24: To verify that the user should not be able to save the Empty Panel from Edit Panel page');
    newLabSetup.navigateTO(jsonData.PanelName).then(function (dept) {
      expect(dept).toBe(true);
    });
    panels.clickEditThisPanelLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    panels.clickRemoveIcon(jsonData.PanelAnalyte1).then(function (removeIconClicked) {
      expect(removeIconClicked).toBe(true);
    });
    panels.verifyNoItemsSelectedDisplayed().then(function (noItems) {
      expect(noItems).toBe(true);
    });
    panels.verifySaveDisabled().then(function (saveDisabled) {
      expect(saveDisabled).toBe(true);
    });
  });

  // Need 1 Panel to be created already
  it('Test case 36: To verify that the Lab User can access the existing Panel, but cannot create a new Panel and Edit or Delete the existing Panel', function () {
    library.logStep('Test case 36: To verify that the Lab User can access the existing Panel, but cannot create a new Panel and Edit or Delete the existing Panel');
    out.signOut().then(function (loggedOut) {
      expect(loggedOut).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameUser,
      jsonData.PasswordUser, jsonData.FirstNameUser).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    panels.verifyAddPanelsInLeftNavigation().then(function (linkdisplayed) {
      expect(linkdisplayed).toBe(false);
    });
    newLabSetup.navigateTO(jsonData.PanelName).then(function (dept) {
      expect(dept).toBe(true);
    });
    panels.verifyEditPanelLinkDisplayed().then(function (editDisplayed) {
      expect(editDisplayed).toBe(false);
    });
  });

  // Need 1 Panel to be created already
  it('Test case 30: User should be able to Delete the Panel from Edit Panel Page', function () {
    library.logStep('Test case 30: User should be able to Delete the Panel from Edit Panel Page');
    newLabSetup.navigateTO(jsonData.PanelName).then(function (dept) {
      expect(dept).toBe(true);
    });
    panels.clickEditThisPanelLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    panels.clickDeleteButton().then(function (deleteClicked) {
      expect(deleteClicked).toBe(true);
    });
    panels.clickConfirmDeleteButton().then(function (confirmDeleteClicked) {
      expect(confirmDeleteClicked).toBe(true);
    });
    dashboard.clickUnityNext().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    panels.verifyPanelCreated(jsonData.PanelName).then(function (deleted) {
      expect(deleted).toBe(false);
    });
  });
});


