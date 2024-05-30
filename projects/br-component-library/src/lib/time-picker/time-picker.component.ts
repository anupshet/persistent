import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'br-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrTimePickerComponent),
      multi: true
    }
  ]
})
export class BrTimePickerComponent implements OnInit, ControlValueAccessor {
@Input() placeHolder: string;
@Input() elementName: string;
@Input() time: string;
@Input() timeDisabled: boolean;
@Input() emitValue: boolean;
@Output() timeChanged = new EventEmitter<String>();
timeSelected: string;

  onChange: any = () => {};
  onTouched: any = () => {};
  constructor() { }

  ngOnInit() {
    this.timeDisabled = this.timeDisabled ? this.timeDisabled : false;
    this.timeSelected = this.time;
  }

  get value() {
    return this.timeSelected;
  }

  set value(val) {
    this.timeSelected = val;
    this.emitSelected();
    this.onChange(val);
    this.onTouched();
  }


  emitSelected() {
    if (this.emitValue) {
      this.timeChanged.emit(this.timeSelected);
    }
  }

  // We implement this method to keep a reference to the onChange
  // callback function passed by the forms API
  registerOnChange(fn) {
    this.onChange = fn;
  }
  // We implement this method to keep a reference to the onTouched
  // callback function passed by the forms API
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  // This is a basic setter that the forms API is going to use
  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }
}
