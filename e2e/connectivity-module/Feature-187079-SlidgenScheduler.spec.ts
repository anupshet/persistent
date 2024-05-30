/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { Connectivity } from '../page-objects/connectivity-mapping-e2e.po';
import { SlidgenSchedulerE2E } from '../page-objects/slideGenScheduler-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';


const fs = require('fs');


let jsonData;
fs.readFile('./JSON_data/Feature-187079-SlidgenScheduler.json', (err, data) => {
  if (err) { throw err; }
  const newLabSetup = JSON.parse(data);
  jsonData = newLabSetup;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: PBI 194356 - Slide Gen Scheduler UI Update Slide Gen', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  let flagForIEBrowser: boolean;
  const connectivity = new Connectivity();
  const slideGenScheduler = new SlidgenSchedulerE2E();
  const library = new BrowserLibrary();
  var globalVariable;

  beforeAll(function () {
    globalVariable = browser.params.user.globalVariable;
    console.log("Before all globalVariable +++++>> ",globalVariable)
    browser.getCapabilities().then(function (c) {

      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
    });
  });
  beforeEach(function () {
    /* loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    }); */
  });

  afterEach(function () {
    //out.signOut();
  });


  xit('Test Case 1 : Verify analytes in the Need review are dispalyed ', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    /* library.browseFileToUpload("UFFT.csv").then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.selectRadioBtnYes().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.clickOnTBDBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.navigateToCategory('Need review').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    slideGenScheduler.verifyAnalytesDisplayed().then(function (dispalyed) {
      expect(dispalyed).toBe(true);
    }); */
  });

  it('Test Case 2 : Verify cancel button functionality on updating the analyte for the Need review tab', function () {
    if (globalVariable === true) {
      console.log("++++++++++++++> Inside Test case 2 IF loop ++++>")
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      library.browseFileToUpload("UFFT.csv").then(function (verified) {
        expect(verified).toBe(true);
      });
      slideGenScheduler.selectRadioBtnYes().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.clickOnTBDBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.navigateToCategory('Need review').then(function (navigated) {
        expect(navigated).toBe(true);
      });
      slideGenScheduler.clickOnUpdateBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.clickOnCancelBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.clickOnAddSlidegen().then(function (displayed) {
        expect(displayed).toBe(false);
      });
    }else{
      console.log("++++++++++++++> SKIPPED ++++>")
    }
  });

  xit('Test Case 4 : Verify cancel button functionality on editing the analyte for the updated tab', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    library.browseFileToUpload("UFFT.csv").then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.selectRadioBtnYes().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.clickOnTBDBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.navigateToCategory('Need review').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    slideGenScheduler.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.selectSlidgenFrmList('1', 'Unspecified ***').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.setStartDate('2022', 'MAR', '1', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setStartTime('0626PM').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setEndDate('2022', 'MAR', '2', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setEndTime('0626PM').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.clickOnConfirmBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.navigateToCategory('Updated').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    slideGenScheduler.clickOnEditBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.clickOnCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.clickOnAddSlidegen().then(function (displayed) {
      expect(displayed).toBe(false);
    });
    connectivity.closeMapping().then(function (windowclosed) {
      expect(windowclosed).toBe(true);
    });
  });
  xit('Test Case 5 : Verify edit button functionality on updated category', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    library.browseFileToUpload("UFFT.csv").then(function (verified) {
      expect(verified).toBe(true);
    });
    slideGenScheduler.selectRadioBtnYes().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.clickOnTBDBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.navigateToCategory('Need review').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    slideGenScheduler.clickOnUpdateBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.selectSlidgenFrmList('1', 'Unspecified ***').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.setStartDate('2022', 'MAR', '1', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setStartTime('0626PM').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setEndDate('2022', 'MAR', '2', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setEndTime('0626PM').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.clickOnConfirmBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.navigateToCategory('Updated').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    slideGenScheduler.clickOnEditBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.selectSlidgenFrmList('1', 'Unspecified ***').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.setStartDate('2022', 'MAR', '2', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setStartTime('0626PM').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setEndDate('2022', 'MAR', '3', '1').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setEndTime('0626PM').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.clickOnConfirmBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    connectivity.closeMapping().then(function (windowclosed) {
      expect(windowclosed).toBe(true);
    });
  });
  /* it('Test Case 5 : Verify functionality of add new slidgen scheduler in existing analyte on Updated tab', function () {
    connectivity.gotoConnectivityPage().then(function (conn) {
      expect(conn).toBe(true);
    });
    slideGenScheduler.navigateToCategory('Updated').then(function (navigated) {
      expect(navigated).toBe(true);
    });
    slideGenScheduler.clickOnEditBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.clickOnAddSlidegen().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.selectSlidgenFrmList('2', 'Slide Gen #29').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    slideGenScheduler.setStartDate('', '', '', '2').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setStartTime('').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setEndDate('', '', '', '2').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.setEndTime('').then(function (selected) {
      expect(selected).toBe(true);
    });
    slideGenScheduler.clickOnConfirmBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
}); */


  xdescribe('Test Suite: PBI 194357 - Slide Gen Scheduler UI: Update and Accepted Categories Display', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    let flagForIEBrowser: boolean;
    const connectivity = new Connectivity();
    const slideGenScheduler = new SlidgenSchedulerE2E();
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

    //----------------------------------- Accepted category ------------------------------------------------

    xit('Test Case 6 : Verify Accepted category UI', function () {
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      library.browseFileToUpload("UFFT.csv").then(function (verified) {
        expect(verified).toBe(true);
      });
      slideGenScheduler.selectRadioBtnYes().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.clickOnTBDBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.clickOnAcceptBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.navigateToCategory('Accepted').then(function (navigated) {
        expect(navigated).toBe(true);
      });
      slideGenScheduler.verifyAcceptedUI('Cortisol').then(function (dispalyed) {
        expect(dispalyed).toBe(true);
      });
    });
    /**
    * Pegination is pending
    * */
    xit('Test Case 7 : Verify analytes in the accepted and accepted tabs are dispalyed ', function () {
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      slideGenScheduler.navigateToCategory('Accepted').then(function (navigated) {
        expect(navigated).toBe(true);
      });
      slideGenScheduler.verifyAnalytesDisplayed().then(function (dispalyed) {
        expect(dispalyed).toBe(true);
      });
    });

    xit('Test Case 8 : Verify Accepted category UI', function () {
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      slideGenScheduler.navigateToCategory('Accepted').then(function (navigated) {
        expect(navigated).toBe(true);
      });
      slideGenScheduler.verifyAcceptedUI('Ammonia').then(function (dispalyed) {
        expect(dispalyed).toBe(true);
      });
    });


    xit('Test Case 4 : Verify cancel button functionality on editing the analyte', function () {
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      slideGenScheduler.navigateToCategory('Accepted').then(function (navigated) {
        expect(navigated).toBe(true);
      });
      slideGenScheduler.clickOnEditBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.clickOnCancelBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.clickOnAddSlidegen().then(function (displayed) {
        expect(displayed).toBe(false);
      });
    });

    xit('Test Case 5 : Verify edit button functionality on accepted category', function () {
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      slideGenScheduler.navigateToCategory('Accepted').then(function (navigated) {
        expect(navigated).toBe(true);
      });
      slideGenScheduler.clickOnEditBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.selectSlidgenFrmList('1', 'Slide Gen #18').then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.setStartDate('', '', '', '1').then(function (selected) {
        expect(selected).toBe(true);
      });
      slideGenScheduler.setStartTime('').then(function (selected) {
        expect(selected).toBe(true);
      });
      slideGenScheduler.setEndDate('', '', '', '1').then(function (selected) {
        expect(selected).toBe(true);
      });
      slideGenScheduler.setEndTime('').then(function (selected) {
        expect(selected).toBe(true);
      });
      slideGenScheduler.clickOnConfirmBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });

    xit('Test Case 5 : Verify functionality of add new slidgen scheduler in existing analyte', function () {
      connectivity.gotoConnectivityPage().then(function (conn) {
        expect(conn).toBe(true);
      });
      slideGenScheduler.navigateToCategory('Accepted').then(function (navigated) {
        expect(navigated).toBe(true);
      });
      slideGenScheduler.clickOnEditBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.clickOnAddSlidegen().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.selectSlidgenFrmList('2', 'Slide Gen #19').then(function (clicked) {
        expect(clicked).toBe(true);
      });
      slideGenScheduler.setStartDate('', '', '', '2').then(function (selected) {
        expect(selected).toBe(true);
      });
      slideGenScheduler.setStartTime('').then(function (selected) {
        expect(selected).toBe(true);
      });
      slideGenScheduler.setEndDate('', '', '', '2').then(function (selected) {
        expect(selected).toBe(true);
      });
      slideGenScheduler.setEndTime('').then(function (selected) {
        expect(selected).toBe(true);
      });
      slideGenScheduler.clickOnConfirmBtn().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });
  });
});

