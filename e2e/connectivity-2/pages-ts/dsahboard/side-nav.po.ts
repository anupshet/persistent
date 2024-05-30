// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser, by, element, ElementFinder } from 'protractor';
import { CommonFunctions } from '../../letBase/common/commonFunctions';
import * as testData from '../../test-data/userInfo.json';

export class SideNav extends CommonFunctions {

    private tnDepartment    = element(by.xpath('.//*[@id="sideNav"]//div[1][text()=" ' + testData.labsetup.department + ' "]'));
    private tnInstrument    = element(by.xpath('.//*[@id="sideNav"]/div/div/div[2]/perfect-scrollbar//mat-nav-list/unext-nav-side-bar-link/span/div/div[1][text()=" ' + testData.labsetup.instrument + ' "]'));
    private tnControl       = element(by.xpath('.//*[@id="sideNav"]/div/div/div[2]/perfect-scrollbar//mat-nav-list/unext-nav-side-bar-link/span/div/div[1][contains(text(),"' + testData.labsetup.product + '")]'));
    private tnAnalyteTest   = element(by.xpath('.//*[@id="sideNav"]/div/div/div[2]/perfect-scrollbar//mat-nav-list/unext-nav-side-bar-link/span/div/div[1][text()=" ' + testData.labsetup.analyte + ' "]'));


    async verifyDepartmentAdded(element: ElementFinder, expected: string) {
        let actual = await element.getText();
        expect(expected.trim()).toBe(actual.trim());
    }

    async verifyInstrumentAdded(element: ElementFinder, expected: string) {
        let actual = await element.getText();
        expect(expected.trim()).toBe(actual.trim());
    }

    async verifyControlAdded(element: ElementFinder, expected: string) {
        let actual = await element.getText();
        expect(expected.trim()).toBe(actual.trim());
    }

    async verifyDeptInstProd(dept: string, inst: string, prod : string) {

        let actual = await this.tnDepartment.getText();
        expect(dept.trim()).toBe(actual.trim());

        await this.click(this.tnDepartment);

        actual = await this.tnInstrument.getText();
        expect(inst.trim()).toBe(actual.trim());

        await this.click(this.tnInstrument);

        actual = await this.tnControl.getText();
        expect(prod.trim()).toBe(actual.trim());

        await this.click(this.tnControl);
    }

    async verifyAnalyteTestAtTreeView(dept: string, inst: string, prod : string, analyte : string) {
        let actual = await this.tnDepartment.getText();
        expect(dept.trim()).toBe(actual.trim());

        await this.click(this.tnDepartment);

        actual = await this.tnInstrument.getText();
        expect(inst.trim()).toBe(actual.trim());

        await this.click(this.tnInstrument);

        await browser.sleep(5000);
        actual = await this.tnControl.getText();
        expect(prod.trim()).toBe(actual.trim());

        await browser.sleep(5000);
        await this.click(this.tnControl);

        await browser.sleep(5000);
        actual = await this.tnAnalyteTest.getText();
        expect(analyte.trim()).toBe(actual.trim());
    }

    async clickAnalyteTN(){
        await this.click(this.tnAnalyteTest);
    }

    async clickInstrumentTN(){
        await this.click(this.tnInstrument);
    }

    async naviInstrument() {

        await this.click(this.tnDepartment);
        await this.click(this.tnInstrument);

    }
}
