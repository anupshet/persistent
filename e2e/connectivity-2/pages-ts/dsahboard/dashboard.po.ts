// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser, by, element } from 'protractor';
import { CommonFunctions } from '../../letBase/common/commonFunctions';
import { SideNav } from './side-nav.po';
import * as testData from '../../test-data/userInfo.json';

const sidenav = new SideNav();

export class DashBoard extends CommonFunctions {

    private greetingTextFirstName = element(by.xpath('.//*[@id="greetingTextFirstName"]'));
    private addDepartment = element(by.xpath('./html/body/unext-root/div/div/div/perfect-scrollbar/div/div[1]/unext-lab-setup/div/div/unext-department-management-component/button/span/span'));
    private deptLoc = element(by.xpath('./html/body/unext-root/div/div/div/perfect-scrollbar/div/div[1]/unext-lab-setup/div/div/unext-department-management-component/unext-department-config-component/unext-department-entry-component/mat-card/unext-lab-setup-header/div/div/h5'));
    private deptName = element(by.xpath('.//*[@id="mat-input-0"]'));
    private deptAdded = element(by.xpath('.//mat-nav-list//div[text()=" ' + testData.labsetup.department + ' "]'));
    private addDepartments = element(by.xpath('.//*[@id="spec_saveButton"]'));
    private addInstruments = element(by.xpath('.//*[@id="spec_submitForm"]'));
    private instAdded = element(by.xpath('.//*[@id="sideNav"]/div/div/div[2]/perfect-scrollbar/div/div[1]/mat-nav-list/unext-nav-side-bar-link/span/div/div[1]'));
    private addControls = element(by.xpath('.//button//span[text()="Add Control "]'));
    private controlAdded = element(by.xpath('.//*[@id="sideNav"]/div/div/div[2]/perfect-scrollbar/div/div[1]/mat-nav-list/unext-nav-side-bar-link/span/div/div[1]'));
    private editControls = element(by.xpath('.//unext-analyte-management-component/div/button/span/span[text()="Edit this Control"]'));
    private editingControls = element(by.xpath('.//unext-control-management/unext-control-config/div/unext-control-entry/mat-card/button/span[text()=" Add an Analyte "]'));

    private level1CB = element(by.xpath('.//unext-control-entry/mat-card/mat-card-content/form/div[1]/div[1]/div[2]/div/div[1]/mat-checkbox/label/div'));
    private level2CB = element(by.xpath('.//unext-control-entry/mat-card/mat-card-content/form/div[1]/div[1]/div[2]/div/div[2]/mat-checkbox/label/div'));
    private level3CB = element(by.xpath('.//unext-control-entry/mat-card/mat-card-content/form/div[1]/div[1]/div[2]/div/div[3]/mat-checkbox/label/div'));
    private decimalPoint = element(by.xpath('.//br-select/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span/span[text()="2"]'));
    private updateControlBtn = element(by.xpath('.//button//span[text()="Update "]'));
    private addAnalyteTitle = element(by.xpath('.//unext-analyte-entry-component/mat-card/unext-lab-setup-header/div/div/h5[contains(text(), "Add analytes to  ' + testData.labsetup.product.trim() + '")]'));

    private btnEditAnalyte = element(by.xpath('.//unext-analyte-detail-table/main/div[1]/button/span/span[text()="Edit this analyte"]'));

    private titleToVerifySetting = element(by.xpath('.//*[@id="spec_analyteEntryForm"]/div[2]/div/div[1]/h6[text()="Daily data options"]'));

    // analyte section
    private analyteSelected = element(by.xpath('.//mat-checkbox//span[contains(text(),"' + testData.labsetup.analyte + '")]'));
    private reagentSelected = element(by.xpath('//mat-select[@aria-label=" Reagent "]'));
    private calibratorSelected = element(by.xpath('//mat-select[@aria-label=" Calibrator "]'));
    private methodSelected = element(by.xpath('//mat-select[@aria-label=" Method "]'));
    private unitSelected = element(by.xpath('//mat-select[@aria-label=" Unit "]'));

    private btnAddAnalyte = element(by.xpath('.//mat-card-actions/button[2]/span/span[text()= "Add Analytes"]'));

    private btnDeleteAnalyte = element(by.id('spec_delete'));
    private confirmation = element(by.xpath('.//button[@class="mat-focus-indicator mat-button mat-flat-button mat-button-base"]/span[text()="CONFIRM DELETE"]'));

    private btnEditControl = element(by.xpath('.//button[@class="mat-focus-indicator spec_goToControlSettings mat-button mat-button-base mat-primary ng-star-inserted"]//span[text()="Edit this Control"]'));
    private btnDeleteControl = element(by.id('spec_delete_button'));

    private btnBackArrow = element(by.xpath('.//button[@class="mat-focus-indicator backArrow spec_back_arrow mat-icon-button mat-button-base ng-star-inserted"]'));
    private btnEditInstrument = element(by.xpath('.//unext-control-management/div/button/span/span[text()="Edit this Instrument "]'));
    private btnDeleteInstrument = element(by.id('spec_deleteInstrument'));

    private cardDeptToDelete = element(by.xpath('.//unext-department-management-component//span[text()="' + testData.labsetup.department + '"]'));

    private btnDeleteDept = element(by.id('spec_deleteButton'));
    private btnManualDataEntry = element(by.xpath('.//unext-analyte-detail-table/main/div[2]/unext-runs-table/div/div[1]/a[text()="Manually enter test run"]'));

    private btnShowOptions = element(by.xpath('.//unext-run-insert/section/div/div[3]/div[1]/a/span[text()="Show options"]'));

    private txtLotNumber =      element(by.xpath('.//div/div[1]/span/span[text()="' + testData.labsetup.lotnumber + '"]'));

    private empryValCnts = element.all(by.xpath('.//input[contains(@class,"mat-input-element")]'));

    private btnSubmitData =     element(by.xpath('.//unext-run-insert/section//span[text()="Submit Data"]'));

    async verifySignin(expected: string) {
        let actual = await this.greetingTextFirstName.getText();
        expect(expected).toBe(actual);
    }

    async verifyDepartManagement() {
        let actual = await this.addDepartment.getText();
        expect(testData.misc.lblDepartManagement).toBe(actual);
    }

    async verifyAtAddingLocDept() {
        let actual = await this.deptLoc.getText();
        expect(testData.misc.lblWhatDepartmentsAreIn + testData.labsetup.location + testData.misc.lblQuestionMark).toContain(actual)
    }

    async clickAddDepartment() {
        await this.click(this.addDepartment);
    }

    async enterDeptName(deptName: string) {
        await this.typeAndEnter(this.deptName, deptName);
    }

    // Jermita Sanders
    async selectManagerDropdown(managerName: string) {
        await element(by.tagName('br-select')).element(by.tagName('mat-select')).click();
        await element(by.cssContainingText('mat-option .mat-option-text', managerName)).click();
    }

    async clickAddDepartments() {
        await this.click(this.addDepartments);
    }

    // Beckman Coulter
    async selectManufacturerDropdown(manufacturerName: string) {
        await element(by.tagName('br-select')).element(by.tagName('mat-select')).click();
        await element(by.cssContainingText('mat-option .mat-option-text', manufacturerName)).click();
    }

    // Model in the dropdown
    async selectModelDropdown(model: string) {
        await element(by.xpath('.//mat-select//span[text()=" Instrument model "]')).click();
        await element(by.cssContainingText('mat-option .mat-option-text', model)).click();
    }

    async clickAddInstruments() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.addInstruments.getWebElement());
        await this.click(this.addInstruments);
    }

    // Multiqual 123
    async selectControlNameDropdown(controlname: string) {
        await element(by.tagName('br-select')).element(by.tagName('mat-select')).click();
        await element(by.cssContainingText('mat-option .mat-option-text', controlname)).click();
    }

    // 45810
    async selectLotNumberDropdown(lotnumber: string) {
        await element(by.xpath('.//mat-select//span[text()=" Lot Number "]')).click();
        await element(by.cssContainingText('mat-option .mat-option-text', lotnumber)).click();
    }

    async clickAddControls() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.addControls.getWebElement());
        await this.click(this.addControls);
        await browser.sleep(5000);
    }

    async clickEditControls() {
        await this.click(this.editControls);
    }

    async clickUpdateControls() {
        await element(by.tagName('mat-radio-group')).all(by.tagName('mat-radio-button')).get(1).click();
        await this.click(this.level1CB, false);
        await this.click(this.level2CB, false);
        await this.click(this.level3CB, false);

        await browser.executeScript('arguments[0].scrollIntoView();', this.updateControlBtn.getWebElement());
        await this.click(this.updateControlBtn);
        await browser.executeScript('arguments[0].scrollIntoView();', this.addAnalyteTitle.getWebElement());
    }

    async selectAnalyte() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.analyteSelected.getWebElement());
        await this.click(this.analyteSelected);
    }

    async addAnalyteTest() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnAddAnalyte.getWebElement());
        await this.click(this.btnAddAnalyte);
    }

    async clickEditAnalyte() {
        await this.click(this.btnEditAnalyte);
    }

    async clickDeleteAnalyte() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnDeleteAnalyte.getWebElement());
        await this.click(this.btnDeleteAnalyte);
    }

    async clickConfirm() {
        await this.click(this.confirmation);
    }

    async clickEditThisControl() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnEditControl.getWebElement());
        await this.click(this.btnEditControl);
    }

    async clickDeleteControl() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnDeleteControl.getWebElement());
        await this.click(this.btnDeleteControl);
    }

    async clickBackArrow() {
        await this.click(this.btnBackArrow);
    }

    async clickEditThisInstrument() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnEditInstrument.getWebElement());
        await this.click(this.btnEditInstrument);
    }

    async clickDeleteInstrument() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnDeleteInstrument.getWebElement());
        await this.click(this.btnDeleteInstrument);
    }

    async clickDeptToDelete() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.cardDeptToDelete.getWebElement());
        await this.click(this.cardDeptToDelete);
    }

    async clickDeleteDept() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnDeleteDept.getWebElement());
        await this.click(this.btnDeleteDept);
    }

    // this is slide gen lot number
    async selectSlideGenDropdown(lotnumber: string) {
        await element(by.xpath('.//mat-select//span[text()=" Lot number "]')).click();
        await element(by.cssContainingText('mat-option .mat-option-text', lotnumber)).click();
    }

    // this is slide gen unit
    async selectUnitDropdown(unit: string) {
        await element(by.xpath('.//mat-select//span[text()=" Unit "]')).click();
        await element(by.cssContainingText('mat-option .mat-option-text', unit)).click();
    }

    // click manually enter run and confirm it is a vitro test to enter point
    async clickManuallyEnterTestRun() {
        await this.click(this.btnManualDataEntry);

    }

    async verifyReagentlot(reagentlot: string) {
        await this.click(this.btnShowOptions);
    }

    async enterLevelValues() {

        await this.type(this.empryValCnts.get(2), '1.3');
        await this.type(this.empryValCnts.get(3), '2.3');

        await this.clickSubmitData();
    }

    async clickSubmitData() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnSubmitData.getWebElement());
        await this.click(this.btnSubmitData);
    }
}
