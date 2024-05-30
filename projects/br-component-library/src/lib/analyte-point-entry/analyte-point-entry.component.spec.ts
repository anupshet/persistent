// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AnalytePointEntry, AnalyteEntryType, LevelValue } from '../contracts';
import { BrDateTimePicker } from '../date-time-picker';
import { MaterialModule } from '../material-module';
import { BrAnalytePointEntryComponent } from './analyte-point-entry.component';
import { analyeEntryNoLevelData, analyeEntryLevelDisplayTest } from './analyte-point-entry.data.spec';
import { BrChangeLot } from '../change-lot';
import { BrCore } from '../shared';
import { HttpLoaderFactory } from '../../../../../src/app/app.module';

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="test(form.value)"  novalidate>
      <br-analyte-point-entry
        formControlName="analyte"
        [analyteEntryType]="analyteEntryType"
        [analyteEntry]="analyeEntry"
        [selectedDate]="selectedDate">
      </br-analyte-point-entry>

      <div>
        <button type="reset" mat-button color="primary">Cancel</button>
        <button mat-button color="primary" [disabled]="form.invalid">Submit Data</button>
      </div>
    </form>
  `
})
class TestHostComponent implements OnInit {
  analyteEntry: AnalytePointEntry;
  analyteEntryType: AnalyteEntryType;
  form: FormGroup;
  analyteFormControl: FormControl;
  selectedDate: Date = new Date();
  readonly levelIdentifier = 'level-';

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

describe('BrAnalytePointEntryComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrAnalytePointEntryComponent, TestHostComponent ],
      imports: [FormsModule, MaterialModule, ReactiveFormsModule, BrDateTimePicker, BrChangeLot, BrowserAnimationsModule, BrCore,
        StoreModule.forRoot([]),
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        { provide: Store, useValue: [] },
        provideMockStore({}),
        TranslateService,
      ]
    })
    .compileComponents();
  }));


  it('log test file to console', () => {
    console.log('br-analyte-point-entry');
  });

  xit('should create for single point', (async() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyeEntryNoLevelData;
    component.analyteEntryType = AnalyteEntryType.Single;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  xit('should create for multi point', (async() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyeEntryNoLevelData;
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  xit('Analyte Name should not be set in Single Point Entry', (async() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyeEntryNoLevelData;
    component.analyteEntryType = AnalyteEntryType.Single;
    fixture.detectChanges();
    const analyteName = fixture.debugElement.query(By.css('.test-analyte-name'));
    expect(analyteName).toBe(null);
  }));

  xit('Analyte Name should be set in Multi Point Entry', (async() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyeEntryNoLevelData;
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    const analyteName = fixture.debugElement.query(By.css('.test-analyte-name'));
    expect(analyteName.nativeElement.innerText).toBe(analyeEntryNoLevelData.analyteName);
  }));

  xit('Date Time Picker should exist in Single Point Entry', (async() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyeEntryNoLevelData;
    component.analyteEntryType = AnalyteEntryType.Single;
    fixture.detectChanges();
    const dateTimePicker = fixture.debugElement.query(By.css('br-date-time-picker'));
    expect(dateTimePicker).toBeTruthy();
  }));

  xit('Date Time Picker should NOT exist in Multi Point Entry', (async() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyeEntryNoLevelData;
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    const dateTimePicker = fixture.debugElement.query(By.css('br-date-time-picker'));
    expect(dateTimePicker).toBe(null);
  }));

  xit('Date Time Picker should NOT exist in Multi Point Entry', (async() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyeEntryNoLevelData;
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    const dateTimePicker = fixture.debugElement.query(By.css('br-date-time-picker'));
    expect(dateTimePicker).toBe(null);
  }));

  xit('All visible levels are displayed', (async() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyeEntryLevelDisplayTest;
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();

    // For each cumulative level value, look for it's input. Then checked if there is a level data set item
    // with a corresponding level value. If there is a corresponding level data set item then an input should
    // be found. If there is no corresponding value then no input should be found.
    const cumulativeLevels: Array<number> = component.analyteEntry.cumulativeLevels;
    const levelDataSet: Array<LevelValue> = component.analyteEntry.levelDataSet;
    for (let i = 0; i < cumulativeLevels.length; i++) {
      const levelInput = fixture.debugElement.query(By.css('#' + component.levelIdentifier +  cumulativeLevels[i]));
      if (levelDataSet.find(levelSetItem => levelSetItem.level === cumulativeLevels[i])) {
        expect(levelInput).toBeTruthy();
      } else {
        expect(levelInput).toBe(null);
      }
    }

    for (let i = 0; i < levelDataSet.length; i++) {
      if (cumulativeLevels.find(level => level === levelDataSet[i].level)) {
        // Do nothing we already checked these
      } else {
        const levelInput = fixture.debugElement.query(By.css('#' + component.levelIdentifier +  levelDataSet[i].level));
        expect(levelInput).toBe(null);
      }
    }

  }));

});
