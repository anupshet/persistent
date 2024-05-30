//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { DataTable } from '../page-objects/data-table-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { multipoint } from '../page-objects/pbi-200682Tooltip-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { RevisedSummaryData } from '../page-objects/summary-form-revision.po';
import { RevisedMultiDataForm } from '../page-objects/multidata-revision-196090-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { ConditionalExpr } from '@angular/compiler';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/multi-data-form-196090.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000;
describe('Multi Data form revision', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dataTable = new DataTable();
  const labsetup = new NewLabSetup();
  const newLabSetup = new NewLabSetup();
  const library = new BrowserLibrary();
  const multiEntryInst = new multipoint();
  const pointData = new PointDataEntry();
  const summaryRevised = new RevisedSummaryData();
  const mutlidatarevisionform = new RevisedMultiDataForm();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });
  afterEach(function () {
    out.signOut();
  });
  it('Test Case 1: To Verify the Multi Data Form UI @P1', function () {
    labsetup.navigateTO(jsonData.Connectivitydepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Connectivityinstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    mutlidatarevisionform.presenceofSendToPeerGroupbtnOnMultidata().then(function (Status) {
      expect(Status).toBe(true);
    });
    dataTable.verifyShowLastToggle().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyShowLastToggleStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyShowLastToggleFunctionalityConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.enterData(jsonData.Connectivityanalyte, jsonData.Level1, jsonData.value).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    mutlidatarevisionform.clickonSendtoPeerBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    mutlidatarevisionform.verifyIfLastEntryIsPresentIfToggleIsOn(jsonData.value).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.verifyDateBarPosition().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDateBarIsFixed().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDataEntryLinkPresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDataEntryFormIsAlreadyOpen(jsonData.Pointform).then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(jsonData.Connectivitycontrol).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    mutlidatarevisionform.presenceofSendToPeerGroupbtnOnMultidata().then(function (Status) {
      expect(Status).toBe(true);
    });
    dataTable.verifyShowLastToggle().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyShowLastToggleStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyShowLastToggleFunctionalityConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    mutlidatarevisionform.verifyIfLastEntryIsPresentIfToggleIsOn(jsonData.value).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.verifyDateBarPositionControlLevel().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDateBarIsFixed().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDataEntryLinkPresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDataEntryFormIsAlreadyOpen(jsonData.Pointform).then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.navigateTO(jsonData.Connectivityanalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.ClickOnEditDataOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.verifyConfirmDeleteBtnOnPopUp().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  it('Test case 2: To verify that the ToolTip is displayed correctly for previous data entry on Multidata entry Page @P2 ', function () {
    library.logStep('Test case: To verify that the ToolTip is displayed correctly for  previous data entry on Multidata entry Page');
    newLabSetup.navigateTO(jsonData.Deptfortooltip).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrumentfortooltip).then(function (inst) {
      expect(inst).toBe(true);
    });
    multiEntryInst.hoverOverLastEntryLabel(jsonData.analytefortooltip, jsonData.Level1).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiEntryInst.verifyToolTipDisplayed().then(function (toolTipDisplayed) {
      expect(toolTipDisplayed).toBe(true);
    });
    multiEntryInst.isvalueonTooltipDisplayed(jsonData.levelValue, jsonData.Mean, jsonData.SD, jsonData.CV, jsonData.Zscore).then(function (Valueontooltipdisplayed) {
      expect(Valueontooltipdisplayed).toBe(true);
    });
    multiEntryInst.verifyDatetimeonTootTip(jsonData.datetime, jsonData.time).then(function (Displayed) {
      expect(Displayed).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.controlfortooltip).then(function (control) {
      expect(control).toBe(true);
    });
    multiEntryInst.hoverOverLastEntryLabel(jsonData.analytefortooltip, jsonData.Level1).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiEntryInst.verifyToolTipDisplayed().then(function (toolTipDisplayed) {
      expect(toolTipDisplayed).toBe(true);
    });
    multiEntryInst.isvalueonTooltipDisplayed(jsonData.levelValue, jsonData.Mean, jsonData.SD, jsonData.CV, jsonData.Zscore).then(function (Valueontooltipdisplayed) {
      expect(Valueontooltipdisplayed).toBe(true);
    });
    multiEntryInst.verifyDatetimeonTootTip(jsonData.datetime, jsonData.time).then(function (Displayed) {
      expect(Displayed).toBe(true);
    });
  });
  it('Test case 3:To verify the presence of show option arrow on multidata entry page @P2', function () {
    library.logStep('Test case:To verify the presence of show option arrow on multidata Page');
    labsetup.navigateTO(jsonData.Connectivitydepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Connectivityinstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    summaryRevised.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
    });
    mutlidatarevisionform.verifythepresenceoflevelHeader().then(function (result) {
      expect(result).toBe(true);
    });
    labsetup.navigateTO(jsonData.Connectivitycontrol).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    mutlidatarevisionform.verifythepresenceoflevelHeader().then(function (result) {
      expect(result).toBe(true);
    });
    summaryRevised.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it('Test case 4:Verify if lastdataentry is displayed as red and yellow shaded in multidata form when rules are applied  @P2', function () {
    library.logStep('Test Case:Verify last entry is red and yellow shaded if rules are applied.');
    newLabSetup.navigateTO(jsonData.Deptfortooltip).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrumentfortooltip).then(function (inst) {
      expect(inst).toBe(true);
    });
    mutlidatarevisionform.verifyLastEntryIsRedandYellowShadedIfrulesapplied(jsonData.analytefortooltip, jsonData.Level1, jsonData.Level2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.controlfortooltip).then(function (control) {
      expect(control).toBe(true);
    });
    mutlidatarevisionform.verifyLastEntryIsRedandYellowShadedIfrulesapplied(jsonData.analytefortooltip, jsonData.Level1, jsonData.Level2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
});
