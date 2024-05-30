// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[unextRestrictDecimalPlaces]'
})
export class UnityRestrictDecimalPlacesDirective {
  @Input() decimalPlaces: number;
  @Input() allowNegative: boolean;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const negativePattern = (this.allowNegative) ? '-?' : '';
    const strRegExPattern = (this.decimalPlaces) ? '^' + negativePattern + '\\d*\\.?,?\\d{0,' + this.decimalPlaces + '}$' :
    '^' + negativePattern + '[1-9]\\d*$';
    if (this.allowNegative) {
      this.specialKeys.push('-');
    }
    const regex: RegExp = new RegExp(strRegExPattern);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

}
