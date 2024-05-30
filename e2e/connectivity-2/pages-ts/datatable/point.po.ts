// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { by, element } from 'protractor';
import { CommonFunctions } from '../../letBase/common/commonFunctions';

export class Point extends CommonFunctions {

    private firstRow        = element(by.xpath('.//unext-runs-table/div/div[2]/perfect-scrollbar/div/div[1]/div/perfect-scrollbar/div/div[1]/div/div/table/tbody/tr[3]'));
    private deleteIcon      = element(by.xpath('.//button[@mattooltip="Delete this data set"]'));
    private confirmation    = element(by.xpath('.//*[@id="dialog_button2"]/span[contains(text(),"Confirm Delete")]'));
    private elmChildren = element.all(by.xpath('.//unext-runs-table//table/tbody/tr'));


    async clickFirstRow( ) {
        await this.click(this.firstRow);
    }

    async clickDelete( ) {
        await this.click(this.deleteIcon, false);
    }

    async clickConfirm( ) {
        await this.click(this.confirmation);
    }

    async getPoints( ) : Promise<number> {
        return new Promise((resolve, reject) => {
            this.elmChildren.count().then((value) => {
                resolve(value)
            })
        })
    }
}
