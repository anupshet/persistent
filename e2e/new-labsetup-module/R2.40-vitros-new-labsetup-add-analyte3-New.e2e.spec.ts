//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { NewLabDepartment } from '../page-objects/new-lab-department-e2e.po';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
import { AddControl } from '../page-objects/new-labsetup-add_Control-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { Feedback } from '../page-objects/new-lab-feedback-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';
import { AnalyteSettings } from '../page-objects/analyte-settings-e2e.po';


const library = new BrowserLibrary();
const newLabSetup = new NewLabSetup();
const setting = new Settings();
const westgard = new WestgardRule();
const analyteSettings = new AnalyteSettings();
const nav = new NewNavigation();

const fs = require('fs');
let jsonData;

library.parseJson('./JSON_data/NewLabsetupAddAnalyte3-New.json').then(function(data) {
  jsonData = data;
});


describe('PBI 211905 Lab Setup: Analyte creation should be limited to Reagent/Calibrator level', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const control = new AddControl();
  const analyte = new AddAnalyte();
  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
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

  it('Test Case 01, 02:Verify when the same Reagent already exists under the analyte, it should not allow a new analyte to be created with saame Reagent and different Reagent Lot.', function () {
    library.logStep('Test Case 02:Verify error message when user create new analyte for existing Reagent with different Reagent Lot.'+
    'Error Message: An analyte with this configuration already exist for the selected control.');

    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    control.clickEditThisControlLink().then(function (edit) {
      expect(edit).toBe(true);
    });
    control.clickAddAnAnalyteLink().then(function (addAnalyteLink) {
      expect(addAnalyteLink).toBe(true);
    });

    // analyte.selectLevelInUse(jsonData.levels).then(function (checked) {
    //   expect(checked).toBe(true);
    // });
    analyte.selectAnalyteName(jsonData.Analyte1).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectReagent(jsonData.AnalyteReagent1).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.verifyErrorSameAnalyte().then(function (errordisplayed) {
      expect(errordisplayed).toBe(true);
    });
  });

  it('Test Case 03:Verify when the different Reagent already exists for same analyte, it should not allow user to update analyte Reagent to other existing Reagent.', function () {
    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    // newLabSetup.navigateToReagentLot(jsonData.AnalyteReagent1).then(function (prod) {
    //   expect(prod).toBe(true);
    // });
    control.clickEditThisControlLink().then(function (edit) {
      expect(edit).toBe(true);
    });
    control.clickAddAnAnalyteLink().then(function (addAnalyteLink) {
      expect(addAnalyteLink).toBe(true);
    });

    analyte.selectAnalyteName(jsonData.Analyte1).then(function (selected) {
      expect(selected).toBe(true);
    });
    setting.selectReagent(jsonData.ReagentDuplicate).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.verifyErrorSameAnalyte().then(function (errordisplayed) {
      expect(errordisplayed).toBe(true);
    });
  });

  it('Test Case 04:Verify user should not be allowed to change Reagent and should be disabled once user adds data for summary/point data. @P1', function () {
    newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte4).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
      expect(clickedEditLink).toBe(true);
    });

    newLabSetup.verifySelectReagentIsEnabled().then(function (NotEnabled) {
      expect(NotEnabled).toBe(true);
    });
    // newLabSetup.navigateTO(jsonData.Analyte5).then(function (analyte) {
    //   expect(analyte).toBe(true);
    // });
    // westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
    //   expect(clickedEditLink).toBe(true);
    // });
    // setting.selectReagent(jsonData.Reagent3).then(function (selected) {
    //   expect(selected).toBe(false);
    // });
  });
  // it('Test Case 05:Verify user should not be allowed to change Reagent and should be disabled once user adds data for summary/point data.', function () {
  //   newLabSetup.navigateTO(jsonData.Department).then(function (dept) {
  //     expect(dept).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.Instrument).then(function (inst) {
  //     expect(inst).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.Control).then(function (prod) {
  //     expect(prod).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.Analyte4).then(function (analyte) {
  //     expect(analyte).toBe(true);
  //   });
  //   westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
  //     expect(clickedEditLink).toBe(true);
  //   });
  //   setting.selectReagent(jsonData.Reagent2).then(function (selected) {
  //     expect(selected).toBe(false);
  //   });
  //   newLabSetup.navigateTO(jsonData.Analyte5).then(function (analyte) {
  //     expect(analyte).toBe(true);
  //   });
  //   westgard.clickEditThisAnalyteLink().then(function (clickedEditLink) {
  //     expect(clickedEditLink).toBe(true);
  //   });
  //   setting.selectReagent(jsonData.Reagent3).then(function (selected) {
  //     expect(selected).toBe(false);
  //   });
  // });

});
