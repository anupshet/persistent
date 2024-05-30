// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { by, element } from 'protractor';
import { CommonFunctions } from '../letBase/common/commonFunctions';

export class SignIn extends CommonFunctions {

    private emailInput      = element(by.id('okta-signin-username'))
    private passWordInput   = element(by.id('okta-signin-password'))
    private signInBtn       = element(by.id('okta-signin-submit'))
    private signin          = element(by.xpath('.//*[@class="okta-form-title o-form-head"]'));

    async enterEmail(email: string) {
        await this.clearAndType(this.emailInput, email);
    }

    async enterPassword(password: string) {
        await this.clearAndType(this.passWordInput, password);
    }

    async clickSignIn() {
        await this.click(this.signInBtn);
    }

    async verifyLogout(expected: string) {
        let actual = await this.signin.getText();
        expect(expected).toBe(actual)
    }
}
