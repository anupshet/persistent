// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { BrSelectComponent } from './select.component';
import { DisplayTextPipe } from '../shared/pipes/display-text.pipe';
import { MaterialModule } from '../material-module';

@Component({
  template: `
  <form [formGroup]="testForm">
    <br-select
      [formControl]="userSelect"
      [placeholder]="placeholder"
      [emitValue]="emitValue"
      [elementName]="elementName"
      [data]="data"
      [displayTextPipe] = "displayTextPipe"
      [enableSearch]="enableSearch"
      [minSearchCharacter] = "3"
      [searchPlaceholder]="'Search Data'"
      [maxSearchCharacter]="20"
      [noSearchResultsText]="noSearchResultsText"
      [enableClearSearch]="enableClearSearch"
      (selectedChanged)="selectItem($event)">
    </br-select>
  </form>
  `
})
class TestHostComponent implements OnInit {
  placeholder: '';
  elementName = '';
  emitValue: boolean;
  data: Array<any>;
  displayTextPipe: DisplayTextPipe<any>;
  selectedItem: any;
  testForm: FormGroup;
  userSelect: FormControl;
  minSearchCharacter: number;
  maxSearchCharacter: number;
  enableSearch: boolean;
  searchPlaceholder = '';
  noSearchResultsText = '';
  enableClearSearch: boolean;

  selectItem(item: any) {
    this.selectedItem = item;
  }

  createForm() {
    this.userSelect = new FormControl();
    this.testForm = new FormGroup({
      userSelect: this.userSelect
    });
  }

  ngOnInit() {
    this.createForm();
  }
}

@Pipe({ name: 'texthighlight' })
class MockHighLightPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('SelectComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrSelectComponent, TestHostComponent, MockHighLightPipe],
      imports: [FormsModule, MaterialModule, FormsModule, BrowserAnimationsModule, ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.placeholder = '';
    component.data = [];
    component.elementName = '';
    component.emitValue = false;
    component.enableSearch = false;
    component.minSearchCharacter = 3;
    component.maxSearchCharacter = 20;
    component.searchPlaceholder = 'Search Item';
    component.noSearchResultsText = 'No Results';
    component.enableClearSearch = false;
    component.displayTextPipe = <DisplayTextPipe<any>>(
      jasmine.createSpyObj('MockDisplayTextPipe', ['transform'])
    );
    fixture.detectChanges();

  });

  it('log test file to console', () => {
    console.log('br-select-component.ts');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label text for single data', () => {
    component.data = ['John Doe'];
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#singleData')).toBeTruthy();
  });

  it('should display dropdown for multiple data', () => {
    component.data = ['John Doe', 'Jane Doe'];
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#multipleData')).toBeTruthy();
  });

  it('a ngModelChange should trigger selectItem function if emitValue is true', (async () => {
    component.data = ['John Doe', 'Jane Doe'];
    component.emitValue = true;
    fixture.detectChanges();

    spyOn(component, 'selectItem');
    const select = fixture.debugElement.query(By.css('mat-select'));
    select.nativeElement.dispatchEvent(new Event('ngModelChange'));
    fixture.detectChanges();

    expect(await component.selectItem).toHaveBeenCalled();
  }));

  it('the element name should be set', (async () => {
    component.data = ['John Doe', 'Jane Doe'];
    component.elementName = 'UserDropdown';

    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('mat-select'));

    expect(await select.attributes['ng-reflect-name']).toBe('UserDropdown');
  }));

  // it('the default should be set in the select', fakeAsync(() => {
  //   fixture = TestBed.createComponent(TestHostComponent);
  //   component = fixture.componentInstance;
  //   component.placeholder = '';
  //   component.elementName = '';
  //   component.displayTextPipe = <DisplayTextPipe<any>>(
  //     jasmine.createSpyObj('MockDisplayTextPipe', ['transform'])
  //   );
  //   component.data = ['John Doe', 'Jane Doe'];
  //   component.emitValue = false;
  //   component.userSelect = new FormControl(component.data[0]);
  //   component.testForm = new FormGroup({
  //     userSelect: component.userSelect
  //   });
  //   fixture.detectChanges();
  //   tick();
  //   fixture.whenStable().then(() => {
  //     const select = fixture.debugElement.query(By.css('mat-select'));
  //     console.log(select);
  //     console.log(select.nativeElement);
  //     expect(select.attributes['ng-reflect-model']).toBe('John Doe');

  //   });
  // }));

  // it('selectItem should be called with the default value when emitDefault is true', async(() => {
  //   fixture = TestBed.createComponent(TestHostComponent);
  //   component = fixture.componentInstance;
  //   component.placeholder = '';
  //   component.elementName = '';
  //   component.displayTextPipe = <DisplayTextPipe<any>>(
  //     jasmine.createSpyObj('MockDisplayTextPipe', ['transform'])
  //   );
  //   component.data = ['John Doe', 'Jane Doe'];
  //   component.emitValue = true;
  //   component.default = 'Jane Doe';

  //   spyOn(component, 'selectItem');
  //   fixture.detectChanges();

  //   expect(component.selectItem).toHaveBeenCalled();
  //   expect(component.selectItem).toHaveBeenCalledWith('Jane Doe');
  // }));

  // it('selectItem should not be called when emitDefault is false', async(() => {
  //   fixture = TestBed.createComponent(TestHostComponent);
  //   component = fixture.componentInstance;
  //   component.placeholder = '';
  //   component.elementName = '';
  //   component.displayTextPipe = <IDisplayTextPipe<any>>(
  //     jasmine.createSpyObj('MockDisplayTextPipe', ['transform'])
  //   );
  //   component.data = ['John Doe', 'Jane Doe'];
  //   component.emitDefault = false;
  //   component.default = 'Jane Doe';

  //   spyOn(component, 'selectItem');
  //   fixture.detectChanges();

  //   expect(component.selectItem).not.toHaveBeenCalled();
  // }));

  it('should display dropdown for single select with search', fakeAsync(() => {
    component.enableSearch = true;
    component.data = ['Abbott', 'Cipla', 'Mankind'];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      fixture.detectChanges();
      expect(compiled.querySelector('#selectWithSearch')).toBeTruthy();
      expect(compiled.querySelector('.search-input')).toBeTruthy();
    });
  }));
});

describe('BrSelectComponent', () => {
  // Using type any to be able to test component of genertic type <T>
  let component: BrSelectComponent<any>;
  let fixture: ComponentFixture<BrSelectComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrSelectComponent, MockHighLightPipe],
      imports: [FormsModule, MaterialModule, FormsModule, BrowserAnimationsModule, ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrSelectComponent);
    component = fixture.componentInstance;
    component.placeholder = '';
    component.data = ['Abbott', 'Cipla', 'Mankind'];
    component.minSearchCharacter = 3;
    component.maxSearchCharacter = 20;
    component.searchPlaceholder = 'Search Item';
    component.noSearchResultsText = 'No Results';
    component.enableClearSearch = false;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Using type any to be able to test private methods
  it('should not trigger search when characters entered are less than minimum search character (test for 3)', () => {
    component.enableSearch = true;
    component.data = ['Abbott', 'Cipla', 'Mankind'];
    spyOn<any>(component, 'filterList');
    fixture.detectChanges();

    component.filterFormControl.patchValue('Ab');

    expect(component['filterList']).not.toHaveBeenCalled();
  });

  it('should trigger search when minimum search character (test for 3) are entered', () => {
    component.enableSearch = true;
    component.data = ['Abbott', 'Cipla', 'Mankind'];
    spyOn<any>(component, 'filterList');
    fixture.detectChanges();

    component.filterFormControl.patchValue('Abb');

    expect(component['filterList']).toHaveBeenCalledWith('Abb');
  });

  it('should return "No Results" text when search query dosnt match list items', fakeAsync(() => {
    component.enableSearch = true;
    component.data = ['Abbott', 'Cipla', 'Mankind'];
    component.ngOnInit();

    component.filterFormControl.setValue('Gsk');

    fixture.detectChanges();
    let filteredData;
    component.filterData.subscribe(data => filteredData = data);
    expect(filteredData[0]).toEqual('No Results');
  }));
});
