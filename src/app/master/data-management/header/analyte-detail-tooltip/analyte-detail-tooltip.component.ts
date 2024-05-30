import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Header } from '../../../../contracts/models/data-management/header.model';

@Component({
  selector: 'unext-analyte-detail-tooltip',
  templateUrl: './analyte-detail-tooltip.component.html',
  styleUrls: ['./analyte-detail-tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyteDetailTooltipComponent {

  @Input() headerData: Header;

  constructor() {}
}
