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
library.parseJson('./JSON_data/MultiPoint_Spec4.json').then(function(data) {
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

it('Test case 13:Control: Verify Control based multi-point page', function () {
  library.logStep('Test case 13:Control: Verify Control based multi-point page');
  const dataMap1 = new Map<string, string>();
    const test1 = '1', test2 = '2', test3 = '3';
    const val1 = '1.11', val2 = '1.12', val3 = '1.13';
    const val4 = '2.14', val5 = '2.15', val6 = '2.16';
    const val7 = '3.17', val8 = '3.18', val9 = '3.19';
    // const string1 = 'Comment for analyte ' + jsonData.C2Analyte1;
    // const string2 = 'Comment for analyte ' + jsonData.C2Analyte2;
    const string3 = 'Comment for analyte ' + jsonData.C2Analyte3;
    const commentCount = '1';
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
    const dataMap = new Map<string, string>();
    dataMap.set('11', val1);
    dataMap.set('14', val2);
    dataMap.set('17', val3);
    dataMap.set('21', val4);
    dataMap.set('24', val5);
    dataMap.set('27', val6);
    dataMap.set('31', val7);
    dataMap.set('34', val8);
    dataMap.set('37', val9);
    multiPoint.enterValues(dataMap).then(function (result) {
      console.log('Values entered for Matrix 1');
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // if (flagForIEBrowser === true) {
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
    // }
    multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val2, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val3, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val4, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val5, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val6, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val7, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val8, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val9, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    dataMap1.set('11', val9);
    dataMap1.set('14', val8);
    dataMap1.set('21', val7);
    dataMap1.set('27', val6);
    dataMap1.set('34', val5);
    dataMap1.set('37', val4);

    multiPoint.enterValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    // multiPoint.enterCommentForAllTests(string1, jsonData.C2Analyte1).then(function (added) {
    //   expect(added).toBe(true);
    // });
    // multiPoint.enterCommentForAllTests(string2, jsonData.C2Analyte2).then(function (added) {
    //   expect(added).toBe(true);
    // });
    multiPoint.enterCommentForAllTests(string3, jsonData.C2Analyte3).then(function (added) {
      expect(added).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // if (flagForIEBrowser === true) {
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
    // }
    multiPoint.verifyEnteredValueStoredL1AllTest(val9, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val8, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val7, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val6, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val5, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val4, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    // multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte1, string1).then(function (doneThat) {
    //   expect(doneThat).toBe(true);
    // });
    // multiPoint.verifySpecificAnalyteInteractionNumber(jsonData.C2Analyte1, commentCount).then(function (verified) {
    //   expect(verified).toBe(true);
    // });
    // multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte2, string2).then(function (doneThat) {
    //   expect(doneThat).toBe(true);
    // });
    // multiPoint.verifySpecificAnalyteInteractionNumber(jsonData.C2Analyte2, commentCount).then(function (verified) {
    //   expect(verified).toBe(true);
    // });
    multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte3, string3).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    multiPoint.verifySpecificAnalyteInteractionNumber(jsonData.C2Analyte3, commentCount).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 15:Control: Verify Control based multi-Point page data on level setting changed', function () {
    library.logStep('Test case 15:Control: Verify Control based multi-Point page data on level setting changed');
    const dataMap1 = new Map<string, string>();
    const test4 = '4', test5 = '5', test6 = '6';
    const val10 = '4.20', val11 = '4.21', val12 = '4.22';
    const val13 = '5.23', val14 = '5.24', val15 = '5.25';
    const val16 = '6.26', val17 = '6.27', val18 = '6.28';
    const string4 = 'Comment for analyte ' + jsonData.C2Analyte4;
    // const string5 = 'Comment for analyte ' + jsonData.C2Analyte5;
    // const string6 = 'Comment for analyte ' + jsonData.C2Analyte6;
     const commentCount = '1';

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
    const dataMap = new Map<string, string>();
    dataMap.set('41', val10);
    dataMap.set('44', val11);
    dataMap.set('47', val12);
    dataMap.set('51', val13);
    dataMap.set('54', val14);
    dataMap.set('57', val15);
    dataMap.set('61', val16);
    dataMap.set('64', val17);
    dataMap.set('67', val18);
    multiPoint.enterValues(dataMap).then(function (result) {
      console.log('Values entered for Matrix 1');
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // if (flagForIEBrowser === true) {
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
    // }
    multiPoint.verifyEnteredValueStoredL1AllTest(val10, test4).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val11, test4).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val12, test4).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val13, test5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val14, test5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val15, test5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val16, test6).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val17, test6).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val18, test6).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    dataMap1.set('41', val18);
    dataMap1.set('54', val17);
    dataMap1.set('67', val16);

    multiPoint.enterValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.enterCommentForAllTests(string4, jsonData.C2Analyte4).then(function (added) {
      expect(added).toBe(true);
    });
    // multiPoint.enterCommentForAllTests(string5, jsonData.C2Analyte5).then(function (added) {
    //   expect(added).toBe(true);
    // });
    // multiPoint.enterCommentForAllTests(string6, jsonData.C2Analyte6).then(function (added) {
    //   expect(added).toBe(true);
    // });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // if (flagForIEBrowser === true) {
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
    // }
    multiPoint.verifyEnteredValueStoredL1AllTest(val18, test4).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val17, test5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val16, test6).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte4, string4).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    multiPoint.verifySpecificAnalyteInteractionNumber(jsonData.C2Analyte4, commentCount).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    // multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte5, string5).then(function (doneThat) {
    //   expect(doneThat).toBe(true);
    // });
    // multiPoint.verifySpecificAnalyteInteractionNumber(jsonData.C2Analyte5, commentCount).then(function (doneThat) {
    //   expect(doneThat).toBe(true);
    // });
    // multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte6, string6).then(function (doneThat) {
    //   expect(doneThat).toBe(true);
    // });
    // multiPoint.verifySpecificAnalyteInteractionNumber(jsonData.C2Analyte6, commentCount).then(function (doneThat) {
    //   expect(doneThat).toBe(true);
    // });
  });


it('Test case 13:Instrument: Verify Instrument based multi-point page', function () {
  library.logStep('Test case 13:Instrument: Verify Instrument based multi-point page');
  const dataMap1 = new Map<string, string>();
  const test1 = '1', test2 = '2', test3 = '3';
  const val1 = '1.11', val2 = '1.12', val3 = '1.13';
  const val4 = '2.14', val5 = '2.15', val6 = '2.16';
  const val7 = '3.17', val8 = '3.18', val9 = '3.19';
   const string1 = 'Comment for analyte ' + jsonData.C1Analyte1;
  // const string2 = 'Comment for analyte ' + jsonData.C1Analyte2;
  // const string3 = 'Comment for analyte ' + jsonData.C2Analyte1;
   const commentCount = '1';

  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataMap = new Map<string, string>();
  dataMap.set('11', val1);
  dataMap.set('14', val2);
  dataMap.set('17', val3);
  dataMap.set('21', val4);
  dataMap.set('24', val5);
  dataMap.set('27', val6);
  dataMap.set('31', val7);
  dataMap.set('34', val8);
  dataMap.set('37', val9);

  multiPoint.enterValues(dataMap).then(function (result) {
    console.log('Values entered for Matrix 1');
    expect(result).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
//  if (flagForIEBrowser === true) {
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
//  }
  multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val2, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val3, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val4, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val5, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val6, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val7, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val8, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val9, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });

  dataMap1.set('11', val9);
  dataMap1.set('14', val8);
  dataMap1.set('21', val7);
  dataMap1.set('27', val6);
  dataMap1.set('34', val5);
  dataMap1.set('37', val4);
  multiPoint.enterValues(dataMap1).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.enterCommentForAllTests(string1, jsonData.C1Analyte1).then(function (added) {
    expect(added).toBe(true);
  });
  // multiPoint.enterCommentForAllTests(string2, jsonData.C1Analyte2).then(function (added) {
  //   expect(added).toBe(true);
  // });
  // multiPoint.enterCommentForAllTests(string3, jsonData.C2Analyte1).then(function (added) {
  //   expect(added).toBe(true);
  // });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
//  if (flagForIEBrowser === true) {
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
 // }
  multiPoint.verifyEnteredValueStoredL1AllTest(val9, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val8, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val7, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val6, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val5, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val4, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyPezCommentToolTipAllTest(string1, test1).then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.verifyCommentNumberAllTest(commentCount, test1).then(function (verified) {
    expect(verified).toBe(true);
  });
  // multiPoint.verifyPezCommentToolTipAllTest(string2, test2).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyCommentNumberAllTest(commentCount, test2).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyPezCommentToolTipAllTest(string3, test3).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyCommentNumberAllTest(commentCount, test3).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
});

it('Test case 15:Instrument: Verify Instrument based multi point page data on level setting changed', function () {
  library.logStep('Test case 15:Instrument: Verify Instrument based multi point page data on level setting changed');
  const dataMap1 = new Map<string, string>();
  const test4 = '4', test5 = '5', test6 = '6';
  const val10 = '4.20', val11 = '4.21', val12 = '4.22';
  const val13 = '5.23', val14 = '5.24', val15 = '5.25';
  const val16 = '6.26', val17 = '6.27', val18 = '6.28';
  // const string4 = 'Comment for analyte ' + jsonData.C2Analyte2;
  // const string5 = 'Comment for analyte ' + jsonData.C2Analyte3;
  // const string6 = 'Comment for analyte ' + jsonData.C2Analyte4;
  // const commentCount = '1';
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataMap = new Map<string, string>();
  dataMap.set('41', val10);
  dataMap.set('44', val11);
  dataMap.set('47', val12);
  dataMap.set('51', val13);
  dataMap.set('54', val14);
  dataMap.set('57', val15);
  dataMap.set('61', val16);
  dataMap.set('64', val17);
  dataMap.set('67', val18);
  multiPoint.enterValues(dataMap).then(function (result) {
    console.log('Values entered for Matrix 1');
    expect(result).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
 // if (flagForIEBrowser === true) {
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
 // }
  multiPoint.verifyEnteredValueStoredL1AllTest(val10, test4).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val11, test4).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val12, test4).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val13, test5).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val14, test5).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val15, test5).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val16, test6).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val17, test6).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val18, test6).then(function (displayed) {
    expect(displayed).toBe(true);
  });

  dataMap1.set('41', val12);
  dataMap1.set('54', val11);
  dataMap1.set('67', val10);

  multiPoint.enterValues(dataMap1).then(function (result) {
    expect(result).toBe(true);
  });
  // multiPoint.enterCommentForAllTests(string4, jsonData.C2Analyte2).then(function (added) {
  //   expect(added).toBe(true);
  // });
  // multiPoint.enterCommentForAllTests(string5, jsonData.C2Analyte3).then(function (added) {
  //   expect(added).toBe(true);
  // });
  // multiPoint.enterCommentForAllTests(string6, jsonData.C2Analyte4).then(function (added) {
  //   expect(added).toBe(true);
  // });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
//  if (flagForIEBrowser === true) {
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
 // }
  multiPoint.verifyEnteredValueStoredL1AllTest(val12, test4).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val11, test5).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val10, test6).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  // multiPoint.verifyPezCommentToolTipAllTest(string4, test4).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyPezCommentToolTipAllTest(string5, test5).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyPezCommentToolTipAllTest(string6, test6).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyCommentNumberAllTest(commentCount, test6).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyInteractionIconAllTests(commentCount, test6).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyCommentNumberAllTest(commentCount, test4).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyCommentNumberAllTest(commentCount, test5).then(function (verified) {
  //   expect(verified).toBe(true);
  // });

  // multiPoint.verifyInteractionIconAllTests(commentCount, test4).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
  // multiPoint.verifyInteractionIconAllTests(commentCount, test5).then(function (verified) {
  //   expect(verified).toBe(true);
  // });
});
});

