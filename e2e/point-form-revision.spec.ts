//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { LoginEvent } from './page-objects/login-e2e.po';
import { LogOut } from './page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from './utils/browserUtil';
import { NewLabSetup } from './page-objects/new-labsetup-e2e.po';
import { RevisedSummaryData } from './page-objects/summary-form-revision.po';
import { RevisedPointData } from './page-objects/point-form-revision.po';
import { MultiSummary } from './page-objects/multi-summary-e2e.po';
import { PointDataEntry } from './page-objects/point-data-entry-e2e.po';
const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/dataentryrevision.json').then(function (data) {
  jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;
describe('Test Suite: RevisedPointForm', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const RevisedPointData1 = new RevisedPointData();
  const summaryRevised = new RevisedSummaryData();
  const multiSummary = new MultiSummary();
  const newLabSetup = new NewLabSetup();
  const pointData = new PointDataEntry();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.firstname).then(function (loggedIn) {
      console.log(jsonData.URL);
      expect(loggedIn).toBe(true);
    });
  });
  afterEach(function () {
    out.signOut();
  });
  it("verify the Revised UI form for Point Form @P2 ", function () {
    library.logStep('Test Case 1:Verify the presence of Manual Enter Data link.');
    library.logStep('Test case 2: Verify the presence of sendToPeerGroupbtn.');
    library.logStep('Test case 3: Verify if the cursor is placed at first value.');
    library.logStep('Test Case 4:Verify the presence of label for levels');
    library.logStep('Test case 5: Verify if jenning chart is placed at Leftposition');
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
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    RevisedPointData1.presenceOfLevelHeader(jsonData.levelheader).then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.VerifyfocusonFirstElement().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.verifychartsPositionSwapped(jsonData.ChartPosition).then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.presenceofSendToPeerGroupbtnOnPointForm().then(function (Status) {
      expect(Status).toBe(true);
    });
  });
  it('Test case : Verify the presence of Updated activity icon,Restart float icon and Point Data Entry Page shows most recently entered line at the top @P1', function () {
    library.logStep('Test case 1: Point Data Entry Page shows most recently entered line at the top');
    library.logStep('Test case 2: Verify the presence of show option arrow');
    library.logStep('Test case 3:Verify the click on restartfloaticon ');
    library.logStep('Test case 4:verify the presence of updated Restart icon');
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
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    summaryRevised.clickonToggleArrow().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.enterPointValue(10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    RevisedPointData1.VerifythepresenceofShowOptionArrow().then(function (result) {
      expect(result).toBe(true);
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
    pointData.verifyEnteredPointValuesLvl1(10).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    RevisedPointData1.ClickOnEditDialogueButtonOnTestLevel().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.clickonrestartFloatIcon().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
      expect(submitUpdatesClicked).toBe(true);
    });
    RevisedPointData1.verifypresenceofupdatedRestartIcon().then(function (result) {
      expect(result).toBe(true);
    });
  });
  it('Test case : Verify the presence of Insert a different date link @P2', function () {
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
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    RevisedPointData1.verifythepresenceofinsertdateIcon().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.verifythepresenceofInsertadifferentDate().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.insertdifferentlinkvisibleonclickingCancelBtn().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.verifythepresenceofInsertadifferentDate().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.verifyDateTimePicker().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.insertDateThroughCalender(jsonData.year, jsonData.month, jsonData.date).then(function (inserted) {
      expect(inserted).toBe(true);
    });
    RevisedPointData1.enterPointValue(3).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    summaryRevised.clickonToggleArrow().then(function (result) {
      expect(result).toBe(true);
    });
    RevisedPointData1.verifyDateTime(jsonData.monthdate).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
