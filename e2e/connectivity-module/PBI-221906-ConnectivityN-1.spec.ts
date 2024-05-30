/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Connectivity } from '../page-objects/connectivity-mapping-e2e.po';
import { SlidgenSchedulerE2E } from '../page-objects/slideGenScheduler-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { ConnectivityNew } from '../page-objects/connectivity-new-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
const fs = require('fs');

let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/PBI-221906-ConnectivityN-1.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Connectivity: N-1: provide the ability to map multiple codes to single entity', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  let flagForIEBrowser: boolean;
  const connectivity = new Connectivity();
  const slideGenScheduler = new SlidgenSchedulerE2E();
  const pointData = new PointDataEntry();
  const connectE2E = new ConnectivityNew();
  const setting = new Settings();
  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
    });
  });
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 1 : To verify Instrument Cards UI', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity.selectInstruction(jsonData.InstructionsName).then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload("FlexFilePoint.txt").then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.selectRadioBtnNo().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.clickOnUploadBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.clickMappingTab().then(function (mappingTab) {
      expect(mappingTab).toBe(true);
    });
    connectivity.applyDepartmentFilter(jsonData.Department1).then(function (filter) {
      expect(filter).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode1, jsonData.Dept1Instr1, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    })
    connectivity.mapCodesToCards(jsonData.InstrumentCode2, jsonData.Dept1Instr1, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.InstrumentCode3, jsonData.Dept1Instr1, 'Instrument').then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.verifyNTo1Mapping(jsonData.Dept1Instr1).then(function (Verified) {
      expect(Verified).toBe(true);
    });
    connectivity.closeMapping().then(function (windowclosed) {
      expect(windowclosed).toBe(true);
    });
  });

  it('Test Case 2 : To verify Product Cards UI', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity.clickMappingTab().then(function (mappingTab) {
      expect(mappingTab).toBe(true);
    });
    connectivity.applyDepartmentFilter(jsonData.Department1).then(function (filter) {
      expect(filter).toBe(true);
    });
    connectivity.clickLeftNavigationProduct().then(function (prod2) {
      expect(prod2).toBe(true);
    });
    connectivity.verifyCardDisplayed(jsonData.Dept1Instr1Prod1).then(function (card1) {
      expect(card1).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.ProductCode1, jsonData.Dept1Instr1Prod1, 'Product').then(function (mapCodes) {
      expect(mapCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.ProductCode2, jsonData.Dept1Instr1Prod1, 'Product').then(function (mapCodes) {
      expect(mapCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.ProductCode3, jsonData.Dept1Instr1Prod1, 'Product').then(function (mapCodes) {
      expect(mapCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.verifyCodeLinked(jsonData.ProductCode1, jsonData.Dept1Instr1Prod1, '0', 'Product').then(function (mapped) {
      expect(mapped).toBe(true);
    });
    connectivity.verifyCodeLinked(jsonData.ProductCode2, jsonData.Dept1Instr1Prod1, '0', 'Product').then(function (mapped) {
      expect(mapped).toBe(true);
    });
    connectivity.verifyCodeLinked(jsonData.ProductCode3, jsonData.Dept1Instr1Prod1, '0', 'Product').then(function (mapped) {
      expect(mapped).toBe(true);
    });
    connectivity.verifyNTo1Mapping(jsonData.Dept1Instr1Prod1).then(function (Verified) {
      expect(Verified).toBe(true);
    });
    connectivity.closeMapping().then(function (windowclosed) {
      expect(windowclosed).toBe(true);
    });
  });


  it('Test Case 3 : To verify analyte Cards UI', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity.clickMappingTab().then(function (mappingTab) {
      expect(mappingTab).toBe(true);
    });
    connectivity.applyDepartmentFilter(jsonData.Department1).then(function (filter) {
      expect(filter).toBe(true);
    });
    connectivity.clickLeftNavigationTest().then(function (prod2) {
      expect(prod2).toBe(true);
    });
    connectivity.verifyCardDisplayed(jsonData.Dept1Instr1Prod1Analyte1).then(function (card1) {
      expect(card1).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.AnalyteCode1, jsonData.Dept1Instr1Prod1Analyte1, 'Analyte').then(function (mapCodes) {
      expect(mapCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.AnalyteCode2, jsonData.Dept1Instr1Prod1Analyte1, 'Analyte').then(function (mapCodes) {
      expect(mapCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.mapCodesToCards(jsonData.AnalyteCode3, jsonData.Dept1Instr1Prod1Analyte1, 'Analyte').then(function (mapCodes) {
      expect(mapCodes).toBe(true);
    });
    connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
      expect(mapInstrumentCodes).toBe(true);
    });
    connectivity.verifyCodeLinked(jsonData.AnalyteCode1, jsonData.Dept1Instr1Prod1Analyte1, '0', 'Analyte').then(function (mapped) {
      expect(mapped).toBe(true);
    });
    connectivity.verifyCodeLinked(jsonData.AnalyteCode2, jsonData.Dept1Instr1Prod1Analyte1, '0', 'Analyte').then(function (mapped) {
      expect(mapped).toBe(true);
    });
    connectivity.verifyCodeLinked(jsonData.AnalyteCode3, jsonData.Dept1Instr1Prod1Analyte1, '0', 'Analyte').then(function (mapped) {
      expect(mapped).toBe(true);
    });
    connectivity.verifyNTo1Mapping(jsonData.Dept1Instr1Prod1Analyte1).then(function (Verified) {
      expect(Verified).toBe(true);
    });
    connectivity.closeMapping().then(function (windowclosed) {
      expect(windowclosed).toBe(true);
    });
  });

  it('Test Case 4 : Verify N to 1 Data is processed at analyte level', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectE2E.verifyFileUploadStatus().then(function (verified) {
      expect(verified).toBe(true);
    });
    connectivity.closeMapping().then(function (windowclosed) {
      expect(windowclosed).toBe(true);
    });
    setting.navigateTO(jsonData.Department1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Instr1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Instr1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Dept1Instr1Prod1Analyte1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    pointData.verifyEnteredPointValuesLvl1(5).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    pointData.clickEnteredValuesRow2(5).then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    pointData.isEditDialogDisplayed().then(function (editDialogDisplayed) {
      expect(editDialogDisplayed).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.clickConfirmDeleteButton().then(function (confirmDeleteButtonClicked) {
      expect(confirmDeleteButtonClicked).toBe(true);
    });
    pointData.verifyEnteredPointValuesLvl1(11).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    pointData.clickEnteredValuesRow2(11).then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    pointData.isEditDialogDisplayed().then(function (editDialogDisplayed) {
      expect(editDialogDisplayed).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.clickConfirmDeleteButton().then(function (confirmDeleteButtonClicked) {
      expect(confirmDeleteButtonClicked).toBe(true);
    });
    pointData.verifyEnteredPointValuesLvl1(15).then(function (valuesVerified) {
      expect(valuesVerified).toBe(true);
    });
    pointData.clickEnteredValuesRow2(15).then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    pointData.isEditDialogDisplayed().then(function (editDialogDisplayed) {
      expect(editDialogDisplayed).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.clickConfirmDeleteButton().then(function (confirmDeleteButtonClicked) {
      expect(confirmDeleteButtonClicked).toBe(true);
    });
  });

  xit('Test Case 5 : Unlink Instrument code for Next Execution', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    connectivity.clickMappingTab().then(function (mappingTab) {
      expect(mappingTab).toBe(true);
    });
    connectivity.applyDepartmentFilter(jsonData.Department1).then(function (filter) {
      expect(filter).toBe(true);
    });
    connectivity.clickLeftNavigationInstrument().then(function (test1) {
      expect(test1).toBe(true);
    });
    connectivity.verifyUnlinkDisplayed(jsonData.InstrumentCode1).then(function (unlinkDisplayed) {
      expect(unlinkDisplayed).toBe(true);
    });
    connectivity.clickAndVerifyCardUnlink(jsonData.InstrumentCode1).then(function (unlinked) {
      expect(unlinked).toBe(true);
    });
    connectivity.clickAndVerifyCardUnlink(jsonData.InstrumentCode2).then(function (unlinked) {
      expect(unlinked).toBe(true);
    });
    connectivity.clickAndVerifyCardUnlink(jsonData.InstrumentCode3).then(function (unlinked) {
      expect(unlinked).toBe(true);
    });
    connectivity.closeMapping().then(function (windowclosed) {
      expect(windowclosed).toBe(true);
    });
  });
});
