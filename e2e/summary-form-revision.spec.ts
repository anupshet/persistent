//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { LoginEvent } from './page-objects/login-e2e.po';
import { LogOut } from './page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from './utils/browserUtil';
import { NewLabSetup } from './page-objects/new-labsetup-e2e.po';
import { RevisedSummaryData } from './page-objects/summary-form-revision.po';
import { MultiSummary } from './page-objects/multi-summary-e2e.po';
import { SingleSummary } from './page-objects/single-summary.po';
import { PointDataEntry } from './page-objects/point-data-entry-e2e.po';
import { RevisedPointData } from './page-objects/point-form-revision.po';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/dataentryrevision.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
describe('Test Suite: RevisedSummaryForm', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const labsetup = new NewLabSetup();
  const summaryRevised = new RevisedSummaryData();
  const RevisedPointData1 = new RevisedPointData();
  const multiSummary = new MultiSummary();
  const singleSummary = new SingleSummary();
  const pointData = new PointDataEntry();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.firstname).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });
  afterEach(function () {
    out.signOut();
  });
  it("Test case:verify the Revised Summary Form @P2 ", function () {
    library.logStep('Test Case 1:Verify the presence of Manual Enter Data link.');
    library.logStep('Test case 2: Verify the presence of sendToPeerGroupbtn.');
    library.logStep('Test case 3: Verify if the cursor is placed at first value.');
    library.logStep('Test Case 4:Verify the presence of label for levels');
    library.logStep('Test case 5:Verify if the DataEntry Table is present at the top above header');
    labsetup.navigateTO(jsonData.Departmentname).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    summaryRevised.presenceofManuallyEnterDataLink().then(function (result) {
      expect(result).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    summaryRevised.presenceOfLevelHeader().then(function (result) {
      expect(result).toBe(true);
    });
    summaryRevised.VerifyfocusonFirstElement().then(function (result) {
      expect(result).toBe(true);
    });
    summaryRevised.presenceofsendToPeerGroupBtn().then(function (Status) {
      expect(Status).toBe(true);
    });
  });
  it('Test case :Presence of updated Activity icon and user is able to click on Show option Arrow @P1 ', function () {
    library.logStep('Test case 1: Lab User is able to add data using Summary Data Entry Page');
    library.logStep('Test Case 2: User is able to click on Show option arrow')
    library.logStep('Test case 3: Able to add a comment in the view edit dialogue.');
    library.logStep('Test case 4: All Levels should display corresponding MEAN, SD and POINTS values.');
    library.logStep('Test Case 5: Presence of updated activity icon ');
    library.logStep('Test case 6: Verify if the DataEntry Table is present at the top above header');
    labsetup.navigateTO(jsonData.Departmentname).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    summaryRevised.enterMeanSdPoints(jsonData.levelno, jsonData.mean, jsonData.SD, jsonData.Points).then(function (result) {
      expect(result).toBe(true);
    });
    summaryRevised.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickShowOptionNew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    summaryRevised.clickonToggleArrow().then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    summaryRevised.VerifyDataEntryformonTop().then(function (result) {
      expect(result).toBe(true);
    });
    summaryRevised.clickonToggleArrow().then(function (result) {
      expect(result).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTest(jsonData.mean, jsonData.SD, jsonData.Points).then(function (stored) {
      expect(stored).toBe(true);
    });
    summaryRevised.presenceofupdatedIcon().then(function (result) {
      expect(result).toBe(true);
    });
    summaryRevised.ClickonDoneBtn().then(function (result) {
      expect(result).toBe(true);
    });
    singleSummary.ClickOnEditDialogueButtonOnTestLevel().then(function (cancle) {
      expect(cancle).toBe(true);
    });
    pointData.addCommentOnEditDialog(jsonData.CommentValue).then(function (commentAdded) {
      expect(commentAdded).toBe(true);
    });
    singleSummary.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
      expect(submitUpdatesClicked).toBe(true);
    });
    summaryRevised.verifyEnteredComment(jsonData.CommentValue).then(function (text) {
      expect(text).toBe(true);
    });
    summaryRevised.presenceofupdatedIcon().then(function (result) {
      expect(result).toBe(true);
    });
    summaryRevised.presenceofDataonActivityIcon(jsonData.CommentValue).then(function (text) {
      expect(text).toBe(true);
    })
  });
  it('Test Case: Verify the presence of seperator for year @P2', function () {
    library.logStep('Test Case 1 : Verify the presence of seperator for year');
    labsetup.navigateTO(jsonData.Departmentname).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ControlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.clickHideData().then(function (dataHidden) {
      expect(dataHidden).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    RevisedPointData1.insertDateThroughCalender(jsonData.previousyear, jsonData.month, jsonData.date).then(function (inserted) {
      expect(inserted).toBe(true);
    });
    summaryRevised.enterMeanSdPoints(jsonData.levelno, jsonData.mean, jsonData.SD, jsonData.Points).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    summaryRevised.VerifypresenceofHeaderForYear().then(function (result) {
      expect(result).toBe(true);
    });
  });
});
