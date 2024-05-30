/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { MultiEntryPoint } from '../page-objects/multi-entry-point.po';
import { settings } from 'cluster';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/MultiPoint_Pagination.json').then(function(data) {
  jsonData = data;
});


describe('Multi Point Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dashboard = new Dashboard();
  const newLabSetup = new NewLabSetup();
  const multiPoint = new MultiPointDataEntryInstrument();
  const library = new BrowserLibrary();
  const pointData = new PointDataEntry();
  const setting = new Settings();
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
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 21:Instrument:To Verify that a modal will be displayed if user clicks on any pagination button without saving data',
   function () {
    library.logStep('Test case 21:Instrument:To Verify ' +
       'that a modal will be displayed if user clicks on any pagination button without saving data');
    library.logStep('Test case 22:Instrument:Display of modal when user navigates away from data entry page');
    library.logStep('Test case 23:Instrument:Clicking ' +
       'on the Dont save data button on the modal when ' +
       'user tries to navigate away from data entry page will navigate you to the new location');
    library.logStep('Test case 24:Instrument:Clicking ' +
       'on the Save this page on the modal when user tries to navigate away from data entry page will save the data');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.verifyPageSelected(1).then(function (page1Selected) {
      expect(page1Selected).toBe(true);
    });
    multiPoint.clickPaginationNextButton().then(function (nextClicked) {
      expect(nextClicked).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
      expect(dontSaveClicked).toBe(true);
    });
    multiPoint.verifyPageSelected(2).then(function (page2Selected) {
      expect(page2Selected).toBe(true);
    });
    multiPoint.clickPaginationPreviousButton().then(function (previousClicked) {
      expect(previousClicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
      expect(dontSaveClicked).toBe(true);
    });
    setting.isControlPageDisplayed(jsonData.Control1).then(function (controlPage) {
      expect(controlPage).toBe(true);
    });
    setting.goToHomePage().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    // multiPoint.verifyPageSelected(1).then(function (page1Selected) {
    //   expect(page1Selected).toBe(true);
    // });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.clickPaginationNextButton().then(function (nextClicked) {
      expect(nextClicked).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickSaveDataButton().then(function (saveButtonClicked) {
      expect(saveButtonClicked).toBe(true);
    });
    multiPoint.verifyPageSelected(2).then(function (page2Selected) {
      expect(page2Selected).toBe(true);
    });
    multiPoint.clickPaginationPreviousButton().then(function (previousClicked) {
      expect(previousClicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyDataEntered(jsonData.C1Analyte1, 5).then(function (noDataVerified) {
      expect(noDataVerified).toBe(true);
    });
  });


  // Control Level TC
  it('Test case 21:Control:Display of modal when user navigates away from data entry page',
   function () {
    library.logStep('Test case 21:Control:To Verify ' +
       'that a modal will be displayed if user clicks on any pagination button without saving data');
    library.logStep('Test case 22:Control:Display of modal when user navigates away from data entry page');
    library.logStep('Test case 23:Control:Clicking on ' +
       'the Dont save data button on the modal when user ' +
       'tries to navigate away from data entry page will navigate you to the new location');
    library.logStep('Test case 24:Control:Clicking on the ' +
       'Save this page on the modal when user tries to navigate away from data entry page will save the data');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C2Analyte1, 2.55).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.verifyPageSelected(1).then(function (page1Selected) {
      expect(page1Selected).toBe(true);
    });
    multiPoint.clickPaginationNextButton().then(function (nextClicked) {
      expect(nextClicked).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
      expect(dontSaveClicked).toBe(true);
    });
    multiPoint.verifyPageSelected(2).then(function (page2Selected) {
      expect(page2Selected).toBe(true);
    });
    multiPoint.clickPaginationPreviousButton().then(function (previousClicked) {
      expect(previousClicked).toBe(true);
    });
    // multiPoint.verifyDataEntered(jsonData.C1Analyte1, 'No Data').then(function (noDataVerified) {
    //   expect(noDataVerified).toBe(true);
    // });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C2Analyte1, 2.56).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    setting.navigateTO(jsonData.C2Analyte1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
      expect(dontSaveClicked).toBe(true);
    });
    pointData.verifyPointEntryPageHeader(jsonData.C2Analyte1).then(function (analytePage) {
      expect(analytePage).toBe(true);
    });
    setting.goToHomePage().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    // multiPoint.verifyDataEntered(jsonData.C1Analyte1, 'No Data').then(function (noDataVerified) {
    //   expect(noDataVerified).toBe(true);
    // });
    multiPoint.verifyPageSelected(1).then(function (page1Selected) {
      expect(page1Selected).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C2Analyte1, 2.57).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.clickPaginationNextButton().then(function (nextClicked) {
      expect(nextClicked).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickSaveDataButton().then(function (saveButtonClicked) {
      expect(saveButtonClicked).toBe(true);
    });
    multiPoint.verifyPageSelected(2).then(function (page2Selected) {
      expect(page2Selected).toBe(true);
    });
    multiPoint.clickPaginationPreviousButton().then(function (previousClicked) {
      expect(previousClicked).toBe(true);
    });
    multiPoint.verifyDataEntered(jsonData.C2Analyte1, 2.57).then(function (noDataVerified) {
      expect(noDataVerified).toBe(true);
    });
  });

it('Test case 16:Control: To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.', function () {
  library.logStep
  ('Test case 16:Control: To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.');
  library.logStep
  ('Test case 17:Control: To ' +
       'Verify that user will be navigated to specific page of analytes by clicking on Page number in Pagination Control');
  library.logStep('Test case 18:Control: To Verify that once the user Navigated to the second page back arrow button will be displayed.');
  library.logStep('Test case 19:Control: To Verify that clicking on Back arrow will navigate user to previous page');
  library.logStep('Test case 20:Control: To Verify that Clicking on Single arrow (Next) will be taking user to very next page of Analytes');
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Control2).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.paginationButtonsDisplayed().then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.verifyPrevButtonEnabled().then(function (verified) {
    expect(verified).toBe(false);
  });
  multiPoint.clickOnSecondPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('2').then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyPrevButtonEnabled().then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.clickOnPreviousPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('1').then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.clickOnNextPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('2').then(function (clicked) {
    expect(clicked).toBe(true);
  });
});

it
('Test case 16:Instrument: To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.', function () {
  library.logStep('Test case 16:Instrument: ' +
       'To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.');
  library.logStep
  ('Test case 17:Instrument: To ' +
       'Verify that user will be navigated to specific page of analytes by clicking on Page number in Pagination Control');
  library.logStep('Test case 18:Instrument: ' +
       'To Verify that Clicking on Single arrow (Next) will be taking user to very next page of Analytes');
  library.logStep('Test case 19:Instrument: ' +
       'To Verify that once the user Navigated to the second page Previous arrow button will be enabled.');
  library.logStep('Test case 20:Instrument: To Verify that clicking on Previous arrow will navigate user to previous page');
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.paginationButtonsDisplayed().then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.verifyPrevButtonEnabled().then(function (verified) {
    expect(verified).toBe(false);
  });
  multiPoint.clickOnSecondPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('2').then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyPrevButtonEnabled().then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.clickOnPreviousPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('1').then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.clickOnNextPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('2').then(function (clicked) {
    expect(clicked).toBe(true);
  });
});
});
