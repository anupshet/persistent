// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { BrAnalytePointViewComponent } from './analyte-point-view.component';
import { MaterialModule } from '../material-module';
import { BrPezCell } from '../pez-cell/pez-cell.module';
import { BrCore, TransformValuePipe } from '../shared';
import {
  ANALYTE_VIEW_4_LEVELS,
  LEVEL_DATA_COLUMNS_ALL,
  ANALYTE_VIEW_2_LEVELS,
  ANALYTE_VIEW_NO_ANALYTE_NAME,
  ANALYTE_VIEW_INSERTED_ROW,
  LEVEL_DATA_COLUMNS_VALUE_ONLY,
  ANALYTE_VIEW_7_LEVELS
} from './analyte-point-view.data.spec';
import { AnalytePointView, PointLevelDataColumns, LevelValue } from '../contracts';

const EN_US = 'en-US';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@Component({
  template: `
    <br-analyte-point-view
      [analytePointView]="analytePointView"
      [displayedLevelDataColumns]="displayedLevelDataColumns"
      [showAnalyteNameHeader]="showAnalyteNameHeader">
    </br-analyte-point-view>
  `
})
class TestHostComponent implements OnInit {
  analytePointView: AnalytePointView;
  displayedLevelDataColumns: Set<PointLevelDataColumns>;
  showAnalyteNameHeader = true;

  constructor() { }

  ngOnInit() { }
}

xdescribe('AnalytePointViewComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BrAnalytePointViewComponent,
        TestHostComponent
      ],
      imports: [
        MaterialModule,
        BrPezCell,
        CommonModule,
        PerfectScrollbarModule,
        BrCore
      ],
      providers: [
        { provide: DecimalPipe, useClass: DecimalPipe },
        { provide: DatePipe, useClass: DatePipe },
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
      ]
    })
      .compileComponents();
  }));

  function testAnalyteName(analyteNameShouldBe: string, showAnalyteNameHeader: boolean) {
    const analyteNameRow = fixture.nativeElement.querySelector('.analyte-name');
    if (showAnalyteNameHeader && analyteNameShouldBe) {
      expect(analyteNameRow.innerText).toBe('- ' + analyteNameShouldBe);
    } else {
      expect(analyteNameRow).toBeNull();
    }
  }

  function testAnalyteDateTimeExists() {
    const analyteDateTime = fixture.nativeElement.querySelector('.analyte-date-time');
    expect(analyteDateTime).toBeTruthy();
  }

  function testAnalyteDateTimeForInsertedRow() {
    testAnalyteDateTimeExists();
    const insertIcon = fixture.nativeElement.querySelector('.icn-insert');
    expect(insertIcon).toBeTruthy();
  }

  function testAllCumulativeLevels(testHost: TestHostComponent) {
    testHost.analytePointView.cumulativeLevels.forEach(cumulativeLevel => {
      const levelData = testHost.analytePointView.levelDataSet.find(lvl => {
        return lvl.level === cumulativeLevel;
      });
      // if (testHost.analytePointView.) {
      //     testLevelPointValue(cumulativeLevel, levelData);
      // }
    //   if (testHost.basePoint.z) {
    //     testLevelPointValue(cumulativeLevel, levelData);
    // }
    //   if (testHost.basePoint.ruleViolated) {
    //     testLevelPointValue(cumulativeLevel, levelData);
    // }
      if (testHost.displayedLevelDataColumns.has(PointLevelDataColumns.Z)) {
        testLevelPointZ(cumulativeLevel, levelData);
      }
      // if (testHost.displayedLevelDataColumns.has(PointLevelDataColumns.Reason)) {
      //   testLevelPointReason(cumulativeLevel, levelData);
      // }
    });
  }

  function testPez() {
    const pez = fixture.nativeElement.querySelector('.pez-placeholder');
    expect(pez).toBeTruthy();
  }

  function testLevel(
    level: number,
    divIndex: number,
    valueShouldBe: string
  ) {
    const levelColumnSelector = getLevelColumnSelector(level);
    expect(levelColumnSelector[divIndex].innerText).toBe(valueShouldBe);
  }

  function testLevelPointZ(
    level: number,
    levelValue: LevelValue
  ) {
    if (columnShouldBeEmpty(level, levelValue)) {
      testEmptyColumn(level);
    } else {
      const pipe: TransformValuePipe = new TransformValuePipe(new DecimalPipe(EN_US));
      testLevel(
        level,
        1,
        pipe.transform(levelValue.data.z) || ''
      );
    }
  }

  function columnShouldBeEmpty(
    level: number,
    levelValue: LevelValue
  ): boolean {
    if (!levelValue) {
      return true;
    }
    return levelValue.level !== level;
  }

  function testEmptyColumn(level: number) {
    const matColumnClassName = getMatColumnClassName(level);
    const notVisibleColumn = fixture.nativeElement.querySelector(`${matColumnClassName} .not-visible`);
    expect(notVisibleColumn).toBeTruthy();
  }

  function getMatColumnClassName(level: number): string {
    return `.mat-column-${level}`;
  }

  function getLevelColumnSelector(level: number): any {
    const matColumnSelector = getMatColumnClassName(
      level
    );
    return fixture.nativeElement.querySelectorAll(`${matColumnSelector} div div`);
  }

  it('should create', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analytePointView = ANALYTE_VIEW_4_LEVELS;
    component.displayedLevelDataColumns = LEVEL_DATA_COLUMNS_ALL;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display with 4 levels', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analytePointView = ANALYTE_VIEW_4_LEVELS;
    component.displayedLevelDataColumns = LEVEL_DATA_COLUMNS_ALL;
    fixture.detectChanges();
    testAnalyteName(component.analytePointView.analyteName, component.showAnalyteNameHeader);
    testAnalyteDateTimeExists();
    testAllCumulativeLevels(component);
    testPez();
  });

  it('should display with 2 levels', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analytePointView = ANALYTE_VIEW_2_LEVELS;
    component.displayedLevelDataColumns = LEVEL_DATA_COLUMNS_ALL;
    fixture.detectChanges();
    testAnalyteName(component.analytePointView.analyteName, component.showAnalyteNameHeader);
    testAnalyteDateTimeExists();
    testAllCumulativeLevels(component);
    testPez();
  });

  it('should display without analyte name header when analyte name is null', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analytePointView = ANALYTE_VIEW_NO_ANALYTE_NAME;
    component.displayedLevelDataColumns = LEVEL_DATA_COLUMNS_ALL;
    fixture.detectChanges();
    testAnalyteName(null, component.showAnalyteNameHeader);
    testAnalyteDateTimeExists();
    testAllCumulativeLevels(component);
    testPez();
  });

  it('should display without analyte name header when showAnalyteNameHeader Input is set to false', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analytePointView = ANALYTE_VIEW_4_LEVELS;
    component.displayedLevelDataColumns = LEVEL_DATA_COLUMNS_ALL;
    component.showAnalyteNameHeader = false;
    fixture.detectChanges();
    testAnalyteName(component.analytePointView.analyteName, component.showAnalyteNameHeader);
    testAnalyteDateTimeExists();
    testAllCumulativeLevels(component);
    testPez();
  });

  it('should only display the columns specified (value column in this case)', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analytePointView = ANALYTE_VIEW_4_LEVELS;
    component.displayedLevelDataColumns = LEVEL_DATA_COLUMNS_VALUE_ONLY;
    fixture.detectChanges();
    testAnalyteName(component.analytePointView.analyteName, component.showAnalyteNameHeader);
    testAnalyteDateTimeExists();
    testAllCumulativeLevels(component);
    testPez();
  });

  it('should display inserted row icon', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analytePointView = ANALYTE_VIEW_INSERTED_ROW;
    component.displayedLevelDataColumns = LEVEL_DATA_COLUMNS_ALL;
    fixture.detectChanges();
    testAnalyteName(component.analytePointView.analyteName, component.showAnalyteNameHeader);
    testAnalyteDateTimeForInsertedRow();
    testAllCumulativeLevels(component);
    testPez();
  });

  it('should display with 7 levels (columns with missing data should be empty)', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.analytePointView = ANALYTE_VIEW_7_LEVELS;
    component.displayedLevelDataColumns = LEVEL_DATA_COLUMNS_ALL;
    fixture.detectChanges();
    testAnalyteName(component.analytePointView.analyteName, component.showAnalyteNameHeader);
    testAnalyteDateTimeExists();
    testAllCumulativeLevels(component);
    testPez();
  });
});
