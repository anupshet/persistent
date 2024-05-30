// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrAnalyteSummaryEntryComponent } from './analyte-summary-entry.component';
import { AnalyteEntryType } from '../contracts/enums/analyte-entry-type.enum';
import { AnalyteSummaryEntry } from '../contracts/models/data-management/data-entry/analyte-entry.model';
import { BrDateTimePicker } from '../date-time-picker';
import { MaterialModule } from '../material-module';
import { BrChangeLot } from '../change-lot';
import { BrCore } from '../shared/core.module';
import { analyteEntrySummaryData } from './analyte-summary-entry.data.spec';

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="test(form.value)"  novalidate>
      <br-analyte-summary-entry
        formControlName="analyte"
        [analyteEntryType]="analyteEntryType"
        [selectedDate]="selectedDate"
        [translationLabelDictionary]="{ SDShouldbeZero: 'SD should be zero.' }">
      </br-analyte-summary-entry>

      <div>
        <button type="reset" mat-button color="primary">Cancel</button>
        <button mat-button color="primary" [disabled]="form.invalid">Submit Data</button>
      </div>
    </form>
  `
})
class TestHostComponent implements OnInit {
  analyteEntry: AnalyteSummaryEntry;
  analyteEntryType: AnalyteEntryType;
  selectedDate: Date = new Date();
  form: FormGroup;
  analyteFormControl: FormControl;

  createForm() {
    this.analyteFormControl = new FormControl(this.analyteEntry);
    this.form = new FormGroup({
      analyte: this.analyteFormControl
    });
  }

  constructor() {
  }

  ngOnInit() {
    this.createForm();
  }
}

xdescribe('AnalyteSummaryEntryComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BrAnalyteSummaryEntryComponent,
        TestHostComponent
      ],
      imports : [
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        BrCore,
        BrDateTimePicker,
        BrChangeLot,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyteEntrySummaryData;
    fixture.detectChanges();
  });

  it('should create', (() => {
    expect(component).toBeTruthy();
  }));

  it('should display/not-display AnalyteName based on AnalyteEntryType', (() => {
    component.analyteEntryType = AnalyteEntryType.Single;
    fixture.detectChanges();
    const analyteName = fixture.debugElement.query(By.css('h6'));
    expect(analyteName).toBeNull();
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    expect(analyteName).toBeDefined();
  }));

  it('should display/not-display DateTimePicker based on AnalyteEntryType', (() => {
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    const dateTimePicker = fixture.debugElement.query(By.css('br-date-time-picker'));
    expect(dateTimePicker).toBeNull();
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    expect(dateTimePicker).toBeDefined();
  }));

  it('should display ChangeLot for single/multi summary entry', (() => {
    component.analyteEntryType = AnalyteEntryType.Single;
    fixture.detectChanges();
    const changeLot = fixture.debugElement.query(By.css('br-change-lot'));
    expect(changeLot).toBeDefined();
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    expect(changeLot).toBeDefined();
  }));

  it('should set data to null on calling Reset', (() => {
    component.analyteEntry.levelDataSet[0].data.mean = 5;
    fixture.detectChanges();
    expect(component.analyteEntry.levelDataSet[0].data.mean).toBeTruthy();
    component.analyteFormControl.setValue(null);
    fixture.detectChanges();
    expect(component.analyteEntry.levelDataSet[0].data.mean).toBeNull();
  }));

  it('should return error for validation if only one value entered in a level', (() => {
    component.analyteEntry.levelDataSet[0].data.mean = 5;
    component.analyteFormControl.setValue(component.analyteEntry);
    fixture.detectChanges();
    expect(component.form.controls['analyte'].errors).toBeTruthy();
  }));

  it('should return null for validation if all values entered in a level', (() => {
    component.analyteEntry.levelDataSet[0].data.mean = 5;
    component.analyteEntry.levelDataSet[0].data.sd = 5;
    component.analyteEntry.levelDataSet[0].data.numPoints = 5;
    component.analyteFormControl.setValue(component.analyteEntry);
    fixture.detectChanges();
    expect(component.form.controls['analyte'].errors).toBeNull();
  }));

  it('should return error for validation if numPoints=1 & sd!=0', (() => {
    component.analyteEntry.levelDataSet[0].data.mean = 5;
    component.analyteEntry.levelDataSet[0].data.sd = 5;
    component.analyteEntry.levelDataSet[0].data.numPoints = 1;
    component.analyteFormControl.setValue(component.analyteEntry);
    fixture.detectChanges();
    expect(component.form.controls['analyte'].errors).toBeTruthy();
  }));

  it('should return error for validation if numPoints<=0', (() => {
    component.analyteEntry.levelDataSet[0].data.mean = 5;
    component.analyteEntry.levelDataSet[0].data.sd = 5;
    component.analyteEntry.levelDataSet[0].data.numPoints = 0;
    component.analyteFormControl.setValue(component.analyteEntry);
    fixture.detectChanges();
    expect(component.form.controls['analyte'].errors).toBeTruthy();
  }));

});
