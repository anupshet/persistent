// Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved

import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { ActionableDashboard } from '../page-objects/actionable-dashboard-e2e.po';
import { DuplicateLot } from '../page-objects/duplicate-lot-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { DataTable } from '../page-objects/data-table-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { MultiEntryPoint } from '../page-objects/multi-entry-point.po';
import { ExpiringLicenseComponent } from 'src/app/master/actionable-dashboard/containers/expiring-license/expiring-license.component';

const fs = require('fs');
let jsonData;
//For Dev Execution
// fs.readFile('./JSON_data/data-entry-expiredlot-200529.json', (err, data) => {
//   if (err) { throw err; }
//   const actionableDashboard = JSON.parse(data);
//   jsonData = actionableDashboard;
// });
//For QA Execution
fs.readFile('./JSON_data/data-entry-expiredlot-200529-test.json', (err, data) => {
  if (err) { throw err; }
  const actionableDashboard = JSON.parse(data);
  jsonData = actionableDashboard;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000;
describe('Verify Actionable Dashboard', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const actDashboard = new ActionableDashboard();
  const duplicateLot = new DuplicateLot();
  const labsetup = new NewLabSetup();
  const dataTable = new DataTable();
  const dashboard = new Dashboard();
  const multi = new MultiEntryPoint();

  beforeEach(function () {

    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  //   it('Test Case 1:To Verify expired control lot and start a new lot popup is displayed on instrument level page.', function () {
  //    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });
  //    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });
  //    dataTable.verifyExpControlLotPresent(jsonData.ControlName).then(function (present) {
  //      expect(present).toBe(true);
  //    });
  //    dataTable.verifyStartNewLotButtonPresent(jsonData.ControlName).then(function (present) {
  //      expect(present).toBe(true);
  //    });
  //  });
  //  it('Test Case 2:To Verify expired control lot and start a new lot popup is displayed on control level page.', function () {
  //    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });
  //    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });
  //    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });
  //    dataTable.verifyExpControlLotPresent(jsonData.ControlName).then(function (present) {
  //      expect(present).toBe(true);
  //    });
  //    dataTable.verifyStartNewLotButtonPresent(jsonData.ControlName).then(function (present) {
  //      expect(present).toBe(true);
  //    });
  //  });
  //  it('Test Case 3: Verify data entry options and show options button are not displayed for expired lot control on instrument and control page for a point analyte.', function () {
  //     labsetup.navigateTO(jsonData.Department).then(function (navigated) {
  //       expect(navigated).toBe(true);
  //     });
  //     labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
  //       expect(navigated).toBe(true);
  //     });
  //     dataTable.verifyDataEntryEnabled('Cardiac').then(function (verified) {
  //       expect(verified).toBe(false);
  //     });
  //     dataTable.verifyShowOptionsDisplayed().then(function (displayed) {
  //       expect(displayed).toBe(false);
  //     });
  //     labsetup.navigateTO(jsonData.Control).then(function (navigated) {
  //       expect(navigated).toBe(true);
  //     });
  //     dataTable.verifyDataEntryEnabled('Cardiac').then(function (verified) {
  //       expect(verified).toBe(false);
  //     });
  //     dataTable.verifyShowOptionsDisplayed().then(function (displayed) {
  //       expect(displayed).toBe(false);
  //     });
  //   });
  // it('Test Case 4: Verify data entry options and show options button are not displayed for expired lot control on instrument and control page for a summary analyte.', function () {
  //   labsetup.navigateTO(jsonData.Department).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(jsonData.Instrument2).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   dataTable.verifySummaryDataEntryEnabled('Cardiac').then(function (verified) {
  //     expect(verified).toBe(false);
  //   });
  //   dataTable.verifyShowOptionsDisplayed().then(function (displayed) {
  //     expect(displayed).toBe(false);
  //   });
  //   labsetup.navigateTO(jsonData.Control).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   dataTable.verifySummaryDataEntryEnabled('Cardiac').then(function (verified) {
  //     expect(verified).toBe(false);
  //   });
  //   dataTable.verifyShowOptionsDisplayed().then(function (displayed) {
  //     expect(displayed).toBe(false);
  //   });
  // });
  //  it('Test Case 5: To verify when there are no expiring lots, Expiring Product Lots Card is not displayed to Admin.', function () {
  //   out.signOut();
  //   loginEvent.loginToApplication(jsonData.URL, jsonData.Username2,
  //     jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
  //       expect(loggedIn).toBe(true);
  //     });
  //   actDashboard.verifyExpiringLotCards().then(function (displayed) {
  //     expect(displayed).toBe(false);
  //   });
  //   actDashboard.verifyQcLotViewer().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  // });
  it('Test Case 6: To Verify expired control lot and start a new lot popup is not displayed to lab user.', function () {
    out.signOut();
    loginEvent.loginToApplication(jsonData.URL, jsonData.LabUser,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
      labsetup.navigateTO(jsonData.Department2).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      dataTable.verifyExpControlLotPresent(jsonData.ControlName).then(function (present) {
        expect(present).toBe(false);
      });
      dataTable.verifyStartNewLotButtonPresent(jsonData.ControlName).then(function (present) {
        expect(present).toBe(false);
      });
      labsetup.navigateTO(jsonData.Control).then(function (navigated) {
        expect(navigated).toBe(true);
      });
      dataTable.verifyExpControlLotPresent(jsonData.ControlName).then(function (present) {
        expect(present).toBe(false);
      });
      dataTable.verifyStartNewLotButtonPresent(jsonData.ControlName).then(function (present) {
        expect(present).toBe(false);
      });
  });
  // //done
  // it('Test Case 7: To verify content of start new lot popup', function () {
  //   labsetup.navigateTO(jsonData.Department).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   dataTable.clickStartNewLotButton().then(function (Clicked) {
  //     expect(Clicked).toBe(true);
  //   });
  //   duplicateLot.VerifyStartNewLotPopupUI(jsonData.ControlName).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
  //     expect(LotNumberClicked).toBe(true);
  //   });
  //   duplicateLot.verifyLotDisplayed(jsonData.FutureLot1, jsonData.FutureLot1Expiry).then(function (verified1) {
  //     expect(verified1).toBe(true);
  //   });
  //   duplicateLot.verifyLotDisplayed(jsonData.FutureLot2, jsonData.FutureLot2Expiry).then(function (verified2) {
  //     expect(verified2).toBe(true);
  //   });
  //   duplicateLot.verifyLotDisplayed(jsonData.FutureLot3, jsonData.FutureLot3Expiry).then(function (verified1) {
  //     expect(verified1).toBe(true);
  //   });
  //   duplicateLot.verifyLotDisplayed(jsonData.FutureLot4, jsonData.FutureLot4Expiry).then(function (verified2) {
  //     expect(verified2).toBe(true);
  //   });
  //   duplicateLot.verifyLotDisplayed(jsonData.FutureLot5, jsonData.FutureLot5Expiry).then(function (verified2) {
  //     expect(verified2).toBe(true);
  //   });
  // });
  // //done
  // it('Test Case 8: To verify action of clicking a cancel button on to "Start a new lot of product" pop-up.', function () {
  //   labsetup.navigateTO(jsonData.Department).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   dataTable.clickStartNewLotButton().then(function (Clicked) {
  //     expect(Clicked).toBe(true);
  //   });
  //   duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
  //     expect(LotNumberClicked).toBe(true);
  //   });
  //   duplicateLot.SelectLot(jsonData.FutureLot3).then(function (lotSelected) {
  //     expect(lotSelected).toBe(true);
  //   });
  //   duplicateLot.clickCancelButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   duplicateLot.VerifyStartNewLotPopupUI(jsonData.ControlName).then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  // });
  // //done
  // it('Test Case 9: To verify action of clicking a "X" button on to "Start a new lot of product" pop-up.', function () {
  //   labsetup.navigateTO(jsonData.Department).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   dataTable.clickStartNewLotButton().then(function (Clicked) {
  //     expect(Clicked).toBe(true);
  //   });
  //   duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
  //     expect(LotNumberClicked).toBe(true);
  //   });
  //   duplicateLot.SelectLot(jsonData.FutureLot3).then(function (lotSelected) {
  //     expect(lotSelected).toBe(true);
  //   });
  //   duplicateLot.clickCloseButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   dataTable.verifyExpControlLotPresent(jsonData.ControlName).then(function (present) {
  //     expect(present).toBe(true);
  //   });
  //   dataTable.verifyStartNewLotButtonPresent(jsonData.ControlName).then(function (present) {
  //     expect(present).toBe(true);
  //   });
  // });
  // it('Test Case 10: To verify clicking on "Start New Lot" starts new lot on Instrument Page', function () {
  //   labsetup.navigateTO(jsonData.Department).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   dataTable.clickStartNewLotButton().then(function (Clicked) {
  //     expect(Clicked).toBe(true);
  //   });
  //   duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
  //     expect(LotNumberClicked).toBe(true);
  //   });
  //   duplicateLot.SelectLot(jsonData.FutureLot3).then(function (lotSelected) {
  //     expect(lotSelected).toBe(true);
  //   });
  //   duplicateLot.selectOnThisInstrumentOption().then(function (Selected) {
  //     expect(Selected).toBe(true);
  //   });
  //   duplicateLot.clickStartNewLotButtonOnOverlay().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   actDashboard.verifyControlChanged(jsonData.FutureLot3).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  // });
  // it('Test Case 11: To verify clicking on "Start New Lot" starts new lot on Control Page', function () {
  //   labsetup.navigateTO(jsonData.Department2).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   labsetup.navigateTO(jsonData.Control).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   dataTable.clickStartNewLotButton().then(function (Clicked) {
  //     expect(Clicked).toBe(true);
  //   });
  //   duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
  //     expect(LotNumberClicked).toBe(true);
  //   });
  //   duplicateLot.SelectLot(jsonData.FutureLot2).then(function (lotSelected) {
  //     expect(lotSelected).toBe(true);
  //   });
  //   duplicateLot.selectOnThisInstrumentOption().then(function (Selected) {
  //     expect(Selected).toBe(true);
  //   });
  //   duplicateLot.clickStartNewLotButtonOnOverlay().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   actDashboard.verifyControlChanged(jsonData.FutureLot2).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  // });
  it('Test Case 12: To verify clicking on "Start New Lot" for multiple instrument start s new lot on multiple instruments ', function () {
    labsetup.navigateTO(jsonData.Department2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dataTable.clickStartNewLotButton().then(function (Clicked) {
      expect(Clicked).toBe(true);
    });
    duplicateLot.clickLotNumberDropdown().then(function (LotNumberClicked) {
      expect(LotNumberClicked).toBe(true);
    });
    duplicateLot.SelectLot(jsonData.FutureLot4).then(function (lotSelected) {
      expect(lotSelected).toBe(true);
    });
    duplicateLot.selectOnMultipleInstrumentsOption().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    duplicateLot.clickCheckBxInst(jsonData.OtherInstrument, jsonData.OtherDepartment).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    duplicateLot.clickStartNewLotButtonOnOverlay().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    actDashboard.verifyControlChanged(jsonData.FutureLot4).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dashboard.clickUnityNext().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.navigateTO(jsonData.OtherDepartment).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.OtherInstrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    actDashboard.verifyControlChanged(jsonData.FutureLot4).then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });
  it('Test Case 13: To verify on changing the date before expiry, data entry field and show options is enabled. ', function () {
    labsetup.navigateTO(jsonData.Department2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    multi.changeDate('2021', 'SEP', '24').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    dataTable.verifyDataEntryEnabled('Cardiac').then(function (verified) {
      expect(verified).toBe(true);
    });
    dataTable.verifyShowOptionsDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });
});
