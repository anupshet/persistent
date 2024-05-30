// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output,
  OnChanges, SimpleChanges, ElementRef, ViewChild, OnDestroy, HostListener
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import * as _ from 'lodash';

import { DisplayTextPipe } from '../shared/pipes/display-text.pipe';
import { defaultMaxCharacter, defaultMinCharacter, defaultNoSearchResultsText, DOWN_ARROW, UP_ARROW } from '../shared/constants/general.const';
import { CustomRegex } from '../shared';

@Component({
  selector: 'br-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrSelectComponent),
      multi: true
    }
  ]
})
export class BrSelectComponent<T> implements OnInit, ControlValueAccessor, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() data: Array<T>;
  @Input() displayAttribute: string;
  @Input() displayTextPipe: DisplayTextPipe<T>;
  @Input() elementName: string;
  @Input() emitValue: boolean;
  @Input() disabled: boolean;
  @Input() showAsDropdown: boolean;
  @Input() hasError: boolean;
  @Input() errorMessage: string;

  /**
  * Inputs and Outputs to use search in br-select. Supports single select.
  * @Input enableSearch: boolean - Enable search field with single select dropdown (default false)
  * @Input enableClearSearch: boolean - Enable clear search cross icon (default false)
  * @Input searchPlaceholder: string - Placeholder text when search field is focused
  * @Input noSearchResultsText: string - Text to be displayed when no search filter results are found (default 'No results')
  * @Input minSearchCharacter: number - Minimum characters to trigger search filter (default 3)
  * @Input maxSearchCharacter: number - Maximum characters upto which search filter triggers (default 40)
  * @Input searchOverlayClass: string - Custom class name for overlay, used for styling ngcontent and list with specificity
  * @Input filterFormControl: FormControl - FormControl to be passed from parent component to update value and validity
  * @Output searchFieldData: Object - Send search text and search filtered data to parent component
  *
  * Note: Add template inside br-select tags with class="project-content" to do content projection and to display it
  * inside the options overlay of the search input
  */

  @Input() enableSearch = false;
  @Input() enableClearSearch = false;
  @Input() searchPlaceholder: string;
  @Input() minSearchCharacter = defaultMinCharacter;
  @Input() maxSearchCharacter = defaultMaxCharacter;
  @Input() noSearchResultsText = defaultNoSearchResultsText;
  @Input() searchOverlayClass = 'br-search-overlay';
  @Input() filterFormControl: FormControl = new FormControl('');

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;
  @Output() selectedChanged = new EventEmitter<T>();
  @Output() searchFieldData = new EventEmitter<Object>();
  selectedItem: T;
  private currentStaticItems: Array<T> = [];
  filterData: Observable<Array<T>> | Observable<Array<string>>;
  tempPlaceHolder: string;
  tempData: Array<T> | Array<string>;
  addEventFn;
  private regexRationalNumber = CustomRegex.CLEAR_SPACE;
  onChange: any = () => { };
  onTouched: any = () => { };
  constructor() { }

  ngOnInit() {
    this.listenToFilterFormControlChanges();
  }


  ngOnChanges(changes: SimpleChanges) {
    this.tempPlaceHolder = this.placeholder;
    if (this.data) {
      this.currentStaticItems = this.data;

      if (changes.data) {
        if (this.enableSearch) {
          this.filterData = of(this.data);
          if (this.disabled) {
            this.filterFormControl.disable();
          }
        }
        if (this.displayAttribute && this.data.length === 1 && !this.showAsDropdown) {
          this.writeValue(this.data[0]);
        } else {
          const index = this.data.findIndex((element) => _.isEqual(element, this.selectedItem));
          if (index === -1) {
            this.writeValue('');
          } else {
            this.writeValue(this.data[index]);
          }
        }
      }
    }

    if (changes.filterFormControl) {
      this.selectItem(this.filterFormControl.value);
    }
  }

  /* Disable up down arrow event for no search filter results */
  @HostListener('keydown', ['$event'])
  checkNoSearchResult(evt: KeyboardEvent) {
    if (evt.keyCode === DOWN_ARROW || evt.keyCode === UP_ARROW) {
      if (this.tempData && this.tempData.length === 1 && this.tempData[0] === this.noSearchResultsText) {
        evt.stopPropagation();
      }
    }

  }


  /* Toggle search placeholder text on focus/focusout (Use different search placeholder when field is focused) */
  togglePlaceHolder(event: Event) {
    this.tempPlaceHolder = (this.searchPlaceholder && event.type === 'focus') ? this.searchPlaceholder : this.placeholder;
  }

  /* Trigger search on min-max character input */
  private listenToFilterFormControlChanges(): void {
    this.filterFormControl.valueChanges.pipe(
      startWith(''),
    ).subscribe((value: string) => {
      if (value?.length >= this.minSearchCharacter && value?.length <= this.maxSearchCharacter) {
        this.filterList(value);
      } else {
        this.searchFieldData.emit({ searchText: value, filteredData: this.data });
        this.filterData = of(this.data);
      }
    });
  }

  /* Filter lists by search query */
  private filterList(value: string) {
    const currentItems = this.currentStaticItems;
    const filterValue = this._normalizeValue(value);
    const tempFilterData = currentItems.filter(item => this._normalizeValue(item).includes(filterValue));
    this.tempData = tempFilterData.length ? tempFilterData : (this.noSearchResultsText ? [this.noSearchResultsText] : null);
    this.searchFieldData.emit({ searchText: value, filteredData: this.tempData });
    this.filterData = tempFilterData.length ? of(tempFilterData) : (this.noSearchResultsText ? of([this.noSearchResultsText]) : of(null));
  }

  /* Normalise search query */
  private _normalizeValue(value): string {
    if (typeof value !== 'string') {
      value = this.displayAttribute && value[this.displayAttribute] ? value[this.displayAttribute] : value;
      return value.toString().toLowerCase().replace(this.regexRationalNumber, '');
    }
    return value.toLowerCase().replace(this.regexRationalNumber, '');
  }

  clearSearch() {
    this.searchInput.nativeElement.value = '';
    this.filterData = of(this.data);
  }

  /* To restrict selection of search no results text*/
  allowSelection(item: string): { [className: string]: boolean } {
    return {
      'no-data': item === this.noSearchResultsText,
    };
  }

  formatText(value) {
    return this.displayTextPipe ? this.displayTextPipe.transform(value) : value;
  }

  emitSelected() {
    if (this.emitValue) {
      this.selectedChanged.emit(this.selectedItem);
    }
  }

  selectItem(value) {
    if (this.enableSearch) {
      this.filterFormControl.setValue(value);
      this.searchInput?.nativeElement.blur();
    }
    this.writeValue(value);
  }

  displayFn(item): string {
    return this.displayAttribute && item &&
      !!item[this.displayAttribute] ? item[this.displayAttribute] : item;
  }

  displayFnWrapper() {
    return (item) => this.displayFn(item);
  }

  get value() {
    return this.selectedItem;
  }

  set value(val) {
    this.selectedItem = val;
    this.onChange(val);
    this.onTouched();
    this.emitSelected();
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
    this.value = value;
  }

  ngOnDestroy() {
  }
}
