// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select as ngrxStore, Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { unsubscribe } from '../../../../core/helpers/rxjs-helper';
import { ActionableItemType } from '../../../../contracts/models/actionable-dashboard/actionableItem.model';
import * as fromRoot from '../../../../state/app.state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ExpiredLots } from '../../../../contracts/models/actionable-dashboard/expired-lots.model';
import { DuplicateNodeComponent } from '../../../../shared/containers/duplicate-node/duplicate-node.component';
import { DuplicateNodeEntry } from '../../../../contracts/models/shared/duplicate-node-entry.model';
import { LabProduct } from '../../../../contracts/models/lab-setup';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';

@Component({
  selector: 'unext-expiring-lots-panel',
  templateUrl: './expiring-lots-panel.component.html',
  styleUrls: ['./expiring-lots-panel.component.scss']
})
export class ExpiringLotsPanelComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService
  ) { }

  @Input() expiredItems: Array<ExpiredLots>;
  @Output() onDialogclosed = new EventEmitter();
  timeZone: string;
  public timeZoneSubscription: Subscription;
  private destroy$ = new Subject<boolean>();

  public getAccountState$ = this.store.pipe(ngrxStore(sharedStateSelector.getCurrentAccount));
  public getCurrentLabLocation$ = this.store.pipe(ngrxStore(sharedStateSelector.getCurrentLabLocation));

  ngOnInit() {
    this.getTimeZone();
  }

  onLotsClicked(actionableItem) {
    try {
      this.openDialogBox(actionableItem);
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.ExpiringLotsPanelComponent + blankSpace + Operations.OnLotsClicked));
    }
  }

  getTimeZone() {
    this.getCurrentLabLocation$.pipe(filter(labLocation => !!labLocation),
      takeUntil(this.destroy$)).subscribe(labLocation => {
        this.timeZone = labLocation.locationTimeZone;
      });
  }

  openDialogBox(actionableItem) {
    switch (actionableItem.actionableType) {
      case ActionableItemType.Product: {
        this.openDialogBoxForProduct(actionableItem);
        break;
      }
      case ActionableItemType.Reagent:
      case ActionableItemType.Calibrator:
      default: {
      }
    }
  }

  openDialogBoxForProduct(actionableItem: ExpiredLots) {
    // create control node to be passed to duplicate node component
    const lotInfo = {
      id: actionableItem?.productMasterLotId,
      productId: actionableItem?.productId,
      productName: actionableItem?.productName,
      lotNumber: actionableItem?.lotNumber,
      expirationDate: actionableItem?.expirationDate,
    };
    const controlNode: LabProduct = {
      displayName: (actionableItem.productCustomName) ? actionableItem.productCustomName : actionableItem.productName,
      productMasterLotId: actionableItem?.productMasterLotId ? actionableItem?.productMasterLotId.toString() : '',
      productId: actionableItem?.productId.toString(),
      productCustomName: actionableItem?.productCustomName,
      productInfo: null,
      lotInfo: lotInfo,
      productLotLevels: null,
      levelSettings: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      isArchived: false,
      id: actionableItem?.labProductId,
      parentNodeId: actionableItem?.labInstrumentId,
      parentNode: null,
      nodeType: EntityType.LabProduct,
      children: null,
      isUnavailable: false,
      manufacturerId: actionableItem?.manufacturerId
    };
    const duplicateNodeInfo: DuplicateNodeEntry = {
      sourceNode: controlNode,
      userId: '',
      parentDisplayName: '',
      availableLots: []
    };
    const dialogRef = this.dialog.open(DuplicateNodeComponent, {
      width: '485px',
      data: { duplicateNodeInfo }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onDialogclosed.emit(result);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    unsubscribe(this.timeZoneSubscription);
  }

}
