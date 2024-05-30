/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { EvalMeanSD } from '../page-objects/EvalMeanSD-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { Panels } from '../page-objects/panels-e2e.po';


const fs = require('fs');
let jsonData;
// fs.readFile('./JSON_data/Panel.json', (err, data) => {
//   if (err) { throw err; }
//   const settings = JSON.parse(data);
//   jsonData = settings;
// });

// fs.readFile('./JSON_data/EvaluationMeanSD_stage.json', (err, data) => {
//   if (err) { throw err; }
//   const settings = JSON.parse(data);
//   jsonData = settings;
// });

const library=new BrowserLibrary();
library.parseJson('./JSON_data/Panel.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: Verify Panles UI and Sorting', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const panel = new Panels();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: Verify Add panel page UI', function () {
    panel.verifyAddPanelsInLeftNavigation().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    panel.clickOnAddPanel().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    panel.verifyAddPanelPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });

  });


  /* it('test case 2 - Select at Department level and verify analytes selected',function(){
    panel.verifyAddPanelsInLeftNavigation().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    panel.clickOnAddPanel().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    panel.selectItems('Test1','true','true').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('TSH').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Vitamin B12').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Folate').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Ferritin').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Ferritin').then(function (verified) {
      expect(verified).toBe(true);
    });

  })

  it('test case 3 - Select at Instrument level and verify analytes selected',function(){
    panel.clickOnAddPanel().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    panel.selectItems('Test1','true','false').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.selectItems('Access 2','true','true').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('TSH').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Vitamin B12').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Folate').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Ferritin').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Ferritin').then(function (verified) {
      expect(verified).toBe(true);
    });
  })

  it('test case 4 - Select at Control level and verify analytes selected',function(){
    panel.clickOnAddPanel().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    panel.selectItems('Test1','true','false').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.selectItems('Access 2','true','false').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.selectItems('Anemia','true','true').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('TSH').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Vitamin B12').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Folate').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Ferritin').then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.VerifyItemSelected('Ferritin').then(function (verified) {
      expect(verified).toBe(true);
    });
  })

  it('test case 4 - Deselect at Control level and verify analytes Deselected',function(){
    panel.clickOnAddPanel().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    panel.deSelectItems('Test1','true','false').then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.deSelectItems('Access 2','true','false').then(function (verified) {
      expect(verified).toBe(true);
    });
    panel.deSelectItems('Anemia','true','true').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('TSH').then(function (verified) {
      expect(verified).toBe(false);
    });

    panel.VerifyItemSelected('Vitamin B12').then(function (verified) {
      expect(verified).toBe(false);
    });

    panel.VerifyItemSelected('Folate').then(function (verified) {
      expect(verified).toBe(false);
    });

  }) */


  it('test case 5 - Sort the analytes using sort option', function () {
    panel.clickOnAddPanel().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    panel.selectItems('Test1', 'true', 'false').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.selectItems('Access 2', 'true', 'false').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.selectItems('Anemia', 'true', 'true').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('TSH').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Vitamin B12').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Folate').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.VerifyItemSelected('Ferritin').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.rearrangePanelItems('1', '3').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.verifyItemsRearranged('Folate', '1').then(function (verified) {
      expect(verified).toBe(true);
    });

  });

  it('test case 6 - Verify View info option on add panel UI', function () {
    panel.clickOnAddPanel().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    panel.selectItems('Test1', 'true', 'false').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.selectItems('Access 2', 'true', 'false').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.selectItems('Anemia', 'true', 'true').then(function (verified) {
      expect(verified).toBe(true);
    });

    panel.verifyInfoIconInSelectedItemList('TSH').then(function (verified) {
      expect(verified).toBe(true);
    });

  });

});
