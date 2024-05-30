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
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';

const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./JSON_data/PriorDateTime.json').then(function(data) {
  jsonData = data;
});

describe('Multi Point Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dashboard = new Dashboard();
  const newLabSetup = new NewLabSetup();
  const multiEntry = new MultiPointDataEntryInstrument();
  const library = new BrowserLibrary();
  const multiSummary = new MultiSummary();
  const pointData = new PointDataEntry();
  const setting = new Settings();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  // it('Test case 1: To verify Point Data for Prior Date can be added from Instrument Data Table page', function () {
  //   library.logStep('Test case 1: To verify Point Data for Prior Date can be added from Instrument Data Table page');
  //   const val = '2.10';
  //   const hm = '10:30 PM';
  //   newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiEntry.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   multiEntry.clickChangeDateButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
  //     expect(datePickerClicked).toBe(true);
  //   });
  //   pointData.selectYear('2019').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectMonth('DEC').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectDate('20').then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  //   multiSummary.setTime(hm).then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  //   multiEntry.enterData(jsonData.Analyte1, val).then(function (dataEntered) {
  //     expect(dataEntered).toBe(true);
  //   });
  //   multiEntry.clickSubmitButton().then(function (submitClicked) {
  //     expect(submitClicked).toBe(true);
  //   });
  //   multiEntry.verifyPriorDateTimeDialog().then(function (dialogDisplayed) {
  //     expect(dialogDisplayed).toBe(true);
  //   });
  //   multiEntry.closePriorDateTimeDialog().then(function (closeDialog) {
  //     expect(closeDialog).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.ControlName).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Analyte1).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   pointData.clickHideData().then(function (dataHidden) {
  //     expect(dataHidden).toBe(true);
  //   });
  //   multiEntry.verifyInsertedPointData(val, 'Dec 20').then(function (closeDialog) {
  //     expect(closeDialog).toBe(true);
  //   });
  //   multiEntry.verifyInsertedTime(val, 'Dec 20', hm).then(function (closeDialog) {
  //     expect(closeDialog).toBe(true);
  //   });
  // });

  // it('Test case 2: To verify Point Data for Prior Date can be added from Control Data Table page', function () {
  //   library.logStep('Test case 2: To verify Point Data for Prior Date can be added from Control Data Table page');
  //   const val = '2.20';
  //   const hm = '9:30 PM';
  //   newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.ControlName).then(function (navigateControl) {
  //     expect(navigateControl).toBe(true);
  //   });
  //   multiEntry.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   multiEntry.clickChangeDateButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
  //     expect(datePickerClicked).toBe(true);
  //   });
  //   pointData.selectYear('2014').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectMonth('DEC').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectDate('16').then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  //   multiSummary.setTime(hm).then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  //   multiEntry.enterData(jsonData.Analyte1, val).then(function (dataEntered) {
  //     expect(dataEntered).toBe(true);
  //   });
  //   multiEntry.clickSubmitButton().then(function (submitClicked) {
  //     expect(submitClicked).toBe(true);
  //   });
  //   multiEntry.verifyPriorDateTimeDialog().then(function (dialogDisplayed) {
  //     expect(dialogDisplayed).toBe(true);
  //   });
  //   multiEntry.closePriorDateTimeDialog().then(function (closeDialog) {
  //     expect(closeDialog).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Analyte1).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   pointData.clickHideData().then(function (dataHidden) {
  //     expect(dataHidden).toBe(true);
  //   });
  //   multiEntry.verifyInsertedPointData(val, 'Dec 16').then(function (closeDialog) {
  //     expect(closeDialog).toBe(true);
  //   });
  //   multiEntry.verifyInsertedTime(val, 'Dec 16', hm).then(function (closeDialog) {
  //     expect(closeDialog).toBe(true);
  //   });

  // });

  // it('Test case 3: To verify Summary Data for Prior Date can be added from Instrument Data Table page',
  //   function () {
  //     library.logStep('Test case 3: To verify Summary Data for Prior Date can be added from Instrument Data Table page');
  //     library.logStep('Test case 4: To verify Summary Data for Prior Date can be added from Control Data Table page');
  //     newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
  //       expect(navigate).toBe(true);
  //     });
  //     newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
  //       expect(navigate).toBe(true);
  //     });
  //     multiEntry.clickManuallyEnterData().then(function (clicked) {
  //       expect(clicked).toBe(true);
  //     });
  //     multiEntry.clickChangeDateButton().then(function (clicked) {
  //       expect(clicked).toBe(true);
  //     });
  //     pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
  //       expect(datePickerClicked).toBe(true);
  //     });
  //     pointData.selectYear('2018').then(function (yearSelected) {
  //       expect(yearSelected).toBe(true);
  //     });
  //     pointData.selectMonth('DEC').then(function (yearSelected) {
  //       expect(yearSelected).toBe(true);
  //     });
  //     pointData.selectDate('15').then(function (dateSelected) {
  //       expect(dateSelected).toBe(true);
  //     });
  //     const dataEnter = new Map<string, string>();
  //     dataEnter.set('21', '34.4');
  //     dataEnter.set('22', '0.3');
  //     dataEnter.set('23', '10');
  //     multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //       expect(values).toBe(true);
  //     });
  //     multiSummary.clickSubmitButton().then(function (submit) {
  //       expect(submit).toBe(true);
  //     });
  //     multiEntry.verifyPriorDateTimeDialog().then(function (dialogDisplayed) {
  //       expect(dialogDisplayed).toBe(false);
  //     });
  //     newLabSetup.navigateTO(jsonData.ControlName).then(function (navigateControl) {
  //       expect(navigateControl).toBe(true);
  //     });
  //     multiEntry.clickManuallyEnterData().then(function (clicked) {
  //       expect(clicked).toBe(true);
  //     });
  //     multiEntry.clickChangeDateButton().then(function (clicked) {
  //       expect(clicked).toBe(true);
  //     });
  //     pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
  //       expect(datePickerClicked).toBe(true);
  //     });
  //     pointData.selectYear('2018').then(function (yearSelected) {
  //       expect(yearSelected).toBe(true);
  //     });
  //     pointData.selectMonth('DEC').then(function (yearSelected) {
  //       expect(yearSelected).toBe(true);
  //     });
  //     pointData.selectDate('16').then(function (dateSelected) {
  //       expect(dateSelected).toBe(true);
  //     });
  //     const dataEnter1 = new Map<string, string>();
  //     dataEnter1.set('21', '35.4');
  //     dataEnter1.set('22', '0.3');
  //     dataEnter1.set('23', '10');
  //     multiSummary.enterMeanSDPointValues(dataEnter1).then(function (values) {
  //       expect(values).toBe(true);
  //     });
  //     multiSummary.clickSubmitButton().then(function (submit) {
  //       expect(submit).toBe(true);
  //     });
  //     multiEntry.verifyPriorDateTimeDialog().then(function (dialogDisplayed) {
  //       expect(dialogDisplayed).toBe(false);
  //     });
  //   });

    // it('Test case 5: To verify Point & summary Data for Prior Date can be added from Control Data Table page',
    // function () {
    //   library.logStep('Test case 5: To verify Point & summary Data for Prior Date can be added from Control Data Table page');
    //   library.logStep('Test case 6: To verify Point & summary Data for Prior Date can be added from Instrument Data Table page');
    //   const val = '2.50', mean = '30.1', sd = '0.31', pt = '9';
    //   const val1 = '2.51', mean1 = '31.1', sd1 = '0.32', pt1 = '10';
    //   newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   multiEntry.clickManuallyEnterData().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   multiEntry.clickChangeDateButton().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
    //     expect(datePickerClicked).toBe(true);
    //   });
    //   pointData.selectYear('2018').then(function (yearSelected) {
    //     expect(yearSelected).toBe(true);
    //   });
    //   pointData.selectMonth('DEC').then(function (yearSelected) {
    //     expect(yearSelected).toBe(true);
    //   });
    //   pointData.selectDate('15').then(function (dateSelected) {
    //     expect(dateSelected).toBe(true);
    //   });
    //   multiEntry.enterData(jsonData.Analyte1, val).then(function (dataEntered) {
    //     expect(dataEntered).toBe(true);
    //   });
    //   const dataEnter = new Map<string, string>();
    //   dataEnter.set('21', mean);
    //   dataEnter.set('22', sd);
    //   dataEnter.set('23', pt);
    //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
    //     expect(values).toBe(true);
    //   });
    //   multiEntry.clickSubmitButton().then(function (submitClicked) {
    //     expect(submitClicked).toBe(true);
    //   });
    //   multiEntry.closePriorDateTimeDialog().then(function (closeDialog) {
    //     expect(closeDialog).toBe(true);
    //   });
    //   newLabSetup.navigateTO(jsonData.ControlName).then(function (navigateControl) {
    //     expect(navigateControl).toBe(true);
    //   });
    //   multiEntry.clickManuallyEnterData().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   multiEntry.clickChangeDateButton().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
    //     expect(datePickerClicked).toBe(true);
    //   });
    //   pointData.selectYear('2019').then(function (yearSelected) {
    //     expect(yearSelected).toBe(true);
    //   });
    //   pointData.selectMonth('DEC').then(function (yearSelected) {
    //     expect(yearSelected).toBe(true);
    //   });
    //   pointData.selectDate('16').then(function (dateSelected) {
    //     expect(dateSelected).toBe(true);
    //   });
    //   multiEntry.enterData(jsonData.Analyte1, val1).then(function (dataEntered) {
    //     expect(dataEntered).toBe(true);
    //   });
    //   const dataEnter1 = new Map<string, string>();
    //   dataEnter1.set('21', mean1);
    //   dataEnter1.set('22', sd1);
    //   dataEnter1.set('23', pt1);
    //   multiSummary.enterMeanSDPointValues(dataEnter1).then(function (values) {
    //     expect(values).toBe(true);
    //   });
    //   multiSummary.clickSubmitButton().then(function (submit) {
    //     expect(submit).toBe(true);
    //   });
    //   multiEntry.verifyPriorDateTimeDialog().then(function (dialogDisplayed) {
    //     expect(dialogDisplayed).toBe(true);
    //   });
    //   multiEntry.closePriorDateTimeDialog().then(function (closeDialog) {
    //     expect(closeDialog).toBe(true);
    //   });
    //   setting.navigateTO(jsonData.Analyte1).then(function (navigated) {
    //     expect(navigated).toBe(true);
    //   });
    //   pointData.clickHideData().then(function (dataHidden) {
    //     expect(dataHidden).toBe(true);
    //   });
    //   multiEntry.verifyInsertedPointData(val1, 'Dec 16').then(function (closeDialog) {
    //     expect(closeDialog).toBe(true);
    //   });
    //   multiEntry.verifyInsertedPointData(val, 'Dec 15').then(function (closeDialog) {
    //     expect(closeDialog).toBe(true);
    //   });
    //   setting.navigateTO(jsonData.Analyte1Summary).then(function (navigated) {
    //     expect(navigated).toBe(true);
    //   });
    //   pointData.clickHideData().then(function (dataHidden) {
    //     expect(dataHidden).toBe(true);
    //   });
    //   multiSummary.verifyEnteredValueStoredTestPriorDateTime(mean, sd, pt, '2018', 'Dec').then(function (verify) {
    //     expect(verify).toBe(true);
    //   });
    //   multiSummary.verifyEnteredValueStoredTestPriorDateTime(mean1, sd1, pt1, '2019', 'Dec').then(function (verify) {
    //     expect(verify).toBe(true);
    //   });
    // });

  it('Control Level TC - 15: To verify Point & summary Data for Prior Date can be added from Control Data Table page', function () {
    library.logStep('Control Level TC - 15: To Verify the date displayed correct in Analyte Summary View page for summary and point data.');
    library.logStep
      ('Control Level TC - 14: To Verify Rows of test data are arranged consecutively by date and time for summary and point data.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiEntry.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiEntry.clickChangeDateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
      expect(datePickerClicked).toBe(true);
    });
    pointData.selectYear('2018').then(function (yearSelected) {
      expect(yearSelected).toBe(true);
    });
    pointData.selectMonth('DEC').then(function (yearSelected) {
      expect(yearSelected).toBe(true);
    });
    pointData.selectDate('17').then(function (dateSelected) {
      expect(dateSelected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('21', '36.4');
    dataEnter.set('22', '0.3');
    dataEnter.set('23', '10');
    multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
      expect(values).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submit) {
      expect(submit).toBe(true);
    });
    multiEntry.clickChangeDateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
      expect(datePickerClicked).toBe(true);
    });
    pointData.selectYear('2019').then(function (yearSelected) {
      expect(yearSelected).toBe(true);
    });
    pointData.selectMonth('DEC').then(function (yearSelected) {
      expect(yearSelected).toBe(true);
    });
    pointData.selectDate('18').then(function (dateSelected) {
      expect(dateSelected).toBe(true);
    });
    const dataEnter1 = new Map<string, string>();
    dataEnter1.set('21', '46.4');
    dataEnter1.set('22', '0.3');
    dataEnter1.set('23', '14');
    multiSummary.enterMeanSDPointValues(dataEnter1).then(function (values) {
      expect(values).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submit) {
      expect(submit).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Analyte1Summary).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredTestPriorDateTime('36.4', '0.3', '10', '2018', 'Dec').then(function (verify) {
      expect(verify).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredTestPriorDateTime('46.4', '0.3', '14', '2019', 'Dec').then(function (verify) {
      expect(verify).toBe(true);
    });
  });

  it('Instrument Level TC - 15: To Verify the date displayed correct in Analyte Summary View page for summary and point data.',
    function () {
      library.logStep('InstrumentLevel TC - 15: To Verify the date displayed correct in Analyte Summary View page for summary and point data.');
      library.logStep('InstrumentLevel TC - 14: To Verify Rows of test data are arranged consecutively by date and time for summary and point data.');
      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiEntry.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiEntry.clickChangeDateButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
        expect(datePickerClicked).toBe(true);
      });
      pointData.selectYear('2019').then(function (yearSelected) {
        expect(yearSelected).toBe(true);
      });
      pointData.selectMonth('DEC').then(function (yearSelected) {
        expect(yearSelected).toBe(true);
      });
      pointData.selectDate('18').then(function (dateSelected) {
        expect(dateSelected).toBe(true);
      });
      const dataEnter2 = new Map<string, string>();
      dataEnter2.set('21', '56.4');
      dataEnter2.set('22', '0.3');
      dataEnter2.set('23', '10');
      multiSummary.enterMeanSDPointValues(dataEnter2).then(function (values) {
        expect(values).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (submit) {
        expect(submit).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (submit) {
        expect(submit).toBe(true);
      });
      multiEntry.clickChangeDateButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
        expect(datePickerClicked).toBe(true);
      });
      pointData.selectYear('2017').then(function (yearSelected) {
        expect(yearSelected).toBe(true);
      });
      pointData.selectMonth('JAN').then(function (yearSelected) {
        expect(yearSelected).toBe(true);
      });
      pointData.selectDate('18').then(function (dateSelected) {
        expect(dateSelected).toBe(true);
      });
      const dataEnter3 = new Map<string, string>();
      dataEnter3.set('21', '66.4');
      dataEnter3.set('22', '0.36');
      dataEnter3.set('23', '16');
      multiSummary.enterMeanSDPointValues(dataEnter3).then(function (values) {
        expect(values).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (submit) {
        expect(submit).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.ControlName).then(function (navigateControl) {
        expect(navigateControl).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.Analyte1Summary).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiSummary.verifyEnteredValueStoredTestPriorDateTime('56.4', '0.3', '10', '2019', 'Dec').then(function (verify) {
        expect(verify).toBe(true);
      });
      multiSummary.verifyEnteredValueStoredTestPriorDateTime('66.4', '0.36', '16', '2017', 'Jan').then(function (verify) {
        expect(verify).toBe(true);
      });
    });
});
