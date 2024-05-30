/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { DataTable } from '../page-objects/data-table-e2e.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { MultiPoint } from '../page-objects/multi-point.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();


library.parseJson('./JSON_data/DataEntryShowOption.json').then(function(data) {
  jsonData = data;
});


describe(' Data Entry Show Option', function () {
    browser.waitForAngularEnabled(false);
    const newLabSetup = new NewLabSetup();
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const dataTable = new DataTable();
    const multiSummary = new MultiSummary();
    const dashboard = new Dashboard();
    const library = new BrowserLibrary();
    const pointData = new PointDataEntry();
    const multiPoint = new MultiPoint();
    let reagent, calibrator; // reagentFromLabSetup, calibratorFromLabSetup;

    beforeEach(function () {
        loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
            expect(loggedIn).toBe(true);
        });
    });

    afterEach(function () {
        out.signOut();
    });

    // MultiSummary
    it('Show options link is not visible by default for Multi Summary Data Entry', function () {
        library.logStep('Show options link is not visible by default for Multi Summary Data Entry.');
        const prod = jsonData.ProductName;
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
        dataTable.goToInstrument_ProductName(prod).then(function (status) {
            expect(status).toBe(true);
        });
        multiSummary.clickManuallyEnterData().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(false);
        });
    });

    it('Show options link should be visible after hovering mouse on entry form for Multi Summary Data Entry', function () {
        library.logStep('Show options link should be visible after hovering mouse on entry form for Multi Summary Data Entry');
        const prod = jsonData.ProductName;
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
        dataTable.goToInstrument_ProductName(prod).then(function (status) {
            expect(status).toBe(true);
        });
        multiSummary.clickManuallyEnterData().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverOverTest(jsonData.Test1).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(true);
        });
    });

    it('Options should be displayed after clicking on Show Options link for Multi Summary Data Entry', function () {
        library.logStep('Options should be displayed after clicking on Show Options link for Multi Summary Data Entry.');
        const prod = jsonData.ProductName;
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
        dataTable.goToInstrument_ProductName(prod).then(function (status) {
            expect(status).toBe(true);
        });
        multiSummary.clickManuallyEnterData().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (click) {
            expect(click).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.isOptionDisplayed().then(function (displayed) {
            expect(displayed).toBe(true);
        });
    });

    it('Clicking on Hide Options link hides the shown options for Multi Summary Data Entry', function () {
        library.logStep('Clicking on Hide Options link hides the shown options for Multi Summary Data Entry.');
        const prod = jsonData.ProductName;
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
        dataTable.goToInstrument_ProductName(prod).then(function (status) {
            expect(status).toBe(true);
        });
        multiSummary.clickManuallyEnterData().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.clickHideOption().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        multiSummary.OptionNotDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
    });

    // Unable to select reagent lot and calibrator lot so that part is pending.
    it('Entered Data contains correct values selected for the Reagent Lot & Calibrator Lot for Multi Summary Data Entry.', function () {
        library.logStep('Entered Data contains correct values selected for Reagent Lot & Calibrator Lot for Multi Summary Data Entry.');
        const prod = jsonData.ProductName;
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
        dataTable.goToInstrument_ProductName(prod).then(function (status) {
            expect(status).toBe(true);
        });
        multiSummary.clickManuallyEnterData().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.isOptionDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
        const dataMap = new Map<string, string>();
        dataMap.set('11', '4.6');
        dataMap.set('12', '1.01');
        dataMap.set('13', '5');
        multiSummary.enterMeanSDPointValues(dataMap).then(function (entered23) {
            expect(entered23).toBe(true);
        });
        // method to select reagent and calibrator lot.
        multiSummary.clickSubmitButton().then(function (clicked45) {
            expect(clicked45).toBe(true);
        });
        // verification method for saved data with selected calibrator and reagent lot.
    });

    // Comment Verification pending as it is not displaying on saving data
    it('Add Comment text box should allow user to enter a comment for Multi Summary Data Entry', function () {
        library.logStep('Add Comment text box should allow user to enter a comment for Multi Summary Data Entry.');
        const prod = jsonData.ProductName;
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
        dataTable.goToInstrument_ProductName(prod).then(function (status) {
            expect(status).toBe(true);
        });
        multiSummary.clickManuallyEnterData().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.addComment(jsonData.Comment, '').then(function (Visible) {
            expect(Visible).toBe(true);
        });
        const dataMap = new Map<string, string>();
        dataMap.set('11', '4.6');
        dataMap.set('12', '1.01');
        dataMap.set('13', '5');
        multiSummary.enterMeanSDPointValues(dataMap).then(function (entered23) {
            expect(entered23).toBe(true);
        });
        multiSummary.clickSubmitButton().then(function (submit) {
            expect(submit).toBe(true);
        });
        const mean = '4.60';
        const sd = '1.01';
        const point = '5';
        // Verify the stored values
        multiSummary.verifyEnteredValueStoredNew(mean, sd, point).then(function (saved) {
            expect(saved).toBe(true);
        });
    });

    // Need calibrator lab and reagent lab
    it('Clicking on Cancel Button should clear all the entered data for Multi Summary Data Entry.', function () {
        library.logStep('Clicking on Cancel Button should clear all the entered data for Multi Summary Data Entry.');
        const prod = jsonData.ProductName;
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
        dataTable.goToInstrument_ProductName(prod).then(function (status) {
            expect(status).toBe(true);
        });
        multiSummary.clickManuallyEnterData().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        // select calibrator and reagent lab
        multiSummary.clickSubmitButton().then(function (submit) {
            expect(submit).toBe(true);
        });
        const dataMap = new Map<string, string>();
        dataMap.set('11', '4.6');
        dataMap.set('12', '1.01');
        dataMap.set('13', '5');
        multiSummary.enterMeanSDPointValues(dataMap).then(function (entered23) {
            expect(entered23).toBe(true);
        });
        const mean = '4.60';
        const sd = '1.01';
        const point = '5';
        multiSummary.clickCancelBtn().then(function (cancel) {
            expect(cancel).toBe(true);
        });
        multiSummary.OptionNotDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
    });

    // calibrator and reagent lot are disabled Need to add method for this.
    it('No dropdown should be displayed if there is only one value for Reagent Lot or Calibrator Lot for Multi Summary', function () {
        library.logStep('No dropdown should be displayed if there is only one value for Reagent or Calibrator Lot for Multi Summary');
        const prod = jsonData.ProductName;
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
        dataTable.goToInstrument_ProductName(prod).then(function (status) {
            expect(status).toBe(true);
        });
        multiSummary.clickManuallyEnterData().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
    });

    // SingleSummary
    it('Test Case SSDE01: Show options link is not visible by default for Single Summary Data Entry', function () {
        library.logStep('Test Case SSDE01: Show options link is not visible by default for Single Summary Data Entry.');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigate) {
            expect(navigate).toBe(true);
        });
        multiSummary.clickTestCollapse().then(function (clk) {
            expect(clk).toBe(true);
        });
        multiSummary.clickManuallyEnterSummary().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(false);
        });
    });

    it('Test Case SSDE02: Show options link should be visible after hovering mouse on entry form for Single Summary', function () {
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigate) {
            expect(navigate).toBe(true);
        });
        multiSummary.clickTestCollapse().then(function (clk) {
            expect(clk).toBe(true);
        });
        multiSummary.clickManuallyEnterSummary().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverOverTest(jsonData.Test1).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(true);
        });
    });

    it('Test Case SSDE03: Options should be displayed after clicking on Show Options link for Single Summary Data Entry', function () {
        library.logStep('Test Case SSDE03: Options should be displayed after clicking on Show Options link for Single Summary Data Entry.');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigate) {
            expect(navigate).toBe(true);
        });
        multiSummary.clickTestCollapse().then(function (clk) {
            expect(clk).toBe(true);
        });
        multiSummary.clickManuallyEnterSummary().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.isOptionDisplayed().then(function (displayed) {
            expect(displayed).toBe(true);
        });
    });

    it('Test Case SSDE04: Clicking on Hide Options link hides the shown options for Single Summary Data Entry', function () {
        library.logStep('Test Case SSDE04: Clicking on Hide Options link hides the shown options for Single Summary Data Entry.');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigate) {
            expect(navigate).toBe(true);
        });
        multiSummary.clickTestCollapse().then(function (clk) {
            expect(clk).toBe(true);
        });
        multiSummary.clickManuallyEnterSummary().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.clickHideOption().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        multiSummary.OptionNotDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
    });


    //   // // //Unable to select reagent lot and calibrator lot so that part is pending.
    //   it('Entered Data contains correct values selected for Reagent Lot & Calibrator Lot for Single Summary.', function () {
    //       library.logStep('Entered Data contains correct values selected for Reagent Lot & Calibrator Lot for Single Summary.');
    //       var test = jsonData.AnalyteName;
    //       newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
    //       expect(navigate).toBe(true);
    //   })
    //   newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
    //       expect(navigate).toBe(true);
    //   })
    //   newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
    //       expect(navigate).toBe(true);
    //   })
    //   newLabSetup.navigateTO(jsonData.AnalyteName).then(function (navigate) {
    //       expect(navigate).toBe(true);
    //   })
    //       multiSummary.clickTestCollapse().then(function (clk) {
    //           expect(clk).toBe(true);
    //       });
    //       multiSummary.clickManuallyEnterSummary().then(function (clicked) {
    //           expect(clicked).toBe(true);
    //       });
    //       multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
    //           expect(hover).toBe(true);
    //       });
    //       multiSummary.clickShowOptionnew().then(function (Visible) {
    //           expect(Visible).toBe(true);
    //       });
    //       multiSummary.isOptionDisplayed().then(function (displayed) {
    //           expect(displayed).toBe(false);
    //       });
    //       var dataMap = new Map<string, string>();
    //       dataMap.set('11', '4.6');
    //       dataMap.set('12', '1.01');
    //       dataMap.set('13', '5');
    //       multiSummary.enterMeanSDPointValues(dataMap).then(function (entered23) {
    //           expect(entered23).toBe(true);
    //       });
    //       //method to select reagent and calibrator lot.
    //       multiSummary.clickSubmitButton().then(function (clicked45) {
    //           expect(clicked45).toBe(true);
    //       });
    //       //verification method for saved data with selected calibrator and reagent lot.
    //   });

    // //Comment Verification pending as it is not displaying on saving data
    // it('Add Comment text box should allow user to enter a comment for Single Summary Data Entry', function () {
    //     library.logStep('Add Comment text box should allow user to enter a comment for Single Summary Data Entry.');
    //     var test = jsonData.AnalyteName;
    // newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
    //     expect(navigate).toBe(true);
    // })
    // newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
    //     expect(navigate).toBe(true);
    // })
    // newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
    //     expect(navigate).toBe(true);
    // })
    // newLabSetup.navigateTO(jsonData.AnalyteName).then(function (navigate) {
    //     expect(navigate).toBe(true);
    // })
    //     multiSummary.clickTestCollapse().then(function (clk) {
    //         expect(clk).toBe(true);
    //     });
    //     multiSummary.clickManuallyEnterSummary().then(function (clicked) {
    //         expect(clicked).toBe(true);
    //     });
    //     multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
    //         expect(hover).toBe(true);
    //     });
    //     multiSummary.clickShowOptionnew().then(function (Visible) {
    //         expect(Visible).toBe(true);
    //     });
    //     var dataMap = new Map<string, string>();
    //     dataMap.set('11', '4.6');
    //     dataMap.set('12', '1.01');
    //     dataMap.set('13', '5');
    //     multiSummary.enterMeanSDPointValues(dataMap).then(function (entered23) {
    //         expect(entered23).toBe(true);
    //     });
    //     multiSummary.addComment(jsonData.Comment, '').then(function (Visible) {
    //         expect(Visible).toBe(true);
    //     });
    //     multiSummary.clickSubmitButton().then(function (submit) {
    //         expect(submit).toBe(true);
    //     });
    //     var mean = '4.60';
    //     var sd = '1.01';
    //     var point = '5';
    //     //Verify the stored values
    //     multiSummary.verifyEnteredValueStored(mean, sd, point).then(function (saved) {
    //         expect(saved).toBe(true);
    //     });
    // });

    // // Need calibrator lab and reagent lab
    it('Test Case SSDE05: Clicking on Cancel Button should clear all the entered data for Single Summary Data Entry.', function () {
        library.logStep('Test Case SSDE05: Clicking on Cancel Button should clear all the entered data for Single Summary Data Entry.');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigate) {
            expect(navigate).toBe(true);
        });
        multiSummary.clickTestCollapse().then(function (clk) {
            expect(clk).toBe(true);
        });
        multiSummary.clickManuallyEnterSummary().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        const dataMap = new Map<string, string>();
        dataMap.set('11', '4.6');
        dataMap.set('12', '1.01');
        dataMap.set('13', '5');
        multiSummary.enterMeanSDPointValues(dataMap).then(function (entered23) {
            expect(entered23).toBe(true);
        });
        // select calibrator and reagent lab
        multiSummary.clickSubmitButton().then(function (submit) {
            expect(submit).toBe(true);
        });
        const mean = '4.60';
        const sd = '1.01';
        const point = '5';
        multiSummary.clickCancelBtn().then(function (cancel) {
            expect(cancel).toBe(true);
        });
        multiSummary.OptionNotDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
    });

    // //calibrator and reagent lot are disabled Need to add method for this.
    it('Test Case SSDE06: No dropdown should be displayed if there is only one value for Reagent Lot or Calibrator Lot for Single Summary Data Entry', function () {
        library.logStep('Test Case SSDE06: No dropdown should be displayed if there is only one value for Reagent Lot or Calibrator Lot for Single Summary Data Entry.');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.SummaryAnalyte).then(function (navigate) {
            expect(navigate).toBe(true);
        });
        multiSummary.clickTestCollapse().then(function (clk) {
            expect(clk).toBe(true);
        });
        multiSummary.clickManuallyEnterSummary().then(function (clicked) {
            expect(clicked).toBe(true);
        });
        multiSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
    });

    // Point Data Entry
    it('Test Case PDE01: Options should be displayed after clicking on Show Options link for Point Data Entry', function () {
        library.logStep('Test Case PDE01: Options should be displayed after clicking on Show Options link for Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
            expect(analyte).toBe(true);
        });
        pointData.clickHideData().then(function (dataHidden) {
            expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        pointData.isOptionDisplayed().then(function (displayed) {
            expect(displayed).toBe(true);
        });
    });

    it('Test Case PDE02: Clicking on Hide Options link hides the shown options for Point Data Entry', function () {
        library.logStep('Test Case PDE02: Clicking on Hide Options link hides the shown options for Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
            expect(analyte).toBe(true);
        });
        pointData.clickHideData().then(function (dataHidden) {
            expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        pointData.isOptionDisplayed().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        pointData.clickHideOption().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        pointData.OptionNotDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
    });

    it('Test Case PDE03: Entered Data contains correct values selected for Reagent Lot & Calibrator Lot for Point Data Entry', function () {
        library.logStep('Test Case PDE03: Entered Data contains correct values selected for Reagent Lot & Calibrator Lot for Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
            expect(analyte).toBe(true);
        });
        pointData.clickHideData().then(function (dataHidden) {
            expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        pointData.enterPointValues(3, 4).then(function (dataEntered) {
            expect(dataEntered).toBe(true);
        });
        // need to write new methods to check the drop down values for reagent and calibrator lot
        pointData.clickSubmitButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
            browser.sleep(3000);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
            expect(analyte).toBe(true);
        });
        pointData.verifyEnteredPointValues(3, 4).then(function (valuesVerified) {
            expect(valuesVerified).toBe(true);
        });
        pointData.clickEnteredValuesRow().then(function (clickedEnteredValuesRow) {
            expect(clickedEnteredValuesRow).toBe(true);
        });
        pointData.isEditDialogDisplayed().then(function (editDialogDisplayed) {
            expect(editDialogDisplayed).toBe(true);
        });
        pointData.getSelectedValuesReagentCalibrator().then(function (values) {
            // tslint:disable-next-line: no-construct
            const str = new String(values);
            const getValues = str.split(',');
            reagent = getValues[0];
            calibrator = getValues[1];
            console.log('1: ' + reagent + ' 2: ' + calibrator);
        });
        // need to write the method for comparing the Reagent & Calibrator values
        pointData.clickEditDialogCancelButton().then(function (editDialogCancelButtonClicked) {
            expect(editDialogCancelButtonClicked).toBe(true);
        });
    });

    it('Test Case PDE04: Forgot to enter a prior run ? link should allow user to enter the past results for Point Data Entry', function () {
        library.logStep('Test Case PDE04: Forgot to enter a prior run ? link should allow user to enter the past results for Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
            expect(analyte).toBe(true);
        });
        pointData.clickHideData().then(function (dataHidden) {
            expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        pointData.clickForgotToEnterPastResultsLink().then(function (pastResultsLinkClicked) {
            expect(pastResultsLinkClicked).toBe(true);
        });
        pointData.clickOpenCalendarButton().then(function (openCalendarButtonClicked) {
            expect(openCalendarButtonClicked).toBe(true);
        });
        pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
            expect(datePickerClicked).toBe(true);
        });
        pointData.selectYear('2018').then(function (yearSelected) {
            expect(yearSelected).toBe(true);
        });
        pointData.selectMonth('JUL').then(function (yearSelected) {
            expect(yearSelected).toBe(true);
        });
        pointData.selectDate('25').then(function (dateSelected) {
            expect(dateSelected).toBe(true);
        });
        pointData.enterPointValues(3, 4).then(function (dataEntered) {
            expect(dataEntered).toBe(true);
        });
        pointData.clickSubmitButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
            browser.sleep(3000);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
            expect(analyte).toBe(true);
        });
        pointData.verifyPastResultInserted('Jul 25', 3, 4).then(function (pastResultValuesVerified) {
            expect(pastResultValuesVerified).toBe(true);
        });
    });

    it('Test Case PDE05: Clicking on Cancel Button should clear all the entered data for Point Data Entry', function () {
        library.logStep('Test Case PDE05: Clicking on Cancel Button should clear all the entered data for Point Data Entry');
        // let newReagent, newCalibrator;
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
            expect(analyte).toBe(true);
        });
        pointData.clickHideData().then(function (dataHidden) {
            expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        pointData.enterPointValues(3, 4).then(function (dataEntered) {
            expect(dataEntered).toBe(true);
        });
        // //Drop Down Values missing need to take a look once the Values are available
        // /*
        // pointData.clickReagentLotDropDown().then(function (reagentLotDropDownArrowClicked) {
        //     expect(reagentLotDropDownArrowClicked).toBe(true);
        //     browser.sleep(2000);
        // });
        // pointData.selectReagentFromReagentLotDropDown(newReagent).then(function (reagentValueSelected) {
        //     expect(reagentValueSelected).toBe(true);
        //     browser.sleep(2000);
        // });
        // pointData.clickCalibratorLotDropDown().then(function (calibratorLotDropDownArrowClicked) {
        //     expect(calibratorLotDropDownArrowClicked).toBe(true);
        //     browser.sleep(2000);
        // });
        // pointData.selectCalibratorFromCalibratorLotDropDown(newCalibrator).then(function (calibratorValueSelected) {
        //     expect(calibratorValueSelected).toBe(true);
        //     browser.sleep(2000);
        // });
        //
        pointData.clickCancelButton().then(function (cancelButtonClicked) {
            expect(cancelButtonClicked).toBe(true);
            browser.sleep(2000);
        });
        pointData.OptionNotDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
        pointData.verifyValuesCleared().then(function (valuesCleared) {
            expect(valuesCleared).toBe(true);
        });
    });

    it('Test Case PDE06: No dropdown should be displayed if there is only one value for Reagent or Calibrator Lot for Point Data', () => {
        library.logStep('Test Case PDE06: No dropdown should be displayed if there is only one value for Reagent Lot or Calibrator Lot for Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (analyte) {
            expect(analyte).toBe(true);
        });
        pointData.clickHideData().then(function (dataHidden) {
            expect(dataHidden).toBe(true);
        });
        pointData.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        pointData.verifyReagentLotDropdownUnavailable().then(function (reagentLotDropdownUnavailable) {
            expect(reagentLotDropdownUnavailable).toBe(true);
        });
        pointData.verifyCalibratorLotDropdownUnavailable().then(function (calibratorLotDropdownUnavailable) {
            expect(calibratorLotDropdownUnavailable).toBe(true);
        });
    });

    // The Show options link is visible by default. Hence this TC is obsolete now.
    // it('Show options link is not visible by default for Point Data Entry', function () {
    //     library.logStep('Show options link is not visible by default for Point Data Entry');
    //     var analyte = jsonData.Analyte; //Creatinine
    //     dataTable.goToDataTablePage().then(function (dataTableClicked) {
    //         expect(dataTableClicked).toBe(true);
    //     });
    //     dataTable.clickHamburgerIcon().then(function (hamburgerClicked) {
    //         expect(hamburgerClicked).toBe(true);
    //     });
    //     dataTable.expandTree().then(function (treeExpanded) {
    //         expect(treeExpanded).toBe(true);
    //         dashboard.waitForElement();
    //     });
    //     dataTable.goToInstrument_ProductName(analyte).then(function (testClicked) {
    //         expect(testClicked).toBe(true);
    //     });
    //     pointData.clickManuallyEnterData().then(function (linkClicked) {
    //         expect(linkClicked).toBe(true);
    //         browser.sleep(3000);
    //     })
    //     multiSummary.isShowOptionVisible().then(function (showOptionsVisible) {
    //         expect(showOptionsVisible).toBe(false);
    //     });
    // });

    // The Show options link is visible by default. Hence this TC is obsolete now.
    // it('Show options link should be visible after hovering mouse on entry form for Point Data Entry', function () {
    //     library.logStep('Show options link should be visible after hovering mouse on entry form for Point Data Entry');
    //     var analyte = jsonData.Analyte;
    //     dataTable.goToDataTablePage().then(function (dataTableClicked) {
    //         expect(dataTableClicked).toBe(true);
    //     });
    //     dataTable.clickHamburgerIcon().then(function (hamburgerClicked) {
    //         expect(hamburgerClicked).toBe(true);
    //     });
    //     dataTable.expandTree().then(function (treeExpanded) {
    //         expect(treeExpanded).toBe(true);
    //         dashboard.waitForElement();
    //     });
    //     dataTable.goToInstrument_ProductName(analyte).then(function (testClicked) {
    //         expect(testClicked).toBe(true);
    //     });
    //     pointData.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
    //         expect(manuallyEnterDataClicked).toBe(true);
    //     });
    //     pointData.hoverOverTest().then(function (hover) {
    //         expect(hover).toBe(true);
    //     });
    //     multiSummary.isShowOptionVisible().then(function (Visible) {
    //         expect(Visible).toBe(true);
    //     });
    // });

    // Multi Point
    it('Show options link is not visible by default for Multi Point Data Entry', function () {
        library.logStep('Show options link is not visible by default for Multi Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (linkClicked) {
            expect(linkClicked).toBe(true);
            browser.sleep(3000);
        });
        multiSummary.isShowOptionVisible().then(function (showOptionsVisible) {
            expect(showOptionsVisible).toBe(false);
        });
    });

    it('Show options link should be visible after hovering mouse on entry form for Multi Point Data Entry', function () {
        library.logStep('Show options link should be visible after hovering mouse on entry form for Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiPoint.hoverOverTest(jsonData.PointAnalyte).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(true);
        });
    });

    it('Options should be displayed after clicking on Show Options link for Multi Point Data Entry', function () {
        library.logStep('Options should be displayed after clicking on Show Options link for Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiPoint.hoverOverTest(jsonData.PointAnalyte).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.isOptionDisplayed().then(function (displayed) {
            expect(displayed).toBe(true);
        });
    });

    it('Clicking on Hide Options link hides the shown options for Multi Point Data Entry', function () {
        library.logStep('Clicking on Hide Options link hides the shown options for Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiPoint.hoverOverTest(jsonData.PointAnalyte).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.isOptionDisplayed().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        multiSummary.clickHideOption().then(function (displayed) {
            expect(displayed).toBe(true);
        });
        multiSummary.OptionNotDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
    });

    it('Entered Data contains correct values selected for Reagent Lot & Calibrator Lot for Multi Point', function () {
        library.logStep('Entered Data contains correct values selected for Reagent Lot & Calibrator Lot for Point');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiPoint.hoverOverTest(jsonData.PointAnalyte).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        const dataMap = new Map<string, string>();
        dataMap.set('11', '2');
        dataMap.set('14', '4');
        multiPoint.enterValues(dataMap).then(function (dataEntered) {
            expect(dataEntered).toBe(true);
        });
        // need to write new methods to check the drop down values for reagent and calibrator lot
        pointData.clickSubmitButton().then(function (submitClicked) {
            expect(submitClicked).toBe(true);
            browser.sleep(3000);
        });
        newLabSetup.navigateTO(jsonData.PointAnalyte).then(function (prod) {
            expect(prod).toBe(true);
        });
        pointData.verifyEnteredPointValues(2, 4).then(function (valuesVerified) {
            expect(valuesVerified).toBe(true);
        });
        pointData.clickEnteredValuesRow().then(function (clickedEnteredValuesRow) {
            expect(clickedEnteredValuesRow).toBe(true);
        });
        pointData.isEditDialogDisplayed().then(function (editDialogDisplayed) {
            expect(editDialogDisplayed).toBe(true);
        });
        pointData.getSelectedValuesReagentCalibrator().then(function (values) {
            // tslint:disable-next-line: no-construct
            const str = new String(values);
            const getValues = str.split(',');
            reagent = getValues[0];
            calibrator = getValues[1];
            console.log('1: ' + reagent + ' 2: ' + calibrator);
        });
        // need to write the method for comparing the Reagent & Calibrator values
        pointData.clickEditDialogCancelButton().then(function (editDialogCancelButtonClicked) {
            expect(editDialogCancelButtonClicked).toBe(true);
        });
    });

    it('Add Comment text box should allow user to enter a comment for Multi Point Data Entry', function () {
        library.logStep('Add Comment text box should allow user to enter a comment for Multi Point Data Entry');
        const comment = 'comment';
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiPoint.hoverOverTest(jsonData.PointAnalyte).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        const dataMap = new Map<string, string>();
        dataMap.set('11', '2');
        dataMap.set('14', '4');
        multiPoint.enterValues(dataMap).then(function (dataEntered) {
            expect(dataEntered).toBe(true);
        });
        multiPoint.addComment(comment).then(function (commentAdded) {
            expect(commentAdded).toBe(true);
        });
        multiSummary.clickSubmitButton().then(function (submit) {
            expect(submit).toBe(true);
        });
        multiSummary.verifyCommentAndCount('1', comment, '1', true).then(function (verifiedCommentAndCount) {
            expect(verifiedCommentAndCount).toBe(true);
        });
    });

    it('Clicking on Cancel Button should clear all the entered data for Multi Point Data Entry', function () {
        library.logStep('Clicking on Cancel Button should clear all the entered data for Multi Point Data Entry');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiPoint.hoverOverTest(jsonData.PointAnalyte).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        const dataMap = new Map<string, string>();
        dataMap.set('11', '2');
        dataMap.set('14', '4');
        multiPoint.enterValues(dataMap).then(function (dataEntered) {
            expect(dataEntered).toBe(true);
        });
        // //Drop Down Values missing need to take a look once the Values are available
        // /*
        // pointData.clickReagentLotDropDown().then(function (reagentLotDropDownArrowClicked) {
        //     expect(reagentLotDropDownArrowClicked).toBe(true);
        //     browser.sleep(2000);
        // });
        // pointData.selectReagentFromReagentLotDropDown(newReagent).then(function (reagentValueSelected) {
        //     expect(reagentValueSelected).toBe(true);
        //     browser.sleep(2000);
        // });
        // pointData.clickCalibratorLotDropDown().then(function (calibratorLotDropDownArrowClicked) {
        //     expect(calibratorLotDropDownArrowClicked).toBe(true);
        //     browser.sleep(2000);
        // });
        // pointData.selectCalibratorFromCalibratorLotDropDown(newCalibrator).then(function (calibratorValueSelected) {
        //     expect(calibratorValueSelected).toBe(true);
        //     browser.sleep(2000);
        // });
        //
        pointData.clickCancelButton().then(function (cancelButtonClicked) {
            expect(cancelButtonClicked).toBe(true);
            browser.sleep(2000);
        });
        multiSummary.OptionNotDisplayed().then(function (displayed) {
            expect(displayed).toBe(false);
        });
        multiSummary.verifySubmitButtonDisabled().then(function (submitDisabled) {
            expect(submitDisabled).toBe(true);
        });
    });

    it('No dropdown should be displayed if there is only one value for Reagent Lot or Calibrator Lot for Multi Point', function () {
        library.logStep('No dropdown should be displayed if there is only one value for Reagent or Calibrator Lot for Multi Point');
        newLabSetup.navigateTO(jsonData.PointDepartment).then(function (dept) {
            expect(dept).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointInstrument).then(function (inst) {
            expect(inst).toBe(true);
        });
        newLabSetup.navigateTO(jsonData.PointControl).then(function (prod) {
            expect(prod).toBe(true);
        });
        multiPoint.clickManuallyEnterData().then(function (manuallyEnterDataClicked) {
            expect(manuallyEnterDataClicked).toBe(true);
        });
        multiPoint.hoverOverTest(jsonData.PointAnalyte).then(function (hover) {
            expect(hover).toBe(true);
        });
        multiSummary.isShowOptionVisible().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        multiSummary.clickShowOptionnew().then(function (Visible) {
            expect(Visible).toBe(true);
        });
        pointData.verifyReagentLotDropdownUnavailable().then(function (reagentLotDropdownUnavailable) {
            expect(reagentLotDropdownUnavailable).toBe(true);
        });
        pointData.verifyCalibratorLotDropdownUnavailable().then(function (calibratorLotDropdownUnavailable) {
            expect(calibratorLotDropdownUnavailable).toBe(true);
        });
    });
});
