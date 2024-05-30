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
library.parseJson('./JSON_data/MultiPoint_Spec3.json').then(function(data) {
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

// TC 10 covered here
  it('Test case 11:Instrument: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page',
   function () {
    library.logStep('Test case 10:Instrument: Verify the comment is displayed correctly in Analyte Point View page');
    library.logStep
    ('Test case 11:Instrument: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page');
    const dataMap = new Map<string, string>();
    const val = '1.85';
    const commentString = 'Comment one to check comment count';
    const newCommentString = 'Comment two to check comment count';
    const expectedCommentValue1 = '1';
    const expectedCommentValue2 = '2';
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.hoverOverTest(jsonData.C1Analyte1).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiPoint.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.addComment(commentString).then(function (status) {
      expect(status).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    if (flagForIEBrowser === true) {
      setting.goToHomePage().then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiPoint.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    }
    multiPoint.verifyEnteredValueStored(val).then(function (saved) {
      expect(saved).toBe(true);
    });
    multiPoint.verifyPezCommentToolTip(commentString).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    multiPoint.verifyCommentSection(expectedCommentValue1).then(function (comment1) {
      expect(comment1).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.editComment(val, newCommentString).then(function (status) {
      expect(status).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySpecificAnalyteComment2(jsonData.C1Analyte1, commentString).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    multiPoint.verifyCommentSection(expectedCommentValue2).then(function (comment1) {
      expect(comment1).toBe(true);
    });
    multiPoint.verifytheReviewSummaryPage(jsonData.C1Analyte1, newCommentString ).then(function (review1) {
      expect(review1).toBe(true);
    });
    // multiPoint.clickOnDoneButton().then(function (status) {
    //   expect(status).toBe(true);
    // });
    multiPoint.verifyInteractionIconButtonOnProductLevel().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

// TC 10 covered here
it('Test case 11:Control: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page',
 function () {
  library.logStep('Test case 10:Control: Verify the comment is displayed correctly in Analyte Point View page');
  library.logStep
  ('Test case 11:Control: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page');
  const dataMap = new Map<string, string>();
  const val = '1.83';
  const commentString = 'Comment one to check comment count';
  const newCommentString = 'Comment two to check comment count';
  const expectedCommentValue1 = '1';
  const expectedCommentValue2 = '2';
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Control2).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  dataMap.set('11', val);
  multiPoint.enterValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.hoverOverTest(jsonData.C2Analyte1).then(function (hovered) {
    expect(hovered).toBe(true);
  });
  multiPoint.clickShowOptions().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.addComment(commentString).then(function (status) {
    expect(status).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
   if (flagForIEBrowser === true) {
  setting.goToHomePage().then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
   }

  multiPoint.verifyEnteredValueStored(val).then(function (saved) {
    expect(saved).toBe(true);
  });
  multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte1, commentString).then(function (doneThat) {
    expect(doneThat).toBe(true);
  });
  multiPoint.verifySpecificAnalyteCommentNumber(jsonData.C2Analyte1, expectedCommentValue1).then(function (comment1) {
    expect(comment1).toBe(true);
  });
  setting.navigateTO(jsonData.C2Analyte1).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.editComment(val, newCommentString).then(function (status) {
    expect(status).toBe(true);
  });
  setting.goToHomePage().then(function (navigated) {
    expect(navigated).toBe(true);
  });
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Control2).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifySpecificAnalyteComment2(jsonData.C2Analyte1, commentString).then(function (doneThat) {
    expect(doneThat).toBe(true);
  });
  multiPoint.verifySpecificAnalyteCommentNumber(jsonData.C2Analyte1, expectedCommentValue2).then(function (comment1) {
    expect(comment1).toBe(true);
  });
  multiPoint.verifytheReviewSummaryPage(jsonData.C2Analyte1, commentString).then(function (review1) {
    expect(review1).toBe(true);
  });
});

it('Test case 25:Instrument: Verify that User with user role access can enter the data on instrument level', function () {
  library.logStep('Test case 25:Instrument: Verify that User with user role access can enter the data on instrument level');
  const dataMap = new Map<string, string>();
  const val = '2.70';
  const commentString = 'Comment added by user ' + jsonData.C1Analyte2;
  out.signOut().then(function (status) {
    expect(status).toBe(true);
  });
  loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
    jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  dataMap.set('21', val);
  multiPoint.enterValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.hoverOverTest(jsonData.C1Analyte2).then(function (hovered) {
    expect(hovered).toBe(true);
  });
  multiPoint.clickShowOptions().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.addComment(commentString).then(function (status) {
    expect(status).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  if (flagForIEBrowser === true) {
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
  }
  multiPoint.verifyEnteredValueStoredL1AllTest(val, '2').then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifySpecificAnalyteComment(jsonData.C1Analyte2, commentString).then(function (doneThat) {
    expect(doneThat).toBe(true);
  });
});

it('Test case 25:Control: Verify that User with user role access can enter the data on control level', function () {
  library.logStep('Test case 25:Control: Verify that User with user role access can enter the data on control level');
  const dataMap = new Map<string, string>();
  const val = '2.80';
  const commentString = 'Comment added by user ' + jsonData.Control2;
  out.signOut().then(function (status) {
    expect(status).toBe(true);
  });
  loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
    jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Control2).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  dataMap.set('21', val);
  multiPoint.enterValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.hoverOverTest(jsonData.C2Analyte2).then(function (hovered) {
    expect(hovered).toBe(true);
  });
  multiPoint.clickShowOptions().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.addComment(commentString).then(function (status) {
    expect(status).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  if (flagForIEBrowser === true) {
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
  }
  multiPoint.verifyEnteredValueStoredL1AllTest(val, '2').then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte2, commentString).then(function (doneThat) {
    expect(doneThat).toBe(true);
  });
});
});

