// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { forkJoin, Subject } from 'rxjs';
import { concatMap, filter, take, takeUntil } from 'rxjs/operators';

import { MessageSnackBarService } from '../../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { Chip } from '../../../../../contracts/models/connectivity-map/chip.model';
import { InstrumentMap } from '../../../../../contracts/models/connectivity-map/instrument-map-put.model';
import {
  InstrumentCard,
  ProductCard,
  ProductLevel,
  TestCard
} from '../../../../../contracts/models/connectivity-map/map-card.model';
import { ProductMap } from '../../../../../contracts/models/connectivity-map/product-map-put.model';
import { ReagentCalibratorDialogData } from '../../../../../contracts/models/connectivity-map/reagent-calibrator-dialog-data.model';
import { TestMap } from '../../../../../contracts/models/connectivity-map/test-map-put.model';
import { MappingService } from '../../mapping.service';
import { ReagentCalibratorDialogComponent } from '../../test-map/reagent-calibrator-dialog/reagent-calibrator-dialog.component';
import { ReagentCalibratorDialogService } from '../../test-map/reagent-calibrator-dialog/reagent-calibrator-dialog.service';
import { LabLotTest } from '../../../shared/models/lab-lot-test.model';
import { LabConfigurationApiService } from '../../../../../shared/services/lab-configuration.service';
import { MapNode } from '../../../shared/models/connectivity-file-error.model';
import { AuditTrackingAction, AuditTrackingEvent, AuditTrackingActionStatus } from '../../../../../shared/models/audit-tracking.model';
import { nodeTypeNames } from '../../../../../core/config/constants/general.const';

@Component({
  selector: 'unext-mapping-dialog',
  templateUrl: './mapping-dialog.component.html',
  styleUrls: ['./mapping-dialog.component.scss']
})
export class MappingDialogComponent implements OnInit, OnDestroy {
  entityType: EntityType;

  errorMessage: string;
  messageType: string;
  codeMapMessage: string;

  mapInstrumentModel: InstrumentMap;
  mapProductModel: ProductMap;
  mapTestModel: TestMap;

  isCardClicked = false;
  selectedChip: Chip;
  selectedInstrument: InstrumentCard = null;
  selectedProduct: ProductCard = null;
  selectedProductLevel: ProductLevel = null;
  selectedTest: TestCard = null;

  // used in the switch case in HTML
  entityTypeLabInstrument = EntityType.LabInstrument;
  entityTypeLabProduct = EntityType.LabProduct;
  entityTypeLabTest = EntityType.LabTest;

  public destroy$ = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: MapNode,
    private dialogRef: MatDialogRef<MappingDialogComponent>,
    private connectivityMapService: MappingService,
    private reagentCalibratorDialog: MatDialog,
    private reagentCalibratorDialogService: ReagentCalibratorDialogService,
    private messageSnackBar: MessageSnackBarService,
    private labConfigurationApiService: LabConfigurationApiService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.connectivityMapService.currentSelectedChip
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        selectedChip => {
          this.selectedChip = selectedChip;
          if (selectedChip != null) {
            this.updateDialogMessage();
          }
        }
      );

    this.connectivityMapService.currentEntityType
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        entityType => {
          this.entityType = entityType;
        }
      );

    this.connectivityMapService.currentSelectedCard
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        currentSelectedCard => {
          switch (this.entityType) {
            case EntityType.LabInstrument: {
              this.selectedInstrument = currentSelectedCard;
              this.updateDialogMessage();
              break;
            }
            case EntityType.LabProduct: {
              this.selectedProduct = currentSelectedCard;
              this.updateDialogMessage();
              break;
            }
            case EntityType.LabTest: {
              this.selectedTest = currentSelectedCard;
              this.updateDialogMessage();
              break;
            }
            default: {
              break;
            }
          }
        }
      );

    this.connectivityMapService.closeLinkDialog
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dialogRef.close();
      });

    this.connectivityMapService.currentSelectedProductLevel
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        selectedLevel => {
          this.selectedProductLevel = selectedLevel;
          this.updateDialogMessage();
        }
      );
    this.dialogRef.disableClose = true;
    this.entityType = this.data.entityType;

    this.connectivityMapService.updateDialogOpenState(true);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  updateDialogMessage() {
    switch (this.entityType) {
      case EntityType.LabInstrument: {
        if (this.selectedInstrument === null) {
          this.messageType = this.getTranslations('TRANSLATION.INSTRUMENTMAP');
        } else {
          this.isCardClicked = true;
          this.messageType = this.getTranslations('TRANSLATION.LINKCODE');
        }
        break;
      }
      case EntityType.LabProduct: {
        if (this.selectedProduct === null) {
          this.messageType = this.getTranslations('TRANSLATION.PRODUCTMAP');
        } else {
          this.isCardClicked = true;
          this.messageType = this.getTranslations('TRANSLATION.SELECTEDPRODUCTS');
        }
        break;
      }
      case EntityType.LabTest: {
        if (this.selectedTest === null) {
          this.messageType = this.getTranslations('TRANSLATION.TESTMAP');
        } else {
          this.isCardClicked = true;
          this.messageType = this.getTranslations('TRANSLATION.SELECTEDTEST');
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  constructInstrumentMap() {
    const mapInstrumentModel: InstrumentMap = {
      documentId: this.selectedChip.documentId,
      locationId: this.selectedInstrument.locationId,
      departmentId: this.selectedInstrument.departmentId,
      entityId: this.selectedInstrument.instrumentId,
      code: this.selectedChip.code
    };

    this.mapInstrumentModel = mapInstrumentModel;
  }

  constructProductMap() {
    const mapProductModel: ProductMap = {
      code: this.selectedChip.code,
      lotNumber: this.selectedProductLevel.controlLotLevelId,
      lotLevel: this.selectedProductLevel.level,
      entityId: this.selectedProduct.productId,
      entityDetails: [{
        documentId: this.selectedChip.documentId,
      }]
    };

    this.mapProductModel = mapProductModel;
  }

  constructTestMap() {
    const mapTestModel = new TestMap();
    mapTestModel.code = this.selectedChip.code;
    mapTestModel.productId = this.selectedTest.productId;
    mapTestModel.entityId = this.selectedTest.labTestId,
      mapTestModel.entityDetails = [{
        documentId: this.selectedChip.documentId,
      }];

    this.mapTestModel = mapTestModel;
  }

  onConfirmClick(): void {
    switch (this.entityType) {
      case EntityType.LabInstrument: {
        this.constructInstrumentMap();

        this.connectivityMapService.mapInstrument(this.mapInstrumentModel).pipe(take(1))
          .subscribe(tree => {
            this.connectivityMapService.updateDocument(tree);
            this.connectivityMapService.sendAuditTrailPayload(this.mapInstrumentModel, nodeTypeNames[4],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Map, AuditTrackingActionStatus.Success);

            this.messageSnackBar.showMessageSnackBar(
              this.getTranslations('TRANSLATION.INSTRUMENTCODE')
            );
          }, error => (this.errorMessage = <any>error,
            this.connectivityMapService.sendAuditTrailPayload(this.mapInstrumentModel, nodeTypeNames[4],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Map, AuditTrackingActionStatus.Failure))
          );
        break;
      }
      case EntityType.LabProduct: {
        this.constructProductMap();
        this.connectivityMapService.currentUnmappedProdChips.pipe(take(1))
          .subscribe(unmappedProdChips => {
            const selectedChips = unmappedProdChips.filter(chip =>
              chip.code === this.selectedChip.code && chip.parentId === this.selectedChip.parentId);
            const uniqDocumentIds = [...new Set(selectedChips.map(el => String(el.documentId)))];
            const entityDetails = Object.entries(uniqDocumentIds).map(([string, chip]) => ({
              'documentId': chip
            }));
            this.mapProductModel.entityDetails = entityDetails;
          });

        this.connectivityMapService.mapProduct(this.mapProductModel).pipe(take(1))
          .subscribe(tree => {
            this.connectivityMapService.updateDocument(tree);
            this.connectivityMapService.sendAuditTrailPayload(this.mapProductModel, nodeTypeNames[5],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Map, AuditTrackingActionStatus.Success);

            this.messageSnackBar.showMessageSnackBar(
              this.getTranslations('TRANSLATION.PRODUCTCODE')
            );
          }, error => (this.errorMessage = <any>error,
            this.connectivityMapService.sendAuditTrailPayload(this.mapProductModel, nodeTypeNames[5],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Map, AuditTrackingActionStatus.Failure))
          );
        break;
      }
      case EntityType.LabTest: {
        this.constructTestMap();
        this.connectivityMapService.currentUnmappedTestChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(unmappedTestChips => {
            const selectedChips = unmappedTestChips.filter(chip =>
              chip.code === this.selectedChip.code && chip.parentId === this.selectedChip.parentId);
            const uniqDocumentIds = [...new Set(selectedChips.map(el => String(el.documentId)))];
            const entityDetails = Object.entries(uniqDocumentIds).map(([string, chip]) => ({
              'documentId': chip
            }));
            this.mapTestModel.entityDetails = entityDetails;
          }
          );

        const selectedTest = this.selectedTest;
        const selectedChip = this.selectedChip;
        this.labConfigurationApiService.getTests(this.data.labLocationId, null, this.selectedTest.labTestId, false)
          .pipe(filter(analytes => !!analytes), take(1))
          .subscribe((analytes: Array<LabLotTest>) => {
            this.mapTestModel.isSlideGen = analytes[0].isMicroslide && selectedChip.reagentLotCodes?.length <= 0;
            this.maptest(selectedTest, selectedChip);
          });
        break;
      }
      default: {
        this.messageSnackBar.showMessageSnackBar(this.getTranslations('TRANSLATION.INVALID'));
        break;
      }
    }

    this.isCardClicked = false;
    this.connectivityMapService.clearSelectionStates();
  }

  public maptest(selectedTest: TestCard, selectedChip: Chip) {
    const dialogData = new ReagentCalibratorDialogData(
      selectedTest,
      selectedChip
    );
    if (
      this.reagentCalibratorDialogService.lotCodesExist(
        selectedChip.calibratorLotCodes,
        selectedChip.reagentLotCodes
      )
    ) {
      this.reagentCalibratorDialog
        .open(ReagentCalibratorDialogComponent, {
          height: 'auto',
          width: '430px',
          data: dialogData,
          disableClose: true
        })
        .afterClosed()
        .subscribe(result => {
          this.mapTestModel.calibratorLotCode = result.calibratorLotCode;
          this.mapTestModel.calibratorLotId =
            result.selectedCalibratorLotId;
          this.mapTestModel.reagentLots = result.selectedReagentLotId;
          this.selectedChip = dialogData.chip;
          this.mapTestBasedOnCurrentDataAndShowNotification();
        });
    } else {
      this.selectedChip = dialogData.chip;
      this.mapTestBasedOnCurrentDataAndShowNotification();
    }

  }

  onCancelClick(): void {
    this.connectivityMapService.clearSelectionStates();
  }

  mapTestBasedOnCurrentDataAndShowNotification(): void {
    this.connectivityMapService.mapTest(this.mapTestModel).pipe(take(1))
      .subscribe(tree => {
        this.connectivityMapService.updateDocument(tree);
        this.connectivityMapService.sendAuditTrailPayload(this.mapTestModel, nodeTypeNames[6],
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Map, AuditTrackingActionStatus.Success);

        this.messageSnackBar.showMessageSnackBar(
          this.getTranslations('TRANSLATION.TESTCODE')
        );
      }, error => (this.errorMessage = <any>error,
        this.connectivityMapService.sendAuditTrailPayload(this.mapTestModel, nodeTypeNames[6],
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Map, AuditTrackingActionStatus.Failure))
      );
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
