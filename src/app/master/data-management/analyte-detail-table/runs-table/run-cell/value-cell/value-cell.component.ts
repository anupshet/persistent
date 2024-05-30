import { Component, Input } from '@angular/core';

import { ResultStatus } from '../../../../../../contracts/models/data-management/runs-result.model';
import { ValueCell } from '../../../../../../contracts/models/data-management/runs-table/value-cell.model';

@Component({
  selector: 'unext-value-cell',
  templateUrl: './value-cell.component.html',
  styleUrls: ['./value-cell.component.scss']
})
export class ValueCellComponent {
  @Input()
  valueCell: ValueCell;
  @Input()
  decimalPlace: number;

  getBorderColor(resultStatus) {
    switch (resultStatus) {
      case ResultStatus.Warning:
        return 'yellow';
      case ResultStatus.Accept:
      case ResultStatus.Reject:
        return 'red';
      default:
        return '';
    }
  }
}
