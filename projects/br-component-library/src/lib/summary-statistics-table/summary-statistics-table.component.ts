import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { LabMonthLevel, SummaryStatisticsLabels } from '../contracts/models/summary-stats.model';

@Component({
  selector: 'br-summary-statistics-table',
  templateUrl: './summary-statistics-table.component.html',
  styleUrls: ['./summary-statistics-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrSummaryStatisticsTableComponent {
  @Input() monthSummaryByLevel: Array<LabMonthLevel>;
  @Input() decimalFormatByLevel: Array<number>;
  @Input() labels: SummaryStatisticsLabels;

  constructor() {}
}
