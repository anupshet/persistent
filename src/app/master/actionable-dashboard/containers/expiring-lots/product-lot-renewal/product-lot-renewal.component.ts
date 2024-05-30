import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil, take, filter } from 'rxjs/operators';

import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { LotRenewal, LotRenewalPayload } from '../../../../../contracts/models/actionable-dashboard/actionable-dashboard.model';
import { LabProduct } from '../../../../../contracts/models/lab-setup';
import { LabInstrument } from '../../../../../contracts/models/lab-setup/instrument.model';
import { expirationDayLimit } from '../../../../../core/config/constants/general.const';
import { CodelistApiService } from '../../../../../shared/api/codelistApi.service';
import { PortalApiService } from '../../../../../shared/api/portalApi.service';
import { DateTimeHelper } from '../../../../../shared/date-time/date-time-helper';
import { AppLoggerService } from '../../../../../shared/services/applogger/applogger.service';
import { ActionableItem } from '../../../../../contracts/models/actionable-dashboard/actionableItem.model';
import { ExpiringLotsService } from '../../../services/expiring-lots.service';
import * as fromRoot from '../../../../../state/app.state';
import * as sharedStateSelector from '../../../../../shared/state/selectors';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-product-lot-renewal',
  templateUrl: './product-lot-renewal.component.html',
  styleUrls: ['./product-lot-renewal.component.scss'],
  providers: [
    PortalApiService,
    ExpiringLotsService
  ]
})
export class ProductLotRenewalComponent implements OnInit, OnDestroy {
  accountId: string;
  productLots: Array<ActionableItem> = [];
  instruments: Array<LabInstrument> = [];
  selectedLot: ActionableItem;

  protected cleanUp$ = new Subject<boolean>();

  public getAccountState$ = this.store.pipe(select(sharedStateSelector.getCurrentAccount));

  constructor(
    private codeListService: CodelistApiService,
    private expiringLotsService: ExpiringLotsService,
    private dateTimeHelper: DateTimeHelper,
    public dialogRef: MatDialogRef<ProductLotRenewalComponent>,
    @Inject(MAT_DIALOG_DATA) public actionableItem,
    private portalApiService: PortalApiService,
    private appLogger: AppLoggerService,
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService
  ) { }

  ngOnInit() {
    this.loadLotRenewalData();
  }

  loadLotRenewalData() {
    this.getAccountState$.pipe(filter(account => !!account), take(1))
      .subscribe((accountState) => {
        try {
          const accountId = accountState.id.toString();

          // Get instruments that contain expiring/expired product with id, so user has option to renew across them.
          this.expiringLotsService.getLabProducts(accountId).pipe(takeUntil(this.cleanUp$)).subscribe(instruments => {
            const actionableProductId = this.actionableItem.productId.toString();
            const expiringDateEnd = new Date(this.dateTimeHelper.getSomeDaysAheadDate(expirationDayLimit));

            // First filter instruments with this product that are expiring or expired.
            this.instruments = instruments.filter((instrument: LabInstrument) => {
              return instrument.children.some(product =>
                product.productId === actionableProductId && new Date(product.lotInfo.expirationDate) <= expiringDateEnd
              );
            });

            // Then filter list of instruments to exclude those with newer product lots already.
            this.instruments = this.instruments.filter((instrument: LabInstrument) => {
              instrument.isInstrumentChecked = true;

              return !instrument.children.some(product =>
                product.productId === actionableProductId && new Date(product.lotInfo.expirationDate) > expiringDateEnd
              );
            });
          });
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              componentInfo.ProductLotRenewalComponent + blankSpace + Operations.LoadLotRenewalData));
        }
      });

    this.codeListService.getProductMasterLotsByProductId(this.actionableItem.productId).pipe(
      takeUntil(this.cleanUp$))
      .subscribe(productLotList => {
        if (productLotList && productLotList.length > 0) {
          this.productLots = this.filterExpiredLots(productLotList);
        }
      });
  }

  public filterExpiredLots(lots): Array<ActionableItem> {
    return lots.filter(lot => !this.dateTimeHelper.isExpiredOnSpecificDate(lot.expirationDate,
      new Date(this.dateTimeHelper.getSomeDaysAheadDate(expirationDayLimit))));
  }

  selected(data: LotRenewal): void {
    if (data.selectedInstruments.length > 1) {
      data.selectedInstruments = data.selectedInstruments.filter((instrument: LabInstrument) => instrument.isInstrumentChecked);
    }
    let node: LotRenewalPayload;
    let hasProductId: boolean;
    data.selectedInstruments.forEach((instrument: LabInstrument) => {
      instrument.children.some((product: LabProduct) => {
        if (this.actionableItem.productId === product.productId) {
          node = {
            id: product.id,
            nodeType: EntityType.LabProduct,
            productMasterLotId: data.selectedLot.id.toString()
          };
          hasProductId = true;
          return true;
        }
      });

      if (hasProductId) {
        this.portalApiService.duplicateLabProductNode(node, true, instrument.id).pipe(
          take(1)
        )
          .subscribe(() => {
            this.dialogRef.close(true);
          }, error => {
            this.appLogger.log('New Product lot creation failure', error);
          });
      }
    });
  }

  ngOnDestroy() {
    this.cleanUp$.next(true);
    this.cleanUp$.unsubscribe();
  }
}
