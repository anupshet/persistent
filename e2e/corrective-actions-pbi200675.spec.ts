//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor'
import { LoginEvent } from './page-objects/login-e2e.po';
import { LogOut } from './page-objects/logout-e2e.po';
import { MultiSummary } from './page-objects/multi-summary-e2e.po';
import { NewLabSetup } from './page-objects/new-labsetup-e2e.po';
import { PointDataEntry } from './page-objects/point-data-entry-e2e.po';
import { RevisedPointData } from './page-objects/point-form-revision.po';
import { RevisedSummaryData } from './page-objects/summary-form-revision.po';
import { SingleSummary } from './page-objects/single-summary.po';
import { BrowserLibrary } from './utils/browserUtil';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/corrective-actions-pbi200675.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
describe('Test Suite: Corrective Action', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const RevisedPointData1 = new RevisedPointData();
  const summaryRevised = new RevisedSummaryData();
  const multiSummary = new MultiSummary();
  const singleSummary = new SingleSummary();
  const newLabSetup = new NewLabSetup();
  const pointData = new PointDataEntry();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.firstname).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });
  afterEach(function () {
    out.signOut();
  });
  it('Test case : : Implement Corrective Actions for Point Data Entry on POST Call ', function () {
    library.logStep('Test case 1:Implement Corrective Actions for Point Data Entry on POST Call');
    library.logStep('Test case 2:Implement Corrective Actions for Point Data Entry on PUT Call');
    const analyteName1 = jsonData.AnalyteName;
    const deptName = jsonData.Departmentname;
    const instName = jsonData.InstrumentName;
    const cntrlName = jsonData.ControlName;
    newLabSetup.navigateTO(deptName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(instName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(cntrlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(analyteName1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    RevisedPointData1.enterPointValue(10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    RevisedPointData1.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.clickoncorrectiveactiondropdown().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    RevisedPointData1.selectthecorrectiveactions(jsonData.correctionactionname).then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    RevisedPointData1.addCommentOnEditDialog(jsonData.CommentValue).then(function (commentAdded) {
      expect(commentAdded).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    RevisedPointData1.presenceofupdatedActivityicon().then(function (result) {
      expect(result).toBe(true);
    });
    summaryRevised.presenceofDataonActivityIcon(jsonData.CommentValue).then(function (text) {
      expect(text).toBe(true);
    })
    RevisedPointData1.hoverOvercorrectiveactionIcon().then(function (Hovered) {
      expect(Hovered).toBe(true);
    });
    RevisedPointData1.verifypresenceofcorrectiveactiontooltip().then(function (Displayed) {
      expect(Displayed).toBe(true);
    });
    RevisedPointData1.presenceofactiononToolTip(jsonData.Actionname).then(function (Displayed) {
      expect(Displayed).toBe(true);
    });
    RevisedPointData1.clickoncorrectiveactionicon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    RevisedPointData1.presenceofDataonacorrectiveactionicon(jsonData.Actionname).then(function (verified) {
      expect(verified).toBe(true);
    });
    RevisedPointData1.ClickOnEditDialogueButtonOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.clickonchooseaaction().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    RevisedPointData1.selectthecorrectiveactions(jsonData.correctionactionname).then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    RevisedPointData1.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
      expect(submitUpdatesClicked).toBe(true);
    });
    RevisedPointData1.clickoncorrectiveactionicon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    RevisedPointData1.presenceofDataonacorrectiveactionicon(jsonData.Actionname).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test case 2: To verify that the user can submit Point data without selecting the Corrective action ', function () {
    library.logStep('Test case 2:To verify that the user can submit Point data without selecting the Corrective action');
    const analyteName1 = jsonData.AnalyteName;
    const deptName = jsonData.Departmentname;
    const instName = jsonData.InstrumentName;
    const cntrlName = jsonData.ControlName;
    newLabSetup.navigateTO(deptName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(instName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(cntrlName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(analyteName1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    RevisedPointData1.enterPointValue(10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.verifyEnteredPointValuesLvl1(10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
  });
});
