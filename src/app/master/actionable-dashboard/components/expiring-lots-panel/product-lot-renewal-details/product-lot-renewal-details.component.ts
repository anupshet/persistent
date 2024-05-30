import { Component, OnInit, Input, EventEmitter, Output, AfterContentChecked } from '@angular/core';

import { ActionableItem } from '../../../../../contracts/models/actionable-dashboard/actionableItem.model';
import { LabInstrument } from '../../../../../contracts/models/lab-setup/instrument.model';
import { LotRenewal } from '../../../../../contracts/models/actionable-dashboard/actionable-dashboard.model';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../../core/config/constants/icon.const';
import { IconService } from '../../../../../shared/icons/icons.service';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-product-lot-renewal-details',
  templateUrl: './product-lot-renewal-details.component.html',
  styleUrls: ['./product-lot-renewal-details.component.scss']
})
export class ProductLotRenewalDetailsComponent implements OnInit, AfterContentChecked {
  isLotValid = false;
  isInstrumentValid = false;
  isProcessing = false;

  @Input() productName: string;
  @Input() selectedLots: Array<ActionableItem>;
  @Input() selectedInstruments: Array<LabInstrument>;
  @Output() onSelect = new EventEmitter<LotRenewal>();

  selectedLot: ActionableItem;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24]
  ];

  constructor(
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }


  ngOnInit() { }

  ngAfterContentChecked() {
    if (this.selectedLots && this.selectedLots.length === 1) {
      this.isLotValid = true;
    }
    if (this.selectedInstruments && this.selectedInstruments.length === 1) {
      this.isInstrumentValid = true;
    }
    if (this.selectedInstruments) {
      this.onInstrumentChanged();
    }
  }

  onInstrumentChanged() {
    this.isInstrumentValid = false;
    this.selectedInstruments.some((instrument) => {
      if (instrument.isInstrumentChecked) {
        this.isInstrumentValid = true;
        return false;
      }
    });
  }

  lotChanged() {
    if (this.selectedLot) {
      this.isLotValid = true;
    }
  }

  changeLot(): void {
    try {
      this.isProcessing = true;

      if (this.selectedLots.length === 1) {
        this.selectedLot = this.selectedLots[0];
      }
      const returnObj: LotRenewal = {
        selectedInstruments: this.selectedInstruments,
        selectedLot: this.selectedLot
      };
      this.onSelect.emit(returnObj);
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.ProductLotRenewalDetailsComponent + blankSpace + Operations.ChangingLots));
    }
  }
}
