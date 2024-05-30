/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { DataTable } from '../page-objects/data-table-e2e.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';

let jsonData, flag;

const library = new BrowserLibrary();

library.parseJson('./JSON_data/HistorySectionOnDataTable-UN-10530.json').then(function (data) {
    jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test suite: History Section On Data Table', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const dashBoard = new Dashboard();
    const out = new LogOut();
    const library = new BrowserLibrary();
    const dataTable = new DataTable();
    const multiSummary = new MultiSummary();
    const pointDataEntry = new PointDataEntry();


    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.UserName, jsonData.Password, jsonData.FirstName).then(function (result) {
            expect(result).toBe(true);
        });
    });
    
    afterEach(async function () {
        await out.signOut();
        await browser.manage().deleteAllCookies();
    });

    xit('Verify UI Components for History Section for Summary Data', async () => {
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        await dataTable.scrollHistoryToScreen();
        library.logStep("Verify presence of History Icon");
        flag = await dataTable.isHistoryIconPresent();
        expect(flag).toBe(true);
        library.logStep('Verify presence of History Count');
        flag = await dataTable.isHistoryCountPresent();
        expect(flag).toBe(true);
        await library.waitLoadingImageIconToBeInvisible();
        await library.waitLoadingImageIconToBeInvisible();
        let count = await dataTable.getHistoryCount();
        await dataTable.clickHistoryIcon();
        library.logStep('Verify History Title');
        flag = await dataTable.isHistoryTitlePresent();
        expect(flag).toBe(true);
        flag = await dataTable.getHistoryTitle();
        expect(flag).toEqual("History");
        library.logStep('Verify the number of history items are same as mentioned in the History Icon');
        let countItems = await dataTable.getHistoryItemsLength();
        expect(count).toEqual(countItems);
    });

    xit('Verify UI Components for History Section for Point Data', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        await dataTable.scrollHistoryToScreen();
        library.logStep("Verify presence of History Icon");
        flag = await dataTable.isHistoryIconPresent();
        expect(flag).toBe(true);
        library.logStep('Verify presence of History Count');
        flag = await dataTable.isHistoryCountPresent();
        expect(flag).toBe(true);
        await library.waitLoadingImageIconToBeInvisible();
        await library.waitLoadingImageIconToBeInvisible();
        let count = await dataTable.getHistoryCount();
        await dataTable.clickHistoryIcon();
        library.logStep('Verify History Title');
        flag = await dataTable.isHistoryTitlePresent();
        expect(flag).toBe(true);
        flag = await dataTable.getHistoryTitle();
        expect(flag).toEqual("History");
        library.logStep('Verify the number of history items are same as mentioned in the History Icon');
        let countItems = await dataTable.getHistoryItemsLength();
        expect(count).toEqual(countItems);
    });

    xit('Veify the History section gets closed when click on X icon on Top Right', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        await dataTable.scrollHistoryToScreen();
        await dataTable.clickHistoryIcon();
        await dataTable.closeHistory();
        flag = true;
        flag = await dataTable.isHistoryVisible();
        expect(flag).toBe(false);
    });

    xit('Verify the count is increased when Data is modified for Summary Data Entry', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let count = await dataTable.getHistoryCount();
        await multiSummary.clickFirstRun();
        let map = new Map<String, String>();
        map.set('21', l1);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitUpdateButton();
        expect(await dataTable.getHistoryCount()).toBeGreaterThan(count);
    });

    xit('Verify the count is increased when Data is modified for Point Data Entry', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        let l2 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let count = await dataTable.getHistoryCount();
        await pointDataEntry.clickFirstRun();
        await pointDataEntry.enterPointValuesEditDialog(l1, l2);
        await pointDataEntry.clickSubmitUpdatesButton();
        expect(await dataTable.getHistoryCount()).toBeGreaterThan(count);
    });

    xit('Verify the History items for newly entered Summary Data', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        let l2 = (Math.random() * 10).toString().substring(0, 3);
        let l3 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', l1);
        map.set('12', l2);
        map.set('13', l3);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await dataTable.clickHistoryIcon();
        let countItems = await dataTable.getHistoryItemsLength();
        library.logStep("Verify the History is added for newly entered Summary Data");
        expect(countItems).toBeGreaterThanOrEqual(1);
        library.logStep("Verify the Date and Time is mentioned for newly Entered Summary Data");
        flag = await dataTable.isDateDisplayed();
        expect(flag).toBe(true);
        flag = await dataTable.isTimeDisplayed();
        expect(flag).toBe(true);
        library.logStep("Verify the User Name is present for newly entered Summary Data");
        flag = await dataTable.isUserNameDisplayed();
        expect(flag).toBe(true);
    });

    xit('Verify the History items for newly entered Point Data', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('21', l1);
        await pointDataEntry.enterPointValue(l1);
        await pointDataEntry.clickSubmitButton();
        await dataTable.clickHistoryIcon();
        let countItems = await dataTable.getHistoryItemsLength();
        library.logStep("Verify the History is added for newly entered Point Data");
        expect(countItems).toBeGreaterThanOrEqual(1);
        library.logStep("Verify the Date and Time is mentioned for newly Entered Point Data");
        flag = await dataTable.isDateDisplayed();
        expect(flag).toBe(true);
        flag = await dataTable.isTimeDisplayed();
        expect(flag).toBe(true);
        library.logStep("Verify the User Name is present for newly entered Point Data");
        flag = await dataTable.isUserNameDisplayed();
        expect(flag).toBe(true);
    });

    xit('Verify the Date and Time is mentioned Summary Data is Modified', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        let l2 = (Math.random() * 10).toString().substring(0, 3);
        let l3 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', l1);
        map.set('12', l2);
        map.set('13', l3);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickFirstRun();
        let mapSummary = new Map<String, String>();
        mapSummary.set('21', l1);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitUpdateButton();
        await dataTable.clickHistoryIcon();
        flag = await dataTable.isDateDisplayed();
        expect(flag).toBe(true);
        flag = await dataTable.isTimeDisplayed();
        expect(flag).toBe(true);
    });

    xit('Verify the Date and Time is mentioned Point Data is Modified', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('21', l1);
        await pointDataEntry.enterPointValue(l1);
        await pointDataEntry.clickSubmitButton();
        let pl1 = (Math.random() * 10).toString().substring(0, 3);
        let pl2 = (Math.random() * 10).toString().substring(0, 3);
        await pointDataEntry.clickFirstRun();
        await pointDataEntry.enterPointValuesEditDialog(pl1, pl2);
        await pointDataEntry.clickSubmitUpdatesButton();
        await dataTable.clickHistoryIcon();
        flag = await dataTable.isDateDisplayed();
        expect(flag).toBe(true);
        flag = await dataTable.isTimeDisplayed();
        expect(flag).toBe(true);
    });

    xit('Verify the User Name is present when Summary Data is modified', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        let l2 = (Math.random() * 10).toString().substring(0, 3);
        let l3 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', l1);
        map.set('12', l2);
        map.set('13', l3);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickFirstRun();
        let mapSummary = new Map<String, String>();
        mapSummary.set('21', l1);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitUpdateButton();
        await dataTable.clickHistoryIcon();
        flag = await dataTable.isUserNameDisplayed();
        expect(flag).toBe(true);
    });

    xit('Verify the User Name is present when Point Data is modified', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('21', l1);
        await pointDataEntry.enterPointValue(l1);
        await pointDataEntry.clickSubmitButton();
        let pl1 = (Math.random() * 10).toString().substring(0, 3);
        let pl2 = (Math.random() * 10).toString().substring(0, 3);
        await pointDataEntry.clickFirstRun();
        await pointDataEntry.enterPointValuesEditDialog(pl1, pl2);
        await pointDataEntry.clickSubmitUpdatesButton();
        await dataTable.clickHistoryIcon();
        flag = await dataTable.isUserNameDisplayed();
        expect(flag).toBe(true);
    });

    xit('Verify the modified values are separated by commas when Summary Data with Multi Level is modified', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        let l2 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        await multiSummary.clickFirstRun();
        let map = new Map<String, String>();
        map.set('21', l1);
        map.set('24', l2);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitUpdateButton();
        await dataTable.clickHistoryIcon();
        flag = await dataTable.isCommasPrsentInHistoryAction();
        expect(flag).toBe(true);
    });

    xit('Verify the modified values are separated by commas when Point Data with Multi Level is modified', async () => {
        let l1 = (Math.random() * 10).toString().substring(0, 3);
        let l2 = (Math.random() * 10).toString().substring(0, 3);
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let count = await dataTable.getHistoryCount();
        await pointDataEntry.clickFirstRun();
        await pointDataEntry.enterPointValuesEditDialog(l1, l2);
        await pointDataEntry.clickSubmitUpdatesButton();
        flag = await dataTable.isCommasPrsentInHistoryAction();
        expect(flag).toBe(true);
    });

    xit('Verify the History is Added when Date is changed for Summary Data Entry', async () => {
        let mean = (Math.random() * 10).toString().substring(0, 3);
        let sd = (Math.random() * 10).toString().substring(0, 3);
        let point = (Math.random() * 10).toString().substring(0, 1);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', mean);
        map.set('12', sd);
        map.set('13', point);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickFirstRun();
        let date = await multiSummary.selectDateOtherThanCurrentDay();
        await multiSummary.clickSubmitUpdateButton();
        await multiSummary.clickHistoryIconWithValues([mean, sd, point]);
        await dataTable.verifyHistoryDate(jsonData.userName, date);
    });

    xit('Verify the History is Added when Mean Value is changed for Summary Data Entry', async () => {
        let mean = (Math.random() * 10).toString().substring(0, 3);
        let sd = (Math.random() * 10).toString().substring(0, 3);
        let point = (Math.random() * 10).toString().substring(0, 1);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', mean);
        map.set('12', sd);
        map.set('13', point);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickRunWithValues([mean, sd, point]);
        map.clear();
        map.set('21', (Math.random() * 10).toString().substring(0, 3));
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitUpdateButton();
        await multiSummary.clickHistoryIconWithValues([mean, sd, point]);
        await dataTable.verifyHistoryMean(jsonData.userName, 1, map.get('21'));
    });


    xit('Verify the History is Added when SD Value is changed for Summary Data Entry', async () => {
        let mean = (Math.random() * 10).toString().substring(0, 3);
        let sd = (Math.random() * 10).toString().substring(0, 3);
        let point = (Math.random() * 10).toString().substring(0, 1);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', mean);
        map.set('12', sd);
        map.set('13', point);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickRunWithValues([mean, sd, point]);
        map.clear();
        map.set('22', (Math.random() * 10).toString().substring(0, 3));
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitUpdateButton();
        await multiSummary.clickHistoryIconWithValues([mean, sd, point]);
        await dataTable.verifyHistorySD(jsonData.userName, 1, map.get('22'));
    });

    xit('Verify the History is Added when Point Value is changed for Summary Data Entry', async () => {
        let mean = (Math.random() * 10).toString().substring(0, 3);
        let sd = (Math.random() * 10).toString().substring(0, 3);
        let point = (Math.random() * 10).toString().substring(0, 1);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', mean);
        map.set('12', sd);
        map.set('13', point);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickRunWithValues([mean, sd, point]);
        map.clear();
        map.set('23', (Math.random() * 10).toString().substring(0, 3));
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitUpdateButton();
        await multiSummary.clickHistoryIconWithValues([mean, sd, point]);
        await dataTable.verifyHistoryPoint(jsonData.userName, 1, map.get('23'));
    });

    xit('Verify the History is Added when Calibrator Lot is changed for Summary Data Entry', async () => {
        let mean = (Math.random() * 10).toString().substring(0, 3);
        let sd = (Math.random() * 10).toString().substring(0, 3);
        let point = (Math.random() * 10).toString().substring(0, 1);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', mean);
        map.set('12', sd);
        map.set('13', point);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickRunWithValues([mean,sd,point]);
        let lot = await multiSummary.selectCalibratorLotOtherThanCurrent();
        await multiSummary.clickSubmitUpdateButton();
        await multiSummary.clickHistoryIconWithValues([mean, sd, point]);
        await dataTable.verifyHistoryCalibratorLot(jsonData.userName, lot);
    });

    xit('Verify the History is Added when Reagent Lot is changed for Summary Data Entry', async () => {
        let mean = (Math.random() * 10).toString().substring(0, 3);
        let sd = (Math.random() * 10).toString().substring(0, 3);
        let point = (Math.random() * 10).toString().substring(0, 1);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', mean);
        map.set('12', sd);
        map.set('13', point);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickRunWithValues([mean,sd,point]);
        let lot = await multiSummary.selectReagentLotOtherThanCurrent();
        await multiSummary.clickSubmitUpdateButton();
        await multiSummary.clickHistoryIconWithValues([mean, sd, point]);
        await dataTable.verifyHistoryReagentLot(jsonData.userName, lot);
    });

    xit('Verify the History is Added when comment is changed for Summary Data Entry', async () => {
        let mean = (Math.random() * 10).toString().substring(0, 3);
        let sd = (Math.random() * 10).toString().substring(0, 3);
        let point = (Math.random() * 10).toString().substring(0, 1);
        await dashBoard.selectSidebarOption(jsonData.summaryDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let map = new Map<String, String>();
        map.set('11', mean);
        map.set('12', sd);
        map.set('13', point);
        await multiSummary.enterMeanSDPointValues(map);
        await multiSummary.clickSubmitButton();
        await multiSummary.clickRunWithValues([mean,sd,point]);
        let comment = "Automation "+Date.now();
        await multiSummary.addEditComment(comment);
        await multiSummary.clickSubmitUpdateButton();
        await multiSummary.clickHistoryIconWithValues([mean, sd, point]);
        await dataTable.verifyHistoryComment(jsonData.userName);
    });
    
    xit('Verify the History is Added when Calibrator Lot is changed for Point Data Entry', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let values = await pointDataEntry.fillRandomLevelValues();
        await pointDataEntry.clickSubmitButton();
        await pointDataEntry.clickRunWithValues(values);
        let lot = await pointDataEntry.selectCalibratorLotOtherThanCurrent();
        await pointDataEntry.clickSubmitUpdatesButton();
        await pointDataEntry.clickHistoryIconWithValues(values);
        await dataTable.verifyHistoryCalibratorLot(jsonData.userName, lot);
    });
    
    xit('Verify the History is Added when Reagent Lot is changed for Point Data Entry', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let values = await pointDataEntry.fillRandomLevelValues();
        await pointDataEntry.clickSubmitButton();
        await pointDataEntry.clickRunWithValues(values);
        let lot = await pointDataEntry.selectReagentLotOtherThanCurrent();
        await pointDataEntry.clickSubmitUpdatesButton();
        await pointDataEntry.clickHistoryIconWithValues(values);
        await dataTable.verifyHistoryReagentLot(jsonData.userName, lot);
    });
    
    xit('Verify the History is Added when Restart Float Toggle is changed for Point Data Entry', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let values = await pointDataEntry.fillRandomLevelValues();
        await pointDataEntry.clickSubmitButton();
        await pointDataEntry.clickRunWithValues(values);
        await pointDataEntry.clickonrestartFloatIcon();
        await pointDataEntry.clickSubmitUpdatesButton();
        await pointDataEntry.clickHistoryIconWithValues(values);
        await dataTable.verifyHistoryRestartFloat(jsonData.userName);
    });
    
    xit('Verify the History is Added when Level Value is changed for Point Data Entry', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let values = await pointDataEntry.fillRandomLevelValues();
        await pointDataEntry.clickSubmitButton();
        await pointDataEntry.clickRunWithValues(values);
        let value = await pointDataEntry.enterRandomLevel1Values();
        values[0] = value;
        await pointDataEntry.clickSubmitUpdatesButton();
        await pointDataEntry.clickHistoryIconWithValues(values);
        await dataTable.verifyHistoryLevel(jsonData.userName, 1, value);
    });
    
    xit('Verify the History is Added when Accept or Reject is Selected Point Data Entry', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let values = await pointDataEntry.fillRandomLevelValues();
        await pointDataEntry.clickSubmitButton();
        let level = '1';
        await pointDataEntry.clickRunWithValues(values);
        await pointDataEntry.clickReject(level);
        await pointDataEntry.clickSubmitUpdatesButton();
        await pointDataEntry.clickHistoryIconWithValues(values);
        await dataTable.verifyHistoryReject(jsonData.userName, 1);
        await dataTable.closeHistory();
        await pointDataEntry.clickRunWithValues(values);
        await pointDataEntry.clickAccept(level);
        await pointDataEntry.clickSubmitUpdatesButton();
        await pointDataEntry.clickHistoryIconWithValues(values);
        await dataTable.verifyHistoryAccept(jsonData.userName, 1);
    });
    
    xit('Verify the comment is Not Added in History for Point Data Entry', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let values = await pointDataEntry.fillRandomLevelValues();
        await pointDataEntry.clickSubmitButton();
        await pointDataEntry.clickRunWithValues(values);
        let comment = "Automation "+Date.now();
        await pointDataEntry.addCommentOnEditDialog(comment);
        await pointDataEntry.clickSubmitUpdatesButton();
        await pointDataEntry.clickHistoryIconWithValues(values);
        await dataTable.verifyHistoryComment(jsonData.userName);
    });
    
    it('Verify the Action Change is Not Added in History for Point Data Entry', async () => {
        await dashBoard.selectSidebarOption(jsonData.pointDepartmentName);
        await dashBoard.selectSidebarOption(jsonData.instrumentName);
        await dashBoard.selectSidebarOption(jsonData.controlName);
        await dashBoard.selectSidebarOption(jsonData.analyteName);
        let values = await pointDataEntry.fillRandomLevelValues();
        await pointDataEntry.clickSubmitButton();
        await pointDataEntry.clickRunWithValues(values);
        await pointDataEntry.chooseARandomAction();
        await pointDataEntry.clickSubmitUpdatesButton();
        await pointDataEntry.clickHistoryIconWithValues(values);
        await dataTable.verifyHistoryAction(jsonData.userName);
    });

});
