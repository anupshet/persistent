/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { SingleSummary } from '../page-objects/single-summary.po';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Single-Summary.json').then(function(data) {
  jsonData = data;
});


describe('Single Summary Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const multiSummary = new MultiSummary();
  const singleSummary = new SingleSummary();
  const newLabSetup = new NewLabSetup();
  const library = new BrowserLibrary();
  const pointData = new PointDataEntry();

  beforeEach(function () {
    log4jsconfig.log().info('User logged in successfully');
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    log4jsconfig.log().info('User logged out successfully');
    out.signOut();
  });

  it('Test case 130115: Selecting Analyte (Test) displays Single Summary', function () {
    library.logStep('Test case 130115: Selecting Analyte (Test) displays Single Summary');
    library.logStep('Test case 130117: Single Summary Page will show Analyte Entry component with Submit and Cancel buttons');
    library.logStep('Test case 130122: Summary Statistics Chart will show on Single Summary Page');
    library.logStep('Test case 130332: Date field should display, Selected record date');
    library.logStep('Test case 130124: Date Picker within Analyte Entry will allow to pick month and day.It should prevent future month selection');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.singleSummaryPage().then(function (manually) {
      expect(manually).toBe(true);
    });
    singleSummary.verifyEmptySummaryStatisticTable().then(function (statistics) {
      expect(statistics).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    singleSummary.VerifyCancelBtn().then(function (cancle) {
      expect(cancle).toBe(true);
    });
    singleSummary.clickonDatePickerLink().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    singleSummary.verifyLastdayoftheLastmonth().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    singleSummary.checkFutureDayDisabled().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    singleSummary.setFutureDate().then(function (futureDate) {
      expect(futureDate).toBe(true);
    });
    singleSummary.clickonPoint().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 130121: Delete button will be provided to allow for deletion of saved months summary', function () {
    library.logStep('Test case 130121: Delete button will be provided to allow for deletion of saved months summary');
    library.logStep('Test case 130314: Tool Tips: Submit data: Your results will be submitted to your peers');
    library.logStep('Test case 130311: Tool Tips: Hyperlinked date on row: View and edit data');
    library.logStep('Test case 130312: Tool Tips: Hyperlinked Trash Icon: Delete this data set');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('11', '2.46');
    dataMap.set('12', '0.06');
    dataMap.set('13', '10');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    singleSummary.VerifySubmitButtonToolTip().then(function (msgVerified) {
      expect(msgVerified).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTest(2.46, 0.06, 10).then(function (stored) {
      expect(stored).toBe(true);
    });
    singleSummary.HoverEditMsgVerified().then(function (msgVerified) {
      expect(msgVerified).toBe(true);
    });
    singleSummary.ClickOnEditDialogueButtonOnTestLevel().then(function (editDialogClicked) {
      expect(editDialogClicked).toBe(true);
    });
    singleSummary.deleteButtonTooltipVerified().then(function (tooltipVerified) {
      expect(tooltipVerified).toBe(true);
    });
    pointData.clickEditDialogDeleteButton().then(function (editDialogDeleteButtonClicked) {
      expect(editDialogDeleteButtonClicked).toBe(true);
    });
    pointData.verifyConfirmDeletePopup().then(function (verifyConfirmDeletePopup) {
      expect(verifyConfirmDeletePopup).toBe(true);
    });
    pointData.clickConfirmDeleteButton().then(function (confirmDeleteButtonClicked) {
      expect(confirmDeleteButtonClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    singleSummary.verifyDataExists('2.46').then(function (dataExists) {
      expect(dataExists).toBe(false);
    });
  });

  it('Test case 130116: Single Summary Page shows Multiple Views Summary by Month', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dashBoard.waitForElement();
    dataMap.set('11', '3.9');
    dataMap.set('12', '1.8');
    dataMap.set('13', '5');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTest(3.9, 1.8, 5).then(function (stored) {
      expect(stored).toBe(true);
    });
    // singleSummary.clickManuallyEnterData().then(function (manually) {
    //   expect(manually).toBe(true);
    // });
    const dataMap1 = new Map<string, string>();
    dashBoard.waitForElement();
    dataMap1.set('11', '2.46');
    dataMap1.set('12', '0.06');
    dataMap1.set('13', '10');
    multiSummary.enterMeanSDPointValues(dataMap1).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTest(2.46, 0.06, 10).then(function (stored) {
      expect(stored).toBe(true);
    });
    const months = ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const thisMonth = months[now.getMonth()];
    singleSummary.verifyEnteredValueByMonth(thisMonth).then(function (stored) {
      expect(stored).toBe(true);
    });
  });

  it('Test case 130118: On Click of Analyte Summary View Edit Dialog will Open', function () {
    library.logStep('Test case 130118: On Click of Analyte Summary View Edit Dialog will Open');
    library.logStep('Test case 130318: Clicking on the Cancel hyperlink in the pop up confirmation box, after clicking on the trash icon will close the pop up confirmation');
    library.logStep('Test case 130322: Clicking on CANCEL Button should close the Edit pop up box.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    // multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
    //   expect(applyClicked).toBe(true);
    // });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dashBoard.waitForElement();
    dataMap.set('11', '2');
    dataMap.set('12', '3');
    dataMap.set('13', '4');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTest(2.00, 3.00, 4).then(function (stored) {
      expect(stored).toBe(true);
    });
    singleSummary.ClickOnEditDialogueButtonOnTestLevel().then(function (cancle) {
      expect(cancle).toBe(true);
    });
    singleSummary.ClickonTrashIcon().then(function (trash) {
      expect(trash).toBe(true);
    });
    singleSummary.ConfirmDeleteIsEnabledVerified().then(function (test) {
      expect(test).toBe(true);
    });
    singleSummary.ClickOnCancleBUttonOnTrashPopup().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    singleSummary.clickEditDialogCancelButton().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 130423: Cannot add comment unless valid mean, SD and points are entered for a level', function () {
    library.logStep('Test case 130423: Cannot add comment unless valid mean, SD and points are entered for a level');
    library.logStep('Test case 130333: Add Comment – should view a input field to add a comment.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    // multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
    //   expect(applyClicked).toBe(true);
    // });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    singleSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
      expect(hover).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dashBoard.waitForElement();
    dataMap.set('11', '2.46');
    dataMap.set('12', '0.06');
    dataMap.set('13', '5');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    singleSummary.hoverTestClick(jsonData.Test11).then(function (hover) {
      expect(hover).toBe(true);
    });
    singleSummary.addComment('', jsonData.CommentValue).then(function (addcomment) {
      expect(addcomment).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    singleSummary.verifyEnteredComment(jsonData.CommentValue).then(function (text) {
      expect(text).toBe(true);
    });
  });

  it('Test case 130330: Updating MEAN, SD and POINTS and clicking on SUBMIT DATA button should close the edit pop up box.', function () {
    library.logStep('Test case 130330: Updating MEAN, SD and POINTS and clicking on SUBMIT DATA button should close the edit pop up box.');
    library.logStep('Test case 130331: View should be updated by latest updated data.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    // multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
    //   expect(applyClicked).toBe(true);
    // });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dashBoard.waitForElement();
    dataMap.set('11', '2');
    dataMap.set('12', '3');
    dataMap.set('13', '4');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);

    });
    singleSummary.verifyEnteredValueStoredTest(2.00, 3.00, 4).then(function (stored) {
      expect(stored).toBe(true);
    });
    singleSummary.clickTestToEdit('1').then(function (click) {
      expect(click).toBe(true);
    });
    singleSummary.editDialogDisplay().then(function (edit) {
      expect(edit).toBe(true);
    });
    const dataMap1 = new Map<string, string>();
    dashBoard.waitForElement();
    dataMap1.set('21', '1');
    dataMap1.set('22', '0.2');
    dataMap1.set('23', '3');
    multiSummary.enterMeanSDPointValues(dataMap1).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    singleSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTest(1.00, 0.20, 3).then(function (stored) {
      expect(stored).toBe(true);
    });
  });

  it('Test case 130364: Able to add a comment in the view edit dialogue.', function () {
  library.logStep('Test case 25: Lab User is able to add data using Summary Data Entry Page');
  library.logStep('Test case 130364: Able to add a comment in the view edit dialogue.');
  library.logStep('Test case 130334: All Levels should display corresponding MEAN, SD and POINTS values.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    // multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
    //   expect(applyClicked).toBe(true);
    // });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dashBoard.waitForElement();
    dataMap.set('11', '2');
    dataMap.set('12', '0.5');
    dataMap.set('13', '20');
    dataMap.set('14', '4');
    dataMap.set('15', '0.5');
    dataMap.set('16', '20');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTest(2.00, 0.50, 20).then(function (stored) {
      expect(stored).toBe(true);
    });
    singleSummary.verifyEnteredValueStoredTestLevel2(4.00, 0.50, 20).then(function (stored) {
      expect(stored).toBe(true);
    });
    singleSummary.ClickOnEditDialogueButtonOnTestLevel().then(function (cancle) {
      expect(cancle).toBe(true);
    });
    singleSummary.hoverTestClick(jsonData.Test14).then(function (hover) {
      expect(hover).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    pointData.addCommentOnEditDialog(jsonData.CommentValue).then(function (commentAdded) {
      expect(commentAdded).toBe(true);
    });
    singleSummary.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
      expect(submitUpdatesClicked).toBe(true);
    });
    singleSummary.verifyEnteredComment(jsonData.CommentValue).then(function (text) {
      expect(text).toBe(true);
    });
  });

// Covered in above TC
  // it('Test case 130334: All Levels should display corresponding MEAN, SD and POINTS values.', function () {
  //   newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
  //     expect(applyClicked).toBe(true);
  //   });
  //   singleSummary.clickManuallyEnterData().then(function (manually) {
  //     expect(manually).toBe(true);
  //   });
  //   const dataMap = new Map<string, string>();
  //   dashBoard.waitForElement();
  //   dataMap.set('11', '2');
  //   dataMap.set('12', '0.5');
  //   dataMap.set('13', '20');
  //   dataMap.set('14', '4');
  //   dataMap.set('15', '0.5');
  //   dataMap.set('16', '20');
  //   multiSummary.enterMeanSDPointValues(dataMap).then(function (entered) {
  //     expect(entered).toBe(true);
  //   });
  //   multiSummary.clickSubmitButton().then(function (disabled) {
  //     expect(disabled).toBe(true);
  //   });
  //   singleSummary.verifyEnteredValueStoredTest(2.00, 0.50, 20).then(function (stored) {
  //     expect(stored).toBe(true);
  //   });
  //   singleSummary.verifyEnteredValueStoredTestLevel2(4.00, 0.50, 20).then(function (stored) {
  //     expect(stored).toBe(true);
  //   });
  // });

  // it('Test case 25: Lab User is able to add data using Summary Data Entry Page', function () {
  //   library.logStep('Test case 25: Lab User is able to add data using Summary Data Entry Page');
  //   newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   singleSummary.clickManuallyEnterData().then(function (manually) {
  //     expect(manually).toBe(true);
  //   });
  //   const dataMap = new Map<string, string>();
  //   dashBoard.waitForElement();
  //   dataMap.set('11', '2');
  //   dataMap.set('12', '0.5');
  //   dataMap.set('13', '4');
  //   multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
  //     expect(disabled).toBe(true);
  //   });
  //   multiSummary.clickSubmitButton().then(function (disabled) {
  //     expect(disabled).toBe(true);
  //   });
  //   singleSummary.verifyEnteredValueStoredTest(2.00, 0.50, 4).then(function (stored) {
  //     expect(stored).toBe(true);
  //   });
  // });

  //   These TCs will fail due to UI changes
  //   it('Test case 130313: Tool Tips: Add comment: Open comment field', function () {
  //      newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //     })
  //     newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //     })
  //     newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //     })
  //     newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //     })
  //     multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
  //       expect(applyClicked).toBe(true);
  //     })
  //   singleSummary.clickManuallyEnterData().then(function (manually) {
  //     expect(manually).toBe(true);
  //   });
  //   singleSummary.clickShowOption("11").then(function (manually) {
  //     expect(manually).toBe(true);
  //   });
  //   singleSummary.VerifiedMessageOpenCommentfieldOnAddComment().then(function (text) {
  //     expect(text).toBe(true);
  //     dashBoard.waitForElement();
  //   });
  // });
  //
  // it('Test case 130335: Change Lot Hyperlink– should view selectable reagent and Calibrator
  //   Lots that were available in the Lab Setup page.', function () {
  //   log4jsconfig.log().info("Test case 130335");
  //   dashBoard.dashboardCards().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   })
  //   dataTable.goToDataTablePage().then(function (test) {
  //     expect(test).toBe(true);
  //   })
  //   dataTable.clickHamburgerIcon().then(function (hamburger) {
  //     expect(hamburger).toBe(true);
  //   })
  //   dataTable.expandTree().then(function (test) {
  //     expect(test).toBe(true);
  //   })
  //   multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
  //     expect(applyClicked).toBe(true);
  //   })
  //   singleSummary.clickVerifyChangeLot().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   singleSummary.verifyLotValues(jsonData.ReagentLot, jsonData.CallibratorLot).then(function (status) {
  //     expect(status).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  // })
  //
  // it('Test case 130336: Change Lot Hyperlink– should view previously selected reagent and Calibrator Lots
  //   in View Edit Dialogue', function () {
  //   log4jsconfig.log().info("Test case 130336");
  //   dashBoard.dashboardCards().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //     dataTable.goToDataTablePage().then(function (test) {
  //       expect(test).toBe(true);
  //     })
  //     dataTable.clickHamburgerIcon().then(function (hamburger) {
  //       expect(hamburger).toBe(true);
  //     })
  //     dataTable.expandTree().then(function (test) {
  //       expect(test).toBe(true);
  //     })
  //     multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
  //       expect(applyClicked).toBe(true);
  //     })
  //     var dataMap = new Map<string, string>();
  //     dashBoard.waitForElement();
  //     dataMap.set("11", "2");
  //     dataMap.set("12", "3");
  //     dataMap.set("13", "4");
  //     multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
  //       expect(disabled).toBe(true);
  //       dashBoard.waitForElement();
  //     })
  //     multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
  //       expect(disabled).toBe(true);
  //       dashBoard.waitForElement()
  //     })
  //     multiSummary.clickSubmitButton().then(function (disabled) {
  //       expect(disabled).toBe(true);
  //       dashBoard.waitForElement();
  //     })
  //     singleSummary.verifyEnteredValueStoredTest(2.00, 3.00, 4).then(function (stored) {
  //       expect(stored).toBe(true);
  //       dashBoard.waitForElement();
  //     })
  //     singleSummary.clickVerifyChangeLot2().then(function (displayed) {
  //       expect(displayed).toBe(true);
  //       dashBoard.waitForElement();
  //     })
  //     singleSummary.verifyLotValues(jsonData.ReagentLot, jsonData.CallibratorLot).then(function (status) {
  //       expect(status).toBe(true);
  //       dashBoard.waitForElement();
  //     })
  //     singleSummary.clickonDashboardArrow().then(function (test) {
  //       expect(test).toBe(true)
  //       dashBoard.waitForElement();
  //     })
  //     singleSummary.clickonLabSetupPage().then(function (test) {
  //       expect(test).toBe(true)
  //       dashBoard.waitForPage();
  //       dashBoard.waitForPage();
  //     })
  //     singleSummary.zoomOut().then(function (test) {
  //       expect(test).toBe(true)
  //       dashBoard.waitForPage();
  //     })
  //     singleSummary.zoomOut().then(function (test) {
  //       expect(test).toBe(true)
  //       dashBoard.waitForPage();
  //     })
  //     singleSummary.clickonPerticulartextonLabSetupPage().then(function (test) {
  //       expect(test).toBe(true)
  //       dashBoard.waitForElement();
  //       dashBoard.waitForPage();
  //     })
  //     singleSummary.verifyLotValuesOnLabSetuppage(jsonData.ReagentLot, jsonData.CallibratorLot).then(function (status) {
  //       expect(status).toBe(true)
  //       dashBoard.waitForElement();
  //     })
  //   })
  // })
  //
  // it('Test case 130337: Updated Reagent and Calibrator Lots can be selected View Edit Dialogue', function () {
  //   dashBoard.dashboardCards().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   })
  //   dataTable.goToDataTablePage().then(function (test) {
  //     expect(test).toBe(true);
  //   })
  //   dataTable.clickHamburgerIcon().then(function (hamburger) {
  //     expect(hamburger).toBe(true);
  //   })
  //   dataTable.expandTree().then(function (test) {
  //     expect(test).toBe(true);
  //   })
  //   multiSummary.clearAllTestsData(jsonData.TestName1).then(function (applyClicked) {
  //     expect(applyClicked).toBe(true);
  //   })
  //   var dataMap = new Map<string, string>();
  //   dashBoard.waitForElement();
  //   dataMap.set("11", "2");
  //   dataMap.set("12", "3");
  //   dataMap.set("13", "4");
  //   multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
  //     expect(disabled).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
  //     expect(disabled).toBe(true);
  //     dashBoard.waitForElement()
  //   })
  //   multiSummary.clickSubmitButton().then(function (disabled) {
  //     expect(disabled).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   singleSummary.verifyEnteredValueStoredTest(2.00, 3.00, 4).then(function (stored) {
  //     expect(stored).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   singleSummary.ClickOnEditDialogueButtonOnTestLevel().then(function (cancle) {
  //     expect(cancle).toBe(true);
  //     dashBoard.waitForElement();
  //   });
  //   singleSummary.clickVerifyChangeLotEditDialogueBox().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   singleSummary.changeReagentLotonEditDialogueBox(jsonData.ReagentLotValue).then(function (changed) {
  //     expect(changed).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   singleSummary.changeCallibratortLotonEditDialogueBox(jsonData.ReagentLotValue).then(function (changed) {
  //     expect(changed).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   singleSummary.clickonSubmitButtonOnEditDialogueBox().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   dashBoard.waitForRefresh();
  //   singleSummary.ClickOnEditDialogueButtonOnTestLevel().then(function (cancle) {
  //     expect(cancle).toBe(true);
  //     dashBoard.waitForElement();
  //   });
  //   singleSummary.clickVerifyChangeLotEditDialogueBox().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   singleSummary.clickVerifyChangeLot1().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  //   singleSummary.clickonSubmitButtonOnEditDialogueBox().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //     dashBoard.waitForElement();
  //   })
  // });
});
