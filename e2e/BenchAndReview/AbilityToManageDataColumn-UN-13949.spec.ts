/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { BenchAndReview } from '../page-objects/BenchAndReview-e2e.po';

const fs = require('fs');
const library = new BrowserLibrary();
let jsonData;

library.parseJson('./JSON_data/AbilityToManageDataColumn-UN-13949.json').then(function (data) {
    jsonData = data;
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Ability To Manage Data Column', function () {
    browser.waitForAngularEnabled(false);
    const loginEvent = new LoginEvent();
    const out = new LogOut();
    const benchAndSupervisorReview = new BenchAndReview();

    beforeEach(async function () {
        await loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName);
    });

    afterEach(function () {
        out.signOut();
    });

    it('Test case 1: Verify the gear icon is present on the right side of the column names', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(function (res) {
                return benchAndSupervisorReview.verifyGearIcon();
            });
    });

    it('Test case 2: Verify the names of the columns present by default when Bench Review is opened for the first time', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.verifyDefaultColumnNames(jsonData.DefaultColumnNames);
            });
    });

    it('Test case 3: Verify the names of the columns not present by default when Bench Review is opened for the first time', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then((x) => {
                return benchAndSupervisorReview.verifyNonDefaultColumnNames(jsonData.NonDefaultColumnNames)
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it('Test case 4: Verify the Data Column Window opens on Clickin the gear icon', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyDataColumnWindow();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it('Test case 5: Verify the UI Components of Data Column Window', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyDataColumnWindowUIComponents();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it('Test case 6: Verify the checkboxes present in the Data Column window', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyCheckBoxes(jsonData.AllCheckBoxes);
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it('Test case 7: Verify the checkboxes checked by default in the Data Columns window when opened for the first time', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyDefaultSelectedCheckBoxes(jsonData.DefaultSelectedCheckBoxes);
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it('Test case 8: Verify the checkboxes not checked by default in the Data Columns window when opened for the first time', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyDefaultNonSelectedCheckBoxes(jsonData.DefaultNonSelectedCheckBoxes);
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it('Test case 9: Verify all the checkboxes are enabled for check or uncheck', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyCheckBoxesAreEnabled(jsonData.AllCheckBoxes);
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it('Test case 10: Verify the columns gets added when they are checked in Data Column Window ' +
        'Test case 11: Verify the columns gets removed when the are unchecked in the Data Column window', function () {
            benchAndSupervisorReview.openBenchReviewPage()
                .then(() => {
                    return benchAndSupervisorReview.openDataColumnWindow();
                })
                .then(() => {
                    return benchAndSupervisorReview.verifyColumnCheckBoxAddedRemoved();
                })
                .then((x) => {
                    expect(x).toBe(true);
                });
        });

    it('Test case 12: Verify the gear icon is present on the right side of the column names', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyCloseButtonFunctionality();
            })
            .then((x) => {
                expect(x).toBe(false);
            });
    });

    it('Test case 13: Verify the warning pop up appears on clicking the "X" button', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyXButtonFunctionality();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

    it('Test case 14: Verify the Update Button is Disabled unless no change is made in the checkboxes', function () {
        benchAndSupervisorReview.openBenchReviewPage()
            .then(() => {
                return benchAndSupervisorReview.openDataColumnWindow();
            })
            .then(() => {
                return benchAndSupervisorReview.verifyUpdateButtonDisableEnable();
            })
            .then((x) => {
                expect(x).toBe(true);
            });
    });

});
