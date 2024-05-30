import { Component, Input } from '@angular/core';

import { ZScoreCell } from '../../../../../../contracts/models/data-management/runs-table/zscore-cell.model';

@Component({
  selector: 'unext-zscore-cell',
  templateUrl: './zscore-cell.component.html',
  styleUrls: ['./zscore-cell.component.scss'],
})
export class ZscoreCellComponent {
  @Input()
  zScoreCell: ZScoreCell;
}
