import { HostListener, ElementRef, Directive } from '@angular/core';
import { CustomRegex } from 'br-component-library';

@Directive({
    selector: '[unextAllowRationalNumber]'
})
export class AllowRationalNumberDirective {
    private regex: RegExp = new RegExp(CustomRegex.RATIONAL_NUMBER);
    private specialKeys: Array<string> = [
        'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', 'NumpadDecimal', 'Decimal'
    ];
    private next: string;
    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        const current: string = this.el.nativeElement.value;
        if (event.key === '-') {
            if (current.indexOf('-') <= 0) {
                this.next = '-' + current;
            }
        } else {
            this.next = current.concat(event.key);
        }
        if (this.next && !String(this.next).match(this.regex)) {
            event.preventDefault();
        }
    }
}
