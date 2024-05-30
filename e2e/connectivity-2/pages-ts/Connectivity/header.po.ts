// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { by, element } from 'protractor';
import { CommonFunctions } from '../../letBase/common/commonFunctions';

export class ConnHeader extends CommonFunctions {

    private fileUpload = element(by.xpath('*//unext-connectivity/unext-connectivity-header/header/div/div/div[1]/div/div[2]/ul/li[2]/a[text()="FILE UPLOAD"]'));
    private status = element(by.xpath('*//unext-connectivity/unext-connectivity-header/header/div/div/div[1]/div/div[2]/ul/li[3]/a[text()="STATUS"]'));
    private mapping = element(by.xpath('*//unext-connectivity/unext-connectivity-header/header/div/div/div[1]/div/div[2]/ul/li[4]/a[text()="MAPPING"]'));
    private instructions = element(by.xpath('*//unext-connectivity/unext-connectivity-header/header/div/div/div[1]/div/div[2]/ul/li[1]/a[text()="INSTRUCTIONS"]'));

    async clickInstructions() {
        await this.click(this.instructions);
    }

    async clickFileUpload() {
      await this.click(this.fileUpload);
  }


    async clickStatus() {
        await this.click(this.status);
    }

    async clickMapping() {
        await this.click(this.mapping);
    }

    async clickMappingToUnmapCode() {
        await this.click(this.mapping);
    }

}
