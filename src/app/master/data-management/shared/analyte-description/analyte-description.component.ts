// <!-- © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.-->
import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Header } from '../../../../contracts/models/data-management/header.model';

@Component({
  selector: 'unext-analyte-description',
  templateUrl: './analyte-description.component.html',
  styleUrls: ['./analyte-description.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyteDescriptionComponent {

  @Input() headerData: Header;
  @Input() hierarchyText: string;

  currMethod: string;
  currReagent: string;
  currCalibrator: string;
  unitOfMeasure: string;
  currHierarchyText: string;

  constructor() {}

  ngOnInit() {
    this.currMethod = this.headerData?.method || '';
    this.currReagent = this.headerData?.reagentName || '';
    this.currCalibrator = this.headerData?.calibrator || '';
    this.unitOfMeasure = this.headerData?.unit || '';
    this.currHierarchyText = this.hierarchyText || '';
  }

}
