// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import path from 'path';
import { browser, by, element } from 'protractor';
import { CommonFunctions } from '../../letBase/common/commonFunctions';
import * as testData from '../../test-data/userInfo.json';

export class ConnDetail extends CommonFunctions {

    private elm = element(by.css('input[type="file"]'));
    private btnUpload = element(by.xpath('.//button[2]/span[text()="' + testData.fileupload.upload + '"]'));
    private btnMapFile = element(by.xpath('.//button/span[text()="' + testData.fileupload.mappingFile + '"]'));
    private btnStatus = element(by.xpath('.//button/span[text()="' + testData.fileupload.status + '"]'));
    private btnInstCodeToMap = element(by.xpath('.//perfect-scrollbar/div/div[1]/div/div/button/strong[text()="' + testData.fileupload.instCode + '"]'));
    private btnInstTileToMap = element(by.xpath('.//mat-card-title[contains(text(),"' + testData.labsetup.instrument +'")]'));

    private btnLink = element(by.xpath('.//unext-mapping-dialog/div/mat-dialog-content/div/div/div[2]/button[2]/span[text()="' + testData.fileupload.link + '"]'));
    private btnUnlink = element(by.xpath('.//mat-card-content/span/span[contains(text(),"' + testData.fileupload.unlink + '")]'));

    private cardInstrument = element(by.xpath('.//mat-card-content/span/div/span[text()="' + testData.fileupload.instCode + '"]'));

    // Product
    private btnProdL1 = element(by.xpath('.//button/strong[contains(text(),"-- 1")]'));
    private btnProdL2 = element(by.xpath('.//button/strong[contains(text(),"-- 2")]'));
    private btnProdL3 = element(by.xpath('.//button/strong[contains(text(),"-- 3")]'));

    private cardProduct = element(by.xpath('.//mat-card-header/section/mat-card-title[contains(text(),"Multiqual")]'));
    private cardProdL1 = element(by.xpath('.//*[@id="levelDiv"]/div[2]/button[1][text()="1"]'));
    private cardProdL2 = element(by.xpath('.//*[@id="levelDiv"]/div[2]/button[2][text()="2"]'));
    private cardProdL3 = element(by.xpath('.//*[@id="levelDiv"]/div[2]/button[3][text()="3"]'));
    private btnProductLink = element(by.xpath('.//button/span[contains(text(),"' + testData.fileupload.link + '")]'));

    // Analyte
    private btnAnalyte = element(by.xpath('.//button/strong[contains(text(),"' + testData.fileupload.testCode + '")]'));
    private cardAnalyte = element(by.xpath('.//mat-card-title[contains(text(),"' + testData.labsetup.analyte + '")]'));
    private btnAnalyteLink = element(by.xpath('.//button/span[contains(text(),"' + testData.fileupload.link + '")]'));


    private tileMappedInstrument = element(by.xpath('.//mat-card-content/span/div/span[text()="' + testData.fileupload.instCode + '"]'));

    private btnDisable = element(by.xpath('.//span[text()="' + testData.fileupload.disable + '"]'));

    private btnInstCodeToRestOrDel = element(by.xpath('.//button/strong[contains(text(),"' + testData.fileupload.instCode + '")]'));
    private btnRestore = element(by.xpath('.//unext-archived-panel/aside/perfect-scrollbar/div/div[1]/div/div/span[1]'));
    private btnDelete = element(by.xpath('.//unext-archived-panel/aside/perfect-scrollbar/div/div[1]/div/div/span[2]'));

    private ddlDept = element(by.xpath('.//mat-select//span[text()="Department"]'));
    private deptSelected = element(by.xpath('.//mat-option//span[contains(text(), "' + testData.labsetup.department + '")]'));

    private lblTotal = element(by.xpath('.//div[1]/unext-connectivity-status-details//div[5]/span[2]'));
    private lblProcessed = element(by.xpath('.//div[1]/unext-connectivity-status-details//div[6]/span[2]'));
    private lblErrored = element(by.xpath('.//div[1]/unext-connectivity-status-details//div[7]/span[2]'));

    private checkMarkDone = element(by.xpath('.//div[1]/unext-connectivity-status-details//div[1]/div[2]/span[@class="spec_done ng-star-inserted"]/mat-icon'));
    private btnRefresh = element(by.xpath('.//div[1]/unext-connectivity-status-details//div[1]/div[2]/button'));

    private btnStatusInUploadFile = element(by.xpath('.//unext-upload-dialog//button/span[text()="Status"]'));

    async clickBrowse() {
        const absolutePath = path.resolve(__dirname, testData.fileupload.fileToUpload);
        await browser.executeScript('arguments[0].style = {};', this.elm.getWebElement());
        await this.elm.sendKeys(absolutePath);
    }


    async clickBrowseMultiFiles() {
        const absolutePath1 = path.resolve(__dirname, testData.fileupload.fileToUpload1);
        const absolutePath2 = path.resolve(__dirname, testData.fileupload.fileToUpload2);
        const absolutePath3 = path.resolve(__dirname, testData.fileupload.fileToUpload3);
        await browser.executeScript('arguments[0].style = {};', this.elm.getWebElement());
        await this.elm.sendKeys(absolutePath1);
        await this.elm.sendKeys(absolutePath2);
        await this.elm.sendKeys(absolutePath3);
    }


    async clickInstruction(instruction: string) {
        await element(by.tagName('mat-select')).click();
        await element(by.cssContainingText('mat-option', testData.fileupload.pointInstruction)).click();
    }

    async clickUpload() {
        await this.click(this.btnUpload, false);
    }

    async clickMapFile() {
        await this.click(this.btnMapFile);
    }

    async clickStatus() {
        await this.click(this.btnStatus);
    }

    async clickInstrumentCodeToMap() {
        await this.mouseHoverAndDoubleClick(this.btnInstCodeToMap);
    }

    async clickInstrumentTileToMap() {
        await this.click(this.btnInstTileToMap, false);
    }

    async clickInstrumentLink() {
        await this.click(this.btnLink);
    }

    async doubleClickInstrumentCardToMapProduct() {
        await this.mouseHoverAndDoubleClick(this.cardInstrument);
    }

    async clickProductL1() {
        await this.click(this.btnProdL1, false);
    }

    async clickProductL2() {
        await this.mouseHoverAndClick(this.btnProdL2);
    }

    async clickProductL3() {
        await this.mouseHoverAndClick(this.btnProdL3);
    }

    async clickCardL1() {
        await this.moveToElement(this.cardProduct);
        await this.click(this.cardProdL1, false);
    }

    async clickCardL2() {
        await this.moveToElement(this.cardProduct);
        await this.click(this.cardProdL2, false);
    }

    async clickCardL3() {
        await this.moveToElement(this.cardProduct);

        await this.click(this.cardProdL3, false);
    }

    async clickProductLink() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnProductLink.getWebElement());
        await this.click(this.btnProductLink);
    }

    async doubleClickProductardToMapAnalyte() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.cardProduct.getWebElement());
        await this.mouseHoverAndDoubleClick(this.cardProduct);
    }

    async clickAnalyte() {
        await this.click(this.btnAnalyte);
    }

    async clickCardAnalyte() {
        await this.click(this.cardAnalyte, false);
    }

    async clickAnalyteLink() {
        await browser.executeScript('arguments[0].scrollIntoView();', this.btnAnalyteLink.getWebElement());
        await this.click(this.btnAnalyteLink);
    }

    /**
     * @description This function is used to unmap the instrument code
     */
    async clickInstrumentCardToUnmap() {
        await browser.actions().mouseMove(this.btnInstTileToMap).perform();
        await this.click(this.cardInstrument);
        await this.click(this.btnUnlink);
    }

    /**
     * @description This function is used to disable the instrument code
     */
    async clickDisableInstrumentCode() {
        await this.click(this.btnDisable);
    }

    /**
    * @description This function is used to delete or restore the instrument code
    */
    async clickRestoreInstrumentCode(restore: boolean) {
        await this.click(this.btnInstCodeToRestOrDel);
        if (restore)
            await this.click(this.btnRestore);
        else
            await this.click(this.btnDelete, false);
    }

    async selectDepartment() {
        await this.click(this.ddlDept, false);
        await browser.sleep(1000);
        await this.click(this.deptSelected, false);
    }

    async checkTotalEQProcessedAndDisabled() {
        let total =  await this.lblTotal.getText();
        let processed =  await this.lblProcessed.getText();
        let errored =  await this.lblErrored.getText();
        let iTotal =  parseInt(total, 10);
        let iPE =  (parseInt(processed, 10) + parseInt(errored, 10));
        expect(iTotal).toBe(iPE);
    }

    async clickStatusInFileUpload() {
        await this.click(this.btnStatusInUploadFile);
    }
}
