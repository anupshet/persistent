import { HostListener, ElementRef, Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { CustomRegex } from '../constants/regular-expressions';
import * as ngrxSelector from '@ngrx/store';
import { select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { createFeatureSelector, createSelector } from '@ngrx/store';

interface NavigationState {
  locale?: object,
}
interface State {
  navigation: NavigationState;
}
@Directive({
  selector: '[brNumericValue]'
})
export class BrNumericValueDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  storedLocale;
  @Input() brNumericValue: string;
  private regex: RegExp;
  getNavigationState = createFeatureSelector<NavigationState>('navigation');
  getLocale = createSelector(this.getNavigationState, (state) => state && state.locale ? state.locale : { country: 'US', lcid: 'en-US', value: 'en', name: 'English' });
  navigationGetLocale$ = this.store.pipe(select(this.getLocale));
  numberFormat;
  periodCount = 0;
  isCommaDecimalSeperator = false;

  constructor(
    private el: ElementRef,
    private store: ngrxSelector.Store<State>,
    ) { }

  ngOnInit() {
 
    this.sleep(200).then(() => {
      let inputText = this.el.nativeElement.value;
      if (!!inputText) {
        if (this.isCommaDecimalSeperator) {
          this.el.nativeElement.value = inputText.replace(/\./g, ',');
        }
      }
     });

    this.navigationGetLocale$
    .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
    .subscribe(loc => {
      if (loc) {
         this.storedLocale = loc;
        this.numberFormat =  (this.storedLocale.hasOwnProperty('numberFormat')) ?
        this.storedLocale.numberFormat : 0;
        this.isCommaDecimalSeperator =  (this.numberFormat === 1 ||  this.numberFormat === 2) ? true : false;
        // replace required seperator when some changes are made in language dialog box
        const inputText = this.el.nativeElement.value;
        if (!!inputText) {
          if (this.isCommaDecimalSeperator) {
            this.el.nativeElement.value = inputText.replace(/\./g, ',');
          } else {
            this.el.nativeElement.value = inputText.replace(/\,/g, '.');
          }
        }
      }
    });

    // Defaults to 0 or more numbers.
    this.regex = new RegExp(this.brNumericValue || '\\d*');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  @HostListener('ngModelChange', ['$event'])
  ngModelChange(value: any) {
    if (this.isCommaDecimalSeperator) {
      this.sleep(50).then(() => {
        this.el.nativeElement.value = value;
       });
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    let inputText = this.el.nativeElement.value;
    const allTextSelected = window.getSelection().toString() === inputText;
   switch (String(this.brNumericValue)) {
    
      case String(CustomRegex.ONLY_DIGITS_GREATER_THAN_ZERO) : {
        if (!this.hasSpecialControl(e) && !this.hasSpecialFunction(e)
          && (this.hasNoDigit(e) || this.hasOnlyZero(e, inputText, allTextSelected))) {
            e.preventDefault();
          }
        break;
      }
      case String(CustomRegex.RATIONAL_NUMBER) : {
        this.periodCount = (this.el.nativeElement.value.split(/\,+/gi).length - 1);

        if (e.keyCode === 188 && this.periodCount === 1) {
          e.preventDefault();
        }
        // comma
        if (!this.isCommaDecimalSeperator  && (e.keyCode === 188 || e.keyCode === 44)) {
          e.preventDefault();
        }
        // period
        if (this.isCommaDecimalSeperator  && (e.keyCode === 190  || e.keyCode === 110)) {
          e.preventDefault();
        }
        const flag = (
          (e.keyCode === 188 || e.keyCode === 44 || e.keyCode === 110) || 
          e.keyCode === 190 ||
          this.hasSpecialControl(e) ||
          this.hasSpecialFunction(e) ||
          this.hasMinusOrSubtract(e) ||
          !this.hasNoDigit(e) ||
          this.hasNumericKeyPadDigits(e)
          ) ? false : true;
          if (flag) {
            e.preventDefault();
          }
        break;
      }
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    let inputText = this.el.nativeElement.value;
    this.periodCount = (this.el.nativeElement.value.split(/\,+/gi).length - 1);
    if (this.hasMinusOrSubtract(e) && (inputText.charAt(0) !== '-')) {
      this.el.nativeElement.value = inputText.replace(/-/g, '');
    }
    if (this.isCommaDecimalSeperator) {
      if ((e.keyCode === 188 || e.keyCode === 44) && this.periodCount === 0) {
        this.el.nativeElement.value = this.el.nativeElement.value + ',';
      }
      if (this.periodCount !== 0) {
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/\./g, ',');
      }
    } 
  }

  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent) {
    e.preventDefault();
    this.insertMatchingContent(e.clipboardData.getData('text/plain').trim());
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.el.nativeElement.focus();
    this.insertMatchingContent(e.dataTransfer.getData('text').trim());
  }

  private insertMatchingContent(content: string) {
    if (this.regex.test(content)) {
      document.execCommand('insertText', false, content);
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

  // No Digits
  private hasNoDigit(e: KeyboardEvent): boolean {
    return ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105));
  }

  // Only has Zero
  private hasOnlyZero(e: KeyboardEvent, inputText: any, allTextSelected: boolean): boolean {
    return (e.keyCode === 48 && (this.isEmpty(inputText) || allTextSelected));
  }

  // Decimal or Period
  private hasDecimalOrPeriod(e: KeyboardEvent): boolean {
    return (e.keyCode === 110 || e.keyCode === 190);
  }

  // Minus or Subtract
  private hasMinusOrSubtract(e: KeyboardEvent): boolean {
    return (e.keyCode === 109 || e.keyCode === 189 || e.keyCode === 45);
  }

  // Digits on numeric key pad
  private hasNumericKeyPadDigits(e: KeyboardEvent): boolean {
    return (
      e.keyCode === 12 || e.keyCode === 33 || e.keyCode === 34 || e.keyCode === 35 || e.keyCode === 36 ||
      e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 45
    );
  }

  isEmpty(value) {
    if (!value) {
      return true;
    }
    return value == null || this.trim(value) === '' || value.length === 0;
  }

  trim(value) {
    if (value && value.trim) {
      return value.trim();
    }
    return value;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
