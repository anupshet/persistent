/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
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


const library = new BrowserLibrary();

const fs = require('fs');
const fileToUpload = '../resources/filename.txt';
const invaliFileWExt = '../resources/invalidFileExtenstion.json';
const fileMaxSize = '../resources/FileOver8MB.pdf';
let jsonData;

library.parseJson('./JSON_data/NewLabSetupAddAnalyte.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: New Lab Setup', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const labsetupDept = new NewLabDepartment();
  const control = new AddControl();
  const analyte = new AddAnalyte();
  const feedback = new Feedback();
  const navigation = new NewNavigation();
  let flagForIEBrowser: boolean;
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


  // TC 91 is covered here
  it('Test Case 89: Verify the Add Analyte Screen displayed after Add Control Screen', function () {
    library.logStep('Test Case 89: Verify the Add Analyte Screen displayed after Add Control Screen');
    library.logStep('Test Case 90: Verify the UI Components on Add Analyte Screen');
    library.logStep('Test Case 92: Verify Levels in use checkboxes on Add Analyte Screen');
    const deptName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.verifyAddAnalyte().then(function (status) {
      expect(status).toBe(true);
    });
    analyte.verifyAddAnalytePageControls().then(function (status) {
      expect(status).toBe(true);
    });
    analyte.verifyLevelsInUse().then(function (verified) {
      expect(verified).toBe(true);
    });
  });


  it('Test Case 100:Verify Analytes List with checkboxes on Add Analyte Screen', function () {
    const analyteName = jsonData.AnalyteName;
    const deptName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(cntrlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.selectAnalyteName(analyteName).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.verifyFieldPopulated().then(function (verified) {
      expect(verified).toBe(true);
    });
    analyte.selectUnit(jsonData.UnitOfMeasure, '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.verifyAddAnalyteButtonEnabled().then(function (verified) {
      expect(verified).toBe(true);
    });
  });


  // Need to confirm the behavior after checking this box.
  it('Test Case 107: Verify Unit dropdown on Add Analyte Page', function () {
    const analyteName = 'Prealbumin';
    const calibratorName = jsonData.Calibrator;
    const unit = jsonData.UnitOfMeasure;
    const dropdownUnit = 'Unit';
    const dropdownCalibrator = 'Calibrator';
    const dropdownReagent = 'Reagent';
    const deptName = jsonData.Dept1Name;
    const instrName = jsonData.Instrument1Model;
    const controlName = jsonData.ControlName;
    labsetup.navigateTO(deptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instrName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(controlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.selectAnalyteName(analyteName).then(function (selected) {
      expect(selected).toBe(true);
    });
    labsetup.verifyListSortedAlphabetically(dropdownUnit).then(function (sorted) {
      expect(sorted).toBe(true);
    });
  });

  it('Test Case 110: Verify the UI Components on Modal to setup the new Analyte', function () {
    library.logStep('Test Case 110: Verify the UI Components on Modal to setup the new Analyte');
    library.logStep('Test Case 109: Verify that a modal to setup new Analyte will be displayed by clicking '
      + 'on Do not see your Analyte ? Link');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const controlName = jsonData.ControlName;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(controlName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.clickDontSeeAnalyte().then(function (dontSee) {
      expect(dontSee).toBe(true);
    });
    analyte.setUpNewAnalyteDisplayed().then(function (status) {
      expect(status).toBe(true);
    });
    analyte.setUpNewAnalyteControls(jsonData.Text).then(function (status) {
      expect(status).toBe(true);
    });
  });



  // Test case failing on IE due to defect - 170459
  // it('Test Case 112: Verify the action on clicking the browse for a file link on Modal to setup the new Analyte  ', function () {
  //   const depName = jsonData.Dept1Name;
  //   const instName = jsonData.Instrument1Model;
  //   const contName = jsonData.ControlName;
  //   labsetup.navigateTO(depName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(instName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(contName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   analyte.clickDontSeeAnalyte().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
  //     expect(uploaded).toBe(true);
  //   });
  //   labsetup.verifyFileisAddedToUpload().then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   analyte.verifySendInformationButtonEnabled().then(function (verifiedBtn) {
  //     expect(verifiedBtn).toBe(true);
  //   });
  //   labsetup.clickCancelOnNewSetup().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  // });

  // it('Test Case 139: Verify the action on clicking the browse for a all the valid files  to setup the new analyte. ', function () {
  //   const depName = jsonData.Dept1Name;
  //   const instName = jsonData.Instrument1Model;
  //   const contName = jsonData.ControlName;
  //   const validFiles = new Map<string, string>();
  //   validFiles.set('../resources/filename.txt', 'TXT File');
  //   validFiles.set('../resources/textPDF.pdf', 'PDF File');
  //   validFiles.set('../resources/jpgFile.jpg', 'JPG File');
  //   validFiles.set('../resources/pngFile.png', 'PNG File');
  //   validFiles.set('../resources/textDoc.doc', 'DOC File');
  //   validFiles.set('../resources/textZip.zip', 'ZIP File');
  //   labsetup.navigateTO(depName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(instName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(contName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.verifyAllValidFileUploadAnalyte(validFiles).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  // });

  // it('Test Case 114: Verify that invalid Analyte file will not get uploaded in the system.', function () {
  //   library.logStep('Test Case 114: Verify that invalid Analyte file will not get uploaded in the system.');
  //   library.logStep('Test Case 115: Verify that more than 8MB size of Analyte files will not get uploaded '
  //     + 'in the system'); const depName = jsonData.Dept1Name;
  //   const instName = jsonData.Instrument1Model;
  //   const contName = jsonData.ControlName;
  //   labsetup.navigateTO(depName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(instName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(contName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   analyte.clickDontSeeAnalyte().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
  //     expect(uploaded).toBe(true);
  //   });
  //   labsetup.browseFileToUpload(invaliFileWExt).then(function (uploaded) {
  //     expect(uploaded).toBe(true);
  //   });
  //   labsetup.VerifyErrorInvalidFileExtention().then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   analyte.verifySendInformationButtonEnabled().then(function (verifiedBtn) {
  //     expect(verifiedBtn).toBe(false);
  //   });
  //   labsetup.clickCancelOnNewSetup().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   analyte.clickDontSeeAnalyte().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
  //     expect(uploaded).toBe(true);
  //   });
  //   labsetup.browseFileToUpload(invaliFileWExt).then(function (uploaded) {
  //     expect(uploaded).toBe(true);
  //   });
  //   labsetup.VerifyErrorInvalidFileExtention().then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   analyte.verifySendInformationButtonEnabled().then(function (verifiedBtn) {
  //     expect(verifiedBtn).toBe(false);
  //   });
  //   labsetup.clickCancelOnNewSetup().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  // });


  it('Test Case 118: Verify that Clicking on Cancel Button will close the  setup new Analyte modal', function () {
    library.logStep('Test Case 118: Verify that Clicking on Cancel Button will close the  setup new Analyte modal');
    library.logStep('Test Case 119: Verify that Clicking on Close Button will close the  setup new Analyte modal');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const contName = jsonData.ControlName;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.clickDontSeeAnalyte().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.clickCancelOnNewSetup().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    analyte.verifyCancelCloseButtonClicked().then(function (cancelclicked) {
      expect(cancelclicked).toBe(true);
    });
    analyte.clickDontSeeAnalyte().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.clickCloseOnNewInstrumentSetup().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    analyte.verifyCancelCloseButtonClicked().then(function (cancelclicked) {
      expect(cancelclicked).toBe(true);
    });
  });


  it('Test Case 120: Verify that Clicking on Cancel Button will clear the form on Add Analyte Page', function () {
    const unit = jsonData.UnitOfMeasure;
    const unit2 = jsonData.UnitOfMeasure2;
    const analyteName = jsonData.AnalyteName;
    const analyteName2 = jsonData.AnalyteName1;
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const contName = jsonData.ControlName;
    const levels = 1;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.selectAnalyteName(analyteName).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit(unit, '1').then(function (unitSelected) {
      expect(unitSelected).toBe(true);
    });
    analyte.clickOnCancel().then(function (cancelclicked) {
      expect(cancelclicked).toBe(true);
    });
    analyte.verifyAddAnalyteFormCleared(analyteName).then(function (verified) {
      expect(verified).toBe(true);
    });
  });


  // Test case 127, 128, 129, 130, 131 & 132 are clubbed here due to feedback screen functionality of displaying only once in the setup
  it('Test Case 121: Verify that user is able to add Analyte on Add Analyte Page', function () {
    log4jsconfig.log().info('Test Case 121: Verify that user is able to add Analyte on Add Analyte Page');
    const unit = jsonData.UnitOfMeasure;
    const unit2 = jsonData.UnitOfMeasure2;
    const analyteName = jsonData.AnalyteName;
    const analyteName2 = jsonData.AnalyteName1;
    const depName = 'Dept1';
    const instName = 'AU480';
    const contName = 'Anemia';
    const levels = 1;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.selectAnalyteName(analyteName).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit(unit, '1').then(function (unitSelected) {
      expect(unitSelected).toBe(true);
    });
    analyte.selectAnalyteName(analyteName2).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit(unit2, '2').then(function (unitSelected) {
      expect(unitSelected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (cancelled) {
      expect(cancelled).toBe(true);
    });
    // feedback.verifyFeedbackPage().then(function (verified) {
    //   expect(verified).toBe(true);
    // });
    // feedback.clickStarRating('1').then(function (rated) {
    //   expect(rated).toBe(true);
    // });
    // feedback.clickOnAddComment().then(function (clicked) {
    //   expect(clicked).toBe(true);
    // });
    // feedback.submitCommentButtonDisabled().then(function (added) {
    //   expect(added).toBe(true);
    // });
    // feedback.addCommentText(jsonData.FeedbackComment).then(function (added) {
    //   expect(added).toBe(true);
    // });
    // feedback.submitCommentButtonEnabled().then(function (enabled) {
    //   expect(enabled).toBe(true);
    // });
    // feedback.clickSubmitButton().then(function (clicked) {
    //   expect(clicked).toBe(true);
    // });
    // feedback.clickGoToDashboardButton().then(function (clicked) {
    //   expect(clicked).toBe(true);
    // });
  });

  // Failing as connectivity icon not displyed
  // it('Test case 134: Verify that the Connectivity icon is shown to the user after completing the Lab Setup', function () {
  //   //Need to add steps before this
  //   feedback.verifyConnectivityIconDisplayed().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  // });
  // ;


});
