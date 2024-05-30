/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { ConnectivityNew } from '../page-objects/connectivity-new-e2e.po';
import { Connectivity } from '../page-objects/connectivity-mapping-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
const incorrectFormat = '../resources/IncorrectFileFormat.xls';
const validFile = '../resources/ValidFilePointCommaheader.txt';
const validMapFile = '../resources/FileSummaryTxt.txt';
const InstructionsName = 'Mapping-Instruction';
const fs = require('fs');
let jsonData;

fs.readFile('./JSON_data/Connectivity.json', (err, data) => {
  if (err) { throw err; }
  const connectivity = JSON.parse(data);
  jsonData = connectivity;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Connectivity', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const connect = new ConnectivityNew();
  const library = new BrowserLibrary();
  const connectivity = new Connectivity();
  const labsetup = new NewLabSetup();
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
      browser.sleep(10000);
    });
  });

  afterEach(function () {
    out.signOut();
  });
  it('Test case 1: Verify that clicking Connectivity Icon connectivity page should be displayed.', function () {
    library.logStep('Test case 1: Verify that clicking Connectivity Icon connectivity page should be displayed.');
    library.logStep('Test case 3: Verify Tool tip for connectivity icon.');
    library.logStep('Test case 4: To verify the UI of Connectivity of page');
    library.logStep('Test case 5: To Verify that by clicking close button, connectivity page is getting closed');
    library.logStep('Test case 134: To verify that tooltips are displayed for all elements on Connectivity page');
    connect.verifyConnectivityToolTip().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyConnectivityUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.closeConnectivityPopup().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  /**
   * Instructions are already created, Fileupload will be enabled
   */

  it('Test case 68: To verify that user should not be able navigate to File Upload page when no instructions defined.', function () {
    library.logStep('Test case 68: To verify that user should not be able navigate to File Upload page when no instructions defined.');
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyFileUploadTabDisabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
  xit('Test case 6: To Verify UI of Instructions Page', function () {
    library.logStep('Test case 6: To Verify UI of Instructions Page');
    library.logStep('Test case 7: Verify information icon on Instruction tab');
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.navigateToInstructions().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    connect.verifyInstructionsPageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test case 11: To Verify the UI of Add Instruction Name popup', function () {
    library.logStep('Test case 10: To Verify the functionality of Add New Instructions Button on Instructions page');
    library.logStep('Test case 11: To Verify the UI of Add Instruction Name popup');
    library.logStep('Test case 13: To verify the functionality of Close button on Instruction name popup');
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.navigateToInstructions().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    connect.clickOnAddInstructionsButton().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyAddInstructionNamePopupDisplayed().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyAddInstructionsPopupUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.clickCloseOnAddInstructionsName().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connect.verifyAddInstructionNamePopupDisplayed().then(function (verified) {
      expect(verified).toBe(false);
    });
  });
  it('Test case 16: To verify that user can not enter more than 50 characters as instruction name', function () {
    library.logStep('Test case 16: To verify that user can not enter more than 50 characters as instruction name');
    const instructionsName = jsonData.InstructionNameMaxChar;
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.navigateToInstructions().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    connect.clickOnAddInstructionsButton().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.addInstructionsName(instructionsName).then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyInstructionsMaxCharacters().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connect.clickCancelOnAddInstructionsName().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyAddInstructionNamePopupDisplayed().then(function (clicked) {
      expect(clicked).toBe(false);
    });
  });
  it('Test case 14: To verify the functionality of Add button on Instruction name popup', function () {
    library.logStep('Test case 14: To verify the functionality of Add button on Instruction name popup');
    library.logStep('Test case 17: To verify that user is navigated to Step 1 of Add Instructions page by adding valid Instruction name');
    library.logStep('Test case 18: To verify the UI Elements on Step 1 page of Instructions Setup');
    const instructionsName = jsonData.InstructionsName;
    const step1 = 'Step 1';
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.navigateToInstructions().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    connect.clickOnAddInstructionsButton().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.addInstructionsName(instructionsName).then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyAddNameButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connect.clickAddOnAddInstructionsName().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyPageDisplayed(step1).then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyStep1PageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
  });
  it('Test case 19: To verify that user should not be able to upload file with invalid format on Instructions Upload page', function () {
    library.logStep('Test case 19: To verify that user should not be able to upload file with invalid format on Instructions Upload page');
    const instructionsName = jsonData.InstructionsName;
    const error = jsonData.InvalidFileExtention;
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.navigateToInstructions().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    connect.clickOnAddInstructionsButton().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.addInstructionsName(instructionsName).then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.clickAddOnAddInstructionsName().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(incorrectFormat).then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.VerifyErrorInvalidFileExtention(error).then(function (verified) {
      expect(verified).toBe(true);
      connect.verifyNextStepButtonDisabled().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });
  });
  it('Test case 24: To verify that user is able to upload valid file by using browse button on Instructions page', function () {
    library.logStep('Test case 24: To verify that user is able to upload valid file by using browse button on Instructions page');
    library.logStep
      ('Test case 26: To verify that user is able to upload valid file with valid format & Size less than 6 MB on Instructions page');
    library.logStep
      ('Test case 28: To verify that user is navigated to Step 2 '
        + ' of Add Instructions page after uploading a valid instructions file & Clicking on Next Step Button');
    library.logStep('Test case 29: To verify the UI Elements on Step 2 page of Instructions Setup');
    const instructionsName = jsonData.InstructionsName;
    const step2 = 'Step 2';
    connect.navigateToConnectivity().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.navigateToInstructions().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    connect.clickOnAddInstructionsButton().then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.addInstructionsName(instructionsName).then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.clickAddOnAddInstructionsName().then(function (verified) {
      expect(verified).toBe(true);
    });
    library.browseFileToUpload(validFile).then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyNextStepButtonDisabled().then(function (clicked) {
      expect(clicked).toBe(false);
    });
    connect.clickNextStepButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connect.verifyPageDisplayed(step2).then(function (verified) {
      expect(verified).toBe(true);
    });
    connect.verifyStep2PageUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    it('Test case 30: To verify that user is able to select headers & footers with Yes & No Radio Buttons', function () {
      library.logStep('Test case 30: To verify that user is able to select headers & footers with Yes & No Radio Buttons');
      library.logStep('Test case 32: To verify that user is able to add valid values in Number of Rows Text boxes for header & footer');
      const instructionsName = jsonData.InstructionsName;
      const headerNo = 'No', footerNo = 'No';
      const headerYes = 'Yes', footerYes = 'Yes';
      const num = 1;
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToInstructions().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(instructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      // Case 1 - No No
      connect.selectHeaderFooter(headerNo, footerNo).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyHeaderNumberFieldDisabled().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyFooterNumberFieldDisabled().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(false);
      });
      // Case 2 - Yes No
      connect.selectHeaderFooter(headerYes, footerNo).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyHeaderNumberFieldDisabled().then(function (verified) {
        expect(verified).toBe(false);
      });
      connect.verifyFooterNumberFieldDisabled().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      connect.addRowsNumberInHeader(num).then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(false);
      });
      // Case 3 - No Yes
      connect.selectHeaderFooter(headerNo, footerYes).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyHeaderNumberFieldDisabled().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyFooterNumberFieldDisabled().then(function (verified) {
        expect(verified).toBe(false);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      connect.addRowsNumberInFooter(num).then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(false);
      });
      // Case 4 - Yes Yes
      connect.selectHeaderFooter(headerYes, footerYes).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyHeaderNumberFieldDisabled().then(function (verified) {
        expect(verified).toBe(false);
      });
      connect.verifyFooterNumberFieldDisabled().then(function (verified) {
        expect(verified).toBe(false);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      connect.addRowsNumberInHeader(num).then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      connect.addRowsNumberInFooter(num).then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(false);
      });
    });

    // Failig due to bug added for special characters
    it('Test case 31: To verify that user is not able to add invalid values in Number of Rows Text boxes for header & footer', function () {
      library.logStep('Test case 31: To verify that user is not able to add invalid values in Number of Rows Text boxes for header & footer');
      const instructionsName = jsonData.InstructionsName;
      const headerYes = 'Yes', footerYes = 'Yes';
      const negativeVal = -1;
      const zeroVal = 0;
      const moreThanTwoDigit = 123;
      const floatingVal = 1.2;
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToInstructions().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(instructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.selectHeaderFooter(headerYes, footerYes).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader(negativeVal).then(function (added) {
        expect(added).toBe(true);
      });
      connect.addRowsNumberInFooter(negativeVal).then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyHeaderError().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyFooterError().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      connect.addRowsNumberInHeader(zeroVal).then(function (added) {
        expect(added).toBe(true);
      });
      connect.addRowsNumberInFooter(zeroVal).then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyHeaderError().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyFooterError().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      connect.addRowsNumberInHeader(moreThanTwoDigit).then(function (added) {
        expect(added).toBe(true);
      });
      connect.addRowsNumberInFooter(moreThanTwoDigit).then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyHeaderError().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyFooterError().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyNextStepButtonDisabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
    });
    it('Test case 33: To verify that data from file is displayed as text on Step 2 on Instructions page', function () {
      library.logStep('Test case 33: To verify that data from file is displayed as text on Step 2 on Instructions page');
      library.logStep('Test case 34: To verify the functionality of Back button on Step 2 on Instructions page');
      const instructionsName = jsonData.InstructionsName;
      const headerYes = 'Yes', footerNo = 'No';
      const num = 1;
      const step1 = 'Step 1';
      const step2 = 'Step 2';
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToInstructions().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(instructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed(step2).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter(headerYes, footerNo).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader(num).then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyFileDataDisplayed().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      connect.verifyBackButtonEnabled().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickBackButton().then(function (added) {
        expect(added).toBe(true);
      });
      connect.verifyPageDisplayed(step1).then(function (verified) {
        expect(verified).toBe(true);
      });
    });
    it('Test case 58: To verify that Instruction is displayed under Instruction name dropdown On File Upload page', function () {
      library.logStep('Test case 58: To verify that Instruction is displayed under Instruction name dropdown On File Upload page');
      const instructionsName = jsonData.InstructionsName;
      const headerYes = 'Yes', footerNo = 'No';
      const num = 1;
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToInstructions().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.selectHeaderFooter(headerYes, footerNo).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader(num).then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.clickSummaryToggle().then(function (summaryToggleClicked) {
        expect(summaryToggleClicked).toBe(true);
      });
      connect.selectValueFromDropDown('Instrument').then(function (InstSelected) {
        expect(InstSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Lot').then(function (ProductLotSelected) {
        expect(ProductLotSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Level').then(function (ProductLevelSelected) {
        expect(ProductLevelSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Test').then(function (TestSelected) {
        expect(TestSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Date').then(function (DateSelected) {
        expect(DateSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Time').then(function (TimeSelected) {
        expect(TimeSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Find Formats').then(function (FormatSelected) {
        expect(FormatSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Value').then(function (MeanSelected) {
        expect(MeanSelected).toBe(true);
      });
      connect.clickCompleteButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToFileUploadTab().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectInstruction(instructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
    });
    it('Test case 60: To verify that user should not be able to upload file with invalid format on File Upload page', function () {
      library.logStep('Test case 60: To verify that user should not be able to upload file with invalid format on File Upload page');
      const error = jsonData.InvalidFileExtention;
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyFileUploadPageUI().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(incorrectFormat).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.VerifyErrorInvalidFileExtention(error).then(function (verified) {
        expect(verified).toBe(true);
        connect.verifyUploadButtonDisabled().then(function (clicked) {
          expect(clicked).toBe(true);
        });
      });
    });
    xit('Test case 69: To verify the functionality of Reset button on file Upload Page', function () {
      library.logStep('Test case 69: To verify the functionality of Reset button on file Upload Page');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToFileUploadTab().then(function (verified) {
        expect(verified).toBe(true);
      });

      /**
       * -- Functionality is not available
       */
      /*connect.verifyResetButtonDisabled().then(function (verified) {
        expect(verified).toBe(true);
      }); */
      /*library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyUploadButtonDisabled().then(function (clicked) {
        expect(clicked).toBe(false);
      });
      /**
       * -- Functionality is not available
       */
      /* connect.verifyResetButtonDisabled().then(function (verified) {
        expect(verified).toBe(false);
      });
      connect.clickResetButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyUploadButtonDisabled().then(function (clicked) {
        expect(clicked).toBe(true);
      }); */
    });
    it('Test case 64: To verify that user is able to upload valid file by using browse button on File Upload page', function () {
      library.logStep('Test case 64: To verify that user is able to upload valid file by using browse button on File Upload page');
      library.logStep
        ('Test case 66: To verify that user is able to upload valid file with valid format & Size less than 6 MB on File Upload page');
      library.logStep('Test case 67: To verify  that user is able to upload valid file with Header & Footer on File Upload Page');
      library.logStep('Test case 70: To verify that after clicking on Upload button, Map File & Status buttons should be displayed');
      const instructionsName = jsonData.InstructionsName;
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToFileUploadTab().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectInstruction(instructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyUploadButtonDisabled().then(function (clicked) {
        expect(clicked).toBe(false);
      });
      connect.clickUploadButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyMapFileButtonDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyStatusButtonDisplayed().then(function (verified) {
        expect(verified).toBe(true);
      });
    });
    /**
     * -- Not sure if Add Instruction functionality is working or not
     * Instrctions tab is not available
     */
    xit('Test case 9: Verify sequence of instruction added', function () {
      library.logStep('Test case 9: Verify sequence of instruction added');
      const instructionsName1 = jsonData.InstructionName;
      const instructionsName2 = jsonData.InstructionName2;
      const headerYes = 'Yes', footerNo = 'No';
      const num = 1;
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToInstructions().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(instructionsName2).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.selectHeaderFooter(headerYes, footerNo).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader(num).then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.clickSummaryToggle().then(function (summaryToggleClicked) {
        expect(summaryToggleClicked).toBe(true);
      });
      connect.selectValueFromDropDown('Instrument').then(function (InstSelected) {
        expect(InstSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Lot').then(function (ProductLotSelected) {
        expect(ProductLotSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Level').then(function (ProductLevelSelected) {
        expect(ProductLevelSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Test').then(function (TestSelected) {
        expect(TestSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Date').then(function (DateSelected) {
        expect(DateSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Time').then(function (TimeSelected) {
        expect(TimeSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Find Formats').then(function (FormatSelected) {
        expect(FormatSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Value').then(function (MeanSelected) {
        expect(MeanSelected).toBe(true);
      });
      connect.clickCompleteButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToInstructions().then(function (navigated) {
        expect(navigated).toBe(true);
      });
      connect.verifySequenceOfInstructions(instructionsName1, instructionsName2).then(function (verified) {
        expect(verified).toBe(true);
      });
    });
    /**
     * -- Not sure if Add Instruction functionality is working or not
     * Instrctions tab is not available
     */
    xit('Test case 8: Verify Delete instruction functionality', function () {
      library.logStep('Test case 8: Verify Delete instruction functionality');
      const instructionsName1 = jsonData.InstructionsName;
      const instructionsName2 = jsonData.InstructionName2;
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToInstructions().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyInstructionsNameDisplayed(instructionsName1).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnDeleteInstructionButton(instructionsName1).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyInstructionsNameDisplayed(instructionsName1).then(function (verified) {
        expect(verified).toBe(false);
      });
      connect.verifyInstructionsNameDisplayed(instructionsName2).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnDeleteInstructionButton(instructionsName2).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyInstructionsNameDisplayed(instructionsName2).then(function (verified) {
        expect(verified).toBe(false);
      });
    });
    /**
     * -- Not sure if Add Instruction functionality is working or not
     * Instrctions tab is not available
     */
    xit('Test case 35: To verify that user is navigated to Step 3 ' +
      ' of Add Instructions after selecting header & footer information & Clicking on Next Step Button', function () {
        library.logStep
          ('Test case 35: To verify that user is navigated to Step 3 ' +
            'of Add Instructions after selecting header & footer information & Clicking on Next Step Button');
        library.logStep('Test case 36: To verify the UI Elements on Step 3 page of Instructions Setup i.e. selecting delimiter');
        library.logStep('Test case 39: To verify that data from file is displayed as text on Step 3 on Instructions page');
        connect.navigateToConnectivity().then(function (verified) {
          expect(verified).toBe(true);
        });
        connect.clickOnAddInstructionsButton().then(function (verified) {
          expect(verified).toBe(true);
        });
        connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
          expect(verified).toBe(true);
        });
        connect.clickAddOnAddInstructionsName().then(function (verified) {
          expect(verified).toBe(true);
        });
        library.browseFileToUpload(validFile).then(function (verified) {
          expect(verified).toBe(true);
        });
        connect.clickNextStepButton().then(function (clicked) {
          expect(clicked).toBe(true);
        });
        connect.verifyPageDisplayed('Step 2').then(function (verified) {
          expect(verified).toBe(true);
        });
        connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
          expect(verified).toBe(true);
        });
        connect.addRowsNumberInHeader('1').then(function (added) {
          expect(added).toBe(true);
        });
        connect.clickStep2NextButton().then(function (nextClicked) {
          expect(nextClicked).toBe(true);
        });
        connect.verifyStep3UI().then(function (step3UIVerified) {
          expect(step3UIVerified).toBe(true);
        });
      });
    /**
     * -- Not sure if Add Instruction functionality is working or not
     * Instrctions tab is not available
     */
    xit('Test case 37: To verify that user is able to select delimiter from dropdown', function () {
      library.logStep('Test case 37: To verify that user is able to select delimiter from dropdown');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.verifyStep3NextButtonEnabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
    });

    /**
     * -- Not sure if Add Instruction functionality is working or not
     * Instrctions tab is not available
     */
    xit('Test case 38: To verify that selecting the delimiter which is not used in uploaded file.', function () {
      library.logStep('Test case 38: To verify that selecting the delimiter which is not used in uploaded file.');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Space').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.verifyStep3NextButtonEnabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectValueFromDropDown('Instrument').then(function (InstSelected) {
        expect(InstSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Lot').then(function (ProductLotSelected) {
        expect(ProductLotSelected).toBe(false);
        library.logStep('Unable to select a value from drop down as incorrect delimiter was selected in Step 3');
      });
    });
    it('Test case 40: To verify the functionality of Back button on Step 3 on Instructions page', function () {
      library.logStep('Test case 40: To verify the functionality of Back button on Step 3 on Instructions page');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.clickBackButton().then(function (backClicked) {
        expect(backClicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
    });

    it('Test case 41: To verify that user is navigated to Step 4 after selecting delimiter & Clicking on Next Step Button', function () {
      library.logStep
        ('Test case 41: To verify that user is navigated to Step 4 ' +
          'of Add Instructions after selecting delimiter & Clicking on Next Step Button');
      library.logStep('Test case 42: To verify the UI Elements on Step 4 page of Instructions Setup');
      library.logStep('Test case 43: To verify the fields displayed when enabling Summary toggle on Step 4');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.verifyStep4UI().then(function (UIVerified) {
        expect(UIVerified).toBe(true);
      });
    });

    it('Test case 44: To verify the fields displayed when disabling Summary toggle on Step 4', function () {
      library.logStep('Test case 44: To verify the fields displayed when disabling Summary toggle on Step 4');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.verifyStep4UI().then(function (UIVerified) {
        expect(UIVerified).toBe(true);
      });
      connect.clickSummaryToggle().then(function (toggleClicked) {
        expect(toggleClicked).toBe(true);
      });
      connect.verifyStep4UIPointData().then(function (pointDataUI) {
        expect(pointDataUI).toBe(true);
      });
    });

    // Use Summary Data File
    it('Test case 45: To verify that user is able to select Instrument code in Instrument code DDL from uploaded file', function () {
      library.logStep('Test case 45: To verify that user is able to select Instrument code in Instrument code DDL from uploaded file');
      library.logStep('Test case 46: To verify that user is able to select Product Lot code in Product Lot & Level DDL from uploaded file');
      library.logStep('Test case 47: To verify that user is able to select Test code in Test code DDL from uploaded file');
      library.logStep('Test case 48: To verify that user is able to select Date in Date/Time Resulted DDL from uploaded file');
      library.logStep('Test case 49: To verify that user is able to select Date & Time formats as per file uploaded');
      library.logStep
        ('Test case 51: To verify that user is able to Mean, SD & Points in Mean, SD, Points DDL when Summary toggle is enabled on Step 4');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.verifyStep4UI().then(function (pointDataUI) {
        expect(pointDataUI).toBe(true);
      });
      connect.selectValueFromDropDown('Instrument').then(function (InstSelected) {
        expect(InstSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Lot').then(function (ProductLotSelected) {
        expect(ProductLotSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Level').then(function (ProductLevelSelected) {
        expect(ProductLevelSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Test').then(function (TestSelected) {
        expect(TestSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Date').then(function (DateSelected) {
        expect(DateSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Time').then(function (TimeSelected) {
        expect(TimeSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Find Formats').then(function (FormatSelected) {
        expect(FormatSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Mean').then(function (MeanSelected) {
        expect(MeanSelected).toBe(true);
      });
      connect.selectValueFromDropDown('SD').then(function (SDSelected) {
        expect(SDSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Points').then(function (PointsSelected) {
        expect(PointsSelected).toBe(true);
      });
    });

    it('Test case 50: To verify that user is able to select Value in Value DDL when Summary toggle is disabled on Step 4', function () {
      library.logStep('Test case 50: To verify that user is able to select Value in Value DDL when Summary toggle is disabled on Step 4');
      library.logStep('Test case 53: To verify the Reset Button Enabled & Disabled on Step 4');
      library.logStep('Test case 52: To verify that user will not be able to proceed further if one of required field is not selected');
      library.logStep('Test case 56: To verify the Complete Button Enabled & Disabled on Step 4');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.clickSummaryToggle().then(function (summaryToggleClicked) {
        expect(summaryToggleClicked).toBe(true);
      });
      connect.verifyStep4UIPointData().then(function (pointDataUI) {
        expect(pointDataUI).toBe(true);
      });
      connect.selectValueFromDropDown('Instrument').then(function (InstSelected) {
        expect(InstSelected).toBe(true);
      });
      connect.verifyResetButtonEnabled().then(function (resetEnabled) {
        expect(resetEnabled).toBe(true);
      });
      connect.selectValueFromDropDown('Product Lot').then(function (ProductLotSelected) {
        expect(ProductLotSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Level').then(function (ProductLevelSelected) {
        expect(ProductLevelSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Test').then(function (TestSelected) {
        expect(TestSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Date').then(function (DateSelected) {
        expect(DateSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Time').then(function (TimeSelected) {
        expect(TimeSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Find Formats').then(function (FormatSelected) {
        expect(FormatSelected).toBe(true);
      });
      connect.verifyCompleteButtonDisabled().then(function (submitDisabled) {
        expect(submitDisabled).toBe(true);
      });
      connect.selectValueFromDropDown('Value').then(function (MeanSelected) {
        expect(MeanSelected).toBe(true);
      });
      connect.verifyCompleteButtonEnabled().then(function (submitEnabled) {
        expect(submitEnabled).toBe(true);
      });
    });

    it('Test case 54: To verify the Reset Button functionality on Step 4', function () {
      library.logStep('Test case 54: To verify the Reset Button functionality on Step 4');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.clickSummaryToggle().then(function (summaryToggleClicked) {
        expect(summaryToggleClicked).toBe(true);
      });
      connect.selectValueFromDropDown('Instrument').then(function (InstSelected) {
        expect(InstSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Lot').then(function (ProductLotSelected) {
        expect(ProductLotSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Level').then(function (ProductLevelSelected) {
        expect(ProductLevelSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Test').then(function (TestSelected) {
        expect(TestSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Date').then(function (DateSelected) {
        expect(DateSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Time').then(function (TimeSelected) {
        expect(TimeSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Find Formats').then(function (FormatSelected) {
        expect(FormatSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Value').then(function (MeanSelected) {
        expect(MeanSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Reagent').then(function (ReagentSelected) {
        expect(ReagentSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Calibrator').then(function (CalibratorSelected) {
        expect(CalibratorSelected).toBe(true);
      });
      connect.clickResetButton().then(function (resetClicked) {
        expect(resetClicked).toBe(true);
      });
      connect.verifySummaryValuesReset('Point').then(function (valuesReset) {
        expect(valuesReset).toBe(true);
      });
      connect.verifyResetButtonDisabled().then(function (resetDisabled) {
        expect(resetDisabled).toBe(true);
      });
      connect.verifyCompleteButtonDisabled().then(function (submitDisabled) {
        expect(submitDisabled).toBe(true);
      });
    });

    it('Test case 55: To verify the functionality of Back button on Step 4 on Instructions page', function () {
      library.logStep('Test case 55: To verify the functionality of Back button on Step 4 on Instructions page');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.verifyStep4UI().then(function (UIVerified) {
        expect(UIVerified).toBe(true);
      });
      connect.clickBackButton().then(function (backClicked) {
        expect(backClicked).toBe(true);
      });
      connect.verifyStep3UI().then(function (step3UIVerified) {
        expect(step3UIVerified).toBe(true);
      });
    });

    it('Test case 57: To verify the functionality of Complete Button on Step 4', function () {
      library.logStep('Test case 57: To verify the functionality of Complete Button on Step 4');
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(jsonData.InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyPageDisplayed('Step 2').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectHeaderFooter('Yes', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addRowsNumberInHeader('1').then(function (added) {
        expect(added).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.clickSummaryToggle().then(function (summaryToggleClicked) {
        expect(summaryToggleClicked).toBe(true);
      });
      connect.selectValueFromDropDown('Instrument').then(function (InstSelected) {
        expect(InstSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Lot').then(function (ProductLotSelected) {
        expect(ProductLotSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Level').then(function (ProductLevelSelected) {
        expect(ProductLevelSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Test').then(function (TestSelected) {
        expect(TestSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Date').then(function (DateSelected) {
        expect(DateSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Time').then(function (TimeSelected) {
        expect(TimeSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Find Formats').then(function (FormatSelected) {
        expect(FormatSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Value').then(function (MeanSelected) {
        expect(MeanSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Reagent').then(function (ReagentSelected) {
        expect(ReagentSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Calibrator').then(function (CalibratorSelected) {
        expect(CalibratorSelected).toBe(true);
      });
      connect.clickCompleteButton().then(function (completeClicked) {
        expect(completeClicked).toBe(true);
      });
      connect.verifyInstructionsNameDisplayed(jsonData.InstructionsName).then(function (instructionDisplayed) {
        expect(instructionDisplayed).toBe(true);
      });
    });

    it('Test case 71: To verify that on clicking Map File Button, User should be navigated to Mapping Page', function () {
      library.logStep('Test case 71: To verify that on clicking Map File Button, User should be navigated to Mapping Page');
      connect.clickFileUpload().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickUploadButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyMappingPage().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

    it('Test case 73: To verify that after uploading file, file status should get displayed on Status Page', function () {
      library.logStep('Test case 73: To verify that after uploading file, file status should get displayed on Status Page');
      connect.clickFileUpload().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickUploadButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyFileUploadStatus().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

    it('Test case 74: To verify the UI of Status Page', function () {
      library.logStep('Test case 72: To verify that on clicking Status Button, User should be navigated to Status Page');
      library.logStep('Test case 74: To verify the UI of Status Page');
      connect.clickFileUpload().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickUploadButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyStatusPage().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.verifyStatusPageUI().then(function (verified) {
        expect(verified).toBe(true);
      });
    });

    it('Test case 75: Verify that file name is displayed under Original File name', function () {
      library.logStep('Test case 75: Verify that file name is displayed under Original File name');
      library.logStep('Test case 76: To verify that User name is displayed under User name');
      library.logStep('Test case 77: Verify that Time uploaded of file is displayed under Time uploaded column');
      library.logStep('Test case 78: Verify that the file status is displayed under Status');
      library.logStep('Test case 79: To verify that status when file is uploaded');
      connect.clickFileUpload().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.browseFileToUpload(validFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickUploadButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyFileNameUploaded(jsonData.FirstName, jsonData.FileUploaded).then(function (verified) {
        expect(verified).toBe(true);
      });
    });

    it('Pre-requisite for mapping Instrument, Product and Test.', function () {
      connect.navigateToConnectivity().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.navigateToInstructions().then(function (navigate) {
        expect(navigate).toBe(true);
      });
      connect.clickOnAddInstructionsButton().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.addInstructionsName(InstructionsName).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickAddOnAddInstructionsName().then(function (verified) {
        expect(verified).toBe(true);
      });
      library.browseFileToUpload(validMapFile).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickNextStepButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.selectHeaderFooter('No', 'No').then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickStep2NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectDelimiter('Comma').then(function (delimiterSelected) {
        expect(delimiterSelected).toBe(true);
      });
      connect.clickStep3NextButton().then(function (nextClicked) {
        expect(nextClicked).toBe(true);
      });
      connect.selectValueFromDropDown('Instrument').then(function (InstSelected) {
        expect(InstSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Lot').then(function (ProductLotSelected) {
        expect(ProductLotSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Test').then(function (TestSelected) {
        expect(TestSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Product Level').then(function (ProductLevelSelected) {
        expect(ProductLevelSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Mean').then(function (MeanSelected) {
        expect(MeanSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Points').then(function (PointsSelected) {
        expect(PointsSelected).toBe(true);
      });
      connect.selectValueFromDropDown('SD').then(function (SDSelected) {
        expect(SDSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Date').then(function (DateSelected) {
        expect(DateSelected).toBe(true);
      });
      connect.selectValueFromDropDown('Find Formats').then(function (FormatSelected) {
        expect(FormatSelected).toBe(true);
      });
      connect.clickCompleteButton().then(function (completeClick) {
        expect(completeClick).toBe(true);
      });
      connectivity.clickFileUploadTab().then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.selectInstruction(InstructionsName).then(function (selected) {
        expect(selected).toBe(true);
      });
      labsetup.browseFileToUpload(validMapFile).then(function (browse) {
        expect(browse).toBe(true);
      });
      connect.clickUploadButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connectivity.waitForFileUpload().then(function (wait) {
        expect(wait).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });

    it('Test Case 83:To verify Instrument mapping and other functionalities on instrument map page', function () {
      library.logStep('Test Case 84: To verify the Department dropdown on Instrument/Product/Test mapping pages');
      library.logStep('Test Case 85: To verify the Instrument dropdown on Instrument/Product/Test mapping pages');
      library.logStep('Test Case 87: To verify the action on clicking to Instruments on Left Navigation Menu');
      library.logStep('Test Case 90: To verify the functionality of Reset button on Instrument/Product/Test pages');
      library.logStep('Test Case 92: To verify that user is able to map the Instruments with Instruments codes');
      library.logStep('Test Case 93: To verify the Link button displayed on footer while mapping instrument');
      library.logStep('Test Case 94: To verify the Message displayed on footer while mapping instrument');
      library.logStep('Test Case 95: To verify that on already linked instrument cards, Unlink is displayed after hovering');
      library.logStep
        ('Test Case 97: To verify that Number of unlinked products under instrument are matching on Left hand navigation & Instrument Card');
      library.logStep
        ('Test Case 98: To verify that clicking on Number of unmapped Product on instrument card will navigate user to Product Mapping Page');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connectivity.applyDepartmentFilter(jsonData.Department1).then(function (filter) {
        expect(filter).toBe(true);
      });
      connectivity.verifyFilterAppliedInstrument(jsonData.Dept1Instr1, jsonData.Dept1Instr2,
        jsonData.Dept1Instr1, jsonData.Dept1Instr2).then(function (cards) {
          expect(cards).toBe(true);
        });
      connectivity.clickResetButton().then(function (resetClicked) {
        expect(resetClicked).toBe(true);
      });
      connectivity.verifyFilterReset('Department').then(function (reset) {
        expect(reset).toBe(true);
      });
      connectivity.verifyCardDisplayed(jsonData.Dept2Instr1).then(function (reset) {
        expect(reset).toBe(true);
      });
      connectivity.applyDepartmentFilter(jsonData.Department1).then(function (filter) {
        expect(filter).toBe(true);
      });
      connectivity.applyInstrumentFilter(jsonData.Dept1Instr1).then(function (applied) {
        expect(applied).toBe(true);
      });
      connectivity.verifyCardDisplayed(jsonData.Dept1Instr1).then(function (cardDisplayed) {
        expect(cardDisplayed).toBe(true);
      });
      connectivity.clickResetButton().then(function (resetClicked) {
        expect(resetClicked).toBe(true);
      });
      connectivity.verifyFilterReset('Instrument').then(function (reset) {
        expect(reset).toBe(true);
      });
      connectivity.verifyCardDisplayed(jsonData.Dept2Instr1).then(function (cardDisp) {
        expect(cardDisp).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.InstCodeToMap, jsonData.Dept1Instr1, 'Instrument').then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connectivity.VerifyCodeLinkFooterUI(jsonData.InstrumentLinkMsg1).then(function (reset) {
        expect(reset).toBe(true);
      });
      connectivity.clickLinkButton().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
      connectivity.verifyCodeLinked(jsonData.InstrumentCode, jsonData.Dept1Instr1, '1', 'Instrument').then(function (mapped) {
        expect(mapped).toBe(true);
      });
      connectivity.verifyUnmappedCountLeftNavigation('PRODUCTS', '1', 'Instrument').then(function (countVerified) {
        expect(countVerified).toBe(true);
      });
      connectivity.verifyUnlinkDisplayed(jsonData.InstrumentCode).then(function (unlinkDisplayed) {
        expect(unlinkDisplayed).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });

    it('Test Case 88:To verify Product mapping and other functionalities on product map page', function () {
      library.logStep('Test Case 84: To verify the Department dropdown on Instrument/Product/Test mapping pages');
      library.logStep('Test Case 85: To verify the Instrument dropdown on Instrument/Product/Test mapping pages');
      library.logStep('Test Case 88:To verify the action on clicking to Products on Left Navigation Menu');
      library.logStep('Test Case 100: To verify that user is able to map the Controls with control codes');
      library.logStep('Test Case 101: To verify the Link button displayed on footer');
      library.logStep('Test Case 102: To verify the Message displayed on footer while mapping control');
      library.logStep('Test Case 103: To verify that on already linked control cards, Unlink is displayed after hovering');
      library.logStep
        ('Test Case 105: To verify that Number of unlinked tests under product are matching on Left hand navigation & product Card');
      library.logStep
        ('Test Case 106: To verify that clicking on Number of unmapped Test on product card will navigate user to Test Mapping Page');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connectivity.clickLeftNavigationProduct().then(function (prod1) {
        expect(prod1).toBe(true);
      });
      connectivity.clickLeftNavigationProduct().then(function (prod2) {
        expect(prod2).toBe(true);
      });
      connectivity.verifyProductUnmappedCountDisplayed('1', jsonData.Dept1Instr1).then(function (count) {
        expect(count).toBe(true);
      });
      connectivity.clickUnmappedCount('1', jsonData.Dept1Instr1).then(function (unmappedCountClicked) {
        expect(unmappedCountClicked).toBe(true);
      });
      connectivity.verifyLocationDepartmentInstrumentDisplayed(jsonData.Location, jsonData.Department1,
        jsonData.Dept1Instr1).then(function (correctValueDisplayed) {
          expect(correctValueDisplayed).toBe(true);
        });
      connectivity.verifyCardDisplayed(jsonData.Dept1Instr1Prod1).then(function (card1) {
        expect(card1).toBe(true);
      });
      connectivity.verifyCardDisplayed(jsonData.Dept1Instr1Prod2).then(function (card2) {
        expect(card2).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.ProductCodeToMap, jsonData.Dept1Instr1Prod1, 'Product').then(function (mapCodes) {
        expect(mapCodes).toBe(true);
      });
      connectivity.VerifyCodeLinkFooterUI(jsonData.ProductLinkMsg1).then(function (reset) {
        expect(reset).toBe(true);
      });
      connectivity.clickLinkButton().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
      connectivity.verifyCodeLinked(jsonData.ProductCode, jsonData.Dept1Instr1Prod1, '1', 'Product').then(function (mapped) {
        expect(mapped).toBe(true);
      });
      connectivity.verifyUnmappedCountLeftNavigation('TESTS', '1', 'Product').then(function (countVerified) {
        expect(countVerified).toBe(true);
      });
      connectivity.verifyUnlinkDisplayed(jsonData.ProductCode).then(function (unlinkDisplayed) {
        expect(unlinkDisplayed).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });

    it('Test Case 89:To verify Test mapping and other functionalities on test map page', function () {
      library.logStep('Test Case 84: To verify the Department dropdown on Instrument/Product/Test mapping pages');
      library.logStep('Test Case 85: To verify the Instrument dropdown on Instrument/Product/Test mapping pages');
      library.logStep('Test Case 89:To verify the action on clicking to Tests on Left Navigation Menu');
      library.logStep('Test Case 108: To verify that user is able to map the Test with Test codes');
      library.logStep('Test Case 109: To verify the Link button displayed on footer while mapping Test');
      library.logStep('Test Case 110: To verify the Message displayed on footer while mapping Test');
      library.logStep('Test Case 111: To verify that on already linked Test cards, Unlink is displayed after hovering');
      library.logStep('Test Case 112: To verify user is able to unlink the Test mapping By clicking on unlink');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connectivity.clickLeftNavigationTest().then(function (test1) {
        expect(test1).toBe(true);
      });
      connectivity.clickLeftNavigationTest().then(function (test2) {
        expect(test2).toBe(true);
      });
      connectivity.verifyTestUnmappedCountDisplayed('1', jsonData.Dept1Instr1Prod1).then(function (count) {
        expect(count).toBe(true);
      });
      connectivity.clickUnmappedCount('1', jsonData.Dept1Instr1Prod1).then(function (unmappedCountClicked) {
        expect(unmappedCountClicked).toBe(true);
      });
      connectivity.verifyLocationDepartmentInstrumentDisplayed(jsonData.Location, jsonData.Department1,
        jsonData.Dept1Instr1).then(function (correctValueDisplayed) {
          expect(correctValueDisplayed).toBe(true);
        });
      connectivity.verifyCardDisplayed(jsonData.Dept1Instr1Prod1Test1).then(function (card1) {
        expect(card1).toBe(true);
      });
      connectivity.verifyCardDisplayed(jsonData.Dept1Instr1Prod1Test2).then(function (card2) {
        expect(card2).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.TestCode, jsonData.Dept1Instr1Prod1Test1, 'Test').then(function (mapCodes) {
        expect(mapCodes).toBe(true);
      });
      connectivity.VerifyCodeLinkFooterUI(jsonData.TestLinkMsg1).then(function (reset) {
        expect(reset).toBe(true);
      });
      connectivity.clickLinkButton().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
      connectivity.verifyCodeLinked(jsonData.TestCode, jsonData.Dept1Instr1Prod1Test1, '1', 'Test').then(function (mapped) {
        expect(mapped).toBe(true);
      });
      connectivity.verifyUnmappedCountLeftNavigation('TESTS', '0', 'Test').then(function (countVerified) {
        expect(countVerified).toBe(true);
      });
      connectivity.verifyUnlinkDisplayed(jsonData.TestCode).then(function (unlinkDisplayed) {
        expect(unlinkDisplayed).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });

    it('Test Case 82: To verify the UI of Mapping Page', function () {
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connectivity.verifyMappingPageInstrumentUI().then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.clickLeftNavigationProduct().then(function (prod) {
        expect(prod).toBe(true);
      });
      connectivity.verifyMappingPageProductUI().then(function (verified1) {
        expect(verified1).toBe(true);
      });
      connectivity.clickLeftNavigationTest().then(function (prod) {
        expect(prod).toBe(true);
      });
      connectivity.verifyMappingPageTestUI().then(function (verified1) {
        expect(verified1).toBe(true);
      });
    });

    it('Test Case 90:To verify unlink Test, Product and Instrument on mapping page.', function () {
      library.logStep('Test Case 96: To verify user is able to unlink the instrument mapping By clicking on unlink');
      library.logStep('Test Case 104: To verify user is able to unlink the product mapping By clicking on unlink');
      library.logStep('Test Case 112: To verify user is able to unlink the Test mapping By clicking on unlink');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connectivity.clickLeftNavigationTest().then(function (test1) {
        expect(test1).toBe(true);
      });
      connectivity.verifyUnlinkDisplayed(jsonData.TestCode).then(function (unlinkDisplayed) {
        expect(unlinkDisplayed).toBe(true);
      });
      connectivity.clickAndVerifyCardUnlink(jsonData.TestCode).then(function (unlinked) {
        expect(unlinked).toBe(true);
      });
      connectivity.clickLeftNavigationProduct().then(function (prod) {
        expect(prod).toBe(true);
      });
      connectivity.verifyUnlinkDisplayed(jsonData.ProductCode).then(function (unlinkDisplayed) {
        expect(unlinkDisplayed).toBe(true);
      });
      connectivity.clickAndVerifyCardUnlink(jsonData.ProductCode).then(function (unlinked) {
        expect(unlinked).toBe(true);
      });
      connectivity.clickLeftNavigationInstrument().then(function (instr) {
        expect(instr).toBe(true);
      });
      connectivity.verifyUnlinkDisplayed(jsonData.InstrumentCode).then(function (unlinkDisplayed) {
        expect(unlinkDisplayed).toBe(true);
      });
      connectivity.clickAndVerifyCardUnlink(jsonData.InstrumentCode).then(function (unlinked) {
        expect(unlinked).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });

    it('Test case 91:To verify Instrument Cards UI', function () {
      library.logStep('Test case 91:To verify Instrument Cards UI');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connectivity.applyDepartmentFilter(jsonData.DepartmentNew1).then(function (filter) {
        expect(filter).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.InstCodeToMap1, jsonData.Dept1Instr11, 'Instrument').then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connectivity.applyDepartmentFilter(jsonData.DepartmentNew1).then(function (filter) {
        expect(filter).toBe(true);
      });
      connect.verifyInstrumentCardUI(jsonData.InstrumentNameOnCard, jsonData.LinkedCode).then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });
    it('Test case 99:To verify Control Cards UI', function () {
      library.logStep('Test case 99:To verify Control Cards UI');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connect.clickProducts().then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.ProdCodeToMap1, jsonData.Dept1Prod11, 'Product').then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connect.verifyControlCardUI(jsonData.controlNameOnCard1, jsonData.ControlLinkedCode1, jsonData.COntrolLotNo1).then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });
    it('Test case 107:To verify Test Cards UI', function () {
      library.logStep('Test case 107:To verify Test Cards UI');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connect.clickTests().then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.TestCodeToMap1, jsonData.Dept1Test11, 'Test').then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connect.selectCaliberator(jsonData.Reagent, jsonData.Reagent).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickLinkBtnonPopUp().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connect.verifyTestsCardUI(jsonData.TestNameOnCard1, jsonData.TestCodeToMap1).then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });
    it('Test case 113:To verify that after linking Test, user is navigated to Reagent Calibrator mapping popup', function () {
      library.logStep('Test case 113:To verify that after linking Test, user is navigated to Reagent Calibrator mapping popup');
      library.logStep('Test case 114: To verify that tooltips are displayed for all elements on Connectivity page');
      library.logStep('Test case 115: To verify that tooltips are displayed for all elements on Connectivity page');
      library.logStep('Test case 116: To verify that tooltips are displayed for all elements on Connectivity page');
      library.logStep('Test case 117: To verify that tooltips are displayed for all elements on Connectivity page');
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      connectivity.clickMappingTab().then(function (mappingTab) {
        expect(mappingTab).toBe(true);
      });
      connectivity.applyDepartmentFilter(jsonData.DeptReage).then(function (filter) {
        expect(filter).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.InstCodeReage, jsonData.Dept1InstrReage, 'Instrument').then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connect.clickProducts().then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.applyProdDepartmentFilter(jsonData.DeptReage).then(function (filter) {
        expect(filter).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.ProdCodeReage, jsonData.Dept1ProdReage, 'Product').then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connect.clickTests().then(function (verified) {
        expect(verified).toBe(true);
      });
      connectivity.applyTestDepartmentFilter(jsonData.DeptReage).then(function (filter) {
        expect(filter).toBe(true);
      });
      connectivity.mapCodesToCards(jsonData.TestCodeReage, jsonData.Dept1TestReage, 'Test').then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connectivity.clickLinkButton().then(function (mapInstrumentCodes) {
        expect(mapInstrumentCodes).toBe(true);
      });
      connect.verifyReagentCaliberatorPopUp().then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.selectCaliberator(jsonData.Reagent, jsonData.Caliberator).then(function (verified) {
        expect(verified).toBe(true);
      });
      connect.clickLinkBtnonPopUp().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      connectivity.closeMapping().then(function (windowclosed) {
        expect(windowclosed).toBe(true);
      });
    });
    it('Test case 135:To verify that a Lab User is able to navigate to Connectivity by clicking on Connectivity Icon', function () {
      library.logStep('Test case 135:To verify that a Lab User is able to navigate to Connectivity by clicking on Connectivity Icon');
      out.signOut();
      loginEvent.loginToApplication(jsonData.URL, jsonData.Username1, jsonData.Password1, jsonData.FirstName1).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
      connect.clickConnectivityLogo().then(function (verified) {
        expect(verified).toBe(true);
      });
    });
  });
});
