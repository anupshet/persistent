/* import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaterialModule } from '../material-module';
import { Autofixture } from 'ts-autofixture/dist/src';

import { BrSummaryStatisticsTableComponent } from './summary-statistics-table.component';
import { BrSummaryStatisticsTable } from './summary-statistics.module';
import { BrSummaryBoxComponent } from './summary-box/summary-box.component';
import { TransformValuePipe } from '../shared/pipes/transform-value.pipe';
import { MatCell, MatTable } from '@angular/material/table';
import { SummaryStatisticsLabels } from '../contracts/models/summary-stats.model';

describe('SummaryStatisticsTableComponent', () => {
  let component: BrSummaryStatisticsTableComponent;
  let fixture: ComponentFixture<BrSummaryStatisticsTableComponent>;
  const autofixture = new Autofixture();
  const labMonthLevelDefault = {
    controlLevel: 0,
    month: {
      cv: 0,
      mean: 0,
      numPoints: 0,
      sd: 0
    },
    cumul: {
      cv: 0,
      mean: 0,
      numPoints: 0,
      sd: 0
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, MaterialModule, BrSummaryStatisticsTable],
      providers: [{ provide: DecimalPipe, useClass: DecimalPipe }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrSummaryStatisticsTableComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    document.body.removeChild(fixture.debugElement.nativeElement);
    fixture = null;
    component = null;
  });

  it('should create a summary statistics table with one level', () => {
    const transformValuePipe = new TransformValuePipe(new DecimalPipe('en-US'));
    const labels = {
      month: 'MONTH',
      cumulative: 'CUMUL',
      level: 'Level_',
      mean: 'Mean_',
      sd: 'SD_',
      cv: 'CV_',
      points: 'Points_'
    } as SummaryStatisticsLabels;
    const labMonthLevels = autofixture.createMany(labMonthLevelDefault, 1);
    labMonthLevels[0].controlLevel = 1;

    component.labels = labels;

    component.monthSummaryByLevel = labMonthLevels;
    component.decimalFormatByLevel = [2];

    fixture.detectChanges();
    expect(component).toBeTruthy();

    // Check labels
    let el: HTMLElement;
    let i = 0;

    // Mean text
    let debugNodes = fixture.debugElement.queryAll(
      By.css('#spc_summarytable_mean')
    );

    expect(debugNodes.length).toEqual(1);
    el = debugNodes[0].nativeElement;
    expect(el.innerText).toEqual(labels.mean);

    // SD text
    debugNodes = fixture.debugElement.queryAll(By.css('#spc_summarytable_sd'));

    expect(debugNodes.length).toEqual(1);
    el = debugNodes[0].nativeElement;
    expect(el.innerText).toEqual(labels.sd);

    // CV text
    debugNodes = fixture.debugElement.queryAll(By.css('#spc_summarytable_cv'));

    expect(debugNodes.length).toEqual(1);
    el = debugNodes[0].nativeElement;
    expect(el.innerText).toEqual(labels.cv);

    // Points text
    debugNodes = fixture.debugElement.queryAll(
      By.css('#spc_summarytable_points')
    );

    expect(debugNodes.length).toEqual(1);
    el = debugNodes[0].nativeElement;
    expect(el.innerText).toEqual(labels.points);

    // Should have one box
    debugNodes = fixture.debugElement.queryAll(
      By.directive(BrSummaryBoxComponent)
    );
    expect(debugNodes.length).toEqual(labMonthLevels.length);

    // Check headings
    debugNodes = fixture.debugElement.queryAll(
      By.css('#spc_summarybox_heading')
    );
    expect(debugNodes.length).toEqual(labMonthLevels.length);

    debugNodes.forEach(debugNode => {
      el = debugNode.nativeElement;
      expect(el.innerText).toEqual(
        labels.level.toLocaleUpperCase() +
          ' ' +
          labMonthLevels[i++].controlLevel
      );
    });

    // Column Titles
    debugNodes = fixture.debugElement.queryAll(
      By.css('#spc_summarybox_title1')
    );
    expect(debugNodes.length).toEqual(labMonthLevels.length);

    i = 0;
    debugNodes.forEach(debugNode => {
      el = debugNode.nativeElement;
      expect(el.innerText).toEqual(labels.month);
    });

    debugNodes = fixture.debugElement.queryAll(
      By.css('#spc_summarybox_title2')
    );
    expect(debugNodes.length).toEqual(labMonthLevels.length);

    i = 0;
    debugNodes.forEach(debugNode => {
      el = debugNode.nativeElement;
      expect(el.innerText).toEqual(labels.cumulative);
    });

    // Table Values
    debugNodes = fixture.debugElement.queryAll(By.directive(MatTable));
    expect(debugNodes.length).toEqual(1);

    i = 0;
    debugNodes.forEach(debugNode => {
      const debugNodeCells = debugNode.queryAll(By.directive(MatCell));

      expect(debugNodeCells.length).toEqual(8);
      expect(debugNodeCells[0].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].month.mean,
          component.decimalFormatByLevel[i]
        )
      );
      expect(debugNodeCells[1].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].cumul.mean,
          component.decimalFormatByLevel[i]
        )
      );
      expect(debugNodeCells[2].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].month.sd,
          component.decimalFormatByLevel[i]
        )
      );
      expect(debugNodeCells[3].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].cumul.sd,
          component.decimalFormatByLevel[i]
        )
      );
      expect(debugNodeCells[4].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].month.cv, 2
        )
      );
      expect(debugNodeCells[5].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].cumul.cv, 2
        )
      );
      expect(debugNodeCells[6].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].month.numPoints, 0
        )
      );
      expect(debugNodeCells[7].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].cumul.numPoints, 0
        )
      );

      i++;
    });
  });

  it('should create a summary statistics table with multiple levels', () => {
    const transformValuePipe = new TransformValuePipe(new DecimalPipe('en-US'));
    const labMonthLevels = autofixture.createMany(labMonthLevelDefault, 4);
    labMonthLevels[0].controlLevel = 1;
    labMonthLevels[1].controlLevel = 2;
    labMonthLevels[2].controlLevel = 3;
    labMonthLevels[3].controlLevel = 4;

    component.monthSummaryByLevel = labMonthLevels;
    component.decimalFormatByLevel = [2, 2, 2, 0];

    fixture.detectChanges();
    expect(component).toBeTruthy();

    // Should have four boxes
    let debugNodes = fixture.debugElement.queryAll(
      By.directive(BrSummaryBoxComponent)
    );
    expect(debugNodes.length).toEqual(labMonthLevels.length);

    // Check headings
    debugNodes = fixture.debugElement.queryAll(
      By.css('#spc_summarybox_heading')
    );
    expect(debugNodes.length).toEqual(labMonthLevels.length);

    let el: HTMLElement;
    let i = 0;

    debugNodes.forEach(debugNode => {
      el = debugNode.nativeElement;
      expect(el.innerText).toEqual('LEVEL ' + labMonthLevels[i++].controlLevel);
    });

    // Column Titles
    debugNodes = fixture.debugElement.queryAll(
      By.css('#spc_summarybox_title1')
    );
    expect(debugNodes.length).toEqual(labMonthLevels.length);

    i = 0;
    debugNodes.forEach(debugNode => {
      el = debugNode.nativeElement;
      expect(el.innerText).toEqual('MON');
    });

    debugNodes = fixture.debugElement.queryAll(
      By.css('#spc_summarybox_title2')
    );
    expect(debugNodes.length).toEqual(labMonthLevels.length);

    i = 0;
    debugNodes.forEach(debugNode => {
      el = debugNode.nativeElement;
      expect(el.innerText).toEqual('CUM');
    });

    // Table Values
    debugNodes = fixture.debugElement.queryAll(By.directive(MatTable));
    expect(debugNodes.length).toEqual(4);

    i = 0;
    debugNodes.forEach(debugNode => {
      const debugNodeCells = debugNode.queryAll(By.directive(MatCell));
      expect(debugNodeCells.length).toEqual(8);
      // expect(debugNodeCells[0].nativeElement.innerText).toEqual(
      //   transformValuePipe.transform(
      //     labMonthLevels[i].month.mean,
      //     component.decimalFormatByLevel[0]
      //   )
      // );
      // expect(debugNodeCells[1].nativeElement.innerText).toEqual(
      //   transformValuePipe.transform(
      //     labMonthLevels[i].cumul.mean,
      //     component.decimalFormatByLevel[0]
      //   )
      // );
      // expect(debugNodeCells[2].nativeElement.innerText).toEqual(
      //   transformValuePipe.transform(
      //     labMonthLevels[i].month.sd,
      //     component.decimalFormatByLevel[1]
      //   )
      // );
      // expect(debugNodeCells[3].nativeElement.innerText).toEqual(
      //   transformValuePipe.transform(
      //     labMonthLevels[i].cumul.sd,
      //     component.decimalFormatByLevel[1]
      //   )
      // );
      expect(debugNodeCells[4].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].month.cv,
          component.decimalFormatByLevel[2]
        )
      );
      expect(debugNodeCells[5].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].cumul.cv,
          component.decimalFormatByLevel[2]
        )
      );
      expect(debugNodeCells[6].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].month.numPoints,
          component.decimalFormatByLevel[3]
        )
      );
      expect(debugNodeCells[7].nativeElement.innerText).toEqual(
        transformValuePipe.transform(
          labMonthLevels[i].cumul.numPoints,
          component.decimalFormatByLevel[3]
        )
      );

      i++;
    });
  });
});
 */
