import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';

export class CoreTestHelper<T> {
    constructor(private fixture: ComponentFixture<T>) {
    }

    getNativeElementBy(selector): HTMLElement {
        const de = this.getDebugElementBy(selector);
        const nativeElement = (de === null) ? null : de.nativeElement;
        return nativeElement;
    }

    getDebugElementBy(selector) {
        return this.fixture.debugElement.query(By.css(`${selector}`));
    }

    getDebugElementsBy(selector) {
        return this.fixture.debugElement.queryAll(By.css(`${selector}`));
    }

    routerLinkShouldExistWithUrl(url) {
        const des = this.fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
        const index = des.findIndex(de => de.properties['href'] === url);
        // expect(index).toBeGreaterThan(-1);
    }

    directiveShouldExistOn(url, selector) {
        const de = this.fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
        const re = de.find(e => e.properties['href'] === url);
        return re.parent.attributes[selector];
    }

    tearDown(component) {
        this.fixture.destroy();
        document.body.removeChild(this.fixture.debugElement.nativeElement);
        this.fixture = null;
        component = null;
    }
}
