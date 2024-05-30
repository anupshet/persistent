// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import * as ngrxStore from '@ngrx/store';
import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { cloneDeep } from 'lodash';
import * as moment from 'moment';

import * as fromAuth from '../../state/selectors';
import { AuthState } from '../../state/reducers/auth.reducer';
import * as fromRoot from '../../../state/app.state';
import * as actions from '../../state/actions';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { DuplicateNodeEntry } from '../../../contracts/models/shared/duplicate-node-entry.model';
import { DuplicateControlRequest, StartNewBrLotRequest } from '../../../contracts/models/shared/duplicate-control-request.model';
import { InstrumentInfo, InstrumentListRequest } from '../../../contracts/models/shared/list-duplicate-lot-instruments.model';
import { LabConfigurationApiService } from '../../services/lab-configuration.service';
import { PortalApiService } from '../../api/portalApi.service';
import { LevelLoadRequest } from '../../../contracts/models/portal-api/labsetup-data.model';
import { LabInstrument, LabLocation, LabProduct } from '../../../contracts/models/lab-setup';
import { CodelistApiService } from '../../api/codelistApi.service';
import { DateTimeHelper } from '../../date-time/date-time-helper';
import { ProductLot } from '../../../contracts/models/lab-setup/product-lots-list-point.model';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import * as sharedStateSelector from '../../../shared/state/selectors';
import { UnityNextDatePipe } from '../../../shared/date-time/pipes/unity-next-date.pipe';
import { CustomControlMasterLot } from '../../../contracts/models/control-management/custom-control-master-lot.model';

@Component({
  selector: 'unext-duplicate-node',
  templateUrl: './duplicate-node.component.html',
  providers: [UnityNextDatePipe]
})
export class DuplicateNodeComponent implements OnInit, OnDestroy {
  public duplicateNodeInfo: DuplicateNodeEntry;
  public placeholder: string;
  public userId: string;
  public instrumentList: Array<InstrumentInfo>;
  private destroy$ = new Subject<boolean>();
  public currentlySelectedControls: Array<LabProduct> = [];
  public availableLots: Array<ProductLot> = [];
  public allAvailableLots: Array<CustomControlMasterLot> = [];
  public currentLocation: LabLocation;
  public hasNonBrLicense: boolean;

  currentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  expText: string;
  hasNonBrLicense$ = this.store.pipe(select(fromNavigationSelector.getHasNonBrLicenseCurrentVal));

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DuplicateNodeEntry>,
    private errorLoggerService: ErrorLoggerService,
    private store: Store<fromRoot.State>,
    private labConfigurationApiService: LabConfigurationApiService,
    private portalApiService: PortalApiService,
    private codeListService: CodelistApiService,
    private dateTimeHelper: DateTimeHelper,
    private unityNextDatePipe: UnityNextDatePipe,
    private translate: TranslateService
  ) {
    store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!authState && !!authState.currentUser), distinctUntilChanged())
      .subscribe((authState: AuthState) => {
        this.userId = authState.currentUser.id;
    });
    this.hasNonBrLicense$.pipe(takeUntil(this.destroy$)).subscribe((hasNonBrLicense: boolean) => {
      this.hasNonBrLicense = hasNonBrLicense;
    });
  }

  ngOnInit(): void {
    this.expText = this.getTranslation('CONTROLENTRY.EXP');
    this.duplicateNodeInfo = this.data.duplicateNodeInfo;
    this.duplicateNodeInfo.userId = this.userId;
    this.placeholder = this.data.placeholder;
    this.currentLabLocation$
      .pipe(filter(location => !!location), take(1), takeUntil(this.destroy$))
      .subscribe((location: LabLocation) => {
        this.currentLocation = location;
      });
    if (!this.duplicateNodeInfo.parentDisplayName) {
      this.portalApiService.getLabSetupNode
        (EntityType.LabInstrument, this.duplicateNodeInfo.sourceNode.parentNodeId, LevelLoadRequest.LoadChildren)
        .pipe(filter(_instrument => !!_instrument), take(1)).subscribe((instrument: LabInstrument) => {
          this.duplicateNodeInfo.parentDisplayName = instrument?.instrumentInfo.name;
          this.currentlySelectedControls = instrument.children;
          if (this.availableLots && this.availableLots.length > 0) {
            this.filterExistingLots();
          }
        });
    }

    if (!this.duplicateNodeInfo.availableLots || !(this.duplicateNodeInfo.availableLots.length > 0)) {
      this.codeListService.getProductMasterLotsByProductId(this.duplicateNodeInfo?.sourceNode?.productId).pipe(
        takeUntil(this.destroy$))
        .subscribe((productLotList: ProductLot[]) => {
          if (productLotList && productLotList.length > 0) {
            this.getAllAvailableLots(productLotList);
            this.availableLots = this.filterExpiredLots(productLotList);
            // for removing existing lots if any from the list of lots
            if (this.availableLots && this.availableLots.length > 0) {
              this.availableLots.forEach((lot) => {
                lot.lotWithExpirationDate = lot.lotNumber.concat('\xa0\xa0\xa0\xa0'
                  + this.expText + ' ' + this.unityNextDatePipe.transform(lot.expirationDate, 'mediumDate'));
              });
            }
            if (this.currentlySelectedControls && this.currentlySelectedControls.length > 0) {
              this.filterExistingLots();
            }
          }
        });
    }
  }

  getAllAvailableLots(productLotList: ProductLot[]) {
    const tempLots = [];
    productLotList.forEach((lot => {
      const customControlLot = new CustomControlMasterLot();
      customControlLot.id = lot?.id;
      customControlLot.expirationDate = lot?.expirationDate;
      customControlLot.lotNumber = lot?.lotNumber;
      tempLots.push(customControlLot);
    }));
    this.allAvailableLots = cloneDeep(tempLots);
  }

  public filterExpiredLots(_lotsList: ProductLot[]): Array<ProductLot> {
    // for removing expired lots if any from the list of lots
    return _lotsList.filter(lot =>
      !this.dateTimeHelper.isExpired(lot.expirationDate));
  }

  public filterExistingLots() {
    // for removing existing lots if any from the list of lots
    this.currentlySelectedControls.forEach(control => {
      if (this.availableLots && this.availableLots.length > 0) {
        const arrayIndex = this.availableLots.findIndex(lot => control.lotInfo.id === lot.id);
        if (arrayIndex > -1) {
          this.availableLots.splice(arrayIndex, 1);
        }
      }
    });
    this.duplicateNodeInfo.availableLots = this.availableLots;
    this.duplicateNodeInfo = cloneDeep(this.duplicateNodeInfo);
  }

  duplicationRequest(duplicateLotEmitter: DuplicateControlRequest[]): void {
    try {
      const duplicateLot = duplicateLotEmitter.map(intrumentData => ({ ...intrumentData, locationId: this.currentLocation?.id }));
      this.store.dispatch(actions.LabConfigDuplicateLotsActions.duplicateLot({ duplicateLotEmitter: duplicateLot }));
      this.dialogRef.close();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DuplicateNodeComponent + blankSpace + Operations.CloseDialog)));
    }
  }

  startNewBrLotRequest(startNewBrLotEmitter: StartNewBrLotRequest[]): void {
    try {
      const newNonBrLot = startNewBrLotEmitter.map(intrumentData => ({ ...intrumentData, locationId: this.currentLocation?.id }));
      this.store.dispatch(actions.LabConfigDuplicateLotsActions.defineNBrLot({ startNewBrLotEmitter: newNonBrLot }));
      this.dialogRef.close();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DuplicateNodeComponent + blankSpace + Operations.CloseDialog)));
    }
  }

  instrumentListRequest(instrumentListEmitter: InstrumentListRequest) {
    try {
      this.labConfigurationApiService.getDuplicateLotInstruments(instrumentListEmitter)
        .pipe(filter(instrumentInfo => !!instrumentInfo), take(1))
        .subscribe((instrumentInfo) => {
          this.instrumentList = instrumentInfo?.length ? instrumentInfo : [];
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DuplicateNodeComponent + blankSpace + Operations.GetInstrumentInfo)));
    }
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(actions.LabConfigDuplicateLotsActions.ClearState());
  }
}
