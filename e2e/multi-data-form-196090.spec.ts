//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from './page-objects/login-e2e.po';
import { LogOut } from './page-objects/logout-e2e.po';
import { DataTable } from './page-objects/data-table-e2e.po';
import { NewLabSetup } from './page-objects/new-labsetup-e2e.po';
import { multipoint } from './page-objects/pbi-200682Tooltip-e2e.po';
import { BrowserLibrary } from './utils/browserUtil';
import { RevisedSummaryData } from './page-objects/summary-form-revision.po';
import { RevisedMultiDataForm } from './page-objects/multidata-revision-196090-e2e.po';
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
  it('Test Case 1:  To Verify the Multi Data Form UI for Non Connectivity User on Instrument Level.', function () {
    library.logStep('Test case: To verify the presence of send to peer group button');
    out.signOut();
    loginEvent.loginToApplication(jsonData.URL, jsonData.nonConnectivityUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    const depName = jsonData.deptName;
    const instName = jsonData.instrument;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    mutlidatarevisionform.presenceofSendToPeerGroupbtnOnMultidata().then(function (Status) {
      expect(Status).toBe(true);
    });
    dataTable.verifyShowLastToggle().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyShowLastToggleStatus().then(function (verified) {
      expect(verified).toBe(false);
    });
    dataTable.verifyShowLastToggleFunctionalityNonConnectivity().then(function (verified) {
      expect(verified).toBe(true);
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
    dataTable.verifyDataEntryFormIsAlreadyOpen().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test Case 2: To Verify the Multi Data Form UI for Non Connectivity User on Control Level.', function () {
    out.signOut();
    loginEvent.loginToApplication(jsonData.URL, jsonData.nonConnectivityUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    const depName = jsonData.deptName;
    const instName = jsonData.instrument;
    const control = jsonData.control;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    mutlidatarevisionform.presenceofSendToPeerGroupbtnOnMultidata().then(function (Status) {
      expect(Status).toBe(true);
    });
    dataTable.verifyShowLastToggle().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyShowLastToggleStatus().then(function (verified) {
      expect(verified).toBe(false);
    });
    dataTable.verifyShowLastToggleFunctionalityNonConnectivity().then(function (verified) {
      expect(verified).toBe(true);
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
    dataTable.verifyDataEntryFormIsAlreadyOpen().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test Case 3: To Verify the Multi Data Form UI for Connectivity User on Instrument Level.', function () {
    const depName = jsonData.deptName1;
    const instName = jsonData.instrument1;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
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
    dataTable.verifyDateBarPosition().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDateBarIsFixed().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDataEntryLinkPresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDataEntryFormIsAlreadyOpen().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test Case 4: To Verify the Multi Data Form UI for Connectivity User on Control Level.', function () {
    const depName = jsonData.deptName1;
    const instName = jsonData.instrument1;
    const control = jsonData.control1;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(control).then(function (navigated) {
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
    dataTable.verifyDateBarPositionControlLevel().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDateBarIsFixed().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDataEntryLinkPresent().then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyDataEntryFormIsAlreadyOpen().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test case 5: To verify that the ToolTip is displayed correctly for Valid previous data entry on Instrument Page', function () {
    library.logStep('Test case: To verify that the ToolTip is displayed correctly for Valid previous data entry on Instrument Page');
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
  });
  it('Test case 6: To verify that the ToolTip is displayed correctly for Valid previous data entry on control Page', function () {
    library.logStep('Test case: To verify that the ToolTip is displayed correctly for Valid previous data entry on Control Page');
    newLabSetup.navigateTO(jsonData.Deptfortooltip).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrumentfortooltip).then(function (inst) {
      expect(inst).toBe(true);
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
  it('Test case 7: To verify the presence of show option arrow on Instrument Page', function () {
    library.logStep('Test case:  To verify the presence of show option arrow on Instrument Page');
    newLabSetup.navigateTO(jsonData.deptName1).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.instrument1).then(function (inst) {
      expect(inst).toBe(true);
    });
    summaryRevised.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
    });
    mutlidatarevisionform.verifyShowOptionFormAreaisClosedByDefault().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it('Test case 8: To verify the presence of show option arrow on Control Page', function () {
    library.logStep('Test case:  To verify the presence of show option arrow on Control Page');
    newLabSetup.navigateTO(jsonData.deptName1).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.instrument1).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.control1).then(function (control) {
      expect(control).toBe(true);
    });
    summaryRevised.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
    });
    mutlidatarevisionform.verifyShowOptionFormAreaisClosedByDefault().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it('Test case 9:Verify if lastdataentry is Displayed in greyshaded and if rules are applied at instrument level ', function () {
    library.logStep('Test case:To verify the presence of level header on instrument Page');
    library.logStep('Test Case:Verify last entry is red and yellow shaded if rules are applied.');
    newLabSetup.navigateTO(jsonData.Deptfortooltip).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrumentfortooltip).then(function (inst) {
      expect(inst).toBe(true);
    });
    mutlidatarevisionform.verifythepresenceoflevelHeader().then(function (result) {
      expect(result).toBe(true);
    });
    mutlidatarevisionform.verifyLastEntryIsGreyShaded(jsonData.analyteforgreyshaded, jsonData.Level1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    mutlidatarevisionform.verifyLastEntryIsRedandYellowShadedIfrulesapplied(jsonData.analytefortooltip, jsonData.Level1, jsonData.Level2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    mutlidatarevisionform.verifyIfLastEntryIsPresentIfToggleIsOn().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
  it('Test case 10:Verify if lastdataentry is Displayed in greyshaded and if rules are applied at control level ', function () {
    library.logStep('Test case:  To verify the presence of level header on control Page');
    library.logStep('Test Case:Verify last entry is red and yellow shaded if rules are applied.');
    newLabSetup.navigateTO(jsonData.Deptfortooltip).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrumentfortooltip).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.controlfortooltip).then(function (control) {
      expect(control).toBe(true);
    });
    mutlidatarevisionform.verifythepresenceoflevelHeader().then(function (result) {
      expect(result).toBe(true);
    });
    mutlidatarevisionform.verifyLastEntryIsGreyShaded(jsonData.analyteforgreyshaded, jsonData.Level1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    mutlidatarevisionform.verifyLastEntryIsRedandYellowShadedIfrulesapplied(jsonData.analytefortooltip, jsonData.Level1, jsonData.Level2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    mutlidatarevisionform.verifyIfLastEntryIsPresentIfToggleIsOn().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
});
