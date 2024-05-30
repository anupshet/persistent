// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { by, element } from 'protractor';
import { CommonFunctions } from '../../letBase/common/commonFunctions';

export class NavHeader extends CommonFunctions {

    private location   = element(by.xpath('.//*[@class="mat-h4 mb-0 cursor-pointer spec_title"]'));
    private openfileupload  = element(by.xpath('.//div[contains(@class, "connectivity-link")]/button'));
    private closefileupload = element(by.xpath('//unext-connectivity/unext-connectivity-header/header/div/div/div[2]/mat-icon[text()="close"]'));
    private waitElement = element(by.xpath('//unext-unity-busy/div[@class="unity-busy-component"'));
    private connectivity = element(by.xpath('.//unext-connectivity-header/header//h2[text()="Connectivity"]'));

    async verifyTitle(expected: string) {
        let actual = await this.location.getText();
        expect(expected).toBe(actual);
    }

    async verifyConnectivityPage(expected: string) {
        let actual = await this.connectivity.getText();
        expect(expected).toBe(actual);
    }


    async clickLocation( ) {
        await this.click(this.location);
    }

    async clickOpenFileUpload(locText : string) {
        await this.waitForElementToBeDisplayed(this.openfileupload)
        await this.waitForElementToBePresent(this.openfileupload)
        await this.clickConnectivityIcon(this.openfileupload, this.location, locText);
    }

    async clickCloseFileUpload( ) {
        await this.click(this.closefileupload);
    }


}
