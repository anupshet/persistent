// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ViewChild } from '@angular/core';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInput } from '@angular/material/input';

import { CustomRegex } from 'br-component-library';

import { LevelValue } from '../../../../contracts/models/data-management/level-value.model';

@Component({
  selector: 'unext-point-data-entry',
  templateUrl: './point-data-entry.component.html',
  styleUrls: ['./point-data-entry.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PointDataEntryComponent)
    }
  ]
})
export class PointDataEntryComponent implements OnInit, ControlValueAccessor {
  @Input() levelValues: Array<LevelValue>;
  @Input() isProductMasterLotExpired: false;
  @Input() isLeafArchived: boolean;
  @Output() valueChange = new EventEmitter<Array<LevelValue>>();
  @Output() focus = new EventEmitter<boolean>();
  private inputElements: Array<ElementRef>;
  tabIndex: Number;
  public regexRationalNumber = CustomRegex.RATIONAL_NUMBER;

  @ViewChild('dataInputEntry', { static: false }) _dataInputEntry: MatInput;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputElements = this.elem.nativeElement.querySelectorAll('input'); // checking input elements loaded properly
      if (this.inputElements && this.inputElements.length > 0 && this._dataInputEntry) {
        this._dataInputEntry.focus();
      }
    }, 0);
  }

  public keytab(event): void {
    event.preventDefault();
    if (
      event.srcElement.attributes.tabIndex &&
      event.srcElement.attributes.tabIndex.value > 0
    ) {
      this.inputElements = this.elem.nativeElement.querySelectorAll('input');
      this.findNextTabIndex(event.srcElement.attributes.tabIndex.value);
    }
  }

  private findNextTabIndex(currentIndex: number): void {
    let nextElement: ElementRef;
    this.inputElements.forEach(element => {
      if (element['tabIndex'] && element['tabIndex'] > currentIndex) {
        if (nextElement && nextElement['tabIndex'] > element['tabIndex']) {
          nextElement = element;
        }
        if (!nextElement) {
          this.tabIndex = element['tabIndex'];
          nextElement = element;
        }
      }
    });
    if (nextElement) {
      // pbi192324
      // nextElement is undefined. It worked for 2yrs....
      try {
        nextElement.nativeElement.focus();
        nextElement.nativeElement.select();
      } catch (error) {
        document.getElementById((this.tabIndex).toString()).focus();
      }
    }
  }

  public onFocus(input: boolean): void {
    this.focus.emit(input);
  }

  // BEGIN implement ControlValueAccessor

  // This is the initial value set to the component
  public writeValue(obj: Array<LevelValue>) {
    this.levelValues = obj as Array<LevelValue>;
  }

  // Registers a callback method
  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  // not used, used for touch input
  public registerOnTouched(fn: any) { }

  private propagateChange = (_: any) => { };

  // END implement ControlValueAccessor
}
