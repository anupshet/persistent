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

library.parseJson('./JSON_data/LabSetup.json').then(function (data) {
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

  // // // // // ---------------------- Department -------------------------------
  // // Test Case 21, 22, 23, 26, 27 are clubbed here
  it('Test case 22: Verify Add Department UI Components', function () {
    library.logStep('Test case 22: Verify Add Department UI Components');
    library.logStep('Test case 26: Verify Department Name Field on Add Departments Page');
    library.logStep('Test case 29: Verify Manager Name dropdown on Add Departments Page');
    labsetupDept.verifyDepartmentSetupPage(jsonData.LabName).then(function (pageValidation) {
      expect(pageValidation).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.InvalidDept1).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.deptNameFieldValidation().then(function (fieldValidation) {
      expect(fieldValidation).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.verifyAddDeptButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labsetupDept.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.Dept1Name).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.verifyAddDeptButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labsetupDept.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
  });

  // // Test Case 33 & 34 are clubbed here
  it('Test case 30: Verify that user is able to add more departments by clicking on Another Department? Link', function () {
    library.logStep('Test case 30: Verify that user is able to add more departments by clicking on Another Department? Link');
    library.logStep('Test case 32: Verify that Clicking on Cancel Button will clear the form on Add Department Page');
    labsetupDept.verifyCountOfDepartmentFields().then(function (countDept) {
      expect(countDept).toBe(3);
    });
    labsetupDept.clickAnotherDepartmentLink().then(function (anotherDeptLinkClicked) {
      expect(anotherDeptLinkClicked).toBe(true);
    });
    labsetupDept.verifyCountOfDepartmentFields().then(function (countDept) {
      expect(countDept).toBe(4);
    });
    labsetupDept.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.Dept1Name).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.verifyAddDeptButtonEnabled().then(function (addDeptEnabled) {
      expect(addDeptEnabled).toBe(true);
    });
    labsetupDept.clickCancelButton().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    labsetupDept.firstDeptNameFieldBlank().then(function (blank) {
      expect(blank).toBe(true);
    });
    labsetupDept.verifyDepartmentSetupPage(jsonData.LabName).then(function (pageValidation) {
      expect(pageValidation).toBe(true);
    });
  });

  it('Test case 34: Verify that newly added 4 Department fields will be removed after clicking on Cancel Button on Add Department Page',
    function () {
      labsetupDept.clickAnotherDepartmentLink().then(function (added1) {
        expect(added1).toBe(true);
      });
      labsetupDept.clickAnotherDepartmentLink().then(function (added2) {
        expect(added2).toBe(true);
      });
      labsetupDept.clickAnotherDepartmentLink().then(function (added3) {
        expect(added3).toBe(true);
      });
      labsetupDept.clickAnotherDepartmentLink().then(function (added4) {
        expect(added4).toBe(true);
      });
      labsetupDept.verifyCountOfDepartmentFields().then(function (count) {
        expect(count).toBe(7);
      });
      labsetupDept.addFirstDepartmentName(jsonData.Dept1Name).then(function (dept1NameAdded) {
        expect(dept1NameAdded).toBe(true);
      });
      labsetupDept.verifySelectManagerUser().then(function (singleUser) {
        expect(singleUser).toBe(true);
      });
      labsetupDept.clickCancelButton().then(function (cancelClicked) {
        expect(cancelClicked).toBe(true);
      });
      labsetupDept.verifyDepartmentSetupPage(jsonData.LabName).then(function (pageValidation) {
        expect(pageValidation).toBe(true);
      });
    });

  // Test Case 35 & 36 are clubbed here
  it('Test case 36: Verify that Department can be added on Add Department Page @P1', function () {
    log4jsconfig.log().info('Test case 36: Verify that Department can be added on Add Department Page');
    labsetupDept.clickAddADepartmentButton().then(function(addADepartmentButtonClicked){
      expect(addADepartmentButtonClicked).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.Dept1Name).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.selectManagerUser(1).then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.addThirdDeptName(jsonData.Dept3Name).then(function (dept3NameAdded) {
      expect(dept3NameAdded).toBe(true);
    });
    labsetupDept.selectManagerUser(2).then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.verifyAddDeptButtonEnabled().then(function (addDeptEnabled) {
      expect(addDeptEnabled).toBe(true);
    });
    labsetupDept.clickAddDepartmentsButton().then(function (addDeptClicked) {
      expect(addDeptClicked).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(jsonData.Dept1Name).then(function (added) {
      expect(added).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(jsonData.Dept3Name).then(function (added) {
      expect(added).toBe(true);
    });
  });

  // --------------------------- Instrument ----------------------------
  it('Test case 38:Verify that Add instruments Page will be displayed incase user has selected We do not have Department' +
    ' option in Lab Setup Welcome Screen Page', function () {
      labsetup.selectNoDepartmentRadio().then(function (defaultVal) {
        expect(defaultVal).toBe(true);
      });
      labsetup.clickLetsGoButton().then(function (click) {
        expect(click).toBe(true);
      });
      labsetup.verifyAddInstrumentPopupDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  // // // TC 41 is covered in TC 40
  it('Test case 39:Verify that Add instrument Page will be displayed incase user has navigated from Add Department Page', function () {
    library.logStep('Test case 39:Verify that Add instrument Page will be displayed incase user has navigated from Add Department Page');
    library.logStep('Test case 40:Verify Add instrument UI Components');
    const toDept = jsonData.Dept1Name;
    labsetup.navigateTO(toDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.verifyAddInstrumentPopupDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.verifyAddInstrumentUI().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test Case 42: Verify Manufacturer Name dropdown on Add instrument Page', function () {
    log4jsconfig.log().info('Test Case 42: Verify Manufacturer Name dropdown on Add instrument Page');
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.verifyDefaultInstrumentManufacturerDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.verifyListSortedAlphabetically('Instrument manufacturer').then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.selectManufacturerName(jsonData.ManufacturerName).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.verifyInstrumentModelDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.verifyCustomInstrumentNameDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labsetup.verifySerialNumberDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 43: Verify Instrument Model dropdown on Add instrument Page', function () {
    log4jsconfig.log().info('Test Case 43: Verify Instrument Model dropdown on Add instrument Page');
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.selectManufacturerName(jsonData.ManufacturerName).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.verifyListSortedAlphabetically('Instrument model').then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.selectInstrumentName(jsonData.Instrument1Model).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.verifyAddInstrumentButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
  });

  // TC - 45 Clubbed here
  it('Test Case 44: Verify Custom Name Field on Add Instrument Page', function () {
    library.logStep('Test Case 44: Verify Custom Name Field on Add Instrument Page');
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.selectManufacturerName(jsonData.Instrument1ManufacturerName).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.selectInstrumentName(jsonData.Instrument1Model).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.verifyMaxCharacterLimit(jsonData.InstrumentCustomNameFormControl).then(function (entered) {
      expect(entered).toBe(true);
    });
    labsetup.verifyAddInstrumentButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
  });

  it('Test Case 47: Verify Serial Number Field on Add Instrument Page', function () {
    log4jsconfig.log().info('Test Case 47: Verify Serial Number Field on Add Instrument Page.');
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.selectManufacturerName(jsonData.Instrument1ManufacturerName).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.selectInstrumentName(jsonData.Instrument1Model).then(function (select) {
      expect(select).toBe(true);
    });
    labsetup.enterSerialNumber(jsonData.Instrument1SerialNo).then(function (entered) {
      expect(entered).toBe(true);
    });
    labsetup.verifyAddInstrumentButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
  });

  // TC 49 covered here- Serial no allows only 50 char, no error message displayed. Updating method for max lenght verification.
  it('Test Case 48: Verify that user should not be able to add more than 50 characters in Serial Number Field on Add Instrument Page',
    function () {
      const depName = jsonData.Dept1Name;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.selectManufacturerName(jsonData.Instrument1ManufacturerName).then(function (select) {
        expect(select).toBe(true);
      });
      labsetup.selectInstrumentName(jsonData.Instrument1Model).then(function (select) {
        expect(select).toBe(true);
      });
      labsetup.verifySerialNoValidation(jsonData.SerialNoMaxCharacter, jsonData.SerialNoSpecialCharacter).then(function (entered) {
        expect(entered).toBe(true);
      });
      labsetup.verifyAddInstrumentButtonDisable().then(function (disabled) {
        expect(disabled).toBe(true);
      });
    });

  it('Test case 53: Verify that Instrument will be added on by adding Instrument Details in 3rd Instrument Field on Add Instrument Page',
    function () {
      const depName = jsonData.Dept1Name;
      const instName = jsonData.Instrument1Model;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.clickOnThirdInstrumentManufacturer().then(function (result) {
        expect(result).toBe(true);
      });
      labsetup.selectInstrumentManufacturer(jsonData.Instrument1ManufacturerName).then(function (selected) {
        expect(selected).toBe(true);
      });
      labsetup.selectInstrumentName(jsonData.Instrument1Model).then(function (select) {
        expect(select).toBe(true);
      });
      labsetup.verifyAddInstrumentButtonEnabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
    });

  // TC 61, 62 covered here
  it('Test Case 54: Verify that a modal to setup new instrument will be displayed by clicking on Dont see your Instrument? Link',
    function () {
      library.logStep('Test Case 54: Verify that a modal to setup new instrument will be displayed by clicking on Dont'
        + ' see your Instrument? Link');
      library.logStep('Test Case 55: Verify the UI Components on Modal to setup the new instrument');
      library.logStep('Test Case 56: Verify the Header & Sub Header on Modal to setup the new instrument');
      library.logStep('Test Case 57: Verify the action on clicking the browse for a file link on Modal to setup the new instrument');
      const depName = jsonData.Dept1Name;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.verifyHeaderSubHeaderText().then(function (verified) {
        expect(verified).toBe(true);
      });
      labsetup.verifySetupNewInstrumentUI().then(function (setup) {
        expect(setup).toBe(true);
      });
      labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
        expect(uploaded).toBe(true);
      });
      labsetup.verifyFileisAddedToUpload().then(function (verified) {
        expect(verified).toBe(true);
      });
      analyte.verifySendInformationButtonEnabled().then(function (verifiedBtn) {
        expect(verifiedBtn).toBe(true);
      });
      labsetup.clickCancelOnNewSetup().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });

  it('Test Case 138  : Verify the action on clicking the browse for a all the valid files  to setup the new instrument.', function () {
    const depName = jsonData.Dept1Name;
    const validFiles = new Map<string, string>();
    validFiles.set('../resources/filename.txt', 'TXT File');
    validFiles.set('../resources/textPDF.pdf', 'PDF File');
    validFiles.set('../resources/jpgFile.jpg', 'JPG File');
    validFiles.set('../resources/pngFile.png', 'PNG File');
    validFiles.set('../resources/textDoc.doc', 'DOC File');
    // validFiles.set('../resources/textZip.zip', 'ZIP File');
    // file not present in resources folder so commenting Zip code
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.verifyAllValidFileUpload(validFiles).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test Case 58: Verify the action on dropping the file on Modal to setup the new instrument', function () {
    library.logStep('Test Case 58: Verify the action on dropping the file on Modal to setup the new instrument');
    library.logStep('Test Case 59: Verify that invalid instrument file will not get uploaded in the system');
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    labsetup.verifyFileisAddedToUpload().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.clickCancelOnNewSetup().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.browseFileToUpload(invaliFileWExt).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    labsetup.VerifyErrorInvalidFileExtention().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.clickCancelOnNewSetup().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 60: Verify that more than 8MB size of instrument files will not get uploaded in the system', function () {
    library.logStep('Test Case 60: Verify that more than 8MB size of instrument files will not get uploaded in the system');
    library.logStep('Test Case 63: Verify that Clicking on Cancel Button will close the  setup new Instrument modal');
    library.logStep('Test Case 64: Verify that Clicking on Close Button will close the  setup new Instrument modal');
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.browseFileToUpload(fileMaxSize).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    labsetup.VerifyErrorMaxFileSize().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.clickCancelOnNewSetup().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.clickCancelOnNewSetup().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    analyte.verifyCancelCloseButtonClicked().then(function (cancelclicked) {
      expect(cancelclicked).toBe(true);
    });
    labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.clickCloseOnNewInstrumentSetup().then(function (close) {
      expect(close).toBe(true);
    });
    analyte.verifyCancelCloseButtonClicked().then(function (cancelclicked) {
      expect(cancelclicked).toBe(true);
    });
  });

  it('Test Case 65: Verify that Clicking on Cancel Button will clear the form on Add Instrument Page', function () {
    log4jsconfig.log().info('Test Case 65: Verify that Clicking on Cancel Button will clear the form on Add Instrument Page');
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.addInstrument(jsonData.Instrument1ManufacturerName,
      jsonData.Instrument1Model, jsonData.Instrument1CustomName, jsonData.Instrument1SerialNo).then(function (close) {
        expect(close).toBe(true);
      });
    labsetup.clickOnCancelInstrument().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    labsetup.verifyCancelButtonFunctionality().then(function (cleared) {
      expect(cleared).toBe(true);
    });
  });

  it('Test Case 66: Verify that Instrument can be added on Add Instrument Page @P1', function () {
    log4jsconfig.log().info('Test Case 66: Verify that Instrument can be added on Add Instrument Page.');
    const toDept = 'Dept1';
    const createdName = jsonData.Instrument1Model;
    labsetup.navigateTO(toDept).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.addInstrument(jsonData.Instrument1ManufacturerName,
      jsonData.Instrument1Model, ' ', jsonData.Instrument1SerialNo).then(function (added) {
        expect(added).toBe(true);
      });
    labsetup.clickAddInstrumentsButton().then(function (click) {
      expect(click).toBe(true);
    });
    if (flagForIEBrowser === true) {
      labsetup.navigateTO('dept3').then(function (navigated3) {
        expect(navigated3).toBe(true);
      });
      labsetup.navigateTO(toDept).then(function (navigated3) {
        expect(navigated3).toBe(true);
      });
    }
    labsetup.verifyInstrumentControlAnalyteCreated(createdName).then(function (cleared) {
      expect(cleared).toBe(true);
    });
  });

  // // // ------------------------------ Control -----------------------------
  // // // // Test Cases 69, 71 are clubbed here
  it('Test case 70: Verify the UI Components on Add Control Screen', function () {
    library.logStep('Test case 70: Verify the UI Components on Add Control Screen');
    library.logStep('Test case 72: Verify Control Name dropdown on Add Control Page');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    const selectDropdown = jsonData.DropDownNameForSortingControl;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.verifyAddControlPage().then(function (verified) {
      expect(verified).toBe(true);
    });
    control.verifyDefaultControlsDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    labsetup.verifyListSortedAlphabetically(selectDropdown).then(function (status) {
      expect(status).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyLotnumberDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    control.verifyCustomNameDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  // // TC 74 is covered here
  it('Test case 73: Verify Lot Number dropdown on Add Control Page', function () {
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    const lotNumber = jsonData.ControlLotNumber;
    library.logStep('Test case 73: Verify Lot Number dropdown on Add Control Page');
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(lotNumber).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyAddControlButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
  });

  it('Test case 75: Verify that user will not be able to add more than 50 characters in Custom Name Field on Add Control Page',
    function () {
      const depName = jsonData.Dept1Name;
      const instName = jsonData.Instrument1Model;
      const cntrlName = jsonData.ControlName;
      const lotNumber = jsonData.ControlLotNumber;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      control.clickOnFirstControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(cntrlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstLotNumberList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControlLotNumber(lotNumber).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.enterDataControlName(jsonData.CustomNameMaxCharacter).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.verifyCustomNameMaxLength().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

  it('Test case 77: Verify that user is able to add more Controls by clicking on Another Control? Link', function () {
    log4jsconfig.log().info('Test case 77: Verify that user is able to add more Controls by clicking on Another Control? Link');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.addAnotherControl().then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyAnotherControlAdded().then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  // Test case 78 covered here
  it('Test case 79: Verify that newly added 4 Control fields will be removed after clicking on Cancel Button on Add Control Page',
    function () {
      const depName = jsonData.Dept1Name;
      const instName = jsonData.Instrument1Model;
      const cntrlName = jsonData.ControlName;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      control.addAnotherControl().then(function (selected) {
        expect(selected).toBe(true);
      });
      control.verifyAnotherControlAdded().then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(cntrlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnCancel().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      control.verifyDefaultControlsDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

  it('Test case 80: Verify that Control will be added on by adding Control Details in 3rd Control Field'
    + ' on Add Control Page', function () {
      const depName = jsonData.Dept1Name;
      const instName = jsonData.Instrument1Model;
      const cntrlName = jsonData.ControlName;
      const lotNumber = jsonData.ControlLotNumber;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      control.clickOnThirdControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(cntrlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstLotNumberList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControlLotNumber(lotNumber).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.verifyAddControlButtonEnabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
    });

  it('Test case 81: Verify that Clicking on Cancel Button will clear the form on Add Control Page', function () {
    log4jsconfig.log().info('Test case 81: Verify that Clicking on Cancel Button will clear the form on Add Control Page');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    const lotNumber = jsonData.ControlLotNumber;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(lotNumber).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.verifyAddControlButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    control.clickOnCancel().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    control.verifyAddControlButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

  it('Test case 82: Verify that Control can be added on Add Control Page @P1', function () {
    library.logStep('Test case 82: Verify that Control can be added on Add Control Page');
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const cntrlName = jsonData.ControlName;
    const lotNumber = jsonData.ControlLotNumber;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (Navigated2) {
      expect(Navigated2).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(cntrlName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(lotNumber).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickAddControlButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(cntrlName).then(function (created1) {
      expect(created1).toBe(true);
    });
  });

  // --------------------------------- Analyte --------------------------------------------
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
    analyte.setUpNewAnalyteDisplayed().then(function (status) {
      expect(status).toBe(true);
    });
    analyte.setUpNewAnalyteControls(jsonData.Text).then(function (status) {
      expect(status).toBe(true);
    });
  });

  // Test case failing on IE due to defect - 170459
  it('Test Case 112: Verify the action on clicking the browse for a file link on Modal to setup the new Analyte  ', function () {
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
    labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    labsetup.verifyFileisAddedToUpload().then(function (verified) {
      expect(verified).toBe(true);
    });
    analyte.verifySendInformationButtonEnabled().then(function (verifiedBtn) {
      expect(verifiedBtn).toBe(true);
    });
    labsetup.clickCancelOnNewSetup().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 139: Verify the action on clicking the browse for a all the valid files  to setup the new analyte. ', function () {
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const contName = jsonData.ControlName;
    const validFiles = new Map<string, string>();
    validFiles.set('../resources/filename.txt', 'TXT File');
    validFiles.set('../resources/textPDF.pdf', 'PDF File');
    validFiles.set('../resources/jpgFile.jpg', 'JPG File');
    validFiles.set('../resources/pngFile.png', 'PNG File');
    validFiles.set('../resources/textDoc.doc', 'DOC File');
    // validFiles.set('../resources/textZip.zip', 'ZIP File');
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.verifyAllValidFileUploadAnalyte(validFiles).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test Case 114: Verify that invalid Analyte file will not get uploaded in the system.', function () {
    library.logStep('Test Case 114: Verify that invalid Analyte file will not get uploaded in the system.');
    library.logStep('Test Case 115: Verify that more than 8MB size of Analyte files will not get uploaded '
      + 'in the system'); const depName = jsonData.Dept1Name;
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
    labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    labsetup.browseFileToUpload(invaliFileWExt).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    labsetup.VerifyErrorInvalidFileExtention().then(function (verified) {
      expect(verified).toBe(true);
    });
    analyte.verifySendInformationButtonDisabled().then(function (verifiedBtn) {
      expect(verifiedBtn).toBe(true);
    });
    labsetup.clickCancelOnNewSetup().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.clickDontSeeAnalyte().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.browseFileToUpload(fileMaxSize).then(function (uploaded) {
      expect(uploaded).toBe(true);
    });
    labsetup.VerifyErrorMaxFileSize().then(function (verified) {
      expect(verified).toBe(true);
    });
    analyte.verifySendInformationButtonDisabled().then(function (verifiedBtn) {
      expect(verifiedBtn).toBe(true);
    });
    labsetup.clickCancelOnNewSetup().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

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

  // //  Test case 127, 128, 129, 130, 131 & 132 are clubbed here due to feedback screen functionality of displaying only once in the setup
  it('Test Case 121: Verify that user is able to add Analyte on Add Analyte Page @P1', function () {
    log4jsconfig.log().info('Test Case 121: Verify that user is able to add Analyte on Add Analyte Page');
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
    analyte.selectAnalyteName(analyteName2).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit(unit2, '2').then(function (unitSelected) {
      expect(unitSelected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (cancelled) {
      expect(cancelled).toBe(true);
    });
  });

  it('Test case 134: Verify that the Connectivity icon is shown to the user after completing the Lab Setup', function () {
    // Need to add steps before this
    feedback.verifyConnectivityIconDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case 67:Verify that the user can follow steps for instrument creation for another department,'
    + ' by selecting it from left navigation', function () {
      const toDept = 'dept3';
      const createdName = jsonData.Instrument1Model2;
      const customName = jsonData.Instrument1CustomName2;
      labsetup.navigateTO(toDept).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.addInstrument(jsonData.Instrument1ManufacturerName2,
        jsonData.Instrument1Model2, jsonData.Instrument1CustomName2, jsonData.Instrument1SerialNo2).then(function (added) {
          expect(added).toBe(true);
        });
      labsetup.clickAddInstrumentsButton().then(function (click) {
        expect(click).toBe(true);
      });
      if (flagForIEBrowser === true) {
        labsetup.goToListOfDepartments().then(function (navigatedToDept) {
          expect(navigatedToDept).toBe(true);
        });
        labsetup.navigateTO(toDept).then(function (navigated) {
          expect(navigated).toBe(true);
        });
      }
      labsetup.verifyInstrumentControlAnalyteCreated(customName).then(function (cleared) {
        expect(cleared).toBe(true);
      });
      labsetup.verifyInsrumentNameDisplayedUnderneathCustomName(createdName).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  it('Test case 83: Verify that the user can follow steps for control creation for another instrument,'
    + ' by selecting it from left navigation ', function () {
      const depName = jsonData.Dept3Name;
      const instName = jsonData.Instrument1CustomName2;
      const controlName = jsonData.ControlName2;
      const lotNumber = jsonData.ControlLotNumber2;
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated1) {
        expect(navigated1).toBe(true);
      });
      control.clickOnFirstControlList().then(function (result) {
        expect(result).toBe(true);
      });
      control.selectControl(controlName).then(function (selected) {
        expect(selected).toBe(true);
      });
      control.clickOnFirstLotNumberList().then(function (result2) {
        expect(result2).toBe(true);
      });
      control.selectControlLotNumber(lotNumber).then(function (selected2) {
        expect(selected2).toBe(true);
      });
      control.enterDataControlName(jsonData.ControlCustomName2).then(function (selected3) {
        expect(selected3).toBe(true);
      });
      control.clickAddControlButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      labsetup.verifyInstrumentControlAnalyteCreated(jsonData.ControlCustomName2).then(function (created) {
        expect(created).toBe(true);
      });
      labsetup.verifyInsrumentControlNameDisplayedUnderneathCustomName(controlName).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  it('Test case 122  : Verify that Levels in use selected at the time of Analyte adding should match with '
    + 'levels in use on Multi Summary & Multi Point Data Entry Page  ', function () {
      // tslint:disable-next-line:no-shadowed-variable
      const unit = jsonData.Unit5;
      const analyteName3 = jsonData.AnalyteName5;
      const depName = jsonData.Dept3Name;
      const instName = jsonData.Instrument1CustomName2;
      const contName = jsonData.ControlCustomName2;
      const levels = jsonData.Level1;
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
      analyte.selectAnalyteName(analyteName3).then(function (selected) {
        expect(selected).toBe(true);
      });
      analyte.selectUnit(unit, '1').then(function (units) {
        expect(units).toBe(true);
      });
      analyte.clickAddAnalyteButton().then(function (cancelled) {
        expect(cancelled).toBe(true);
      });
      labsetup.navigateTO(depName).then(function (navigated2) {
        expect(navigated2).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated2) {
        expect(navigated2).toBe(true);
      });
      labsetup.navigateTO(contName).then(function (navigated2) {
        expect(navigated2).toBe(true);
      });
      labsetup.navigateTO(analyteName3).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      analyte.verifyNumberOfLevelDisplayed(levels).then(function (level) {
        expect(level).toBe(true);
      });
      analyte.clickEditThisAnalyteLink().then(function (editLvl) {
        expect(editLvl).toBe(true);
      });
      analyte.clickSummaryEntryToggle().then(function (toggle) {
        expect(toggle).toBe(true);
      });
      analyte.clickUpdateButton().then(function (update) {
        expect(update).toBe(true);
      });
      analyte.verifyNumberOfLevelDisplayedPoint(levels).then(function (level) {
        expect(level).toBe(true);
      });
    });

  it('Test case 123  : To verify that, the user is able to add multiple analytes.', function () {
    const unit = jsonData.Unit5;
    const analyteName6 = jsonData.AnalyteName6;
    const analyteName7 = jsonData.AnalyteName7;
    const depName = jsonData.Dept3Name;
    const instName = jsonData.Instrument1CustomName2;
    const contName = jsonData.ControlCustomName2;
    const levels = '2';
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickEditThisControlLink().then(function (edit) {
      expect(edit).toBe(true);
    });
    control.clickAddAnAnalyteLink().then(function (addAnalyteLink) {
      expect(addAnalyteLink).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.selectAnalyteName(analyteName6).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectAnalyteName(analyteName7).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (addclick) {
      expect(addclick).toBe(true);
    });
    if (flagForIEBrowser === true) {
      labsetup.goToListOfDepartments().then(function (navigatedToDept) {
        expect(navigatedToDept).toBe(true);
      });
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(contName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
    }
    labsetup.verifyInstrumentControlAnalyteCreated(analyteName6).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(analyteName7).then(function (analyte2) {
      expect(analyte2).toBe(true);
    });
  });

  it('Test case 124  : To verify that, the user can create analytes in another control.', function () {
    const analyteName8 = jsonData.AnalyteName8;
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1Model;
    const contName = jsonData.ControlName;
    const levels = '1';
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickEditThisControlLink().then(function (edit) {
      expect(edit).toBe(true);
    });
    control.clickAddAnAnalyteLink().then(function (addAnalyteLink) {
      expect(addAnalyteLink).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.selectAnalyteName(analyteName8).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit('g/L', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (addclick) {
      expect(addclick).toBe(true);
    });
    if (flagForIEBrowser === true) {
      labsetup.goToListOfDepartments().then(function (navigatedToDept) {
        expect(navigatedToDept).toBe(true);
      });
      labsetup.navigateTO(depName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(instName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(contName).then(function (navigated) {
        expect(navigated).toBe(true);
      });
    }
    labsetup.verifyInstrumentControlAnalyteCreated(analyteName8).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
  });

  it('Test case 125  : To verify that, the user can create analytes in control present in different instrument.', function () {
    const analyteName9 = jsonData.AnalyteName9;
    const depName = jsonData.Dept1Name;
    const instName = jsonData.Instrument1CustomName2;
    const contName = jsonData.ControlName5;
    const levels = '1';
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(contName).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber('34000').then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickAddControlButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.selectAnalyteName(analyteName9).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnit('%', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectLevelInUse(levels).then(function (checked) {
      expect(checked).toBe(true);
    });
    analyte.clickAddAnalyteButton().then(function (addclick) {
      expect(addclick).toBe(true);
    });
    if (flagForIEBrowser === true) {
      labsetup.goToListOfDepartments().then(function (navigatedToDept) {
        expect(navigatedToDept).toBe(true);
      });
    }
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(contName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.verifyInstrumentControlAnalyteCreated(analyteName9).then(function (analyte1) {
      expect(analyte1).toBe(true);
    });
  });

  it('Test case 135: Verify that the Departments in Left Navigation are alphabetically sorted.', function () {
    const depName = jsonData.Dept1Name;
    labsetup.clickLabName().then(function (labName) {
      expect(labName).toBe(true);
    });
    labsetup.clickAddADepartment().then(function (addDept) {
      expect(addDept).toBe(true);
    });
    labsetupDept.addFirstDepartmentName(jsonData.Dept11).then(function (dept1NameAdded) {
      expect(dept1NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.addThirdDeptName(jsonData.Dept12).then(function (dept3NameAdded) {
      expect(dept3NameAdded).toBe(true);
    });
    labsetupDept.verifySelectManagerUser().then(function (singleUser) {
      expect(singleUser).toBe(true);
    });
    labsetupDept.clickAddDepartmentsButton().then(function (addDeptClicked) {
      expect(addDeptClicked).toBe(true);
    });
    labsetup.verifyLeftNavigationListSorted().then(function (sorted) {
      expect(sorted).toBe(true);
    });
  });

  it('Test case 136: Verify that the Instruments in Left Navigation are alphabetically sorted   .', function () {
    const depName = jsonData.Dept1Name;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.clickAddAnInstrument().then(function (addInstru) {
      expect(addInstru).toBe(true);
    });
    labsetup.addInstrument(jsonData.Instrument2ManufacturerName, jsonData.Instrument2Model, '', '').then(function (added1) {
      expect(added1).toBe(true);
    });
    labsetup.addInstrument(jsonData.Instrument3ManufacturerName, jsonData.Instrument3Model, '', '').then(function (added1) {
      expect(added1).toBe(true);
    });
    labsetup.clickAddInstrumentsButton().then(function (click) {
      expect(click).toBe(true);
    });
    labsetup.verifyLeftNavigationListSorted().then(function (sorted) {
      expect(sorted).toBe(true);
    });
  });

  it('Test case 137: Verify that the Controls in Left Navigation are alphabetically sorted.', function () {
    const depName = jsonData.Dept1Name;
    const instrName = jsonData.Instrument1Model;
    const control1 = jsonData.Control5;
    const lot1 = jsonData.ControlLot5;
    const control2 = jsonData.Control6;
    const lot2 = jsonData.ControlLot6;
    labsetup.navigateTO(depName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(instrName).then(function (navigated1) {
      expect(navigated1).toBe(true);
    });
    labsetup.clickEditThisInstrument().then(function (clickEdit) {
      expect(clickEdit).toBe(true);
    });
    control.clickAddControlLink().then(function (addInstru) {
      expect(addInstru).toBe(true);
    });
    control.clickOnFirstControlList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControl(control1).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickOnFirstLotNumberList().then(function (result) {
      expect(result).toBe(true);
    });
    control.selectControlLotNumber(lot1).then(function (selected) {
      expect(selected).toBe(true);
    });
    control.clickAddControlButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.verifyLeftNavigationListSorted().then(function (sorted) {
      expect(sorted).toBe(true);
    });
  });

  // //  ---------------------- Welcome Page TCs -------------------------------
  // //   Below test cases has been marked as defered as Welcome page is not present on UI
  // // Test Case 1, 4 & 5 are clubbed here
  // it('Test case 4: Verify the Lab Setup Welcome Screen', function () {
  //   log4jsconfig.log().info('Test case 4: Verify the Lab Setup Welcome Screen');
  //   labsetup.verifyWelcomePage(jsonData.FirstName, jsonData.LastName).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  // });

  // it('Test case 2: Verify that the Lab User is presented with an error message if'
  //   + ' he logs into the application before the Lab Setup is completed', function () {
  //     out.signOut().then(function (loggedOut) {
  //       expect(loggedOut).toBe(true);
  //     });
  //     loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameUser,
  //       jsonData.PasswordUser, jsonData.FirstNameUser).then(function (loggedIn) {
  //         expect(loggedIn).toBe(true);
  //       });
  //     labsetup.verifyUserErrorMessage().then(function (verifiedError) {
  //       expect(verifiedError).toBe(true);
  //     });
  //   });

  // it('Test case 3: Verify that the Connectivity icon is not shown to the user before completing the Lab Setup', function () {
  //   labsetup.verifyConnectivityIconPresent().then(function (present) {
  //     expect(present).toBe(false);
  //   });
  // });

  // it('Test case 8: Verify that information is displayed on hovering on info (i) icon near Data entry options on Welcome Screen',
  //   function () {
  //     labsetup.verifyToolTipDataEntry().then(function (dataEntryToolTip) {
  //       expect(dataEntryToolTip).toBe(true);
  //     });
  //   });

  // // NO-Dept TC
  // it('Test case 10: Verify the action on selecting We do not have departments Radio Button On Welcome Screen', function () {
  //   log4jsconfig.log().info('Test case 10: Verify the action on selecting We do not have departments Radio Button On Welcome Screen');
  //   out.signOut();
  //   loginEvent.loginToApplication(jsonData.URL, jsonData.UsernameWithoutDept,
  //     jsonData.PasswordWithoutDept, jsonData.FirstNameWithoutDept).then(function (loggedIn) {
  //       expect(loggedIn).toBe(true);
  //     });
  //   labsetup.verifyNoDepartmentIsSelected().then(function (noSelected) {
  //     expect(noSelected).toBe(true);
  //   });
  //   labsetup.clickLetsGoButton().then(function (letsGoClicked) {
  //     expect(letsGoClicked).toBe(true);
  //   });
  //   labsetup.verifyInstPageHeader().then(function (instPageHeader) {
  //     expect(instPageHeader).toBe(true);
  //   });
  // });

  // it('Test case 11: Verify that information is displayed on hovering info (i)'
  // + ' icon near Grouped By Departments options on Welcome Screen',
  //   function () {
  //     labsetup.verifyToolTipDept().then(function (deptToolTip) {
  //       expect(deptToolTip).toBe(true);
  //     });
  //   });

  // it('Test case 14: Verify that information is displayed on hovering on info (i) icon near Give Permission text on Welcome Screen',
  //   function () {
  //     labsetup.verifyToolTipTrack().then(function (trackToolTip) {
  //       expect(trackToolTip).toBe(true);
  //     });
  //   });

  // it('Test case 19:Verify the Set Decimal Place field on Welcome Screen', function () {
  //   log4jsconfig.log().info('Test case 19:Verify the Set Decimal Place field on Welcome Screen');
  //   labsetup.verifyDecimalPlaceValue(2).then(function (defaultVal) {
  //     expect(defaultVal).toBe(true);
  //   });
  //   labsetup.clickDecimalPlacesDropDownArrow().then(function (dropdownClicked) {
  //     expect(dropdownClicked).toBe(true);
  //   });
  //   labsetup.verifyDecimalPlacesDropdownValues().then(function (valuesVerified) {
  //     expect(valuesVerified).toBe(true);
  //   });
  //   labsetup.selectFirstDecimalValue().then(function (selected) {
  //     expect(selected).toBe(true);
  //   });
  //   labsetup.verifyDecimalPlaceValue(0).then(function (valueVerified) {
  //     expect(valueVerified).toBe(true);
  //   });
  // });

  // // Test case 9: Verify the action on selecting Yes, by departments Radio Button On Welcome Screen covered in TC-20
  // it('Test case 20: Verify that user is able to save the basic information on Welcome Screen', function () {
  //   log4jsconfig.log().info('Test case 20: Verify that user is able to save the basic information on Welcome Screen');
  //   labsetup.verifySummaryIsSelected().then(function (pointEntrySelected) {
  //     expect(pointEntrySelected).toBe(true);
  //   });
  //   labsetup.verifyYesByDepartmentIsSelected().then(function (yesDeptSelected) {
  //     expect(yesDeptSelected).toBe(true);
  //   });
  //   labsetup.verifyYesTrackIsSelected().then(function (noTrackSelected) {
  //     expect(noTrackSelected).toBe(true);
  //   });
  //   labsetup.clickLetsGoButton().then(function (letsGoClicked) {
  //     expect(letsGoClicked).toBe(true);
  //   });
  //   labsetupDept.verifyDeptPageHeader(jsonData.LabName).then(function (deptPageHeader) {
  //     expect(deptPageHeader).toBe(true);
  //   });
  // });*/
});
