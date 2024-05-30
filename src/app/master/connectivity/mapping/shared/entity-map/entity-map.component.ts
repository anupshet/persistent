// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { orderBy } from 'lodash';

import { MessageSnackBarService } from '../../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { Chip } from '../../../../../contracts/models/connectivity-map/chip.model';
import { FilterData } from '../../../../../contracts/models/connectivity-map/connectivity-map-dropdowns.model';
import { InstrumentMap } from '../../../../../contracts/models/connectivity-map/instrument-map-put.model';
import {
  InstrumentCard,
  ProductCard,
  ProductLevel,
  TestCard
} from '../../../../../contracts/models/connectivity-map/map-card.model';
import { ProductMap } from '../../../../../contracts/models/connectivity-map/product-map-put.model';
import { TestMap } from '../../../../../contracts/models/connectivity-map/test-map-put.model';
import { unRouting } from '../../../../../core/config/constants/un-routing-methods.const';
import { MappingService } from '../../mapping.service';
import { DropdownFilterComponent } from '../dropdown-filter/dropdown-filter.component';
import { HeaderService } from '../../../shared/header/header.service';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../../core/config/constants/icon.const';
import { ReagentCalibratorDialogData } from '../../../../../contracts/models/connectivity-map/reagent-calibrator-dialog-data.model';
import { ReagentCalibratorDialogService } from '../../test-map/reagent-calibrator-dialog/reagent-calibrator-dialog.service';
import { ReagentCalibratorDialogComponent } from '../../test-map/reagent-calibrator-dialog/reagent-calibrator-dialog.component';
import { LabLotTest } from '../../../shared/models/lab-lot-test.model';
import { LabConfigurationApiService } from '../../../../../shared/services/lab-configuration.service';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { Permissions } from '../../../../../security/model/permissions.model';
import { nodeTypeNames } from '../../../../../core/config/constants/general.const';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../../shared/models/audit-tracking.model';
import { ParsingInfo } from '../../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';

@Component({
  selector: 'unext-entity-map',
  templateUrl: './entity-map.component.html',
  styleUrls: ['./entity-map.component.scss']
})
export class EntityMapComponent implements OnInit, OnDestroy {
  @ViewChild(DropdownFilterComponent)
  dropdownComponent: DropdownFilterComponent;
  @Input() testChips: Chip[];
  @Input() labLocationId: string;
  @Input() configurations: ParsingInfo;
  @Output() mapReagentLots: EventEmitter<any> = new EventEmitter<any>();

  labId: string;
  entityType: EntityType;
  entityId: string;
  errorMessage: string;
  cards: Array<any>;
  filteredCards: Array<any>;
  focusedCardIndex: number;
  selectedCardIndex: number;
  focusedCodeIndex: number;
  focusedLevelIndex: number;
  focusedLevelCodeIndex: number;
  selectedLevelIndex: number;
  selectedProductLevel: number;
  selectedChip: Chip;
  dialogOpenState: boolean;

  isAllProductsScreen: boolean;
  isAllTestsScreen: boolean;

  permissions = Permissions;

  // used in the switch case in HTML
  entityTypeLabInstrument = EntityType.LabInstrument;
  entityTypeLabProduct = EntityType.LabProduct;
  entityTypeLabTest = EntityType.LabTest;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.linkChain[32]
  ];

  public destroy$ = new Subject<boolean>();
  public filterData: FilterData;

  constructor(
    public connectivityMapService: MappingService,
    public router: Router,
    public messageSnackBar: MessageSnackBarService,
    public _headerService: HeaderService,
    public location: Location,
    public reagentCalibratorDialogService: ReagentCalibratorDialogService,
    public reagentCalibratorDialog: MatDialog,
    public brPermissionsService: BrPermissionsService,
    public labConfigurationApiService: LabConfigurationApiService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.connectivityMapService.currentSelectedChip
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        selectedChip => {
          this.selectedChip = selectedChip;
        }
      );

    this.connectivityMapService.updateSelectedCardIndex(this.selectedCardIndex);
    this.connectivityMapService.currentSelectedCardIndex
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        selectedCardIndex => {
          this.selectedCardIndex = selectedCardIndex;
        }
      );

    this.connectivityMapService.currentDialogOpenState
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        dialogOpenState => {
          this.dialogOpenState = dialogOpenState;
        }
      );
  }

  public filterCardsByDropdown(filterData: FilterData): void {
    this.filterData = filterData;
    if (filterData.selectedLocationIds == null) {
      return;
    }

    this.filteredCards = this.cards;
    if (this.cards != null && this.cards.length > 0) {
      if (filterData.selectedLocationIds.length > 0) {
        this.filteredCards = this.filteredCards.filter(card =>
          filterData.selectedLocationIds.includes(card.locationId)
        );
      }
      if (filterData.selectedDepartmentIds.length > 0) {
        this.filteredCards = this.filteredCards.filter(card =>
          filterData.selectedDepartmentIds.includes(card.departmentId)
        );
      }
      if (filterData.selectedInstrumentIds.length > 0) {
        this.filteredCards = this.filteredCards.filter(card =>
          filterData.selectedInstrumentIds.includes(card.instrumentId)
        );
      }
      if (filterData.selectedProductIds.length > 0) {
        this.filteredCards = this.filteredCards.filter(card =>
          filterData.selectedProductIds.includes(card.productId)
        );
      }
      this.filteredCards = orderBy(this.filteredCards, [el => el.instrumentModelName.replace(/\s/g, '').toLocaleLowerCase()], ['asc']);
    }
  }

  private onInstrumentCardSelected(
    selectedInstrumentCard: InstrumentCard,
    cardSelectIndex: number
  ): void {
    if (this.selectedChip) {
      this.selectedCardIndex = cardSelectIndex;
      this.connectivityMapService.updateSelectedCard(selectedInstrumentCard);
    }
  }

  private mappedCodeCount(productCard: ProductCard) {
    let count = 0;
    productCard.productLevels.forEach(productLevel => {
      count += productLevel.codes.length;
    });
    return count;
  }

  private onProductLevelSelected(
    selectedCard: ProductCard,
    level: number,
    selectedCardIndex: number
  ): void {
    const cardLevelIndex = selectedCard.productLevels.findIndex(
      p => p.level === level
    );
    const productLevel = selectedCard.productLevels[cardLevelIndex];
    this.selectedProductLevel = productLevel.level;
    this.selectedCardIndex = selectedCardIndex;
    this.selectedLevelIndex = cardLevelIndex;

    this.connectivityMapService.updateSelectedProductLevel(productLevel);
    this.connectivityMapService.updateSelectedCard(selectedCard);
  }

  private onTestCardSelected(
    selectedTestCard: TestCard,
    cardSelectIndex: number
  ): void {
    if (this.selectedChip) {
      this.selectedCardIndex = cardSelectIndex;
      this.connectivityMapService.updateSelectedCard(selectedTestCard);
    }
  }

  private openChildEntity(cardIndex: number): void {
    this.connectivityMapService.clearSelectionStates();
    const selectedCard = this.filteredCards[cardIndex];

    const labSegment = unRouting.connectivity.labs.replace(':id', this.labId);
    const prefix = `/${unRouting.connectivity.connectivity}/${labSegment}/${unRouting.connectivity.mapping
      }`;

    switch (this.entityType) {
      case EntityType.LabInstrument:
        if (!selectedCard.codes || selectedCard.codes.length === 0) {
          return;
        }
        this.location.go(
          this.router.createUrlTree([`/${prefix}/${this.filteredCards[cardIndex].instrumentId}/product`]).toString()
        );
        this.entityId = (this.filteredCards && this.filteredCards[cardIndex]) ? this.filteredCards[cardIndex].instrumentId : null;
        this.connectivityMapService.updateEntityId(this.entityId);
        this._headerService.setDialogComponentMapping('product');
        break;
      case EntityType.LabProduct:
        if (selectedCard.productLevels.filter(l => l.codes.length > 0).length === 0) {
          return;
        }
        this.location.go(
          this.router.createUrlTree([`${prefix}/${this.filteredCards[cardIndex].productId}/test`]).toString()
        );
        this.entityId = (this.filteredCards && this.filteredCards[cardIndex]) ? this.filteredCards[cardIndex].productId : null;
        this.connectivityMapService.updateEntityId(this.entityId);
        this._headerService.setDialogComponentMapping('test');
        break;
      case EntityType.LabTest:
        break;
      default:
        break;
    }
  }

  private unmap(card: any, codeIndex?: number, level?: ProductLevel): void {
    codeIndex = codeIndex || 0;
    if (this.hasPermissionToAccess([Permissions.ConnectivityMapping])) {
      switch (this.entityType) {
        case EntityType.LabInstrument: {
          this.unmapInstrument(card, codeIndex);
          break;
        }
        case EntityType.LabProduct: {
          this.unmapProduct(card, codeIndex, level);
          break;
        }
        case EntityType.LabTest: {
          this.unmapTest(card, codeIndex);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private unmapInstrument(selectedCard: InstrumentCard, codeIndex = 0): void {
    const mapInstrument: InstrumentMap = {
      locationId: selectedCard.locationId,
      departmentId: selectedCard.departmentId,
      documentId: selectedCard.codes[codeIndex].documentId,
      code: selectedCard.codes[codeIndex].code,
      entityId: selectedCard.instrumentId
    };
    this.connectivityMapService.unmapInstrument(mapInstrument).pipe(takeUntil(this.destroy$))
      .subscribe(tree => {
        this.connectivityMapService.updateUnlinkedCodes(selectedCard.codes[codeIndex].code);
        this.connectivityMapService.updateDocument(tree);

        this.connectivityMapService.sendAuditTrailPayload(mapInstrument, nodeTypeNames[4],
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Unmap, AuditTrackingActionStatus.Success);

        this.messageSnackBar.showMessageSnackBar(
          this.getTranslations('TRANSLATION.INSTRUMENTCODEUNLINKED')
        );
      },
        error => (this.errorMessage = <any>error,
          this.connectivityMapService.sendAuditTrailPayload(mapInstrument, nodeTypeNames[4],
            AuditTrackingEvent.FileUpload, AuditTrackingAction.Unmap, AuditTrackingActionStatus.Failure)
        )
      );
  }

  public constructProductUnmap(selectedCard: ProductCard, codeIndex: number, selectedLevel: ProductLevel) {
    const mapProduct: ProductMap = {
      code: selectedLevel.codes[codeIndex].code,
      lotNumber: selectedLevel.controlLotLevelId,
      lotLevel: selectedLevel.level,
      entityId: selectedCard.productId,
      entityDetails: [{
        documentId: selectedLevel.codes[codeIndex].documentId,

      }]
    };
    this.connectivityMapService.currentMappedProdChips.pipe(take(1))
      .subscribe((mappedProdChips: Array<Chip>) => {
        const chipsToUnmap = [];
        mappedProdChips.forEach((el, i) => {
          mappedProdChips.forEach((element, index) => {
            if (i === index) { return null; }
            if (selectedLevel.codes[codeIndex].code === element.code) {
              if (element.code === el.code && element.parentId === el.parentId) {
                if (!chipsToUnmap.includes(el)) { chipsToUnmap.push(el); }
              }
            }
          });
        });
        const uniqDocumentIds = [...new Set(chipsToUnmap.map(el => String(el.documentId)))];
        const entityDetails = Object.entries(uniqDocumentIds).map(([string, chip]) => ({
          'documentId': chip
        }));
        mapProduct.entityDetails = chipsToUnmap.length > 0 ? entityDetails : mapProduct.entityDetails;
      }
      );
    return mapProduct;
  }

  public constructTestUnmap(selectedCard: TestCard, codeIndex = 0) {
    const mapTest: TestMap = {
      code: selectedCard.codes[codeIndex].code,
      productId: selectedCard.productId,
      calibratorLotCode: null,
      calibratorLotId: null,
      reagentLots: null,
      isSlideGen: false,
      entityId: selectedCard.labTestId,
      entityDetails: [{
        documentId: selectedCard.codes[codeIndex].documentId,
      }]
    };
    this.connectivityMapService.currentMappedTestChips.pipe(take(1))
      .subscribe((mappedTestChips: Array<Chip>) => {
        const chipsToUnmap = [];
        mappedTestChips.forEach((el, i) => {
          mappedTestChips.forEach((element, index) => {
            if (i === index) { return null; }
            if (selectedCard.codes[codeIndex].code === element.code) {
              if (element.code === el.code && element.parentId === el.parentId) {
                if (!chipsToUnmap.includes(el)) { chipsToUnmap.push(el); }
              }
            }
          });
        });
        const uniqDocumentIds = [...new Set(chipsToUnmap.map(el => String(el.documentId)))];
        const entityDetails = Object.entries(uniqDocumentIds).map(([string, chip]) => ({
          'documentId': chip
        }));
        mapTest.entityDetails = chipsToUnmap.length > 0 ? entityDetails : mapTest.entityDetails;
      }
      );
    return mapTest;
  }

  private unmapProduct(
    selectedCard: ProductCard,
    codeIndex: number,
    selectedLevel: ProductLevel
  ): void {
    const mapProduct = this.constructProductUnmap(selectedCard, codeIndex, selectedLevel);
    this.connectivityMapService.unmapProduct(mapProduct).pipe(takeUntil(this.destroy$))
      .subscribe(tree => {
        this.connectivityMapService.updateUnlinkedCodes(selectedLevel.codes[codeIndex].code);
        this.connectivityMapService.updateDocument(tree);

        this.connectivityMapService.sendAuditTrailPayload(mapProduct, nodeTypeNames[5],
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Unmap, AuditTrackingActionStatus.Success);

        this.messageSnackBar.showMessageSnackBar(
          this.getTranslations('TRANSLATION.PRODUCTCODEUNLINKED')
        );
      }, error => (this.errorMessage = <any>error,
        this.connectivityMapService.sendAuditTrailPayload(mapProduct, nodeTypeNames[5],
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Unmap, AuditTrackingActionStatus.Failure)
      )
      );
  }

  private unmapTest(selectedCard: TestCard, codeIndex = 0): void {
    const mapTest = this.constructTestUnmap(selectedCard, codeIndex);
    this.connectivityMapService.unmapTest(mapTest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tree => {
        this.connectivityMapService.updateUnlinkedCodes(selectedCard.codes[codeIndex].code);
        // if code is unlinked, remove associated calibrator/reagent lot codes too
        this.connectivityMapService.unlinkLotCodes(selectedCard);
        this.connectivityMapService.updateDocument(tree);

        this.connectivityMapService.sendAuditTrailPayload(mapTest, nodeTypeNames[6],
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Unmap, AuditTrackingActionStatus.Success);

        this.messageSnackBar.showMessageSnackBar(
          this.getTranslations('TRANSLATION.TESTCODEUNLINKED')
        );
      }, error => (this.errorMessage = <any>error,
        this.connectivityMapService.sendAuditTrailPayload(mapTest, nodeTypeNames[6],
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Unmap, AuditTrackingActionStatus.Failure)
      )
      );
  }

  private getTestCodeCountText(testCard: TestCard): string {
    const count = this.getTotalNumberOfCodes(testCard);
    if (count > 0) {
      return `(+ ${count.toString()} ${this.getTranslations('TRANSLATION.MORE')})`;
    }
  }

  openReagentCalibratorDialog(selectedCard: TestCard) {
    // Support mapping of multiple slidegen codes for same test chip
    let isMicroslideAnalyte = false;
    selectedCard.codes.forEach(code => {
      this.selectedChip = this.testChips.find(el => el.code === code.code && el.documentId === code.documentId);
    });

    // Find ids with null values and pass on to dialogData before opening the dialog
    this.selectedChip.reagentLotCodes = selectedCard.linkedReagentLotCodes.filter(el => el.id === null);

    isMicroslideAnalyte = this.checkMicroSlideAnalyte(selectedCard.labTestId);

    const dialogData = new ReagentCalibratorDialogData(
      selectedCard,
      this.selectedChip
    );

    this.reagentCalibratorDialog
      .open(ReagentCalibratorDialogComponent, {
        height: 'auto',
        width: '430px',
        data: dialogData,
        disableClose: true
      })
      .afterClosed()
      .subscribe(result => {
        const mapTestModel = new TestMap();
        mapTestModel.calibratorLotCode = result.calibratorLotCode;
        mapTestModel.calibratorLotId = result.selectedCalibratorLotId;
        mapTestModel.reagentLots = result.selectedReagentLotId;
        mapTestModel.entityId = selectedCard.labTestId,  // ensure entityId is sent to the reagentDialog
          mapTestModel.entityDetails = [{
            documentId: this.selectedChip.documentId,
          }];
        mapTestModel.productId = selectedCard.productId;
        mapTestModel.code = this.selectedChip.code;
        mapTestModel.isSlideGen = isMicroslideAnalyte && selectedCard.reagentLots?.length <= 0;
        this.mapTestBasedOnCurrentDataAndShowNotification(mapTestModel);
      });
  }

  mapTestBasedOnCurrentDataAndShowNotification(mapTestModel: TestMap): void {
    this.connectivityMapService.mapTest(mapTestModel).pipe(take(1)).subscribe(
      trees => {
        this.connectivityMapService.updateDocument(trees);
        this.messageSnackBar.showMessageSnackBar(
          this.getTranslations('TRANSLATION.TESTCODE')
        );
      },
      error => (this.errorMessage = <any>error)
    );
  }

  public checkMicroSlideAnalyte(selectedTestId: string) {
    let isMicroslide = false;
    this.labConfigurationApiService.getTests(this.labLocationId, null, selectedTestId, false)
      .pipe(filter(analytes => !!analytes), take(1))
      .subscribe((analytes: Array<LabLotTest>) => {
        isMicroslide = analytes[0].isMicroslide;
      });
    return isMicroslide;
  }

  private getUnmappedReagentLotCount(testCard: TestCard) {
    let count: number;
    if (testCard && this.arrayIsNotEmpty(testCard.linkedReagentLotCodes)) {
      count = testCard.linkedReagentLotCodes.filter((el) => el.id === null).length;
    }
    return count;
  }

  private getFirstCalibratorLotCode(testCard: TestCard): string {
    let lotCode = '';
    if (testCard && this.arrayIsNotEmpty(testCard.linkedCalibratorLotCodes)) {
      lotCode = testCard.linkedCalibratorLotCodes[0].code;
    }
    return lotCode;
  }

  private onlyTestCodeMapped(testCard: TestCard): boolean {
    return (
      testCard &&
      testCard.codes?.length &&
      !this.arrayIsNotEmpty(testCard.linkedCalibratorLotCodes) &&
      !this.arrayIsNotEmpty(testCard.linkedReagentLotCodes)
    );
  }

  private getTotalNumberOfCodes(testCard: TestCard): number {
    let count = 0;
    if (this.arrayIsNotEmpty(testCard.linkedCalibratorLotCodes)) {
      count += testCard.linkedCalibratorLotCodes.length;
    }
    if (this.arrayIsNotEmpty(testCard.linkedReagentLotCodes)) {
      count += testCard.linkedReagentLotCodes.length;
    }
    return count;
  }

  private arrayIsNotEmpty(array: Array<any>): boolean {
    return Array.isArray(array) && array.length > 0;
  }

  private productCardHasCode(productCard: ProductCard): boolean {
    const levelsWithCode = productCard.productLevels.filter(
      lv => lv.codes?.length && lv.codes?.length > 0
    ).length;
    if (levelsWithCode > 0) {
      return true;
    } else {
      return false;
    }
  }

  private testCardHasCode(testCard: TestCard): boolean {
    return this.getTotalNumberOfCodes(testCard) > 0;
  }

  private closeDialog(): void {
    this.connectivityMapService.closeLinkDialog.next();
  }

  /* checking Permissions */
  public hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  private getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
