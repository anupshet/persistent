// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { by, element } from 'protractor';
import { CommonFunctions } from '../../letBase/common/commonFunctions';

export class NavBar extends CommonFunctions {

    private signinUser              = element(by.xpath('.//*[@id="navBarUserNameText"]'));
    private logout                  = element(by.xpath('.//*[@id="mat-menu-panel-4"]/div/button'));
    private btnUnityNext            = element(by.xpath('.//button[@id="spc_header_logo_button"]'));

    async clickSigninUser( ) {
        await this.click(this.signinUser);
    }

    async clickLogout( ) {
        await this.click(this.logout, true);
    }

    async clickUnityNext( ) {
        await this.click(this.btnUnityNext);
    }
}
