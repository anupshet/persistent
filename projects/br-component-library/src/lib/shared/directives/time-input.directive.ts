import { HostListener, ElementRef, Directive, Input } from '@angular/core';

@Directive({
  selector: '[brTimeInput]'
})
export class BrTimeInputDirective {
  @Input('brTimeInput') brTimeValue: string;

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const inputText = this.el.nativeElement.value;

    if (!this.hasSpecialControl(e) && !this.hasSpecialFunction(e) && (this.hasNoTimeCharacter(e) )) {
      e.preventDefault();
    }
    if (!this.hasSpecialControl(e) && inputText.length === 5 && this.isNotDigit(e) ) {
      e.preventDefault();
    }
    // For the last minute digit only allow backspace or 0-9
    if (!this.hasSpecialControl(e) && inputText.length === 4 && this.isNotDigit(e) ) {
      e.preventDefault();
    }
    // For the first minute digit only allow backspace or 0-5
    if (!this.hasSpecialControl(e) && inputText.length === 3 && !this.lessThanSix(e) ) {
      e.preventDefault();
    }
    // For the only allow colon for separation of hours and minutes
    if (!this.hasSpecialControl(e) && inputText.length === 2 && !this.isColon(e) ) {
      e.preventDefault();
    }
    if (!this.hasSpecialControl(e) && inputText.length === 1 && this.isNotDigit(e) ) {
      e.preventDefault();
    }
    // For the last hour digit only allow backspace or 0-9 if the first number was less than 2 if it was two only allow 0-3
    if (!this.hasSpecialControl(e) && inputText.length === 1 &&
     ((inputText !== '2' && this.isNotDigit(e)) || (inputText === '2' && !this.lessThanFour(e))) ) {
      e.preventDefault();
    }
    // For the first hour digit only allow backspace or 0-2
    if (!this.hasSpecialControl(e) && inputText.length === 0 && !this.lessThanThree(e) ) {
      e.preventDefault();
    }
}

  // Allow Delete, Backspace, Tab, Escape, Enter, End, Home, left arrow, right arrow
  private hasSpecialControl(e: KeyboardEvent): boolean {
    return ([46, 8, 9, 27, 13, 35, 36, 37, 39].indexOf(e.keyCode) !== -1);
  }

  // Ctrl+A, Ctrl+C Ctrl+V, Allow: Ctrl+X, Cmd+A (Mac), Cmd+C (Mac), Cmd+V (Mac), Cmd+X (Mac)
  private hasSpecialFunction(e: KeyboardEvent): boolean {
    return ([65, 67, 86, 88].indexOf(e.keyCode) !== -1 && (e.ctrlKey === true || e.metaKey === true));
  }

  private hasNoTimeCharacter(e: KeyboardEvent): boolean {
    return (((e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105) && (e.shiftKey && e.keyCode !== 186));
  }

  // No Digits
  private isNotDigit(e: KeyboardEvent): boolean {
    return ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105));
  }

  private lessThanThree(e: KeyboardEvent): boolean {
    return (e.keyCode > 47 && e.keyCode < 51);
  }

  private lessThanFour(e: KeyboardEvent): boolean {
    return (e.keyCode > 47 && e.keyCode < 52);
  }

  private lessThanSix(e: KeyboardEvent): boolean {
    return (e.keyCode > 47 && e.keyCode < 54);
  }

  private isColon(e: KeyboardEvent): boolean {
    return (e.keyCode === 58) || (e.shiftKey && e.keyCode === 186);
  }

}
