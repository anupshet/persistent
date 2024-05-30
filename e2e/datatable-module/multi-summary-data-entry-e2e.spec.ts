/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { LabSetup } from '../page-objects/lab-setup.e2e.po';
import { DataTable } from '../page-objects/data-table-e2e.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { SPCRules } from '../page-objects/spc-rules.e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { log4jsconfig } from '../../LOG4JSCONFIG/Log4jsConfig';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/Multi-Summary.json').then(function(data) {
  jsonData = data;
});

describe('Multi Summary Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const labSetup = new LabSetup();
  const dataTable = new DataTable();
  const multiSummary = new MultiSummary();
  const dashboard = new Dashboard();
  const spc = new SPCRules();
  const library = new BrowserLibrary();
  const newLabSetup = new NewLabSetup();
  const errorMsgforZeroSD = 'SD should be zero';
  const errorSDMsg = 'Enter SD value';
  const errorPoint = 'Enter point value';
  const errorMean = ' Enter mean value';

  beforeAll(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });


  afterEach(function () {
    out.signOut();
  });


  it('Test case 127758: Run Entry Input Data Verification Using Tab Key (Multi Summary and Multi Point);', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.selectRunEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '34.4');
    dataEnter.set('12', '0');
    dataEnter.set('13', '1');
    dataEnter.set('14', '35.5');
    dataEnter.set('15', '1.5');
    dataEnter.set('16', '5');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '12');
    tabFocusedElement1.set('12', '13');
    tabFocusedElement1.set('13', '14');
    tabFocusedElement1.set('14', '15');
    tabFocusedElement1.set('15', '16');
    tabFocusedElement1.set('16', '21');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 127761: Level Entry Input Data Verification Using the Tab Key (Muti Summary and Multi Point);', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '34.4');
    dataEnter.set('12', '0');
    dataEnter.set('13', '1');
    dataEnter.set('21', '35.8');
    dataEnter.set('22', '2');
    dataEnter.set('23', '5');
    dataEnter.set('14', '38.4');
    dataEnter.set('15', '2.5');
    dataEnter.set('16', '8');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '12');
    tabFocusedElement1.set('12', '13');
    tabFocusedElement1.set('13', '14');
    tabFocusedElement1.set('14', '15');
    tabFocusedElement1.set('15', '16');
    tabFocusedElement1.set('16', '21');
    tabFocusedElement1.set('21', '22');
    tabFocusedElement1.set('22', '23');
    tabFocusedElement1.set('23', '30');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });



  it('Test case 127918: Verification for all data (Mean, SD, Points); values in Analyte Summary' +
    'View page are correct using the Tab Key', function () {
      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiSummary.selectRunEntry().then(function (selected) {
        expect(selected).toBe(true);
      });

      const dataEnter = new Map<string, string>();
      dataEnter.set('11', '43.86');
      dataEnter.set('12', '2.01');
      dataEnter.set('13', '23');
      dataEnter.set('14', '34.45');
      dataEnter.set('15', '0');
      dataEnter.set('16', '1');

      const tabFocusedElement1 = new Map<string, string>();
      tabFocusedElement1.set('11', '12');
      tabFocusedElement1.set('12', '13');
      tabFocusedElement1.set('13', '14');
      tabFocusedElement1.set('14', '15');
      tabFocusedElement1.set('15', '16');
      tabFocusedElement1.set('16', '21');
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      multiSummary.clickCancle().then(function (cancle) {
        expect(cancle).toBe(true);
      });

      const dataEnter1 = new Map<string, string>();
      dataEnter1.set('11', '4.6');
      dataEnter1.set('12', '1.01');
      dataEnter1.set('13', ' ');
      dataEnter1.set('14', ' ');
      dataEnter1.set('15', '0');
      dataEnter1.set('16', '4');

      const tabFocusedElement2 = new Map<string, string>();
      tabFocusedElement2.set('11', '12');
      tabFocusedElement2.set('12', '13');
      tabFocusedElement2.set('13', '14');
      tabFocusedElement2.set('14', '15');
      tabFocusedElement2.set('15', '16');
      tabFocusedElement2.set('16', '21');
      multiSummary.verifyRunEntry(dataEnter1, tabFocusedElement2).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });

      multiSummary.clickCancle().then(function (cancle) {
        expect(cancle).toBe(true);
      });
      const data_Map = new Map<string, string>();
      data_Map.set('11', '42.65');
      data_Map.set('12', '3.51');
      data_Map.set('13', '53');
      data_Map.set('14', '34.96');
      data_Map.set('15', '0.74');
      data_Map.set('16', '17');

      multiSummary.enterMeanSDPointValues(data_Map).then(function (entered23) {
        expect(entered23).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (clicked45) {
        expect(clicked45).toBe(true);
      });
      const meanL1 = '42.65';
      const sdL1 = '3.51';
      const pointL1 = '53';
      multiSummary.verifyEnteredValueStoredNew(meanL1, sdL1, pointL1).then(function (saved) {
        expect(saved).toBe(true);
      });
      const meanL2 = '34.96';
      const sdL2 = '0.74';
      const pointL2 = '17';
      multiSummary.verifyEnteredValueStoredL2(meanL2, sdL2, pointL2).then(function (saved1) {
        expect(saved1).toBe(true);
      });
      const storedMap = new Map<string, string>();
      storedMap.set('11', '48.6');
      storedMap.set('12', '3.21');
      storedMap.set('13', '56');

      multiSummary.enterMeanSDPointValues(storedMap).then(function (eneter) {
        expect(eneter).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      const mean = '48.6';
      const sd = '3.21';
      const point = '56';

      multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (saved) {
        expect(saved).toBe(true);
      });
      multiSummary.veryfyL2ValuesNotDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  it('Test case 128960:  Level Entry Input Data Verification Using the Enter Key (Multi Summary and Multi Point);', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '34.4');
    dataEnter.set('12', '0');
    dataEnter.set('13', '1');
    dataEnter.set('21', '35.8');
    dataEnter.set('22', '2');
    dataEnter.set('23', '5');
    dataEnter.set('14', '38.4');
    dataEnter.set('15', '2.5');
    dataEnter.set('16', '8');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '12');
    tabFocusedElement1.set('12', '13');
    tabFocusedElement1.set('13', '14');
    tabFocusedElement1.set('14', '15');
    tabFocusedElement1.set('15', '16');
    tabFocusedElement1.set('16', '21');
    tabFocusedElement1.set('21', '22');
    tabFocusedElement1.set('22', '23');
    tabFocusedElement1.set('23', '30');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifyLevelEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });


  it('Test case 128957: Run Entry Input Data Verification Using Enter Key (Multi Summary and Multi Point);', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.selectRunEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '34.4');
    dataEnter.set('12', '0');
    dataEnter.set('13', '1');
    dataEnter.set('14', '35.5');
    dataEnter.set('15', '1.5');
    dataEnter.set('16', '5');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '12');
    tabFocusedElement1.set('12', '13');
    tabFocusedElement1.set('13', '14');
    tabFocusedElement1.set('14', '15');
    tabFocusedElement1.set('15', '16');
    tabFocusedElement1.set('16', '21');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifyRunEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });



  it('Test case 127891: Cancel button Verify when no data has been entered', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.selectRunEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataMap7 = new Map<string, string>();
    dataMap7.set('11', '4.6');
    dataMap7.set('12', '1.01');
    dataMap7.set('13', '5');

    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap7).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clickCancle().then(function (cancled1) {
      expect(cancled1).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  //  //    // Verification covered in TC - 127891 and 127758
  it('Test case 130203: Run Entry: For a level, errors should only be shown when user moves to next level using the tab key', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.selectRunEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const data_Map2 = new Map<string, string>();
    data_Map2.set('11', '4.6');
    data_Map2.set('12', '1.01');
    data_Map2.set('13', '');

    const tabFocusedElement2 = new Map<string, string>();
    tabFocusedElement2.set('11', '12');
    tabFocusedElement2.set('12', '13');
    tabFocusedElement2.set('13', '14');

    multiSummary.verifyRunEntry(data_Map2, tabFocusedElement2).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });


  //  //    // Verification covered in TC - 127891 and 127761
  it('Test case 130202: Level Entry: For a level,  should only be shown when user moves to next level using the tab key', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const data_Map2 = new Map<string, string>();
    data_Map2.set('11', '4.6');
    data_Map2.set('12', '1.01');
    data_Map2.set('13', '');

    const tabFocusedElement2 = new Map<string, string>();
    tabFocusedElement2.set('11', '12');
    tabFocusedElement2.set('12', '13');
    tabFocusedElement2.set('13', '14');

    multiSummary.verifyLevelEntry(data_Map2, tabFocusedElement2).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.selectRunEntry().then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });



  //  Verification covered in TC -  127758, 127918 and SPC rule verification is not applicable for multi summary TCs
  it(' Test case 128992: Level Entry: Verification for all data (Mean, SD, Points);' +
    'values in Analyte Summary View page are correct using the Tab Key', function () {
      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiSummary.selectLevelEntry().then(function (selected) {
        expect(selected).toBe(true);
      });
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      const dataEnter = new Map<string, string>();
      dataEnter.set('11', '34.4');
      dataEnter.set('12', '0');
      dataEnter.set('13', '');
      dataEnter.set('21', '35.8');
      dataEnter.set('22', '2');
      dataEnter.set('23', '');
      dataEnter.set('14', '38.4');
      dataEnter.set('15', '2.5');
      dataEnter.set('16', '8');

      const tabFocusedElement1 = new Map<string, string>();
      tabFocusedElement1.set('11', '12');
      tabFocusedElement1.set('12', '13');
      tabFocusedElement1.set('13', '14');
      tabFocusedElement1.set('14', '15');
      tabFocusedElement1.set('15', '16');
      tabFocusedElement1.set('16', '21');
      tabFocusedElement1.set('21', '22');
      tabFocusedElement1.set('22', '23');
      tabFocusedElement1.set('23', '30');

      multiSummary.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      multiSummary.clickCancelBtn().then(function (click) {

      });

      const data_Map = new Map<string, string>();
      data_Map.set('11', '4.69');
      data_Map.set('12', '0.51');
      data_Map.set('13', '5');
      data_Map.set('21', '34.6');
      data_Map.set('22', '4.32');
      data_Map.set('23', '33');

      multiSummary.enterMeanSDPointValues(data_Map).then(function (enetered) {
        expect(enetered).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      const meanL1 = '4.69';
      const sdL1 = '0.51';
      const pointL1 = '5';

      multiSummary.verifyEnteredValueStoredNew(meanL1, sdL1, pointL1).then(function (saved) {
        expect(saved).toBe(true);
      });

      const meanL2 = '34.60';
      const sdL2 = '4.32';
      const pointL2 = '33';

      multiSummary.verifyEnteredValueStoredL2(meanL2, sdL2, pointL2).then(function (saved1) {
        expect(saved1).toBe(true);
      });
      const dataMap7 = new Map<string, string>();
      dataMap7.set('11', '4.36');
      dataMap7.set('12', '0.61');
      dataMap7.set('13', '5');

      multiSummary.enterMeanSDPointValues(dataMap7).then(function (entered) {
        expect(entered).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.veryfyL2ValuesNotDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });



  //  Verification covered in TC -  127758, 127918 and SPC rule verification is not applicable for multi summary TCs
  it('Test case 130205: Level Entry: For a level, if user inputs one field and moves to next level,' +
    'errors should be displayed for empty field for that level using the tab key', function () {
      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiSummary.selectLevelEntry().then(function (selected) {
        expect(selected).toBe(true);
      });
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      const data_Map3 = new Map<string, string>();
      data_Map3.set('11', '');
      data_Map3.set('12', '');
      data_Map3.set('13', '5');
      data_Map3.set('21', '');

      const tabFocusedElement3 = new Map<string, string>();
      tabFocusedElement3.set('11', '12');
      tabFocusedElement3.set('12', '13');
      tabFocusedElement3.set('13', '14');
      tabFocusedElement3.set('21', '30');
      multiSummary.verifySubmitButtonDisabled().then(function (verified) {
        expect(verified).toBe(true);
      });
      multiSummary.verifyLevelEntry(data_Map3, tabFocusedElement3).then(function (level) {
        expect(level).toBe(true);
      });
      multiSummary.selectRunEntry().then(function (selected) {
        expect(selected).toBe(true);
      });
      multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (result1) {
        expect(result1).toBe(true);
      });
      multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonDisabled().then(function (verified) {
        expect(verified).toBe(true);
      });
      multiSummary.clickCancelBtn().then(function (cancel) {
        expect(cancel).toBe(true);
      });
    });


  it('Test case 130206: Run Entry: For a level, if user inputs one field and moves to next level,' +
    ' Errors should be displayed for empty field for that level.', function () {
      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiSummary.selectRunEntry().then(function (selected) {
        expect(selected).toBe(true);
      });
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      const data_Map2 = new Map<string, string>();
      data_Map2.set('11', ' ');
      data_Map2.set('12', '1.01');
      data_Map2.set('13', ' ');
      data_Map2.set('14', ' ');

      const tabFocusedElement2 = new Map<string, string>();
      tabFocusedElement2.set('11', '12');
      tabFocusedElement2.set('12', '13');
      tabFocusedElement2.set('13', '14');
      tabFocusedElement2.set('14', '15');

      multiSummary.verifyLevelEntry(data_Map2, tabFocusedElement2).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.selectLevelEntry().then(function (selected) {
        expect(selected).toBe(true);
      });
      multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonDisabled().then(function (verified) {
        expect(verified).toBe(true);
      });
      multiSummary.clickCancelBtn().then(function (cancel) {
        expect(cancel).toBe(true);
      });
    });

  //  Verification covered in TC -  127758, 127918, 130203 and SPC rule verification is not applicable for multi summary TCs
  it('Test case 128991: Verification for all data (Mean, SD, Points); values in Analyte Summary View page are '
    + 'correct using the tab Key', function () {
      log4jsconfig.log().info('Test case 128991: Verification for all data (Mean, SD, Points); ' +
        'values in Analyte Summary View page are correct using the tab Key');
      loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername, jsonData.SampadaPassword,
        jsonData.SampadaFirstName).then(function (loggedIn) {
          expect(loggedIn).toBe(true);
        });
      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });

      const dataEnter = new Map<string, string>();
      dataEnter.set('11', '4.56');
      dataEnter.set('12', '1.67');
      dataEnter.set('13', '5');
      dataEnter.set('14', '7.45');
      dataEnter.set('15', '0.76');
      dataEnter.set('16', '4');

      const tabFocusedElement1 = new Map<string, string>();
      tabFocusedElement1.set('11', '12');
      tabFocusedElement1.set('12', '13');
      tabFocusedElement1.set('13', '14');
      tabFocusedElement1.set('14', '15');
      tabFocusedElement1.set('15', '16');
      tabFocusedElement1.set('16', '21');
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);

      });
      multiSummary.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      multiSummary.clickCancle().then(function (clk) {
      });

      const dataEnter1 = new Map<string, string>();
      dataEnter1.set('11', '4.63');
      dataEnter1.set('12', '0.04');
      dataEnter1.set('13', ' ');
      dataEnter1.set('14', ' ');
      dataEnter1.set('15', '0');
      dataEnter1.set('16', '4');

      const tabFocusedElement2 = new Map<string, string>();
      tabFocusedElement2.set('11', '12');
      tabFocusedElement2.set('12', '13');
      tabFocusedElement2.set('13', '14');
      tabFocusedElement2.set('14', '15');
      tabFocusedElement2.set('15', '16');
      tabFocusedElement2.set('16', '30');

      multiSummary.verifyRunEntry(dataEnter1, tabFocusedElement2).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });

      multiSummary.clickCancle().then(function (clk) {
      });

      const data_Map = new Map<string, string>();
      data_Map.set('11', '22.87');
      data_Map.set('12', '1.87');
      data_Map.set('13', '5');
      data_Map.set('14', '32.76');
      data_Map.set('15', '2.78');
      data_Map.set('16', '15');

      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);

      });
      multiSummary.enterMeanSDPointValues(data_Map).then(function (enetered) {
        expect(enetered).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      const meanL1 = '22.87';
      const sdL1 = '1.87';
      const pointL1 = '5';

      multiSummary.verifyEnteredValueStoredNew(meanL1, sdL1, pointL1).then(function (saved) {
        expect(saved).toBe(true);
      });

      const meanL2 = '32.76';
      const sdL2 = '2.78';
      const pointL2 = '15';

      multiSummary.verifyEnteredValueStoredL2(meanL2, sdL2, pointL2).then(function (saved1) {
        expect(saved1).toBe(true);
      });

      const storedMap = new Map<string, string>();
      storedMap.set('11', '5.76');
      storedMap.set('12', '0.04');
      storedMap.set('13', '42');

      multiSummary.enterMeanSDPointValues(storedMap).then(function (entered) {
        expect(entered).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      const mean = '5.76';
      const sd = '0.04';
      const point = '42';

      multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (saved) {
        expect(saved).toBe(true);
      });
      multiSummary.veryfyL2ValuesNotDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });


    });


  it('Test case 130191 On Cancel : Should clear the values from the input fields.', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.selectRunEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataMap7 = new Map<string, string>();
    dataMap7.set('11', '4.6');
    dataMap7.set('12', '1.01');
    dataMap7.set('13', '5');

    multiSummary.enterMeanSDPointValues(dataMap7).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.clickCancle().then(function (cancled) {
      expect(cancled).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
  });


  it('Test case 130196: On Cancel : Should collapse change-lot/comment.', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.verifyDateTimePicker().then(function (selected) {
      expect(selected).toBe(true);
    });
    multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
      expect(hover).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    multiSummary.clickVerifyChangeLot().then(function (opened) {
      expect(opened).toBe(true);
    });
    const dataMap7 = new Map<string, string>();
    dataMap7.set('11', '34.6');
    dataMap7.set('12', '0');
    dataMap7.set('13', '1');
    multiSummary.enterMeanSDPointValues(dataMap7).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    const comment = jsonData.Comment;
    const test = '1';
    multiSummary.addComment(comment, test).then(function (comment1) {
      expect(comment1).toBe(true);
    });
    multiSummary.clickCancle().then(function (cancled1) {
      expect(cancled1).toBe(true);
    });
    multiSummary.OptionNotDisplayed().then(function (displayed) {
      expect(displayed).toBe(false);
    });
  });


  it('Test case 128253: Verify Application User Access.', function () {
    out.signOut();
    const username = jsonData.UserRoleUsername;
    const password = jsonData.UserRolePassword;
    const firstName = jsonData.UserRoleFirstname;
    loginEvent.doLogin(username, password, firstName).then(function (login) {
      expect(login).toBe(true);
    });
    const assignedLab = jsonData.Assignedlab;
    dashboard.verifyAssignedLabToUser(assignedLab).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 128028: Verify Instrument based multi summary page on sorting analyte by name', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const expectedTest1 = jsonData.Instrument4Product1Test1;
    const expectedTest2 = jsonData.Instrument4Product1Test2;
    const expectedTest3 = jsonData.Instrument4Product1Test3;
    const instruFlag = true;
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifySortingOfAnalyteSummeryEntryIntrumentBased(expectedTest1, expectedTest2,
      expectedTest3, instruFlag).then(function (sorted) {
        expect(sorted).toBe(true);
      });
  });

  it('Test case 128033: Verify Product based multi summary page on sorting analyte by name', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const expectedTest1 = jsonData.Instrument4Product1Test1;
    const expectedTest2 = jsonData.Instrument4Product1Test2;
    const expectedTest3 = jsonData.Instrument4Product1Test3;
    const instruFlag = true;
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifySortingOfAnalyteSummeryEntryIntrumentBased(expectedTest1, expectedTest2,
      expectedTest3, instruFlag).then(function (sorted) {
        expect(sorted).toBe(true);
      });
  });


  it('Test case 128023: Verify product based multi summary page', function () {
    log4jsconfig.log().info('Test case 128023: Verify product based multi summary page');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername, jsonData.SampadaPassword,
      jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (hamburger) {
      expect(hamburger).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    dataTable.expandTree().then(function (expand) {
      expect(expand).toBe(true);
      dashboard.waitForElement();

    });

    dataTable.goToInstrument_ProductName(prod).then(function (status) {
      expect(status).toBe(true);
    });
    const test = jsonData.Instrument4Product1Test1;
    multiSummary.clearAllTestsData(test).then(function (cleared) {

      expect(cleared).toBe(true);
    });

    const test2 = jsonData.Instrument4Product1Test2;
    multiSummary.clearAllTestsData(test2).then(function (cleared1) {

      expect(cleared1).toBe(true);
    });
    const test3 = jsonData.Instrument4Product1Test3;
    multiSummary.clearAllTestsData(test3).then(function (cleared2) {

      expect(cleared2).toBe(true);
    });
    dataTable.goToInstrument_ProductName(prod).then(function (status) {
      expect(status).toBe(true);
    });
    multiSummary.clickSpcRule().then(function (spc1) {

      expect(spc1).toBe(true);
    });
    multiSummary.checkVerifySummaryEntryToggleButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiSummary.isLevel1CheckBoxChecked().then(function (level1Ele) {

      expect(level1Ele).toBe(true);
    });
    multiSummary.isLevel2CheckBoxChecked().then(function (level2Ele) {


      expect(level2Ele).toBe(true);
    });
    const level1 = true;
    const level1Val = jsonData.Level1Val2;
    const level2 = true;
    const level2Val = jsonData.Level2Val2;
    const level3 = false;
    const level3Val = ' ';
    const level4 = false;
    const level4Val = ' ';
    multiSummary.setDecimalPlaces(level1, level1Val, level2, level2Val, level3, level3Val, level4, level4Val).then(function (set) {
      expect(set).toBe(true);
    });

    multiSummary.clickApply().then(function (apply) {
      expect(apply).toBe(true);
    });
    const toastMsg = 'SPC Rules has been updated successfully!';
    multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {

    });


    multiSummary.goToDataTable().then(function (dataTabconstbl) {
      expect(dataTabconstbl).toBe(true);
      dashBoard.waitForPage();
    });
    const instru_ProdName = jsonData.Instrument4Product1;
    multiSummary.verifyIntrumentLevelPageUIElements(instru_ProdName).then(function (verified) {
      expect(verified).toBe(true);
    });
    const data_Map = new Map<string, string>();
    data_Map.set('11', '0');
    data_Map.set('12', '0');
    data_Map.set('13', '0');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickCancelBtn().then(function (cancle) {
      expect(cancle).toBe(true);
    });
    //  Test 1
    const mapData = new Map<string, string>();
    mapData.set('11', '4.6');
    mapData.set('12', '1.01');
    mapData.set('13', '5');
    mapData.set('14', '4.6');
    mapData.set('15', '1.01');
    mapData.set('16', '5');
    multiSummary.enterMeanSDPointValues(mapData).then(function (result1) {
      expect(result1).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const mean = '4.60';
    const sd = '1.01';
    const point = '5';

    multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (saved) {

      expect(saved).toBe(true);
    });
    const mean1 = '4.60';
    const sd1 = '1.01';
    const point1 = '5';

    multiSummary.verifyEnteredValueStoredL2(mean1, sd1, point1).then(function (saved) {

      expect(saved).toBe(true);
    });


    const mapData2 = new Map<string, string>();
    mapData2.set('21', '13.1');
    mapData2.set('22', '1.41');
    mapData2.set('23', '5');
    mapData2.set('24', '13.1');
    mapData2.set('25', '1.41');
    mapData2.set('26', '5');
    multiSummary.enterMeanSDPointValues(mapData2).then(function (result2) {
      expect(result2).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled2) {
      expect(disabled2).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const mean3 = '13.10';
    const sd3 = '1.41';
    const point3 = '5';

    //  Verify the stored values
    multiSummary.verifyEnteredValueStoredTest2(mean3, sd3, point3).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const mean4 = '13.10';
    const sd4 = '1.41';
    const point4 = '5';

    multiSummary.verifyEnteredValueStoredL2Test2(mean4, sd4, point4).then(function (saved4) {

      expect(saved4).toBe(true);
    });


  });





  it('Test case 128022: Verify Instrument based multi summary page', function () {
    log4jsconfig.log().info('Test case 128022: Verify Instrument based multi summary page');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername, jsonData.SampadaPassword,
      jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (hamburger) {
      expect(hamburger).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    const instName = jsonData.Instrument4Name;
    dataTable.expandTree().then(function (expand) {
      expect(expand).toBe(true);
      dashboard.waitForElement();

    });

    dataTable.goToInstrument_ProductName(prod).then(function (status) {
      expect(status).toBe(true);
    });

    const test = jsonData.Instrument4Product1Test1;
    multiSummary.clearAllTestsData(test).then(function (cleared) {

      expect(cleared).toBe(true);
    });

    const test2 = jsonData.Instrument4Product1Test2;
    multiSummary.clearAllTestsData(test2).then(function (cleared1) {

      expect(cleared1).toBe(true);
    });
    const test3 = jsonData.Instrument4Product1Test3;
    multiSummary.clearAllTestsData(test3).then(function (cleared2) {

      expect(cleared2).toBe(true);
    });


    dataTable.goToProduct(dept, inst, prod).then(function (product) {

      expect(product).toBe(true);
    });
    multiSummary.clickSpcRule().then(function (spc1) {

      expect(spc1).toBe(true);
    });
    multiSummary.checkVerifySummaryEntryToggleButton().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiSummary.isLevel1CheckBoxChecked().then(function (level1Ele) {

      expect(level1Ele).toBe(true);
    });
    multiSummary.isLevel2CheckBoxChecked().then(function (level2Ele) {


      expect(level2Ele).toBe(true);
    });
    const level1 = true;
    const level1Val = jsonData.Level1Val2;
    const level2 = true;
    const level2Val = jsonData.Level2Val2;
    const level3 = false;
    const level3Val = ' ';
    const level4 = false;
    const level4Val = ' ';
    multiSummary.setDecimalPlaces(level1, level1Val, level2, level2Val, level3, level3Val, level4, level4Val).then(function (set) {
      expect(set).toBe(true);
    });

    multiSummary.clickApply().then(function (apply) {
      expect(apply).toBe(true);
    });
    const toastMsg = 'SPC Rules has been updated successfully!';
    multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {

    });
    multiSummary.goToDataTable().then(function (dataTable1) {
      expect(dataTable1).toBe(true);
      dashBoard.waitForPage();
    });
    dataTable.goToInstrument_ProductName(instName).then(function (instru) {

      expect(instru).toBe(true);
    });
    const instruName = jsonData.Instrument4Product1;
    multiSummary.verifyIntrumentLevelPageUIElements(instruName).then(function (verified) {
      expect(verified).toBe(true);
    });
    const data_Map = new Map<string, string>();
    data_Map.set('11', '0');
    data_Map.set('12', '0');
    data_Map.set('13', '0');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancle) {
      expect(cancle).toBe(true);
    });
    const mapData = new Map<string, string>();
    mapData.set('11', '23');
    mapData.set('12', '1.41');
    mapData.set('13', '5');
    mapData.set('14', '23');
    mapData.set('15', '1.41');
    mapData.set('16', '5');
    multiSummary.enterMeanSDPointValues(mapData).then(function (result1) {
      expect(result1).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submit) {
      expect(submit).toBe(true);
      const mean = '23.00';
      const sd = '1.41';
      const point = '5';

      multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (saved) {

        expect(saved).toBe(true);
      });
      const mean1 = '23.00';
      const sd1 = '1.41';
      const point1 = '5';

      multiSummary.verifyEnteredValueStoredL2(mean1, sd1, point1).then(function (saved) {

        expect(saved).toBe(true);
      });


      const mapData2 = new Map<string, string>();
      mapData2.set('21', '28.8');
      mapData2.set('22', '14.57');
      mapData2.set('23', '5');
      mapData2.set('24', '28.8');
      mapData2.set('25', '14.57');
      mapData2.set('26', '5');
      multiSummary.enterMeanSDPointValues(mapData2).then(function (result2) {
        expect(result2).toBe(true);
      });

      multiSummary.verifySubmitButtonEnabled().then(function (disabled2) {
        expect(disabled2).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (submit2) {
        expect(submit2).toBe(true);
      });

      const mean3 = '28.80';
      const sd3 = '14.57';
      const point3 = '5';

      multiSummary.verifyEnteredValueStoredTest2InstrumentLvl(mean3, sd3, point3).then(function (saved2) {

        expect(saved2).toBe(true);
      });
      const mean4 = '28.80';
      const sd4 = '14.57';
      const point4 = '5';


      multiSummary.verifyEnteredValueStoredL2Test2InstrumentLvl(mean4, sd4, point4).then(function (saved4) {

        expect(saved4).toBe(true);
      });


    });


  });

  //  Data Deconstion Issue - Unable to deconste data as data is disabled
  it('Test case 126800: Rows of test data are arranged consecutively by date and time.', function () {
    log4jsconfig.log().info('Test case 126800: Rows of test data are arranged consecutively by date and time.');
    //  loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
    //  jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
    //    expect(loggedIn).toBe(true);
    //  });
    const test = jsonData.AnalyteName;
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clearAllTestsData(test).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    const test2 = jsonData.AnalyteName1;
    multiSummary.clearAllTestsData(test2).then(function (cleared1) {
      expect(cleared1).toBe(true);
    });

    const test3 = jsonData.AnalyteName2;
    multiSummary.clearAllTestsData(test3).then(function (cleared2) {
      expect(cleared2).toBe(true);
    });
    newLabSetup.clickBackArrow().then(function (navigate) {
      expect(navigate).toBe(true);
    });

    const mapDataMap = new Map<string, string>();
    mapDataMap.set('11', '28.80');
    mapDataMap.set('12', '1.57');
    mapDataMap.set('13', '5');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(mapDataMap).then(function (result2) {
      expect(result2).toBe(true);
    });


    const month3 = '2';

    multiSummary.verifyDateForTest(month3).then(function (verified4) {

      expect(verified4).toBe(true);
    });


    const mean1 = '28.80';
    const sd1 = '1.57';
    const point1 = '5';
    const test1 = '1';
    // Verify the stored values
    multiSummary.verifyEnteredValueStoredL1AllTest(mean1, sd1, point1, test1).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    //  newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
    //    expect(navigate).toBe(true);
    //  });

    const mapData2 = new Map<string, string>();
    mapData2.set('11', '38.80');
    mapData2.set('12', '0.57');
    mapData2.set('13', '15');
    multiSummary.enterMeanSDPointValues(mapData2).then(function (result2) {
      expect(result2).toBe(true);
    });

    const month2 = '1';
    multiSummary.verifyDateForTest(month2).then(function (verified3) {
      expect(verified3).toBe(true);
    });
    const mean3 = '38.80';
    const sd3 = '0.57';
    const point3 = '15';
    const test31 = '1';
    // Verify the stored values
    multiSummary.verifyEnteredValueStoredL1AllTest(mean3, sd3, point3, test31).then(function (saved2) {
      expect(saved2).toBe(true);
    });
    //  newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
    //    expect(navigate).toBe(true);
    //  });
    const mapData = new Map<string, string>();
    mapData.set('11', '48.80');
    mapData.set('12', '04.57');
    mapData.set('13', '23');
    multiSummary.enterMeanSDPointValues(mapData).then(function (result2) {
      expect(result2).toBe(true);
    });
    const month1 = '0';
    multiSummary.verifyDateForTest(month1).then(function (verified2) {
      expect(verified2).toBe(true);
    });
    const mean = '48.80';
    const sd = '04.57';
    const point = '23';
    const prodtest2 = '1';
    // Verify the stored values
    multiSummary.verifyEnteredValueStoredL1AllTest(mean, sd, point, prodtest2).then(function (saved2) {
      expect(saved2).toBe(true);
    });
  });


  it('Test case 128024: Verify Instrument based multi summary page data on select different Date-Timer Picker.', function () {
    log4jsconfig.log().info('Test case 128024: Verify Instrument based multi summary page data on select different Date-Timer Picker.');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    const instrumentName = jsonData.Instrument4Name;
    dataTable.expandTree().then(function (expand) {
      expect(expand).toBe(true);
      dashboard.waitForElement();

    });

    dataTable.goToInstrument_ProductName(prod).then(function (status) {
      expect(status).toBe(true);
    });

    multiSummary.clickSpcRule().then(function (spc1) {
      expect(spc1).toBe(true);
    });

    const level1 = true;
    const level1Val = jsonData.Level1Val0;
    const level2 = true;
    const level2Val = jsonData.Level2Val1;
    const level3 = false;
    const level3Val = ' ';
    const level4 = false;
    const level4Val = ' ';
    multiSummary.setDecimalPlaces(level1, level1Val, level2, level2Val, level3, level3Val, level4, level4Val).then(function (level) {
      expect(level).toBe(true);
    });
    multiSummary.clickApply().then(function (applyClicked) {
      expect(applyClicked).toBe(true);
    });
    const toastMsg = 'SPC Rules has been updated successfully!';
    multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {

    });

    multiSummary.goToDataTable().then(function (dataTable1) {
      expect(dataTable1).toBe(true);
      dashBoard.waitForPage();
    });

    const instruName = jsonData.Instrument4Name;
    dataTable.goToInstrument_ProductName(instruName).then(function (instrument1) {
      expect(instrument1).toBe(true);
      dashBoard.waitForPage();

    });


    multiSummary.verifyIntrumentLevelPageUIElements(instruName).then(function (verified) {
      expect(verified).toBe(true);


    });

    const cmnt1 = jsonData.Comment;
    const test11 = '1';
    const hoverTest1 = '11';
    multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
      expect(hover).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    multiSummary.addComment(cmnt1, test11).then(function (added) {
      expect(added).toBe(true);
    });


    // Test 1

    const data_Map = new Map<string, string>();
    data_Map.set('11', '4.6');
    data_Map.set('12', '1.01');
    data_Map.set('13', '5');
    data_Map.set('14', '4.6');
    data_Map.set('15', '1.01');
    data_Map.set('16', '5');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean = '5';
    const sd = '1';
    const point = '5';
    const mean2 = '4.6';
    const sd2 = '1.0';
    const point2 = '5';

    // Verify the stored values L1
    multiSummary.clickCancelBtn().then(function (clickcancle) {
      expect(clickcancle).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (saved) {

      expect(saved).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredL2(mean2, sd2, point2).then(function (saved2) {

      expect(saved2).toBe(true);
    });

    const cmnt = jsonData.Comment;
    const cmntCount1 = '1';
    const test1 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount1, cmnt, test1).then(function (verified1) {
      expect(verified1).toBe(true);


    });


    // Test 2
    const cmnt2 = jsonData.Comment;
    const test = '2';
    const hoverTest = '21';
    multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
      expect(hover).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    multiSummary.addComment(cmnt, test).then(function (added1) {
      expect(added1).toBe(true);
    });
    const data_Map2 = new Map<string, string>();
    data_Map2.set('21', '5.6');
    data_Map2.set('22', '5.01');
    data_Map2.set('23', '5');
    data_Map2.set('24', '5.6');
    data_Map2.set('25', '5.01');
    data_Map2.set('26', '5');
    multiSummary.enterMeanSDPointValues(data_Map2).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean3 = '6';
    const sd3 = '5';
    const point3 = '5';
    const mean4 = '5.6';
    const sd4 = '5.0';
    const point4 = '5';

    // Verify the stored values L1
    multiSummary.verifyEnteredValueStoredTest2InstrumentLvl(mean3, sd3, point3).then(function (saved) {

      expect(saved).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredL2Test2InstrumentLvl(mean4, sd4, point4).then(function (saved2) {

      expect(saved2).toBe(true);
    });

    const cmntCount = '1';

    multiSummary.verifyCommentAndInteractionIcon(cmntCount, cmnt2, test).then(function (verified1) {
      expect(verified1).toBe(true);


    });


    multiSummary.setFutureDate().then(function (datePrev) {
      expect(datePrev).toBe(true);
    });


  });


  //  comment icon is not displaying.
  it('Test case 128029: Verify Product based multi summary page data on select different Date-Timer Picker.', function () {
    log4jsconfig.log().info('Test case 128029: Verify Product based multi summary page data on select different Date-Timer Picker.');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    const instrumentName = jsonData.Instrument4Name;
    dataTable.expandTree().then(function (expand) {
      expect(expand).toBe(true);
      dashboard.waitForElement();

    });

    dataTable.goToInstrument_ProductName(prod).then(function (status) {
      expect(status).toBe(true);
    });
    // Spc page validation is covered in TC 128024
    const prodName = jsonData.Instrument4Product1;
    multiSummary.verifyIntrumentLevelPageUIElements(prodName).then(function (verified) {
      expect(verified).toBe(true);


    });
    const cmnt3 = jsonData.Comment;
    const test13 = '1';
    const hoverTest3 = '11';
    multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
      expect(hover).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    multiSummary.addComment(cmnt3, test13).then(function (added) {
      expect(added).toBe(true);
    });


    // Test 1

    const data_Map = new Map<string, string>();
    data_Map.set('11', '4.6');
    data_Map.set('12', '1.01');
    data_Map.set('13', '5');
    data_Map.set('14', '4.6');
    data_Map.set('15', '1.01');
    data_Map.set('16', '5');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean = '5';
    const sd = '1';
    const point = '5';
    const mean2 = '4.6';
    const sd2 = '1.0';
    const point2 = '5';

    // Verify the stored values L1
    multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (saved) {

      expect(saved).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredL2(mean2, sd2, point2).then(function (saved2) {

      expect(saved2).toBe(true);
    });

    const cmnt = jsonData.Comment;
    const cmntCount1 = '1';
    const test1 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount1, cmnt, test1).then(function (verified1) {
      expect(verified1).toBe(true);


    });


    // Test 2
    const cmnt2 = jsonData.Comment;
    const test = '2';
    const hoverTest = '21';
    multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
      expect(hover).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    multiSummary.addComment(cmnt, test).then(function (added1) {
      expect(added1).toBe(true);
    });
    const data_Map2 = new Map<string, string>();
    data_Map2.set('21', '5.6');
    data_Map2.set('22', '5.01');
    data_Map2.set('23', '5');
    data_Map2.set('24', '5.6');
    data_Map2.set('25', '5.01');
    data_Map2.set('26', '5');
    multiSummary.enterMeanSDPointValues(data_Map2).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean3 = '6';
    const sd3 = '5';
    const point3 = '5';
    const mean4 = '5.6';
    const sd4 = '5.0';
    const point4 = '5';

    // Verify the stored values L1
    multiSummary.verifyEnteredValueStoredTest2(mean3, sd3, point3).then(function (saved) {

      expect(saved).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredL2Test2(mean4, sd4, point4).then(function (saved2) {

      expect(saved2).toBe(true);
    });

    const cmntCount = '1';

    multiSummary.verifyCommentAndInteractionIcon(cmntCount, cmnt2, test).then(function (verified1) {
      expect(verified1).toBe(true);


    });


    multiSummary.setFutureDate().then(function (datePrev) {
      expect(datePrev).toBe(true);
    });


  });


  //  comment icon is not displaying.
  it('Test case 128025: Verify Product based multi summary page data on level setting changed.', function () {
    log4jsconfig.log().info('Test case 128025: Verify Product based multi summary page data on level setting changed.');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    const instrument = jsonData.Instrument3Name;
    const product1 = jsonData.Instrument3Product1;
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });


    dataTable.expandTree().then(function (expanded) {
      expect(expanded).toBe(true);

    });
    dataTable.goToInstrument_ProductName(product1).then(function (product) {
      expect(product).toBe(true);

    });
    multiSummary.clickSpcRule().then(function (spc1) {

      expect(spc1).toBe(true);
    });
    multiSummary.checkVerifySummaryEntryToggleButton().then(function (toggledisplayed) {

      expect(toggledisplayed).toBe(true);

    });
    const level1 = true;
    const level1Val = jsonData.Level1Val0;
    const level2 = true;
    const level2Val = jsonData.Level2Val1;
    const level3 = true;
    const level3Val = jsonData.Level3Val2;
    const level4 = false;
    const level4Val = ' ';
    multiSummary.setDecimalPlaces(level1, level1Val, level2, level2Val, level3, level3Val, level4, level4Val).then(function (level) {

      expect(level).toBe(true);
    });
    multiSummary.clickApply().then(function (applyClicked) {

      expect(applyClicked).toBe(true);
    });
    const toastMsg = 'SPC Rules has been updated successfully!';
    multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {

      expect(msgDisplayed).toBe(true);

    });
    multiSummary.goToDataTable().then(function (dataTable1) {

      expect(dataTable1).toBe(true);
      dashBoard.waitForPage();
    });

    multiSummary.verifyIntrumentLevelPageUIElementsSixTests(product1).then(function (verified) {

      expect(verified).toBe(true);
    });

    const cmnt22 = jsonData.Cmnt;
    const testComment2 = '1';
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });

    const data_Map = new Map<string, string>();
    data_Map.set('104', '4.6');
    data_Map.set('105', '1.01');
    data_Map.set('106', '5');
    data_Map.set('204', '4.6');
    data_Map.set('205', '1.01');
    data_Map.set('206', '5');
    data_Map.set('304', '4.6');
    data_Map.set('305', '1.01');
    data_Map.set('306', '5');
    data_Map.set('404', '4.6');
    data_Map.set('405', '1.01');
    data_Map.set('406', '5');
    data_Map.set('504', '4.6');
    data_Map.set('505', '1.01');
    data_Map.set('506', '5');
    data_Map.set('604', '4.6');
    data_Map.set('605', '1.01');
    data_Map.set('606', '5');
    multiSummary.addComment(cmnt22, testComment2).then(function (added1) {
      expect(added1).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean1 = '4.6';
    const sd1 = '1.0';
    const point1 = '5';
    const mean21 = '4.6';
    const sd21 = '1.0';
    const point21 = '5';
    const mean31 = '4.6';
    const sd31 = '1.0';
    const point31 = '5';
    const mean41 = '4.6';
    const sd41 = '1.0';
    const point41 = '5';
    const mean51 = '4.6';
    const sd51 = '1.0';
    const point51 = '5';
    const mean61 = '4.6';
    const sd61 = '1.0';
    const point61 = '5';

    const test11 = '1';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean1, sd1, point1, test11).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test21 = '2';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean21, sd21, point21, test21).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test31 = '3';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean31, sd31, point31, test31).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test41 = '4';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean41, sd41, point41, test41).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test51 = '5';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean51, sd51, point51, test51).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test61 = '6';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean61, sd61, point61, test61).then(function (saved2) {

      expect(saved2).toBe(true);
    });

    const cmnt7 = jsonData.Cmnt;
    const cmntCount7 = '1';
    const test17 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount7, cmnt7, test17).then(function (verified1) {
      expect(verified1).toBe(true);
    });

    //  Matrix 1 level1 and level2
    const cmnt21 = jsonData.Test4Cmt;
    const testComment1 = '1';

    const dataMap12 = new Map<string, string>();

    dataMap12.set('104', '4.6');
    dataMap12.set('105', '1.01');
    dataMap12.set('106', '5');
    dataMap12.set('204', '4.6');
    dataMap12.set('205', '1.01');
    dataMap12.set('206', '5');
    dataMap12.set('304', '4.6');
    dataMap12.set('305', '1.01');
    dataMap12.set('306', '5');
    dataMap12.set('404', '4.6');
    dataMap12.set('405', '1.01');
    dataMap12.set('406', '5');
    dataMap12.set('504', '4.6');
    dataMap12.set('505', '1.01');
    dataMap12.set('506', '5');
    dataMap12.set('604', '4.6');
    dataMap12.set('605', '1.01');
    dataMap12.set('606', '5');
    dataMap12.set('101', '4.6');
    dataMap12.set('102', '1.01');
    dataMap12.set('103', '5');
    dataMap12.set('201', '4.6');
    dataMap12.set('202', '1.01');
    dataMap12.set('203', '5');
    dataMap12.set('301', '4.6');
    dataMap12.set('302', '1.01');
    dataMap12.set('303', '5');
    dataMap12.set('401', '4.6');
    dataMap12.set('402', '1.01');
    dataMap12.set('403', '5');
    dataMap12.set('501', '4.6');
    dataMap12.set('502', '1.01');
    dataMap12.set('503', '5');
    dataMap12.set('601', '4.6');
    dataMap12.set('602', '1.01');
    dataMap12.set('603', '5');
    multiSummary.addComment(cmnt21, testComment1).then(function (added1) {
      expect(added1).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap12).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean8 = '4.6';
    const sd8 = '1.0';
    const point8 = '5';
    const mean28 = '4.6';
    const sd28 = '1.0';
    const point28 = '5';
    const mean38 = '4.6';
    const sd38 = '1.0';
    const point38 = '5';
    const mean48 = '4.6';
    const sd48 = '1.0';
    const point48 = '5';
    const mean58 = '4.6';
    const sd58 = '1.0';
    const point58 = '5';
    const mean68 = '4.6';
    const sd68 = '1.0';
    const point68 = '5';

    const test8 = '1';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean8, sd8, point8, test8).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test28 = '2';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean28, sd28, point28, test28).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test38 = '3';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean28, sd28, point28, test38).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test48 = '4';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean28, sd28, point28, test48).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test58 = '5';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean28, sd28, point28, test58).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test68 = '6';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean28, sd28, point28, test68).then(function (saved2) {

      expect(saved2).toBe(true);
    });


    const mean9 = '5';
    const sd9 = '1';
    const point9 = '5';
    const mean29 = '5';
    const sd29 = '1';
    const point29 = '5';
    const mean39 = '5';
    const sd39 = '1';
    const point39 = '5';
    const mean49 = '5';
    const sd49 = '1';
    const point49 = '5';
    const mean59 = '5';
    const sd59 = '1';
    const point59 = '5';
    const mean69 = '5';
    const sd69 = '1';
    const point69 = '5';
    const test9 = '1';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean9, sd9, point9, test9).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test29 = '2';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean29, sd29, point29, test29).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test39 = '3';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean29, sd29, point29, test39).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test49 = '4';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean29, sd29, point29, test49).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test59 = '5';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean29, sd29, point29, test59).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test69 = '6';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean29, sd29, point29, test69).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const cmnt9 = jsonData.Test4Cmt;
    const cmntCount9 = '1';
    const test19 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount9, cmnt9, test19).then(function (verified1) {
      expect(verified1).toBe(true);
    });


    //  Matrix 2 level1 and level3
    const cmnt29 = jsonData.Test5Cmt;
    const testComment9 = '1';

    const dataMap13 = new Map<string, string>();

    dataMap13.set('107', '4.6');
    dataMap13.set('108', '1.01');
    dataMap13.set('109', '5');
    dataMap13.set('207', '4.6');
    dataMap13.set('208', '1.01');
    dataMap13.set('209', '5');
    dataMap13.set('307', '4.6');
    dataMap13.set('308', '1.01');
    dataMap13.set('309', '5');
    dataMap13.set('407', '4.6');
    dataMap13.set('408', '1.01');
    dataMap13.set('409', '5');
    dataMap13.set('507', '4.6');
    dataMap13.set('508', '1.01');
    dataMap13.set('509', '5');
    dataMap13.set('607', '4.6');
    dataMap13.set('608', '1.01');
    dataMap13.set('609', '5');
    dataMap13.set('101', '4.6');
    dataMap13.set('102', '1.01');
    dataMap13.set('103', '5');
    dataMap13.set('201', '4.6');
    dataMap13.set('202', '1.01');
    dataMap13.set('203', '5');
    dataMap13.set('301', '4.6');
    dataMap13.set('302', '1.01');
    dataMap13.set('303', '5');
    dataMap13.set('401', '4.6');
    dataMap13.set('402', '1.01');
    dataMap13.set('403', '5');
    dataMap13.set('501', '4.6');
    dataMap13.set('502', '1.01');
    dataMap13.set('503', '5');
    dataMap13.set('601', '4.6');
    dataMap13.set('602', '1.01');
    dataMap13.set('603', '5');
    multiSummary.addComment(cmnt29, testComment9).then(function (added1) {
      expect(added1).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap13).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean0 = '4.60';
    const sd0 = '1.01';
    const point0 = '5';
    const mean20 = '4.60';
    const sd20 = '1.01';
    const point20 = '5';
    const mean30 = '4.60';
    const sd30 = '1.01';
    const point30 = '5';
    const mean40 = '4.60';
    const sd40 = '1.01';
    const point40 = '5';
    const mean50 = '4.60';
    const sd50 = '1.01';
    const point50 = '5';
    const mean60 = '4.60';
    const sd60 = '1.01';
    const point60 = '5';

    const test0 = '1';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean0, sd0, point0, test0).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test20 = '2';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean20, sd20, point20, test20).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test30 = '3';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean20, sd20, point20, test30).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test40 = '4';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean20, sd20, point20, test40).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test50 = '5';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean20, sd20, point20, test50).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test60 = '6';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean20, sd20, point20, test60).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const mean10 = '5';
    const sd10 = '1';
    const point10 = '5';
    const mean102 = '5';
    const sd102 = '1';
    const point102 = '5';
    const mean103 = '5';
    const sd103 = '1';
    const point103 = '5';
    const mean104 = '5';
    const sd104 = '1';
    const point104 = '5';
    const mean105 = '5';
    const sd105 = '1';
    const point105 = '5';
    const mean106 = '5';
    const sd106 = '1';
    const point106 = '5';
    const test10 = '1';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean10, sd10, point10, test10).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test102 = '2';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean102, sd102, point102, test102).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test103 = '3';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean102, sd102, point102, test103).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test104 = '4';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean102, sd102, point102, test104).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test105 = '5';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean102, sd102, point102, test105).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test106 = '6';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean102, sd102, point102, test106).then(function (saved2) {

      expect(saved2).toBe(true);
    });

    const cmnt10 = jsonData.Test5Cmt;
    const cmntCount10 = '1';
    const test101 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount10, cmnt10, test101).then(function (verified1) {
      expect(verified1).toBe(true);
    });

    const cmnt210 = jsonData.Test6Cmt;
    const test10Comment = '1';

    const dataMap23 = new Map<string, string>();

    dataMap23.set('107', '5.6');
    dataMap23.set('108', '5.01');
    dataMap23.set('109', '5');
    dataMap23.set('207', '5.6');
    dataMap23.set('208', '5.01');
    dataMap23.set('209', '5');
    dataMap23.set('307', '5.6');
    dataMap23.set('308', '5.01');
    dataMap23.set('309', '5');
    dataMap23.set('407', '5.6');
    dataMap23.set('408', '5.01');
    dataMap23.set('409', '5');
    dataMap23.set('507', '5.6');
    dataMap23.set('508', '5.01');
    dataMap23.set('509', '5');
    dataMap23.set('607', '5.6');
    dataMap23.set('608', '5.01');
    dataMap23.set('609', '5');
    dataMap23.set('101', '5.6');
    dataMap23.set('102', '5.01');
    dataMap23.set('103', '5');
    dataMap23.set('201', '5.6');
    dataMap23.set('202', '5.01');
    dataMap23.set('203', '5');
    dataMap23.set('301', '5.6');
    dataMap23.set('302', '5.01');
    dataMap23.set('303', '5');
    dataMap23.set('401', '5.6');
    dataMap23.set('402', '5.01');
    dataMap23.set('403', '5');
    dataMap23.set('501', '5.6');
    dataMap23.set('502', '5.01');
    dataMap23.set('503', '5');
    dataMap23.set('601', '5.6');
    dataMap23.set('602', '5.01');
    dataMap23.set('603', '5');
    multiSummary.addComment(cmnt210, test10Comment).then(function (added1) {
      expect(added1).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap23).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean201 = '5.6';
    const sd201 = '5.0';
    const point201 = '5';
    const mean202 = '5.6';
    const sd202 = '5.0';
    const point202 = '5';
    const mean203 = '5.6';
    const sd203 = '5.0';
    const point203 = '5';
    const mean204 = '5.6';
    const sd204 = '5.0';
    const point204 = '5';
    const mean205 = '5.6';
    const sd205 = '5.0';
    const point205 = '5';
    const mean206 = '5.6';
    const sd206 = '5.0';
    const point206 = '5';


    const test201 = '1';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean20, sd20, point20, test201).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test202 = '2';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean202, sd202, point202, test202).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test203 = '3';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean202, sd202, point202, test203).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test204 = '4';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean202, sd202, point202, test204).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test205 = '5';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean202, sd202, point202, test205).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test206 = '6';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean202, sd202, point202, test206).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const mean301 = '5.60';
    const sd301 = '5.01';
    const point301 = '5';
    const mean302 = '5.60';
    const sd302 = '5.01';
    const point302 = '5';
    const mean303 = '5.60';
    const sd303 = '5.01';
    const point303 = '5';
    const mean304 = '5.60';
    const sd304 = '5.01';
    const point304 = '5';
    const mean305 = '5.60';
    const sd305 = '5.01';
    const point305 = '5';
    const mean306 = '5.60';
    const sd306 = '5.01';
    const point306 = '5';

    const test311 = '1';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean30, sd30, point30, test311).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test302 = '2';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean302, sd302, point302, test302).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test303 = '3';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean302, sd302, point302, test303).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test304 = '4';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean302, sd302, point302, test304).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test305 = '5';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean302, sd302, point302, test305).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test306 = '6';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean302, sd302, point302, test306).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const cmnt20 = jsonData.Test6Cmt;
    const cmntCount20 = '1';
    const test301 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount20, cmnt20, test301).then(function (verified1) {
      expect(verified1).toBe(true);
    });

    const cmnt220 = jsonData.Test1Cmt;
    const test30Comment = '1';

    const data_Map1 = new Map<string, string>();
    data_Map1.set('101', '4.6');
    data_Map1.set('102', '1.01');
    data_Map1.set('103', '5');
    data_Map1.set('201', '4.6');
    data_Map1.set('202', '1.01');
    data_Map1.set('203', '5');
    data_Map1.set('301', '4.6');
    data_Map1.set('302', '1.01');
    data_Map1.set('303', '5');
    data_Map1.set('401', '4.6');
    data_Map1.set('402', '1.01');
    data_Map1.set('403', '5');
    data_Map1.set('501', '4.6');
    data_Map1.set('502', '1.01');
    data_Map1.set('503', '5');
    data_Map1.set('601', '4.6');
    data_Map1.set('602', '1.01');
    data_Map1.set('603', '5');
    multiSummary.addComment(cmnt220, test30Comment).then(function (added1) {
    });
    multiSummary.enterMeanSDPointValues(data_Map1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean401 = '5';
    const sd401 = '1';
    const point401 = '5';
    const mean402 = '5';
    const sd402 = '1';
    const point402 = '5';
    const mean403 = '5';
    const sd403 = '1';
    const point403 = '5';
    const mean404 = '5';
    const sd404 = '1';
    const point404 = '5';
    const mean405 = '5';
    const sd405 = '1';
    const point405 = '5';
    const mean406 = '5';
    const sd406 = '1';
    const point406 = '5';
    const test4011 = '1';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean401, sd401, point401, test4011).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test402 = '2';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean402, sd402, point402, test402).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test403 = '3';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean402, sd402, point402, test403).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test404 = '4';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean402, sd402, point402, test404).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test405 = '5';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean402, sd402, point402, test405).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test406 = '6';
    multiSummary.verifyEnteredValueStoredL1AllTest(mean402, sd402, point402, test406).then(function (saved2) {

      expect(saved2).toBe(true);
    });

    const cmnt40 = jsonData.Test1Cmt;
    const cmntCount40 = '1';
    const test401 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount40, cmnt40, test401).then(function (verified1) {
      expect(verified1).toBe(true);
    });


    // Matrix 5: Level 2 only
    const cmnt250 = jsonData.Test2Cmt;
    const testComment50 = '1';

    const data_Map2 = new Map<string, string>();

    data_Map2.set('104', '4.6');
    data_Map2.set('105', '1.01');
    data_Map2.set('106', '5');
    data_Map2.set('204', '4.6');
    data_Map2.set('205', '1.01');
    data_Map2.set('206', '5');
    data_Map2.set('304', '4.6');
    data_Map2.set('305', '1.01');
    data_Map2.set('306', '5');
    data_Map2.set('404', '4.6');
    data_Map2.set('405', '1.01');
    data_Map2.set('406', '5');
    data_Map2.set('504', '4.6');
    data_Map2.set('505', '1.01');
    data_Map2.set('506', '5');
    data_Map2.set('604', '4.6');
    data_Map2.set('605', '1.01');
    data_Map2.set('606', '5');
    multiSummary.addComment(cmnt250, testComment50).then(function (added1) {
    });
    multiSummary.enterMeanSDPointValues(data_Map2).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });
    const mean501 = '4.6';
    const sd501 = '1.0';
    const point501 = '5';
    const mean502 = '4.6';
    const sd502 = '1.0';
    const point502 = '5';
    const mean503 = '4.6';
    const sd503 = '1.0';
    const point503 = '5';
    const mean504 = '4.6';
    const sd504 = '1.0';
    const point504 = '5';
    const mean505 = '4.6';
    const sd505 = '1.0';
    const point505 = '5';
    const mean506 = '4.6';
    const sd506 = '1.0';
    const point506 = '5';
    const test5011 = '1';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean501, sd501, point501, test5011).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test502 = '2';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean502, sd502, point502, test502).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test503 = '3';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean502, sd502, point502, test503).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test504 = '4';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean502, sd502, point502, test504).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test505 = '5';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean502, sd502, point502, test505).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test506 = '6';
    multiSummary.verifyEnteredValueStoredL2AllTest(mean502, sd502, point502, test506).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const cmnt50 = jsonData.Test2Cmt;
    const cmntCount50 = '1';
    const test501 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount50, cmnt50, test501).then(function (verified1) {
      expect(verified1).toBe(true);
    });


    const cmnt2 = jsonData.Test3Cmt;
    const testComment = '1';

    const data_Map3 = new Map<string, string>();

    data_Map3.set('107', '4.6');
    data_Map3.set('108', '1.01');
    data_Map3.set('109', '5');
    data_Map3.set('207', '4.6');
    data_Map3.set('208', '1.01');
    data_Map3.set('209', '5');
    data_Map3.set('307', '4.6');
    data_Map3.set('308', '1.01');
    data_Map3.set('309', '5');
    data_Map3.set('407', '4.6');
    data_Map3.set('408', '1.01');
    data_Map3.set('409', '5');
    data_Map3.set('507', '4.6');
    data_Map3.set('508', '1.01');
    data_Map3.set('509', '5');
    data_Map3.set('607', '4.6');
    data_Map3.set('608', '1.01');
    data_Map3.set('609', '5');
    multiSummary.addComment(cmnt2, testComment).then(function (added1) {
      expect(added1).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(data_Map3).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (status3) {
      expect(status3).toBe(true);
    });

    const mean = '4.60';
    const sd = '1.01';
    const point = '5';
    const mean2 = '4.60';
    const sd2 = '1.01';
    const point2 = '5';
    const mean3 = '4.60';
    const sd3 = '1.01';
    const point3 = '5';
    const mean4 = '4.60';
    const sd4 = '1.01';
    const point4 = '5';
    const mean5 = '4.60';
    const sd5 = '1.01';
    const point5 = '5';
    const mean6 = '4.60';
    const sd6 = '1.01';
    const point6 = '5';

    const test = '1';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean, sd, point, test).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test2 = '2';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean2, sd2, point2, test2).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test3 = '3';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean2, sd2, point2, test3).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test4 = '4';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean2, sd2, point2, test4).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test5 = '5';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean2, sd2, point2, test5).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const test6 = '6';
    multiSummary.verifyEnteredValueStoredL3AllTest(mean2, sd2, point2, test6).then(function (saved2) {

      expect(saved2).toBe(true);
    });
    const cmnt = jsonData.Test3Cmt;
    const cmntCount = '1';
    const test1 = '1';
    multiSummary.verifyCommentAndInteractionIcon(cmntCount, cmnt, test1).then(function (verified1) {
      expect(verified1).toBe(true);
    });


  });




  it('Test case 128025: Verify Instrument based multi summary page data on level setting changed.', function () {
    log4jsconfig.log().info('Test case 128025: Verify Instrument based multi summary page data on level setting changed.');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername, jsonData.SampadaPassword,
      jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    const instrument = jsonData.Instrument3;
    const product1 = jsonData.Instrument3Product1;
    dataTable.goToDataTablePage().then(function (displayed) {

      expect(displayed).toBe(true);
    });

    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.Instrument3;
    const prod = jsonData.Instrument3Product1;
    dataTable.expandTree().then(function (expanded) {
      expect(expanded).toBe(true);

    });
    dataTable.goToInstrument_ProductName(inst).then(function (instName) {
      expect(instName).toBe(true);

    });


    // SPC tab is disabled at instrument level

    multiSummary.verifyIntrumentLevelPageUIElementsSixTests(instrument).then(function (verified) {

      expect(verified).toBe(true);
    });
    // Level 2 All Tests
    const cmnt2 = jsonData.Cmnt;
    const testComment = '1';

    const data_Map = new Map<string, string>();
    data_Map.set('104', '4.6');
    data_Map.set('105', '1.01');
    data_Map.set('106', '5');
    data_Map.set('204', '4.6');
    data_Map.set('205', '1.01');
    data_Map.set('206', '5');
    data_Map.set('304', '4.6');
    data_Map.set('305', '1.01');
    data_Map.set('306', '5');
    data_Map.set('404', '4.6');
    data_Map.set('405', '1.01');
    data_Map.set('406', '5');
    data_Map.set('504', '4.6');
    data_Map.set('505', '1.01');
    data_Map.set('506', '5');
    data_Map.set('604', '4.6');
    data_Map.set('605', '1.01');
    data_Map.set('606', '5');
    multiSummary.addComment(cmnt2, testComment).then(function (added1) {
      expect(added1).toBe(true);

      multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
        expect(enabled).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (status3) {
        expect(status3).toBe(true);
      });
      const mean = '4.6';
      const sd = '1.0';
      const point = '5';
      const mean2 = '4.6';
      const sd2 = '1.0';
      const point2 = '5';
      const mean3 = '4.6';
      const sd3 = '1.0';
      const point3 = '5';
      const mean4 = '4.6';
      const sd4 = '1.0';
      const point4 = '5';
      const mean5 = '4.6';
      const sd5 = '1.0';
      const point5 = '5';
      const mean6 = '4.6';
      const sd6 = '1.0';
      const point6 = '5';

      // Verify the stored values L2
      const test = '1';
      multiSummary.verifyEnteredValueStoredL2AllTest(mean, sd, point, test).then(function (saved2) {

        expect(saved2).toBe(true);
      });
      const test2 = '2';
      multiSummary.verifyEnteredValueStoredL2AllTest(mean2, sd2, point2, test2).then(function (saved2) {

        expect(saved2).toBe(true);
      });
      const test3 = '3';
      multiSummary.verifyEnteredValueStoredL2AllTest(mean3, sd3, point3, test3).then(function (saved2) {

        expect(saved2).toBe(true);
      });
      const test4 = '4';
      multiSummary.verifyEnteredValueStoredL2AllTest(mean4, sd4, point4, test4).then(function (saved2) {

        expect(saved2).toBe(true);
      });
      const test5 = '5';
      multiSummary.verifyEnteredValueStoredL2AllTest(mean5, sd5, point5, test5).then(function (saved2) {

        expect(saved2).toBe(true);
      });
      const test6 = '6';
      multiSummary.verifyEnteredValueStoredL2AllTest(mean6, sd6, point6, test6).then(function (saved2) {

        expect(saved2).toBe(true);
      });

      const cmnt = jsonData.Cmnt;
      const cmntCount = '1';
      const test1 = '1';
      multiSummary.verifyCommentAndInteractionIcon(cmntCount, cmnt, test1).then(function (verified1) {
        expect(verified1).toBe(true);
      });

      //  Matrix 1 level1 and level2
      const cmnt27 = jsonData.Test4Cmt;
      const testComment7 = '1';
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);

      });
      const dataMap12 = new Map<string, string>();

      dataMap12.set('104', '4.6');
      dataMap12.set('105', '1.01');
      dataMap12.set('106', '5');
      dataMap12.set('204', '4.6');
      dataMap12.set('205', '1.01');
      dataMap12.set('206', '5');
      dataMap12.set('304', '4.6');
      dataMap12.set('305', '1.01');
      dataMap12.set('306', '5');
      dataMap12.set('404', '4.6');
      dataMap12.set('405', '1.01');
      dataMap12.set('406', '5');
      dataMap12.set('504', '4.6');
      dataMap12.set('505', '1.01');
      dataMap12.set('506', '5');
      dataMap12.set('604', '4.6');
      dataMap12.set('605', '1.01');
      dataMap12.set('606', '5');
      dataMap12.set('101', '4.6');
      dataMap12.set('102', '1.01');
      dataMap12.set('103', '5');
      dataMap12.set('201', '4.6');
      dataMap12.set('202', '1.01');
      dataMap12.set('203', '5');
      dataMap12.set('301', '4.6');
      dataMap12.set('302', '1.01');
      dataMap12.set('303', '5');
      dataMap12.set('401', '4.6');
      dataMap12.set('402', '1.01');
      dataMap12.set('403', '5');
      dataMap12.set('501', '4.6');
      dataMap12.set('502', '1.01');
      dataMap12.set('503', '5');
      dataMap12.set('601', '4.6');
      dataMap12.set('602', '1.01');
      dataMap12.set('603', '5');
      multiSummary.addComment(cmnt27, testComment7).then(function (added16) {
        expect(added16).toBe(true);

        multiSummary.enterMeanSDPointValues(dataMap12).then(function (result) {
          expect(result).toBe(true);
        });
        multiSummary.clickSubmitButton().then(function (status3) {
          expect(status3).toBe(true);
        });
        const mean60 = '4.6';
        const sd60 = '1.0';
        const point60 = '5';
        const mean602 = '4.6';
        const sd602 = '1.0';
        const point602 = '5';
        const mean603 = '4.6';
        const sd603 = '1.0';
        const point603 = '5';
        const mean604 = '4.6';
        const sd604 = '1.0';
        const point604 = '5';
        const mean605 = '4.6';
        const sd605 = '1.0';
        const point605 = '5';
        const mean606 = '4.6';
        const sd606 = '1.0';
        const point606 = '5';

        const test60 = '1';
        multiSummary.verifyEnteredValueStoredL2AllTest(mean60, sd60, point60, test60).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test602 = '2';
        multiSummary.verifyEnteredValueStoredL2AllTest(mean602, sd602, point602, test602).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test603 = '3';
        multiSummary.verifyEnteredValueStoredL2AllTest(mean602, sd602, point602, test603).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test604 = '4';
        multiSummary.verifyEnteredValueStoredL2AllTest(mean602, sd602, point602, test604).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test605 = '5';
        multiSummary.verifyEnteredValueStoredL2AllTest(mean602, sd602, point602, test605).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test606 = '6';
        multiSummary.verifyEnteredValueStoredL2AllTest(mean602, sd602, point602, test606).then(function (saved2) {

          expect(saved2).toBe(true);
        });


        // Verify the stored values L1
        const mean70 = '5';
        const sd70 = '1';
        const point70 = '5';
        const mean702 = '5';
        const sd702 = '1';
        const point702 = '5';
        const mean703 = '5';
        const sd703 = '1';
        const point703 = '5';
        const mean704 = '5';
        const sd704 = '1';
        const point704 = '5';
        const mean705 = '5';
        const sd705 = '1';
        const point705 = '5';
        const mean706 = '5';
        const sd706 = '1';
        const point706 = '5';
        const test70 = '1';
        multiSummary.verifyEnteredValueStoredL1AllTest(mean70, sd70, point70, test70).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test702 = '2';
        multiSummary.verifyEnteredValueStoredL1AllTest(mean702, sd702, point702, test702).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test703 = '3';
        multiSummary.verifyEnteredValueStoredL1AllTest(mean702, sd702, point702, test703).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test704 = '4';
        multiSummary.verifyEnteredValueStoredL1AllTest(mean702, sd702, point702, test704).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test705 = '5';
        multiSummary.verifyEnteredValueStoredL1AllTest(mean702, sd702, point702, test705).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const test706 = '6';
        multiSummary.verifyEnteredValueStoredL1AllTest(mean702, sd702, point702, test706).then(function (saved2) {

          expect(saved2).toBe(true);
        });
        const cmnt70 = jsonData.Test4Cmt;
        const cmntCount70 = '1';
        const test701 = '1';
        multiSummary.verifyCommentAndInteractionIcon(cmntCount70, cmnt70, test701).then(function (verified1) {
          expect(verified1).toBe(true);
        });


        //  Matrix 2 level1 and level3
        const cmnt26 = jsonData.Test5Cmt;
        const testComment6 = '1';

        const dataMap13 = new Map<string, string>();

        dataMap13.set('107', '4.6');
        dataMap13.set('108', '1.01');
        dataMap13.set('109', '5');
        dataMap13.set('207', '4.6');
        dataMap13.set('208', '1.01');
        dataMap13.set('209', '5');
        dataMap13.set('307', '4.6');
        dataMap13.set('308', '1.01');
        dataMap13.set('309', '5');
        dataMap13.set('407', '4.6');
        dataMap13.set('408', '1.01');
        dataMap13.set('409', '5');
        dataMap13.set('507', '4.6');
        dataMap13.set('508', '1.01');
        dataMap13.set('509', '5');
        dataMap13.set('607', '4.6');
        dataMap13.set('608', '1.01');
        dataMap13.set('609', '5');
        dataMap13.set('101', '4.6');
        dataMap13.set('102', '1.01');
        dataMap13.set('103', '5');
        dataMap13.set('201', '4.6');
        dataMap13.set('202', '1.01');
        dataMap13.set('203', '5');
        dataMap13.set('301', '4.6');
        dataMap13.set('302', '1.01');
        dataMap13.set('303', '5');
        dataMap13.set('401', '4.6');
        dataMap13.set('402', '1.01');
        dataMap13.set('403', '5');
        dataMap13.set('501', '4.6');
        dataMap13.set('502', '1.01');
        dataMap13.set('503', '5');
        dataMap13.set('601', '4.6');
        dataMap13.set('602', '1.01');
        dataMap13.set('603', '5');
        multiSummary.addComment(cmnt26, testComment6).then(function (added10) {
          expect(added10).toBe(true);

          multiSummary.enterMeanSDPointValues(dataMap13).then(function (result) {
            expect(result).toBe(true);
          });
          multiSummary.clickSubmitButton().then(function (status3) {
            expect(status3).toBe(true);
          });
          const mean80 = '4.60';
          const sd80 = '1.01';
          const point80 = '5';
          const mean802 = '4.60';
          const sd802 = '1.01';
          const point802 = '5';
          const mean803 = '4.60';
          const sd803 = '1.01';
          const point803 = '5';
          const mean804 = '4.60';
          const sd804 = '1.01';
          const point804 = '5';
          const mean805 = '4.60';
          const sd805 = '1.01';
          const point805 = '5';
          const mean806 = '4.60';
          const sd806 = '1.01';
          const point806 = '5';

          // Verify the stored values L3
          const test80 = '1';
          multiSummary.verifyEnteredValueStoredL3AllTest(mean80, sd80, point80, test80).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test802 = '2';
          multiSummary.verifyEnteredValueStoredL3AllTest(mean802, sd802, point802, test802).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test803 = '3';
          multiSummary.verifyEnteredValueStoredL3AllTest(mean802, sd802, point802, test803).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test804 = '4';
          multiSummary.verifyEnteredValueStoredL3AllTest(mean802, sd802, point802, test804).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test805 = '5';
          multiSummary.verifyEnteredValueStoredL3AllTest(mean802, sd802, point802, test805).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test806 = '6';
          multiSummary.verifyEnteredValueStoredL3AllTest(mean802, sd802, point802, test806).then(function (saved2) {

            expect(saved2).toBe(true);
          });


          // Verify the stored values L1
          const mean90 = '5';
          const sd90 = '1';
          const point90 = '5';
          const mean902 = '5';
          const sd902 = '1';
          const point902 = '5';
          const mean903 = '5';
          const sd903 = '1';
          const point903 = '5';
          const mean904 = '5';
          const sd904 = '1';
          const point904 = '5';
          const mean905 = '5';
          const sd905 = '1';
          const point905 = '5';
          const mean906 = '5';
          const sd906 = '1';
          const point906 = '5';
          const test90 = '1';
          multiSummary.verifyEnteredValueStoredL1AllTest(mean90, sd90, point90, test90).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test902 = '2';
          multiSummary.verifyEnteredValueStoredL1AllTest(mean902, sd902, point902, test902).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test903 = '3';
          multiSummary.verifyEnteredValueStoredL1AllTest(mean902, sd902, point902, test903).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test904 = '4';
          multiSummary.verifyEnteredValueStoredL1AllTest(mean902, sd902, point902, test904).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test905 = '5';
          multiSummary.verifyEnteredValueStoredL1AllTest(mean902, sd902, point902, test905).then(function (saved2) {

            expect(saved2).toBe(true);
          });
          const test906 = '6';
          multiSummary.verifyEnteredValueStoredL1AllTest(mean902, sd902, point902, test906).then(function (saved2) {

            expect(saved2).toBe(true);
          });

          const cmntVal = jsonData.Test5Cmt;
          const cmntCountVal = '1';
          const test901 = '1';
          multiSummary.verifyCommentAndInteractionIcon(cmntCountVal, cmntVal, test901).then(function (verified1) {
            expect(verified1).toBe(true);
          });

          const cmntV2 = jsonData.Test6Cmt;
          const testCommentV = '1';

          const dataMap23 = new Map<string, string>();

          dataMap23.set('107', '5.6');
          dataMap23.set('108', '5.01');
          dataMap23.set('109', '5');
          dataMap23.set('207', '5.6');
          dataMap23.set('208', '5.01');
          dataMap23.set('209', '5');
          dataMap23.set('307', '5.6');
          dataMap23.set('308', '5.01');
          dataMap23.set('309', '5');
          dataMap23.set('407', '5.6');
          dataMap23.set('408', '5.01');
          dataMap23.set('409', '5');
          dataMap23.set('507', '5.6');
          dataMap23.set('508', '5.01');
          dataMap23.set('509', '5');
          dataMap23.set('607', '5.6');
          dataMap23.set('608', '5.01');
          dataMap23.set('609', '5');
          dataMap23.set('101', '5.6');
          dataMap23.set('102', '5.01');
          dataMap23.set('103', '5');
          dataMap23.set('201', '5.6');
          dataMap23.set('202', '5.01');
          dataMap23.set('203', '5');
          dataMap23.set('301', '5.6');
          dataMap23.set('302', '5.01');
          dataMap23.set('303', '5');
          dataMap23.set('401', '5.6');
          dataMap23.set('402', '5.01');
          dataMap23.set('403', '5');
          dataMap23.set('501', '5.6');
          dataMap23.set('502', '5.01');
          dataMap23.set('503', '5');
          dataMap23.set('601', '5.6');
          dataMap23.set('602', '5.01');
          dataMap23.set('603', '5');
          multiSummary.addComment(cmntV2, testCommentV).then(function (added) {
            expect(added).toBe(true);

            multiSummary.enterMeanSDPointValues(dataMap23).then(function (result) {
              expect(result).toBe(true);
            });
            multiSummary.clickSubmitButton().then(function (status3) {
              expect(status3).toBe(true);
            });
            const meanV = '5.6';
            const sdV = '5.0';
            const pointV = '5';
            const meanV2 = '5.6';
            const sdV2 = '5.0';
            const pointV2 = '5';
            const meanV3 = '5.6';
            const sdV3 = '5.0';
            const pointV3 = '5';
            const meanV4 = '5.6';
            const sdV4 = '5.0';
            const pointV4 = '5';
            const meanV5 = '5.6';
            const sdV5 = '5.0';
            const pointV5 = '5';
            const meanV6 = '5.6';
            const sdV6 = '5.0';
            const pointV6 = '5';

            // Verify the stored values L2
            const testV = '1';
            multiSummary.verifyEnteredValueStoredL2AllTest(meanV, sdV, pointV, testV).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testV2 = '2';
            multiSummary.verifyEnteredValueStoredL2AllTest(meanV2, sdV2, pointV2, testV2).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testV3 = '3';
            multiSummary.verifyEnteredValueStoredL2AllTest(meanV2, sdV2, pointV2, testV3).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testV4 = '4';
            multiSummary.verifyEnteredValueStoredL2AllTest(meanV2, sdV2, pointV2, testV4).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testV5 = '5';
            multiSummary.verifyEnteredValueStoredL2AllTest(meanV2, sdV2, pointV2, testV5).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testV6 = '6';
            multiSummary.verifyEnteredValueStoredL2AllTest(meanV2, sdV2, pointV2, testV6).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const meanVal = '5.60';
            const sdVal = '5.01';
            const pointVal = '5';
            const meanVal2 = '5.60';
            const sdVal2 = '5.01';
            const pointVal2 = '5';
            const meanVal3 = '5.60';
            const sdVal3 = '5.01';
            const pointVal3 = '5';
            const meanVal4 = '5.60';
            const sdVal4 = '5.01';
            const pointVal4 = '5';
            const meanVal5 = '5.60';
            const sdVal5 = '5.01';
            const pointVal5 = '5';
            const meanVal6 = '5.60';
            const sdVal6 = '5.01';
            const pointVal6 = '5';

            // Verify the stored values L3
            const testVal = '1';
            multiSummary.verifyEnteredValueStoredL3AllTest(meanVal, sdVal, pointVal, testVal).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testVal2 = '2';
            multiSummary.verifyEnteredValueStoredL3AllTest(meanVal2, sdVal2, pointVal2, testVal2).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testVal3 = '3';
            multiSummary.verifyEnteredValueStoredL3AllTest(meanVal2, sdVal2, pointVal2, testVal3).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testVal4 = '4';
            multiSummary.verifyEnteredValueStoredL3AllTest(meanVal2, sdVal2, pointVal2, testVal4).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testVal5 = '5';
            multiSummary.verifyEnteredValueStoredL3AllTest(meanVal2, sdVal2, pointVal2, testVal5).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const testVal6 = '6';
            multiSummary.verifyEnteredValueStoredL3AllTest(meanVal2, sdVal2, pointVal2, testVal6).then(function (saved2) {

              expect(saved2).toBe(true);
            });
            const cmntVal22 = jsonData.Test6Cmt;
            const cmntCountVal22 = '1';
            const testVal1 = '1';
            multiSummary.verifyCommentAndInteractionIcon(cmntCountVal22, cmntVal22, testVal1).then(function (verified1) {
              expect(verified1).toBe(true);
            });



            // Matrix 4: Level 1 only
            const cmnt2Val1 = jsonData.Test1Cmt;
            const testValComment = '1';

            const data_Map1 = new Map<string, string>();
            data_Map1.set('101', '4.6');
            data_Map1.set('102', '1.01');
            data_Map1.set('103', '5');
            data_Map1.set('201', '4.6');
            data_Map1.set('202', '1.01');
            data_Map1.set('203', '5');
            data_Map1.set('301', '4.6');
            data_Map1.set('302', '1.01');
            data_Map1.set('303', '5');
            data_Map1.set('401', '4.6');
            data_Map1.set('402', '1.01');
            data_Map1.set('403', '5');
            data_Map1.set('501', '4.6');
            data_Map1.set('502', '1.01');
            data_Map1.set('503', '5');
            data_Map1.set('601', '4.6');
            data_Map1.set('602', '1.01');
            data_Map1.set('603', '5');
            multiSummary.addComment(cmnt2Val1, testValComment).then(function (added11) {
              expect(added11).toBe(true);

              multiSummary.enterMeanSDPointValues(data_Map1).then(function (result) {
                expect(result).toBe(true);
              });
              multiSummary.clickSubmitButton().then(function (status3) {
                expect(status3).toBe(true);
              });
              // Verify the stored values L1
              const meanV1 = '5';
              const sdV1 = '1';
              const pointV1 = '5';
              const meanV12 = '5';
              const sdV12 = '1';
              const pointV12 = '5';
              const meanV13 = '5';
              const sdV13 = '1';
              const pointV13 = '5';
              const meanV14 = '5';
              const sdV14 = '1';
              const pointV14 = '5';
              const meanV15 = '5';
              const sdV15 = '1';
              const pointV15 = '5';
              const meanV16 = '5';
              const sdV16 = '1';
              const pointV16 = '5';
              const testV1 = '1';
              multiSummary.verifyEnteredValueStoredL1AllTest(meanV1, sdV1, pointV1, testV1).then(function (saved2) {

                expect(saved2).toBe(true);
              });
              const testV12 = '2';
              multiSummary.verifyEnteredValueStoredL1AllTest(meanV12, sdV12, pointV12, testV12).then(function (saved2) {

                expect(saved2).toBe(true);
              });
              const testV13 = '3';
              multiSummary.verifyEnteredValueStoredL1AllTest(meanV12, sdV12, pointV12, testV13).then(function (saved2) {

                expect(saved2).toBe(true);
              });
              const testV14 = '4';
              multiSummary.verifyEnteredValueStoredL1AllTest(meanV12, sdV12, pointV12, testV14).then(function (saved2) {

                expect(saved2).toBe(true);
              });
              const testV15 = '5';
              multiSummary.verifyEnteredValueStoredL1AllTest(meanV12, sdV12, pointV12, testV15).then(function (saved2) {

                expect(saved2).toBe(true);
              });
              const testV16 = '6';
              multiSummary.verifyEnteredValueStoredL1AllTest(meanV12, sdV12, pointV12, testV16).then(function (saved2) {

                expect(saved2).toBe(true);
              });

              const cmntV1 = jsonData.Test1Cmt;
              const cmntCountV1 = '1';
              const testV11 = '1';
              multiSummary.verifyCommentAndInteractionIcon(cmntCountV1, cmntV1, testV11).then(function (verified1) {
                expect(verified1).toBe(true);
              });


              // Matrix 5: Level 2 only
              const cmnt2V1 = jsonData.Test2Cmt;
              const testV1Comment = '1';

              const data_Map2 = new Map<string, string>();

              data_Map2.set('104', '4.6');
              data_Map2.set('105', '1.01');
              data_Map2.set('106', '5');
              data_Map2.set('204', '4.6');
              data_Map2.set('205', '1.01');
              data_Map2.set('206', '5');
              data_Map2.set('304', '4.6');
              data_Map2.set('305', '1.01');
              data_Map2.set('306', '5');
              data_Map2.set('404', '4.6');
              data_Map2.set('405', '1.01');
              data_Map2.set('406', '5');
              data_Map2.set('504', '4.6');
              data_Map2.set('505', '1.01');
              data_Map2.set('506', '5');
              data_Map2.set('604', '4.6');
              data_Map2.set('605', '1.01');
              data_Map2.set('606', '5');
              multiSummary.addComment(cmnt2V1, testV1Comment).then(function (add) {
                expect(add).toBe(true);

                multiSummary.enterMeanSDPointValues(data_Map2).then(function (result) {
                  expect(result).toBe(true);
                });
                multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
                  expect(enabled).toBe(true);
                });
                multiSummary.clickSubmitButton().then(function (status3) {
                  expect(status3).toBe(true);
                });
                const meanV211 = '4.60';
                const sdV211 = '1.01';
                const pointV211 = '5';
                const meanV22 = '4.60';
                const sdV22 = '1.01';
                const pointV22 = '5';
                const meanV23 = '4.60';
                const sdV23 = '1.01';
                const pointV23 = '5';
                const meanV24 = '4.60';
                const sdV24 = '1.01';
                const pointV24 = '5';
                const meanV25 = '4.60';
                const sdV25 = '1.01';
                const pointV25 = '5';
                const meanV26 = '4.60';
                const sdV26 = '1.01';
                const pointV26 = '5';

                // Verify the stored values L3
                const testV211 = '1';
                multiSummary.verifyEnteredValueStoredL3AllTest(meanV211, sdV211, pointV211, testV211).then(function (saved2) {

                  expect(saved2).toBe(true);
                });
                const testV22 = '2';
                multiSummary.verifyEnteredValueStoredL3AllTest(meanV22, sdV22, pointV22, testV22).then(function (saved2) {

                  expect(saved2).toBe(true);
                });
                const testV23 = '3';
                multiSummary.verifyEnteredValueStoredL3AllTest(meanV22, sdV22, pointV22, testV23).then(function (saved2) {

                  expect(saved2).toBe(true);
                });
                const testV24 = '4';
                multiSummary.verifyEnteredValueStoredL3AllTest(meanV22, sdV22, pointV22, testV24).then(function (saved2) {

                  expect(saved2).toBe(true);
                });
                const testV25 = '5';
                multiSummary.verifyEnteredValueStoredL3AllTest(meanV22, sdV22, pointV22, testV25).then(function (saved2) {

                  expect(saved2).toBe(true);
                });
                const testV26 = '6';
                multiSummary.verifyEnteredValueStoredL3AllTest(meanV22, sdV22, pointV22, testV26).then(function (saved2) {

                  expect(saved2).toBe(true);
                });
                const cmntV22 = jsonData.Test3Cmt;
                const cmntCountV2 = '1';
                const testV21 = '1';
                multiSummary.verifyCommentAndInteractionIcon(cmntCountV2, cmntV22, testV21).then(function (verified1) {
                  expect(verified1).toBe(true);
                });

              });
            });
          });
        });
      });
    });
  });



  it('Test case 130209: For a level, if user inputs Points = 1, then sd should be zero, else error should display.', function () {
    const product1 = jsonData.Instrument4Product1;
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const data_Map = new Map<string, string>();
    data_Map.set('11', '36.8');
    data_Map.set('12', '4.65');
    data_Map.set('13', '1');
    data_Map.set('14', 'protractor.Key.TAB');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorMsgforZeroSD).then(function (errordisplayed) {
      expect(errordisplayed).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (submitDisabled) {
      expect(submitDisabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    data_Map.set('11', '36.8');
    data_Map.set('12', '4.65');
    data_Map.set('13', '18');
    multiSummary.enterMeanSDPointValues(data_Map).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredNew('36.80', '4.65', '18').then(function (valuesStored) {
      expect(valuesStored).toBe(true);

    });
  });


  it('Test case 130210: For a level, user should NOT be able to enter <=0 & decimal values for numPoints field.', function () {
    const product1 = jsonData.Instrument4Product1;
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    dataTable.verifyPointInvalidData('-45').then(function (invalidData) {
      expect(invalidData).toBe(true);

    });
    const data_Map = new Map<string, string>();
    data_Map.set('11', '56.6');
    data_Map.set('12', '0.36');
    data_Map.set('13', '0');
    multiSummary.enterMeanSDPointValues(data_Map).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (errordisplayed) {
      expect(errordisplayed).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (submitDisabled) {
      expect(submitDisabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancelClicked) {
    });
  });


  it('Test case 130186:For Multi-Summary & Single-Summary : Initially, all fields should be empty', function () {
    log4jsconfig.log().info('Test case 130186:For Multi-Summary & Single-Summary : Initially, all fields should be empty');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername, jsonData.SampadaPassword,
      jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    dataTable.verifyProductNameandLotNuberfromtheInstrumentLevel().then(function (verifyProdtandLot) {
      expect(verifyProdtandLot).toBe(true);
    });
    dataTable.verifyAlltheFieldsareEmpty1().then(function (totalcount) {
      expect(totalcount).toBe(true);
    });
    dataTable.countOnAllAddCommentsOnInstrumentLevel().then(function (totalCountforAddComment) {
      expect(totalCountforAddComment).toBe(true);
      browser.sleep(5000);
    });
    dataTable.countOnAllChangeLotsOnInstrumentLevel().then(function (totalCountforChangeLot) {
      expect(totalCountforChangeLot).toBe(true);
      browser.sleep(3000);
    });
    browser.sleep(3000);
    const clickOnTest = element(by.xpath('// span[contains(text();,"Albumin");]'));
    clickOnTest.click();
    browser.sleep(3000);
    dataTable.verifyAlltheFieldsareEmpty1().then(function (totalcount) {
      expect(totalcount).toBe(true);
    });
  });





  it('Test case 130262: Display of modal when user navigates away from data entry page', function () {
    const controlId = jsonData.ControlName;
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const data_Map = new Map<string, string>();
    data_Map.set('11', '35.7');
    data_Map.set('12', '1.56');
    data_Map.set('13', '15');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifyModalComponent().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiSummary.verifyDontSaveBtnClick(controlId).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });



  it('Test case 130263: Clicking on "X" on the modal for when user navigates away from data entry page,' +
    ' will make the modal disappear and data entered will remain on the data ', function () {
      const controlId = jsonData.InstrumentName;
      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      const mean = '38.6', sd = '4.6', point = '22';
      const data_Map = new Map<string, string>();
      data_Map.set('11', mean);
      data_Map.set('12', sd);
      data_Map.set('13', point);
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      newLabSetup.navigateTO(controlId).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.verifyModalComponent().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      multiSummary.closeModalDialog().then(function (closed) {
        expect(closed).toBe(true);
      });
      multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      multiSummary.clickCancelBtn().then(function (cancle) {
        expect(cancle).toBe(true);
      });
    });

  it('Test case 130264: Clicking on the Dont Save Data button on the modal when user' +
    ' tries to navigate away from data entry page will navigate you to the new location', function () {
      const controlId = jsonData.ControlName;
      const analyte = jsonData.AnalyteName;
      const prod = jsonData.Instrument4Product1;
      const mean = '5.7', sd = '0.34', point = '12';

      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      const data_Map = new Map<string, string>();
      data_Map.set('11', mean);
      data_Map.set('12', sd);
      data_Map.set('13', point);
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      newLabSetup.navigateTO(controlId).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.verifyDontSaveBtnClick(controlId).then(function (clicked) {
        expect(clicked).toBe(true);
      });

    });


  it('Test case 130266: Clicking on the Save data and leave page on the modal when user' +
    ' tries to navigate away from data entry page will save the data', function () {
      const controlId = jsonData.ControlName;
      const analyte = jsonData.AnalyteName;
      const prod = jsonData.Instrument4Product1;
      const mean = '35.76', sd = '2.67', point = '13';
      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      const data_Map = new Map<string, string>();
      data_Map.set('11', mean);
      data_Map.set('12', sd);
      data_Map.set('13', point);
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      newLabSetup.clickBackArrow().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.verifySaveBtnClick(controlId).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (found) {
        expect(found).toBe(true);
      });
    });


  it('Test 127859: Points Value Verification', function () {
    log4jsconfig.log().info('Test 127859: Points Value Verification');
    const mean = '4.6', sd = '0', point = '1';
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    dataTable.expandTree().then(function (expand1) {

    });
    dataTable.goToInstrument_ProductName(prod).then(function (prodClicked) {

    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.verifyMaxLength('12345678901234', '13').then(function (status) {
      expect(status).toBe(true);
    });
    multiSummary.verifyPointInvalidData('-11').then(function (result) {
      expect(result).toBe(true);
    });


    const ele = element(by.id('11'));
    dashboard.scrollToElement(ele).then(function (scrolled) {
      expect(scrolled).toBe(true);
    });

    multiSummary.verifyPointInvalidData('1.9').then(function (status) {
      expect(status).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataMap1 = new Map<string, string>();
    dataMap1.set('11', '4');
    dataMap1.set('12', '5');
    dataMap1.set('13', '10');

    multiSummary.enterMeanSDPointValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    // Step 6
    multiSummary.clickCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // Step 7
    const dataMap2 = new Map<string, string>();
    dataMap2.set('11', '4.6');
    dataMap2.set('12', '5.3');
    dataMap2.set('13', '1');
    dataMap2.set('14', 'protractor.Key.TAB');
    multiSummary.enterMeanSDPointValues(dataMap2).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorMsgforZeroSD).then(function (result) {
      expect(result).toBe(true);
    });
    // Step 8
    multiSummary.clickCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // Step 9
    const dataMap3 = new Map<string, string>();
    dataMap3.set('11', mean);
    dataMap3.set('12', sd);
    dataMap3.set('13', point);
    dataMap3.set('14', 'protractor.Key.TAB');
    multiSummary.enterMeanSDPointValues(dataMap3).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (displayed) {
      expect(displayed).toBe(true);
    });

  });

  // Comment is not getting displayed hen

  it('Test case 127922: Verify the comments, Reviews', function () {
    log4jsconfig.log().info('Test case 127922: Verify the comments, Reviews');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    dataTable.expandTree().then(function (expand1) {

    });
    dataTable.goToInstrument_ProductName(prod).then(function (prodClicked) {

    });
    const data_Map = new Map<string, string>();
    browser.sleep(5000);
    data_Map.set('11', '4');
    data_Map.set('12', '5');
    data_Map.set('13', '6');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    const add_Comment = element(by.xpath('(// span[contains(text();,"Add comment");]);[1]'));
    library.scrollToElement(add_Comment);
    add_Comment.click().then(function () {
      browser.sleep(5000);
    });
    const add_Comment1 = element(by.xpath('(// textarea[@formcontrolname="comments"]);[1]'));
    library.scrollToElement(add_Comment1);
    add_Comment1.sendKeys(jsonData.Comment1);
    browser.sleep(3000);
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
      browser.sleep(3000);
    });
    multiSummary.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
      browser.sleep(10000);
    });
    const commentForProduct_Level = '1';
    dataTable.verifyCommentSection(commentForProduct_Level).then(function (comment1) {
      expect(comment1).toBe(true);
      browser.sleep(3000);
    });
    dataTable.verifytheReviewSummaryPage().then(function (review1) {
      expect(review1).toBe(true);
    });
    const clickOnDoneButton = element(by.xpath('// button[contains(text();,"DONE");]'));
    clickOnDoneButton.isDisplayed().then(function (doneBtnDisplayed) {
      expect(doneBtnDisplayed).toBe(true);
      library.clickJS(clickOnDoneButton);
      browser.sleep(2000);
    });
    dataTable.verifyInteractionIconButtonOnProductLevel().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });




  // comment is not getting displayed cant verify the comments
  it('Test case 130130: Multi Summary entry components are displayed in groups by product lots ' +
    'when an instrument with all summary entry tests are selected from nav menu', function () {
      log4jsconfig.log().info('Test case 130130: Multi Summary entry components are displayed in groups by product lots' +
        ' when an instrument with all summary entry tests are selected from nav menu');
      const instrument2 = jsonData.Instrument3;
      const instrument1 = jsonData.Instrument4Name;
      const prod = jsonData.Instrument4Product1;
      const mean = '5', sd = '10', point = '15';
      const prod1 = jsonData.Instrument3Product2;
      const prod2 = jsonData.Instrument3Product3;
      const prod1Test1 = jsonData.Instrument3Product2Test1;
      const prod2Test1 = jsonData.Instrument3Product3Test1;
      loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
        jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
          expect(loggedIn).toBe(true);
        });
      // Step 2
      dashboard.dashboardCards().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // Step 3
      dataTable.goToDataTablePage().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      dataTable.clickHamburgerIcon().then(function (hamburger) {
        expect(hamburger).toBe(true);

      });
      // Step 4
      dataTable.expandTree().then(function (clicked) {
        expect(clicked).toBe(true);
      });

      const dept = jsonData.DepartmentNumber;
      const inst = '2';
      const product = jsonData.Inst3Product2;
      dataTable.goToInstrument_ProductName(product).then(function (productTbl) {
        expect(productTbl).toBe(true);
      });
      const data_Map = new Map<string, string>();
      data_Map.set('11', mean);
      data_Map.set('12', sd);
      data_Map.set('13', point);
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);

      });
      multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
        expect(result).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      // Step 5
      multiSummary.navigateToInstrument(instrument2).then(function (clicked) {
        expect(clicked).toBe(true);
      });
      // 1
      multiSummary.verifySummaryEntryComponents(instrument2, prod1, prod2, prod1Test1, prod2Test1).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      multiSummary.verifyChangeLotAddComments().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // 2
      multiSummary.verifyTopPageHeaderInstrumentView(instrument2).then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // 3
      multiSummary.verifyDefaultRunEntrySelection(instrument2).then(function (selected) {
        expect(selected).toBe(true);
      });
      // 4
      multiSummary.verifyLevelsDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      // 6
      multiSummary.verifyFooterComponents().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      multiSummary.navigateToInstrument(instrument1).then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });




  // comment is not getting displayed cant verify the comments
  it('Test case 130131: Multi Summary entry components are displayed when a product lot' +
    ' with all summary entry tests are selected from nav menu', function () {
      log4jsconfig.log().info('Test case 130131: Multi Summary entry components are displayed when a product lot' +
        ' with all summary entry tests are selected from nav menu');
      const instrument = jsonData.Instrument3;
      // const instrument2 = 'cobas c 311';
      // const product1 = jsonData.Instrument4Product1;
      const product2 = jsonData.Instrument3Product3;
      const prod2Test = jsonData.Instrument3Product3Test1;
      // Step 3
      loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
        jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
          expect(loggedIn).toBe(true);
        });
      dataTable.goToDataTablePage().then(function (displayed) {
        expect(displayed).toBe(true);
      });
      dataTable.clickHamburgerIcon().then(function (hamburger) {
        expect(hamburger).toBe(true);

      });
      // Step 4
      dataTable.expandTree().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      const dept = jsonData.DepartmentNumber;
      const inst = '2';
      const prod = jsonData.Instt3Product3;
      dataTable.goToInstrument_ProductName(prod).then(function (product) {
        expect(product).toBe(true);
      });

      const prod2Summary = jsonData.Instt3Product3;
      multiSummary.verifySummaryEntryComponentsProductView(prod2Summary, prod2Test).then(function (displayed) {
        expect(displayed).toBe(true);

      });
      multiSummary.verifyChangeLotAddComments().then(function (displayed) {
        expect(displayed).toBe(true);

      });
      // 2
      const prod2HeaderName = jsonData.Instt3Product3;
      multiSummary.verifyTopPageHeaderProductView(prod2HeaderName).then(function (displayed) {
        expect(displayed).toBe(true);

      });
      // 3
      multiSummary.verifyDefaultRunEntrySelection(prod2Summary).then(function (selected) {
        expect(selected).toBe(true);

      });
      // 4
      multiSummary.verifyLevelsDisplayed().then(function (displayed) {
        expect(displayed).toBe(true);

      });
      // 6
      multiSummary.verifyFooterComponents().then(function (displayed) {
        expect(displayed).toBe(true);

      });
      multiSummary.navigateToInstrument(instrument).then(function (clicked) {
        expect(clicked).toBe(true);

      });
    });


  //  Unable to deconste data as it is disabled
  it('Test case 127919: Verify the date displayed correct in Analyte Summary View page', function () {
    log4jsconfig.log().info('Test case 127919: Verify the date displayed correct in Analyte Summary View page');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    const mean = '3', sd = '6', point = '9'; // Set 1
    const mean1 = '5', sd1 = '10', point1 = '15'; //  Set 2
    const mean2 = '2', sd2 = '4', point2 = '6'; // Set 3

    const date = new Date();

    const yyyy = date.getFullYear();

    const dd1 = '31', mm1 = 'DEC', yyyy1 = yyyy - 1;
    const dd2 = '11', mm2 = 'APR';
    const dd3 = '15', mm3 = 'MAY';

    const prod = jsonData.Instrument3Product4;
    const test = jsonData.Instrument3Product4Test1;

    // step 1
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dataTable.expandTree().then(function (expanded) {
      expect(expanded).toBe(true);
    });


    multiSummary.clearAllTestsData(test).then(function (cleared) {
      expect(cleared).toBe(true);
    });

    dataTable.goToInstrument_ProductName(prod).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    multiSummary.changeDate(yyyy1, mm1, dd1).then(function (dateChanged) {
      expect(dateChanged).toBe(true);
    });

    const data_Map = new Map<string, string>();
    data_Map.set('11', mean);
    data_Map.set('12', sd);
    data_Map.set('13', point);
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    //  To load the newly entered data
    multiSummary.clickCancelBtn().then(function (cancle) {
      expect(cancle).toBe(true);
    });
    // Step 2
    multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    multiSummary.verifyMonthYear(yyyy1).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    // Step 3
    multiSummary.changeDate(yyyy, mm2, dd2).then(function (dateChanged) {
      expect(dateChanged).toBe(true);
    });

    const dataMap1 = new Map<string, string>();
    dataMap1.set('11', mean1);
    dataMap1.set('12', sd1);
    dataMap1.set('13', point1);

    multiSummary.enterMeanSDPointValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });


    multiSummary.verifyEnteredValueStoredNew(mean1, sd1, point1).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    multiSummary.verifyMonth(mm2).then(function (displayed) {
      expect(displayed).toBe(true);
    });


    multiSummary.changeDate(yyyy, mm3, dd3).then(function (dateChanged) {
      expect(dateChanged).toBe(true);
    });

    const dataMap2 = new Map<string, string>();
    dataMap2.set('11', mean2);
    dataMap2.set('12', sd2);
    dataMap2.set('13', point2);

    multiSummary.enterMeanSDPointValues(dataMap2).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });


    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiSummary.verifyEnteredValueStoredNew(mean2, sd2, point2).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    multiSummary.verifyMonth(mm3).then(function (displayed) {
      expect(displayed).toBe(true);
    });


  });

  it('Test case 127873: Prevent selection of month from beyond current month on Analyte Summary Entry form', function () {
    log4jsconfig.log().info('Test case 127873: Prevent selection of month from beyond current month on Analyte Summary Entry form');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    const mean = '1', sd = '2', point = '3';
    const date = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const mm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    const dd = '1';
    const prod = jsonData.Inst3Product2;
    const test = jsonData.Instrument3Product2Test1;


    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clearAllTestsData(test).then(function (cleared) {
      expect(cleared).toBe(true);
    });

    newLabSetup.navigateTO(jsonData.AnalyteName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.changeDateCurrentMonth(yyyy, mm, dd).then(function (changed) {
      expect(changed).toBe(true);
    });

    const data_Map = new Map<string, string>();
    data_Map.set('11', mean);
    data_Map.set('12', sd);
    data_Map.set('13', point);
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.selectPrevMonthDisabled().then(function (disabled) {
      expect(disabled).toBe(true);

    });
    multiSummary.VerifyFuturedateAndSelectPrevYearDisabled(yyyy).then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

  it('Test case 127988: Verify the comment Pez count is increased', function () {
    log4jsconfig.log().info('Test case 127988: Verify the comment Pez count is increased');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (dataTablePage) {
      expect(dataTablePage).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    const prodtest = jsonData.Instrument4Product1Test1;
    dataTable.expandTree().then(function (col1) {

      expect(col1).toBe(true);
    });
    const meanNo = '2';

    dataTable.goToInstrument_ProductName(prod).then(function (col2) {

      expect(col2).toBe(true);
    });

    const data_Map = new Map<string, string>();
    browser.sleep(5000);
    data_Map.set('11', '5');
    data_Map.set('12', '6');
    data_Map.set('13', '7');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (entered) {
      expect(entered).toBe(true);
    });

    multiSummary.addComment(jsonData.Comment1, '1').then(function (cmnt) {
      expect(cmnt).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (enable) {
      expect(enable).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    const cmntCountExpected = '1';
    const cmt = jsonData.Comment1;
    const test = '1';
    const meanNo1 = '2';
    const checkOnlyCount = false;
    multiSummary.verifyCommentAndCount(cmntCountExpected, cmt, test, checkOnlyCount).then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });


    dataTable.goToInstrument_ProductName(prodtest).then(function (col2) {

      expect(col2).toBe(true);

    });
    multiSummary.addCommentInTest(cmt, test, meanNo1).then(function (col2) {

      expect(col2).toBe(true);
    });
    dataTable.goToInstrument_ProductName(prod).then(function (col2) {

      expect(col2).toBe(true);
    });

    const cmntCountExpected2 = '2';
    const cmt2 = jsonData.Comment1;
    const test2 = '1';
    const checkOnlyCount1 = true;

    multiSummary.verifyCommentAndCount(cmntCountExpected2, cmt2, test2, checkOnlyCount1).then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });



  });

  it('Test case 128026: Verify Instrument based multi summary page data on lot changed', function () {
    log4jsconfig.log().info('Test case 128026: Verify Instrument based multi summary page data on lot changed');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    const instrument = jsonData.Instrument4Name;
    const mean = '5', sd = '10', point = '15';
    let oldReagentLot, oldCallibratorLot;
    const newReagentLot = jsonData.NewReagentLot;
    const newCallibratorLot = jsonData.NewCallibaratorLot;

    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dataTable.expandTree().then(function (expanded) {
      expect(expanded).toBe(true);
    });

    dataTable.goToInstrument_ProductName(instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });

    const data_Map = new Map<string, string>();
    data_Map.set('21', mean);
    data_Map.set('22', sd);
    data_Map.set('23', point);
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.clickVerifyChangeLot().then(function (displayed) {
      expect(displayed).toBe(true);
    });


    multiSummary.changeReagentLot(newReagentLot).then(function (changed) {
      oldReagentLot = changed;


    });


    multiSummary.changeCallibratortLot(newCallibratorLot).then(function (changed) {
      oldCallibratorLot = changed;


    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiSummary.clickVerifyChangeLot().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    multiSummary.verifyNewLotValue(oldReagentLot, oldCallibratorLot).then(function (status) {
      expect(status).toBe(true);
    });

  });


  it('Test case 128003: Verify the Submit Data button Enables and Disables properly', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });

    const data_Map = new Map<string, string>();
    data_Map.set('11', '45.43');
    data_Map.set('12', '5.86');
    data_Map.set('13', '47');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const meanL1 = '45.43';
    const sdL1 = '5.86';
    const pointL1 = '47';

    multiSummary.verifyEnteredValueStoredNew(meanL1, sdL1, pointL1).then(function (saved) {
      expect(saved).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    const dataMap7 = new Map<string, string>();
    dataMap7.set('11', '4.6');
    dataMap7.set('12', '1.01');
    dataMap7.set('13', '5');

    multiSummary.enterMeanSDPointValues(dataMap7).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clearValues(dataMap7).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified1) {
      expect(verified1).toBe(true);
    });

  });


  it('Test case 128000: Date-Time Picker localization verify', function () {
    log4jsconfig.log().info('Test case 128000: Date-Time Picker localization verify');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    labSetup.goToLabSetupPage().then(function (displayed) {
      expect(displayed).toBe(true);

    });
    labSetup.updateLabLocation().then(function (location) {
      expect(location).toBe(true);
    });
    dashBoard.clickOnDashBoardArrow().then(function (board) {
      expect(board).toBe(true);
    });
    dataTable.goToDataTablePage().then(function (abc) {
      expect(abc).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (hamburger) {
      expect(hamburger).toBe(true);
      browser.sleep(3000);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    dataTable.expandTree().then(function (expand1) {
      expect(expand1).toBe(true);
    });
    multiSummary.clearAllTestsData('Albumin').then(function (cleared) {
      expect(cleared).toBe(true);
    });
    dataTable.goToInstrument_ProductName(prod).then(function (prodClicked) {
      expect(prodClicked).toBe(true);
    });
    const data_Map = new Map<string, string>();
    browser.sleep(3000);
    data_Map.set('11', '5');
    data_Map.set('12', '6');
    data_Map.set('13', '7');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(data_Map).then(function (entered) {
      dashBoard.waitForElement();

    });
    multiSummary.addComment('Test', '1').then(function (cmntentere) {
      dashBoard.waitForElement();

    });

    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
      browser.sleep(3000);
    });
    element(by.xpath('.// a[@class = "table-link"]')).click();
    const commentForProduct_Level = '1';
    dataTable.verifyCommentSection(commentForProduct_Level).then(function (comment1) {
      expect(comment1).toBe(true);
      browser.sleep(5000);
    });
    browser.actions().mouseMove(element(by.xpath('(// em[@class="spc_pezcell_comments_number"]);[1]'))).perform();
    browser.sleep(5000);
    dataTable.verifyTimeZoneOnCommentSection().then(function (tooltip1) {
      expect(tooltip1).toBe(true);
    });
  });


  it('Test case 128032: Verify Product based multi summary page data on localization setting changed', function () {
    log4jsconfig.log().info('Test case 128032: Verify Product based multi summary page data on localization setting changed');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    labSetup.goToLabSetupPage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    labSetup.updateLabLocation().then(function (location) {
      expect(location).toBe(true);
    });
    dashBoard.clickOnDashBoardArrow().then(function (board) {
      expect(board).toBe(true);
    });
    dataTable.goToDataTablePage().then(function (abc) {
      expect(abc).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (hamburger) {
      expect(hamburger).toBe(true);
      browser.sleep(3000);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    dataTable.expandTree().then(function (expand1) {

    });
    dataTable.goToInstrument_ProductName(prod).then(function (prodClicked) {

      dashBoard.waitForElement();
    });

    dataTable.clickSpcRule().then(function (spcRuleClicked) {
      expect(spcRuleClicked).toBe(true);
      dashBoard.waitForElement();
      browser.sleep(5000);
    });
    spc.verifyLevelsInUse().then(function (levelsInUse) {
      expect(levelsInUse).toBe(true);
      dashBoard.waitForElement();
    });
    multiSummary.setDecimalPlaces(true, 0, true, 1, false, false, false, false).then(function (decimal) {
      expect(decimal).toBe(true);
      dashBoard.waitForElement();
    });
    multiSummary.clickApply().then(function (applyClicked) {

      expect(applyClicked).toBe(true);
    });
    const toastMsg = jsonData.UpdateMsg;
    multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {

      dashBoard.waitForElement();
    });
    multiSummary.goToDataTable().then(function (dataTable1) {

      expect(dataTable1).toBe(true);
      dashBoard.waitForPage();
    });
    browser.actions()
      .mouseMove(element(by.xpath('// span[contains(text();,"' + jsonData.Instrument4Name + '")]'))).perform();
    const clickOnInstrument = element(by.xpath('// span[contains(text();,"' + jsonData.Instrument4Name + '");]'));
    library.clickAction(clickOnInstrument);
    dashBoard.waitForElement();
    multiSummary.verifyIntrumentLevelPageUIElements(jsonData.Instrument4Name).then(function (pro) {
      expect(pro).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dashBoard.waitForElement();
    dataMap.set('11', '5');
    dataMap.set('12', '6');
    dataMap.set('13', '7');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(dataMap).then(function (entered) {
      dashBoard.waitForElement();

    });
    multiSummary.addComment('Test', '1').then(function (cmntentere) {
      dashBoard.waitForElement();
      console.log('Comment added.');

    });


    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
      browser.sleep(6000);
    });


    const addComment = element(by.xpath('(// span[contains(text();,"Add comment");]);[1]'));
    library.scrollToElement(addComment);
    addComment.click().then(function () {
      browser.sleep(5000);
    });
    const addComment1 = browser.driver.findElement(by.xpath('(// textarea[@formcontrolname="comments"]);[1]'));
    library.scrollToElement(addComment1);
    addComment1.sendKeys('Test');
    dashBoard.waitForElement();



    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
      browser.sleep(6000);
    });
    dashBoard.waitForElement();
    const ClickonTest = element(by.xpath('// span[contains(text();,"Albumin");]'));
    ClickonTest.click();
    dashBoard.waitForElement();
    const scroll1 = browser.driver.findElement(by.xpath('(// em[@class="spc_pezcell_comments_number"]);[1]'));
    library.scrollToElement(scroll1);
    const commentForProductLevel = '1';
    dataTable.verifyCommentSection(commentForProductLevel).then(function (comment1) {
      expect(comment1).toBe(true);
      dashBoard.waitForElement();
    });
    dataTable.verifyInteractionIconButtonOnProductLevel().then(function (disabled) {
      expect(disabled).toBe(true);
      dashBoard.waitForElement();
    });
    browser.actions().mouseMove(element(by.xpath('(// em[@class="spc_pezcell_comments_number"]);[1]'))).perform();
    dashBoard.waitForElement();
    dataTable.verifyTimeZoneOnCommentSection().then(function (tooltip1) {
      expect(tooltip1).toBe(true);
      dashBoard.waitForElement();
      dashBoard.waitForElement();
    });
    browser.actions().mouseMove(element(by.xpath(
      '(// br-analyte-summary-view/section/div[2]/div[1]/table/tbody/tr[1]/td[2]/div/div/span);[2]'))).perform();
    dashBoard.waitForElement();
    browser.actions().mouseMove(element(by.xpath('// em[@class="spc_pezcell_interactions_number"]'))).perform();
    dashBoard.waitForElement();
    dataTable.verifyTimeZoneOnCommentSection().then(function (tooltip1) {
      expect(tooltip1).toBe(true);
      dashBoard.waitForElement();
    });

  });


  it('Test case User: Verify data on clicking Submit Data button.', function () {
    log4jsconfig.log().info('Test case User: Verify data on clicking Submit Data button.');
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
      jsonData.UserRolePassword, jsonData.UserRoleFirstname).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    //  go to Data Table page
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    dataTable.expandTree().then(function (expanded) {
      expect(expanded).toBe(true);

    });
    dataTable.goToInstrument_ProductName(prod).then(function (product) {
      expect(product).toBe(true);

    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });

    const dataMap = new Map<string, string>();
    dataMap.set('11', '5');
    dataMap.set('12', '0');
    dataMap.set('13', '4');

    // Enter SD Man Point
    multiSummary.enterMeanSDPointValues(dataMap).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const meanL1 = '5';
    const sdL1 = '0';
    const pointL1 = '4';

    // Verify the stored values
    multiSummary.verifyEnteredValueStoredNew(meanL1, sdL1, pointL1).then(function (saved) {
      expect(saved).toBe(true);
    });
  });

  //  failing due to defect

  it('Test case 127869: Mean, SD, Points, Level Verification', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('11', '34.6');
    dataMap.set('12', '1.01');
    dataMap.set('13', '1');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorMsgforZeroSD).then(function (result) {
      expect(result).toBe(true);
    });
    // (1). Mean value (Yes);, SD value (NO);, Points Value(NO);
    const dataMap1 = new Map<string, string>();
    dataMap1.set('11', '4.6');
    dataMap1.set('21', '1');

    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (resultSD) {
      expect(resultSD).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (resultpoint) {
      expect(resultpoint).toBe(true);
    });

    // (2). Mean value (Yes);, SD value (Yes);, Points Value(NO);
    const dataMap2 = new Map<string, string>();
    dataMap2.set('11', '4.6');
    dataMap2.set('12', '1.01');
    dataMap2.set('13', '');
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap2).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (result) {
      expect(result).toBe(true);
    });

    //  (3). Mean value (Yes);, SD value (NO);, Points Value(Yes);

    const dataMap3 = new Map<string, string>();
    dataMap3.set('11', '4.6');
    dataMap3.set('12', ' ');
    dataMap3.set('13', '5');
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap3).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (result) {
      expect(result).toBe(true);
    });


    //  (4); Mean value (NO);, SD value (Yes);,Points Value(NO);
    const dataMap4 = new Map<string, string>();
    dataMap4.set('11', ' ');
    dataMap4.set('12', '1.01');
    dataMap4.set('13', ' ');
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap4).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (result) {
      expect(result).toBe(true);
    });


    //  (5); Mean value (NO);, SD value (Yes);, Points Value(Yes);
    const dataMap5 = new Map<string, string>();
    dataMap5.set('11', ' ');
    dataMap5.set('12', '1.01');
    dataMap5.set('13', '5');
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap5).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (result) {
      expect(result).toBe(true);
    });

    //  (6); Mean value (NO);, SD value (NO);, Points Value(Yes);
    const dataMap6 = new Map<string, string>();
    dataMap6.set('11', ' ');
    dataMap6.set('12', ' ');
    dataMap6.set('13', '5');
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap6).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (result) {
      expect(result).toBe(true);
    });

    const dataMap7 = new Map<string, string>();
    dataMap7.set('11', '54.6');
    dataMap7.set('12', '16.01');
    dataMap7.set('13', '32');
    multiSummary.enterMeanSDPointValues(dataMap7).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submit) {
      expect(submit).toBe(true);
    });
    const mean = '54.6';
    const sd = '16.01';
    const point = '32';

    //  Verify the stored values
    //   multiSummary.verifyEnteredValueStored(mean, sd, point).then(function (saved) {
    //     expect(saved).toBe(true);
    //   });

  });


  it('Test case 127856: Mean Value Verification', function () {
    const mean = '34.96', sd = '0.03', point = '17';
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('11', '-.');
    dataMap.set('13', 'protractor.Key.TAB');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    //  multiSummary.selectLevelEntry().then(function (selected) {
    //    expect(selected).toBe(true);
    //  });
    //  multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (result) {
    //    expect(result).toBe(true);
    //  });
    multiSummary.verifyMaxLength('1234567890123412', 16).then(function (status) {
      expect(status).toBe(true);
    });
    multiSummary.verifyMeanCharType('abc!@12#$%^&*();_+:{}":<>').then(function (status) {
      expect(status).toBe(true);
    });
    const dataMap1 = new Map<string, string>();
    dataMap1.set('11', mean);
    dataMap1.set('12', sd);
    dataMap1.set('13', point);
    multiSummary.enterMeanSDPointValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });


  // failing due to defect
  it('Test case 127857: SD Value Verification', function () {
    log4jsconfig.log().info('Test case 127857: SD Value Verification');
    const mean = '2', sd = '4', point = '6';
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dept = jsonData.DepartmentNumber;
    const inst = jsonData.InstrumentNumber;
    const prod = jsonData.Instrument4Product1;
    dataTable.collapseInstrument1().then(function (col1) {
      expect(col1).toBe(true);
    });
    dataTable.collapseInstrument2().then(function (col2) {
      expect(col2).toBe(true);
    });
    dataTable.goToProduct(dept, inst, prod).then(function (product) {
      expect(product).toBe(true);
    });

    const dataMap = new Map<string, string>();
    dataMap.set('12', '-.');
    dataMap.set('13', 'protractor.Key.TAB');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (result) {
      expect(result).toBe(true);

      multiSummary.verifyMaxLength('12345678901234', 11).then(function (status) {
        expect(status).toBe(true);
      });

      multiSummary.verifySdCharType('abc!@12#$%^&*();_+:{}":<>').then(function (status) {
        expect(status).toBe(true);
      });

      const dataMap1 = new Map<string, string>();
      dataMap1.set('11', mean);
      dataMap1.set('12', sd);
      dataMap1.set('13', point);

      multiSummary.enterMeanSDPointValues(dataMap1).then(function (result1) {
        expect(result1).toBe(true);
      });
      multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
        expect(disabled).toBe(true);
      });
      multiSummary.clickSubmitButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    });

  });


  it('Deconste Data, Test and Location', function () {
    log4jsconfig.log().info('Deconste Data, Test and Location');
    loginEvent.loginToApplication(jsonData.URL, jsonData.SampadaUsername,
      jsonData.SampadaPassword, jsonData.SampadaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dataTable.goToDataTablePage().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataTable.clickHamburgerIcon().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataTable.expandTree().then(function (expand) {
      expect(expand).toBe(true);
      dashboard.waitForElement();

    });
    dataTable.deleteAlltestData().then(function (data) {
      expect(data).toBe(true);
    });
    dashBoard.goToDashboard().then(function (board) {
      expect(board).toBe(true);
    });
    labSetup.deleteLocation().then(function (location) {
      expect(location).toBe(true);

    });
  });


  it('Test case 127764: Configuration set up verification', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const dataMap = new Map<string, string>();

    dataMap.set('11', '34.12');
    dataMap.set('12', '2.12');
    dataMap.set('13', '33');
    dataMap.set('14', '41.12');
    dataMap.set('15', '5.12');
    dataMap.set('16', '66');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.enterMeanSDPointValues(dataMap).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.verifyDateTimePicker().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterSummary().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredNew(34.12, 2.12, 33).then(function (verify) {
      expect(verify).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredL2(41.12, 5.12, 66).then(function (verify) {
      expect(verify).toBe(true);
    });
  });


});
