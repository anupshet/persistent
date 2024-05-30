
/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { BenchAndReview } from '../page-objects/BenchAndReview-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { async } from '@angular/core/testing';
import { WestgardRule } from '../page-objects/westgard-rules-e2e.po';

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/B&SReviewIndepndntData-UN-17764.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Supervisor review and Bench review data should be independent', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();
    const westgard = new WestgardRule();
  
    beforeEach(async function () {
        await loginEvent.clickAcceptAndDecline1(jsonData.URL)
        .then((x) => {
         return loginEvent.loginToApplication1(jsonData.URL,jsonData.Username, jsonData.Password, jsonData.FirstName);
        })
      .then((x) => {
       expect(x).toBe(true);
      });
    });

    it('Test case 1:BY Submiting point data into lab,Check that the Bench and Supervisor review page presented with the runs(point data entry)to be review independently.', function () {
        dashBoard.clickUnityNext().then(() => {
            return dashBoard.SelectDeptToAnalyte(jsonData.Department, jsonData.Instrument,jsonData.Control,jsonData.Analyte);
        }).then((a) => {
            return westgard.clickManuallyEnterData();
        }).then(() => {
            return westgard.enterPointValues(jsonData.AcceptedLevel1Pvalue, jsonData.AcceptedLevel2Pvalue);
        }).then(() => {
            return westgard.SubmitPointDataValues();
        }).then(() => {
            return dashBoard.clickUnityNext();
        }).then(() => {
            return benchAndSupervisorReview.openBenchReviewPage()
        .then(() => {
            return benchAndSupervisorReview.VerifyPointDataIsDisplayedOnBenchSupervisorReviewPage(jsonData.Analyte, jsonData.AcceptedLevel1Pvalue,jsonData.date,jsonData.Time);
        }).then((x) => {
            expect(x).toBe(true);
        });
     })
    })


     it('Test case 2:Check whether data sets(all/selected runs) are reviewed in Bench review or Supervisor review page independently, get cleared from supervisor page only' , function () {
        benchAndSupervisorReview.openBenchReviewPage()
        .then((x) => {
        return benchAndSupervisorReview.verifyRunsReviewedIndependentlyOnBSReviewPAge();
        })
        .then((x) => {
         expect(x).toBe(true);
        });
     })
     
      it('Test case 3:Once the supervisor review is perform ,Check whether the same runs still present on bench review page.', function () {
       benchAndSupervisorReview.openBenchReviewPage()
      .then((x) => {
            return benchAndSupervisorReview.verifyReviewedRunsPresentAnotherPage(jsonData.Analyte, jsonData.AcceptedLevel1Pvalue,jsonData.date,jsonData.Time);
       })
        .then((x) => {
           expect(x).toBe(true);
        });
     })
     
   

    })
