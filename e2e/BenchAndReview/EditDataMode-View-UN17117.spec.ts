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

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/EditDataMode-View-UN17117.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bench Review: Edit Data Mode- View', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();
    const dashBoard = new Dashboard();
    
    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
    });

    it('Test case 1: Verify Edit button is editable to user', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyEditButton();
        }).then((x) => {
            expect(x).toBe(true);
        });
    })

    it('Test case 2: Verify Accept/Reject status is editable', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
         return benchAndSupervisorReview.VerifyIsStautsEditable();
        }).then((x) => {
            expect(x).toBe(true);
        });

    })

    it('Test case 3: Verify Result column and check whether it is editable ', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyIsResultEditable();
        }).then((x) => {
            expect(x).toBe(true);
        });
    })

    it('Test case 4: Verify In edit mode Check whether History, Action, Comment icons are enabled', function () {
        benchAndSupervisorReview.openBenchReviewPage().then(() => {
            return benchAndSupervisorReview.VerifyActionCommentHistory();
           }).then((x) => {
            expect(x).toBe(true);
        });
     })

     it('Test case 5: Verify CANCEL button is cancelling the edit mode', function () {
      benchAndSupervisorReview.openBenchReviewPage().then(() => {
          return benchAndSupervisorReview.VerifyCancelButton();
      }).then((x) => {
          expect(x).toBe(true);
      });
    })
    it('Test case 6: Verify Pagination while user navigates away without clicking on UPDATE, the Analyte will not be in Edit mode ', function () {
      benchAndSupervisorReview.openBenchReviewPage().then(() => {
          return benchAndSupervisorReview.VerifyPaginationArrow();
         }).then((x) => {
          expect(x).toBe(true);
      });
   })
   it('Test case 7: Verify whether the checkboxes of analytes are Disabled ', function () {
    benchAndSupervisorReview.openBenchReviewPage().then(() => {
        return benchAndSupervisorReview.VerifyIsAnalyteCheckboxDisabled();
       }).then((x) => {
        expect(x).toBe(true);
    });
    })
    it('Test case 8: Verify whether the Action text field are Disabled ', function () {
    benchAndSupervisorReview.openBenchReviewPage().then(() => {
        return benchAndSupervisorReview.VerifyIsActionboxDisabled();
       }).then((x) => {
        expect(x).toBe(true);
    });
   })
   it('Test case 9: Verify whether the Comment text field are Disabled ', function () {
    benchAndSupervisorReview.openBenchReviewPage().then(() => {
        return benchAndSupervisorReview.VerifyIsCommentboxDisabled();
       }).then((x) => {
        expect(x).toBe(true);
    });
   })
   it('Test case 10: Verify whether the Reviewed button is Disabled ', function () {
    benchAndSupervisorReview.openBenchReviewPage().then(() => {
        return benchAndSupervisorReview.VerifyReviewedbuttonDisabled();
       }).then((x) => {
        expect(x).toBe(true);
    });
   })
  })