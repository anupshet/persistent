/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary} from '../utils/browserUtil';
import { QcpCentral } from './page-objects/qcp-base-page.po';
import { UnitConversion } from './page-objects/code-list/conversion/codelist-unit-conversion.po';

const library = new BrowserLibrary();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

let jsonData;
const filePath = './e2e/qcp-central/test-data/codelist-unit-conversion-qa.json';
library.parseJson(filePath).then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist- Unit Conversion', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const unitConv = new UnitConversion();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (expanded) {
      expect(expanded).toBe(true);
    });
    qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: Codelist - Unit Conversion - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Unit Conversion - UI Verification');
    library.logStep('Test Case 2: Codelist - Unit Conversion - Sort');
    const fromUnitOffsetCol = 'From Unit Offset';
    const commentCol = 'Comment';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    unitConv.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(fromUnitOffsetCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSortingIntegerData(fromUnitOffsetCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(fromUnitOffsetCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(fromUnitOffsetCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    // qcp.clickOnColumnToSort(commentCol, sortAsc).then(function (sorted) {
    //   expect(sorted).toBe(true);
    // });
    // qcp.verifyAscendingSorting(commentCol).then(function (clicked) {
    //   expect(clicked).toBe(true);
    // });
    // qcp.clickOnColumnToSort(commentCol, sortDesc).then(function (sorted) {
    //   expect(sorted).toBe(true);
    // });
    // qcp.verifyDescendingSorting(commentCol).then(function (clicked) {
    //   expect(clicked).toBe(true);
    // });
  });

  it('Test Case 3: Codelist - Unit Conversion - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Unit Conversion - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Unit Conversion - Verify Table Result info is diplayed with selected number');
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[2]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[2]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo(jsonData.PageOptions[2]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[3]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[3]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo(jsonData.PageOptions[3]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[0]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[0]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo(jsonData.PageOptions[0]).then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  it('Test Case 4: CodeList - Unit Conversion - Pagination', function () {
    library.logStep('Test Case 4: CodeList - Unit Conversion - Pagination');
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(false);
    });
    qcp.isNextButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickPageNumButtonPagination(jsonData.PageButton).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isNextButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickPreviosButtonPagination().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(false);
    });
    qcp.isNextButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickNextButtonPagination().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 5: CodeList - Unit Conversion - Download Excel', function () {
    library.logStep('Test Case 5: CodeList - Unit Conversion - Download Excel');
    library.logStep('Test Case 6: CodeList - Unit Conversion - Verify Data');
    library.logStep('Test Case 7: CodeList - Unit Conversion - Verify non 0 IDs');
    const fromUnitCatIdCol = 'FromUnitCategoryId';
    const fromUnitCatNameCol = 'FromUnitCategoryName';
    const fromUnitIdCol = 'FromUnitId';
    const fromUnitNameCol = 'FromUnitName';
    const toUnitCatIdCol = 'ToUnitCategoryId';
    const toUnitCategoryNameCol = 'ToUnitCategoryName';
    const toUnitIdCol = 'ToUnitId';
    const fromUnitOffsetCol = 'FromUnitOffset';
    const multiplierCol = 'Multiplier';
    const dividerCol = 'Divider';
    const toUnitOffsetCol = 'ToUnitOffset';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, fromUnitCatIdCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, fromUnitCatNameCol, jsonData.FromUnitCategoryName).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, fromUnitNameCol, jsonData.FromUnitName).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, fromUnitIdCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, toUnitCategoryNameCol , jsonData.ToUnitCategoryName).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, toUnitIdCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, toUnitCatIdCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, toUnitOffsetCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Unit Conversion', function () {
    library.logStep('Test Case 8: CodeList - Add New Unit Conversion');
    library.logStep('Test Case 9: CodeList - Verify Reload Button');
    library.logStep('Test Case 10: CodeList - Unit Conversion Search-Display in table');
    library.logStep('Test Case 11: CodeList - Click Cancel on Add Unit Conversion');
    unitConv.selectUnitCategory(jsonData.FromUnitCategoryAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.clickOnAddUnitConversion().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    unitConv.clickOnAddUnitConversion().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unitConv.selectFromUnitCategory(jsonData.FromUnitCategoryAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.selectFromUnitName(jsonData.FromUnitAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.selectToUnitCategory(jsonData.ToUnitCategoryAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.selectToUnitName(jsonData.ToUnitAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addFromOffset(jsonData.FromOffsetAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addToOffset(jsonData.ToOffsetAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addMultiplier(jsonData.MultiplierAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addDivider(jsonData.DividerAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addUnitConversionComment(jsonData.CommentAdd).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.clickSubmitButtonOnAddUnitConversion().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.ToastMessageAdded).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickReloadButton().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(jsonData.CommentAdd).then(function (searched) {
      expect(searched).toBe(true);
    });
    unitConv.verifyUnitConversionAdded(jsonData.FromUnitAdd, jsonData.FromOffsetAdd,
    jsonData.MultiplierAdd, jsonData.DividerAdd,
    jsonData.ToOffsetAdd, jsonData.ToUnitAdd).then(function(verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test Case 12: CodeList - Edit Unit Conversion', function () {
    library.logStep('Test Case 12: CodeList - Edit Unit Conversion');
    library.logStep('Test Case 13: CodeList - Click Cancel on Edit Unit Conversion');
    unitConv.selectUnitCategory(jsonData.FromUnitCategoryAdd).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(jsonData.CommentAdd).then(function (searched) {
      expect(searched).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(jsonData.FromUnitAdd).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(jsonData.FromUnitAdd).then(function(verified) {
      expect(verified).toBe(true);
    });
    unitConv.addFromOffset(jsonData.FromOffsetEdit).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addToOffset(jsonData.ToOffsetEdit).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addMultiplier(jsonData.MultiplierEdit).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addDivider(jsonData.DividerEdit).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.addUnitConversionComment(jsonData.CommentEdit).then(function (added) {
      expect(added).toBe(true);
    });
    unitConv.clickSubmitButtonOnUpdateUnitConversion().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.ToastMessageEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickReloadButton().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(jsonData.CommentEdit).then(function (searched) {
      expect(searched).toBe(true);
    });
    unitConv.verifyUnitConversionAdded(jsonData.FromUnitAdd, jsonData.FromOffsetEdit,
      jsonData.MultiplierEdit, jsonData.DividerEdit,
      jsonData.ToOffsetEdit, jsonData.ToUnitAdd).then(function(verified) {
        expect(verified).toBe(true);
      });
  });

  it('Test Case 14: CodeList - Delete Unit Conversion', function () {
    library.logStep('Test Case 14: CodeList - Delete Unit Conversion');
    library.logStep('Test Case 15: Verify Unit Conversion can not be deleted which has dependencies');
    library.logStep('Test Case 16: CodeList - Click Cancel on Delete Unit Conversion');
    unitConv.selectUnitCategory(jsonData.FromUnitCategoryAdd).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(jsonData.CommentEdit).then(function (searched) {
      expect(searched).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(jsonData.CommentEdit).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(jsonData.CommentEdit).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DeleteConfirmationMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(jsonData.CommentEdit).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.ToastDeleteMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    unitConv.selectUnitCategory(jsonData.UnitCategory).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(jsonData.FromUnitName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DeleteConfirmationMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DependencyNotDeletedMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOkOnWarning().then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});
