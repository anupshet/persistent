/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/Point-Data-Entry.json').then(function (data) {
  jsonData = data;
});
describe('Point Data Entry form ', function () {
  browser.waitForAngularEnabled(false);
  const newLabSetup = new NewLabSetup();
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const pointData = new PointDataEntry();
  const library = new BrowserLibrary();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.firstname).then(function (loggedIn) {
      console.log(jsonData.URL);
      expect(loggedIn).toBe(true);
    });
  });
  afterEach(function () {
    out.signOut();
  });
  it('Test case 1: Selecting Analyte (Test) displays Revised Point Data Entry Page @P2', function () {
    library.logStep('Test case 1: Selecting Analyte (Test) displays Point Data Entry Page');
    library.logStep('Test case 2: Point Data Entry Page will show Analyte Entry component with Submit and Cancel buttons');
    library.logStep('Test case 3: Summary Statistics Chart will show on Point Data Entry Page');
    library.logStep('Test Case 4:Verify the presence of Manual Enter Data link.');
    library.logStep('Test case 5: Verify the presence of sendToPeerGroupbtn.');
    library.logStep('Test case 6: Verify if the cursor is placed at first value.');
    library.logStep('Test Case 7:Verify the presence of label for levels');
    library.logStep('Test case 8: Verify if jenning chart is placed at Leftposition');
    newLabSetup.navigateTO(jsonData.Departmentname).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.verifyTopPageHeaderTestView(jsonData.PointAnalyte).then(function (headerVerified) {
      expect(headerVerified).toBe(true);
    });
    pointData.verifySummaryStatisticsTableIsEmpty().then(function (summaryStatisticsTableEmpty) {
      expect(summaryStatisticsTableEmpty).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.presenceOfLevelHeader().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.verifyPointValueEntry().then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    pointData.VerifyfocusonFirstElement().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.verifychartsPositionSwapped(jsonData.ChartPosition).then(function (result) {
      expect(result).toBe(true);
    });
    pointData.presenceofSendToPeerGroupbtnOnPointForm().then(function (Status) {
      expect(Status).toBe(true);
    });
    pointData.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    pointData.verifyCancelButton().then(function (cancelDisplayed) {
      expect(cancelDisplayed).toBe(true);
    });
  });
  it('Test case 2: Point Data Entry Page shows most recently entered line at the top @P1', function () {
    library.logStep('Test case 1: Point Data Entry Page shows most recently entered line at the top');
    library.logStep('Test case 2: Verify the presence of show option arrow');
    library.logStep('Test case 4: verify the presence of updated Restart icon');
    library.logStep('Test case 3: Verify the click on restartfloaticon ');
    library.logStep('Test case 5: Delete button will be provided to allow for deletion of saved data');
    library.logStep('Test case 6: Able to add a comment in the view edit dialogue');
    newLabSetup.navigateTO(jsonData.Departmentname).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.clickonToggleArrow().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.enterPointValue(jsonData.lev1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.addCommentOnEditDialog(jsonData.CommentValue).then(function (commentAdded) {
      expect(commentAdded).toBe(true);
    });
    pointData.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.scrollToCommentBox().then(function (scrolled) {
      expect(scrolled).toBe(true);
    });
    pointData.isCommentIconPresent().then(function (present) {
      expect(present).toBe(true);
    });
    pointData.checkCommentCount('1').then(function (countMaches) {
      expect(countMaches).toBe(true);
    });
    pointData.presenceofupdatedActivityicon().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.presenceofDataonActivityIcon(jsonData.CommentValue).then(function (text) {
      expect(text).toBe(true);
    })
    pointData.verifyEnteredPointValuesLvl1(jsonData.lev1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.ClickOnEditDataOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.isEditDialogDisplayed().then(function (editDialogDisplayed) {
      expect(editDialogDisplayed).toBe(true);
    });
    pointData.clickonrestartFloatIcon().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
      expect(submitUpdatesClicked).toBe(true);
    });
    pointData.verifypresenceofupdatedRestartIcon().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.ClickOnEditDataOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.verifyConfirmDeletePopup().then(function (verifyConfirmDeletePopup) {
      expect(verifyConfirmDeletePopup).toBe(true);
    });
    pointData.verifyConfirmDeleteBtnOnPopUp().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.enteredDataRowExists().then(function (dataExists) {
      expect(dataExists).toBe(false);
    });
  });
  it('Test case 3: Clicking on the Cancel hyperlink in the pop up confirmation box, after clicking on the trash icon will close the pop up confirmation @P2', function () {
    library.logStep('Test case 1: Clicking on the Cancel hyperlink in the pop up confirmation box, after clicking on the trash icon will close the pop up confirmation');
    library.logStep('Test case 2: Clicking on CANCEL Button should close the Edit pop up box.');
    library.logStep('Test case 3: Upon Click on saved record View Edit Dialog will Open');
    library.logStep('Test case 4: Tool Tips: Hyperlinked date on row: View and edit data');
    library.logStep('Test case 5: Tool Tips: Hyperlinked Trash Icon: Delete this data set');
    library.logStep('Test case 6: Tool Tips: Submit data: Your results will be submitted to your peers');
    newLabSetup.navigateTO(jsonData.Departmentname).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.enterPointValue(jsonData.lev1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.verifySubmitButtonTooltip().then(function (submitToolTip) {
      expect(submitToolTip).toBe(true);
    });
    pointData.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.verifyEnteredPointValuesLvl1(jsonData.lev1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.verifyEditButtonTooltip().then(function (editToolTip) {
      expect(editToolTip).toBe(true);
    });
    pointData.ClickOnEditDataOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.verifyDeleteButtonTooltip().then(function (deleteToolTip) {
      expect(deleteToolTip).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.clickDeleteConfirmationPopupCancelButton().then(function (deleteConfirmationPopupCancelButtonClicked) {
      expect(deleteConfirmationPopupCancelButtonClicked).toBe(true);
    });
    pointData.clickEditDialogCancelButton().then(function (editDialogCancelButtonClicked) {
      expect(editDialogCancelButtonClicked).toBe(true);
    });
    pointData.ClickOnEditDataOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.verifyConfirmDeleteBtnOnPopUp().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test case 4 : Verify the presence of Insert a different date link @P1', function () {
    library.logStep('Test case 1:Presence of Insert a different date link');
    library.logStep('Test Case 2:Presence of Icon for Insert a different date link');
    library.logStep('Test case 3:verify DateTimePicker on clicking on the Different date link');
    library.logStep('Test case 4:To Verify Date and Month on saved Data after clicking on Insert a different date link.');
    newLabSetup.navigateTO(jsonData.Departmentname).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.verifythepresenceofinsertdateIcon().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.verifythepresenceofInsertadifferentDate().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.insertdifferentlinkvisibleonclickingCancelBtn().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.verifythepresenceofInsertadifferentDate().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.verifyDateTimePicker().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.insertDateThroughCalender(jsonData.year, jsonData.month, jsonData.date).then(function (inserted) {
      expect(inserted).toBe(true);
    });
    pointData.enterPointValue(jsonData.lev2Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickonToggleArrow().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.verifyPastResultInserted(jsonData.monthdate, jsonData.lev2Value).then(function (pastResultValuesVerified) {
      expect(pastResultValuesVerified).toBe(true);
    });
    pointData.ClickOnEditDataOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.verifyConfirmDeleteBtnOnPopUp().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test case 5: Clicking on Cancel Button after putting the past results will clear all the values @P1', function () {
    library.logStep('Test case 1: Clicking on Cancel Button after putting the past results will clear all the values');
    newLabSetup.navigateTO(jsonData.Departmentname).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.verifythepresenceofInsertadifferentDate().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.verifyDateTimePicker().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.insertDateThroughCalender(jsonData.year, jsonData.month, jsonData.date).then(function (inserted) {
      expect(inserted).toBe(true);
    });
    pointData.enterPointValue(jsonData.lev1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickCancelButton().then(function (cancelButtonClicked) {
      expect(cancelButtonClicked).toBe(true);
    });
    pointData.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    pointData.verifyValuesCleared().then(function (valuesCleared) {
      expect(valuesCleared).toBe(true);
    });
  });
  it('Test case 6: Updating the values and clicking on SUBMIT DATA button should close the edit pop up box @P1 ', function () {
    library.logStep('Test case 1: Updating the values and clicking on SUBMIT DATA button should close the edit pop up box.');
    newLabSetup.navigateTO(jsonData.Departmentname).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.enterPointValues(jsonData.lev1Value, jsonData.lev2Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.verifyEnteredPointValues(jsonData.lev1Value, jsonData.lev2Value).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    pointData.clickEnteredValuesRow().then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    pointData.enterPointValuesEditDialog(3, 4).then(function (valuesEnteredInEditDialogBox) {
      expect(valuesEnteredInEditDialogBox).toBe(true);
    });
    pointData.clickSubmitUpdatesButton().then(function (submitUpdatesButtonClicked) {
      expect(submitUpdatesButtonClicked).toBe(true);
    });
    pointData.verifyEnteredPointValues(3, 4).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    pointData.clickEnteredValuesRow().then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.verifyConfirmDeleteBtnOnPopUp().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test case 7 : Implement Corrective Actions for Point Data Entry on POST Call @P1 ', function () {
    library.logStep('Test case 1:Implement Corrective Actions for Point Data Entry on POST Call');
    library.logStep('Test case 2:Implement Corrective Actions for Point Data Entry on PUT Call');
    newLabSetup.navigateTO(jsonData.Departmentname).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.enterPointValue(jsonData.lev1Value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    pointData.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickoncorrectiveactiondropdown().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    pointData.selectthecorrectiveactions(jsonData.correctionactionname).then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    pointData.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.hoverOvercorrectiveactionIcon().then(function (Hovered) {
      expect(Hovered).toBe(true);
    });
    pointData.presenceofactiononToolTip(jsonData.Actionname).then(function (Displayed) {
      expect(Displayed).toBe(true);
    });
    pointData.clickoncorrectiveactionicon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.presenceofDataonacorrectiveactionicon(jsonData.Actionname).then(function (verified) {
      expect(verified).toBe(true);
    });
    pointData.ClickOnEditDataOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickonchooseaaction().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    pointData.selectthecorrectiveactions(jsonData.correctionactionname).then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    pointData.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
      expect(submitUpdatesClicked).toBe(true);
    });
    pointData.clickoncorrectiveactionicon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.presenceofDataonacorrectiveactionicon(jsonData.Actionname).then(function (verified) {
      expect(verified).toBe(true);
    });
    pointData.ClickOnEditDataOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.verifyConfirmDeleteBtnOnPopUp().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
})
