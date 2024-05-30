import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { LabMonthLevel, SummaryStatisticsLabels } from '../../contracts/models/summary-stats.model';

@Component({
  selector: 'br-summary-box',
  templateUrl: './summary-box.component.html',
  styleUrls: ['./summary-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrSummaryBoxComponent implements OnInit {
  @Input() labMonthLevel: LabMonthLevel;
  @Input() decimalFormat: number;
  @Input() labels: SummaryStatisticsLabels;

  displayedColumns: string[] = ['month', 'cumulative'];

  constructor(
  ) { }

  ngOnInit() {
  }

  getSummaryStatsRows(levelSummaryStats: LabMonthLevel): any[] {
    const summaryStatsRows = [];

    summaryStatsRows.push({
      month: levelSummaryStats.month.mean,
      cumulative: levelSummaryStats.cumul.mean,
      decimal: this.decimalFormat

    },
    {
      month: levelSummaryStats.month.sd,
      cumulative: levelSummaryStats.cumul.sd,
      decimal: this.decimalFormat
    },
    {
      month: levelSummaryStats.month.cv,
      cumulative: levelSummaryStats.cumul.cv,
      decimal: 2
    },
    {
      month: levelSummaryStats.month.numPoints,
      cumulative: levelSummaryStats.cumul.numPoints,
      decimal: 0,
      isNumPoints: true
    });

    return summaryStatsRows;
  }
}
