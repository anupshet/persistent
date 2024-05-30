//  Source code from following link
//  https://github.com/ortoniKC/Protractor-TypeScript-Framework
import { browser, ElementFinder, ProtractorExpectedConditions } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import * as testData from '../../test-data/userInfo.json';

export class ProtractorBase {

    private ec: ProtractorExpectedConditions = browser.ExpectedConditions;
    private timeOut = 900000

    private async elementClickable(element: ElementFinder) {
        let count = 3;
        let init = 0;
        while (init < count) {
            try {

                await browser.wait(this.ec.elementToBeClickable(element), this.timeOut,
                    "Failed to click the element");
                break;
            }
            catch {
            } finally {
                init++;
            }
        }
    }

    /**
     * @description This function is used to do the click action
     * @param element - The element on whick click action to be performed
     */

    public async click(element: ElementFinder, api: boolean = true) {
        await this.waitForElementToBeDisplayed(element)
        await this.waitForElementToBePresent(element)
        await this.elementClickable(element);

        if (api) {
            await browser.sleep(testData.misc.sleep);
            await element.click();
            await browser.sleep(testData.misc.sleep);
        } else {
            await element.click();
        }
    }

    /**
     * @description This function is used to do the click action
     * @param element - The element on whick click action to be performed
     */
    public async clickConnectivityIcon(element: ElementFinder, location : ElementFinder, expected : string) {
        //let actualText = await location.getText();
        //expect(expected.trim()).toBe(actualText.trim());
        await browser.sleep(4000);
        await browser.wait(this.ec.elementToBeClickable(element), this.timeOut, "Failed to click the element");
        await element.click();
        await browser.sleep(4000);
    }


    /**
     * @description This function will append the text
     * @param element Pass the element locator
     * @param testData Data to be typed on the element
     */
    // tslint:disable-next-line: no-shadowed-variable
    public async type(element: ElementFinder, testData: string) {
        await this.visibilityOf(element);
        await element.sendKeys(testData);
    }


    /**
    * @description This function will clear the existing value and then type the data
    * @param element Pass the element locator
    * @param testData Data to be typed on the element
    */

    public async clearAndType(element: ElementFinder, td: string) {
        await this.visibilityOf(element);
        await element.clear()
        await element.sendKeys(td);
    }

    public async assertText(element: ElementFinder, expectedText: string) {
        await this.visibilityOf(element);
        let actualText = await element.getText();
        expect(actualText.trim()).toBe(expectedText);
    }

    private async visibilityOf(element: ElementFinder) {
        await browser.wait(this.ec.visibilityOf(element), this.timeOut,
            "Element is not visible");
    }

    protected async inVisibilityOf(element: ElementFinder) {
        await browser.wait(this.ec.invisibilityOf(element), this.timeOut,
            "Element is still visible");
    }
    public async assertTrue(element: ElementFinder) {
        await this.visibilityOf(element);
        expect(await element.isDisplayed()).toBe(true);
    }

    public async assertFalse(element: ElementFinder) {
        await this.visibilityOf(element);
        expect(await element.isDisplayed()).toBe(false);
    }

    public async acceptAlert() {
        await browser.wait(this.ec.alertIsPresent(), this.timeOut, "Alert is not present");
        await (await browser.switchTo().alert()).accept();
    }

    public async dismissAlert() {
        await this.waitForAlert();
        await (await browser.switchTo().alert()).dismiss();
    }

    private async waitForAlert() {
        await browser.wait(this.ec.alertIsPresent(), this.timeOut, "Alert is not present");
    }

    public async tyepInAlert(data: string) {
        await this.waitForAlert();
        await (await browser.switchTo().alert()).sendKeys(data);
    }
    public async getTextFromAlert(): Promise<string> {
        await this.waitForAlert()
        return  (await browser.switchTo().alert()).getText()
    }

    public async switchToFrame(frameNumber: number) {
        await browser.switchTo().frame(frameNumber)
    }


    public async typeAndTab(element: ElementFinder, td: string) {
        await this.visibilityOf(element)
        await element.clear()
        await element.sendKeys(td, protractor.Key.TAB)
    }

    public async typeAndEnter(element: ElementFinder, td: string) {
        let capabilities = await browser.getCapabilities()
        let platform = capabilities.get('platform')
        await this.visibilityOf(element)
        await element.clear();
        if (platform === "Mac OS X") {
            await element.sendKeys(td, protractor.Key.RETURN)
        } else {
            await element.sendKeys(td, protractor.Key.ENTER)
        }
    }

    public async mouseHoverAndClick(element: ElementFinder) {
        await browser.wait(this.ec.visibilityOf(element), this.timeOut, "Failed to click the element");
        await browser.actions()
            .mouseMove(await element.getWebElement())
            .click()
            .perform();
    }

    public async mouseHoverAndDoubleClick(element: ElementFinder) {
        await browser.wait(this.ec.visibilityOf(element), this.timeOut, "Failed to click the element");
        await browser.actions()
            .mouseMove(await element.getWebElement())
            .doubleClick()
            .perform();
    }

    public async moveToElement(element: ElementFinder) {
        await this.waitForElementToBePresent(element);
        await browser.actions()
            .mouseMove(await element.getWebElement())
            .perform();
    }

    public async waitForElementToBePresent(element: ElementFinder) {
        await browser.wait(element.isPresent(), this.timeOut);
    }

    public async waitForElementToBeDisplayed(element: ElementFinder) {
      await browser.wait(element.isDisplayed(), this.timeOut);
  }
}
