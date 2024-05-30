/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { CustomSortOrder } from '../page-objects/Select-SortOrder.po';
import { Panels } from '../page-objects/panels-e2e.po';
import { MultiPoint } from '../page-objects/multi-point.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';

const fs = require('fs');
let jsonData;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Audit trail UN-10520', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const library = new BrowserLibrary();
  const setting = new Settings();
  const customSortOrder = new CustomSortOrder();
  const panel = new Panels();
  const newLabSetup = new NewLabSetup();
  const multiPoint = new MultiPoint();
  const navigation = new NewNavigation();
  const dataMap = new Map<string, string>();
  const multiSummary = new MultiSummary();

  library.parseJson('./JSON_data/PanelE2EAuditTrail-UN-10520.json').then(function (data) {
    jsonData = data;
  });

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1 : Verify Audit Trail API request on sorting analytes from panel', function () {

    setting.navigateTO(jsonData.PanelName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    customSortOrder.clickOnSortButton(jsonData.SortingType1).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.customSortItems(jsonData.PanelAnalyte1, jsonData.PanelAnalyte2).then(function (verified) {
      expect(verified).toBe(true);
    });
    customSortOrder.clickOnDoneBtn().then(function (verified) {
      expect(verified).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload1,jsonData.statusCode1);

  });

  it('Test case 2 : Verify Audit Trail API request on creating a panel from dashbaord', function () {
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

    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload2,jsonData.statusCode2);

  });

  it('Test case 3 : Verify Audit Trail API request on editing existing  panel from dashbaord', function () {
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

    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload3,jsonData.statusCode3);

  });

  it('Test case 4 : Verify Audit Trail API request on deleting existing  panel from dashbaord', function () {
    newLabSetup.navigateTO(jsonData.PanelName).then(function (dept) {
      expect(dept).toBe(true);
    });
    panel.clickEditThisPanelLink().then(function (editClicked) {
      expect(editClicked).toBe(true);
    });
    panel.clickDeleteButton().then(function (deleteClicked) {
      expect(deleteClicked).toBe(true);
    });
    panel.clickConfirmDeleteButton().then(function (confirmDeleteClicked) {
      expect(confirmDeleteClicked).toBe(true);
    });

    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload4,jsonData.statusCode4);

  });

  const val = '6.95';

  it('Test case 5 : Verify Audit Trail API request on adding Point data through panel', function () {
    newLabSetup.navigateTO(jsonData.PanelName).then(function (dept) {
      expect(dept).toBe(true);
    });
    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload5,jsonData.statusCode5);
  });

  it('Test case 6 : Verify Audit Trail API request on adding Summary data through panel', function () {
    
    const meanVal = '23.00';
    const sdVal = '0.10';
    const points = '11';
    newLabSetup.navigateTO(jsonData.PanelName).then(function (dept) {
      expect(dept).toBe(true); 
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', meanVal);
    dataEnter.set('12', sdVal);
    dataEnter.set('13', points);
    multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
      expect(values).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    library.verifyAPIStatusAndPayloadStructure(jsonData.API,jsonData.inputpayload6,jsonData.statusCode6);
  });


});
