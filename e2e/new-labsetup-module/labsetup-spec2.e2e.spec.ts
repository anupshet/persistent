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

library.parseJson('./JSON_data/NewLabSetupAddInstrument.json').then(function(data) {
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

  // Failing on IE due to defect - 170459
  // TC 61, 62 covered here
  // it('Test Case 54: Verify that a modal to setup new instrument will be displayed by clicking on Dont see your Instrument? Link',
  //   function () {
  //     library.logStep('Test Case 54: Verify that a modal to setup new instrument will be displayed by clicking on Dont'
  //       + ' see your Instrument? Link');
  //     library.logStep('Test Case 55: Verify the UI Components on Modal to setup the new instrument');
  //     library.logStep('Test Case 56: Verify the Header & Sub Header on Modal to setup the new instrument');
  //     library.logStep('Test Case 57: Verify the action on clicking the browse for a file link on Modal to setup the new instrument');
  //     const depName = jsonData.Dept1Name;
  //     labsetup.navigateTO(depName).then(function (navigated) {
  //       expect(navigated).toBe(true);
  //     });
  //     labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
  //       expect(clicked).toBe(true);
  //     });
  //     labsetup.verifyHeaderSubHeaderText().then(function (verified) {
  //       expect(verified).toBe(true);
  //     });
  //     labsetup.verifySetupNewInstrumentUI().then(function (setup) {
  //       expect(setup).toBe(true);
  //     });
  //     labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
  //       expect(uploaded).toBe(true);
  //     });
  //     labsetup.verifyFileisAddedToUpload().then(function (verified) {
  //       expect(verified).toBe(true);
  //     });
  //     analyte.verifySendInformationButtonEnabled().then(function (verifiedBtn) {
  //       expect(verifiedBtn).toBe(true);
  //     });
  //     labsetup.clickCancelOnNewSetup().then(function (clicked) {
  //       expect(clicked).toBe(true);
  //     });
  //   });


  // it('Test Case 138  : Verify the action on clicking the browse for a all the valid files  to setup the new instrument.', function () {
  //   const depName = jsonData.Dept1Name;
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
  //   labsetup.verifyAllValidFileUpload(validFiles).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  // });

  // it('Test Case 58: Verify the action on dropping the file on Modal to setup the new instrument', function () {
  //   library.logStep('Test Case 58: Verify the action on dropping the file on Modal to setup the new instrument');
  //   library.logStep('Test Case 59: Verify that invalid instrument file will not get uploaded in the system');
  //   const depName = jsonData.Dept1Name;
  //   labsetup.navigateTO(depName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.browseFileToUpload(fileToUpload).then(function (uploaded) {
  //     expect(uploaded).toBe(true);
  //   });
  //   labsetup.verifyFileisAddedToUpload().then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   labsetup.clickCancelOnNewSetup().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.browseFileToUpload(invaliFileWExt).then(function (uploaded) {
  //     expect(uploaded).toBe(true);
  //   });
  //   labsetup.VerifyErrorInvalidFileExtention().then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   labsetup.clickCancelOnNewSetup().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  // });

  // it('Test Case 60: Verify that more than 8MB size of instrument files will not get uploaded in the system', function () {
  //   library.logStep('Test Case 60: Verify that more than 8MB size of instrument files will not get uploaded in the system');
  //   library.logStep('Test Case 63: Verify that Clicking on Cancel Button will close the  setup new Instrument modal');
  //   library.logStep('Test Case 64: Verify that Clicking on Close Button will close the  setup new Instrument modal');
  //   const depName = jsonData.Dept1Name;
  //   labsetup.navigateTO(depName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.browseFileToUpload(fileMaxSize).then(function (uploaded) {
  //     expect(uploaded).toBe(true);
  //   });
  //   labsetup.VerifyErrorMaxFileSize().then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   labsetup.clickCancelOnNewSetup().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.clickCancelOnNewSetup().then(function (cancel) {
  //     expect(cancel).toBe(true);
  //   });
  //   analyte.verifyCancelCloseButtonClicked().then(function (cancelclicked) {
  //     expect(cancelclicked).toBe(true);
  //   });
  //   labsetup.clickOnDontSeeYourInstrument().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   labsetup.clickCloseOnNewInstrumentSetup().then(function (close) {
  //     expect(close).toBe(true);
  //   });
  //   analyte.verifyCancelCloseButtonClicked().then(function (cancelclicked) {
  //     expect(cancelclicked).toBe(true);
  //   });
  // });

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

  it('Test Case 66: Verify that Instrument can be added on Add Instrument Page ', function () {
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


});
