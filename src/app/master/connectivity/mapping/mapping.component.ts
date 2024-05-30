// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { combineLatest as observableCombineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { hierarchy } from 'd3-hierarchy';
import { cloneDeep } from 'lodash';

import { HeaderService } from '../shared/header/header.service';
import { Chip } from '../../../contracts/models/connectivity-map/chip.model';
import { Codes, ConnectivityMapTree, Product } from '../../../contracts/models/connectivity-map/connectivity-map-tree.model';
import { InstrumentMap } from '../../../contracts/models/connectivity-map/instrument-map-put.model';
import { InstrumentCard, ProductCard, TestCard } from '../../../contracts/models/connectivity-map/map-card.model';
import { ChildNavigationEntity, NavigationEntity, TestNavigationEntity } from '../../../contracts/models/connectivity-map/navigation-entity.model';
import { ProductMap } from '../../../contracts/models/connectivity-map/product-map-put.model';
import { TestMap } from '../../../contracts/models/connectivity-map/test-map-put.model';
import { MappingService } from './mapping.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import * as fromRoot from '../../../state/app.state';
import * as selectors from '../../../shared/navigation/state/selectors';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import * as fromNavActions from '../../../shared/navigation/state/actions/nav-bar-action';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { blankSpace, componentInfo, Operations } from '../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { TreePill } from '../../../contracts/models/lab-setup';
import { ParsingInfo } from '../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';

@Component({
  selector: 'unext-connectivity-map',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit, OnDestroy {
  @Input() accountId: string;
  @Input() labLocationId: string;
  @Input() configurations: ParsingInfo;
  trees: Array<ConnectivityMapTree>;

  errorMessage: string;

  mappedInstrumentIds: Array<string>;
  mappedProductIds: Array<string>;

  instrumentChips: Array<Chip>;
  productChips: Array<Chip>;
  testChips: Array<Chip>;

  instrumentCards: Array<InstrumentCard>;
  productCards: Array<ProductCard>;
  testCards: Array<TestCard>;

  instrumentNav: NavigationEntity;
  productNav: NavigationEntity;
  testNav: TestNavigationEntity;

  mappedInstrumentChips: Array<Chip>;
  mappedProductChips: Array<Chip>;
  mappedTestChips: Array<Chip>;

  private destroy$ = new Subject<boolean>();

  renderInstrumentMap: boolean;
  renderProductMap: boolean;
  renderTestMap: boolean;

  public getConnectivityState$ = this.store.pipe(ngrxStore.select(selectors.getNavigationState));
  public allProductCodes: Array<any>;
  public allTestCodes: Array<any>;
  public allInstCodes: Array<any>;

  permissions = Permissions;

  constructor(
    private connectivityMapService: MappingService,
    private messageSnackBar: MessageSnackBarService,
    private _headerService: HeaderService,
    private brPermissionsService: BrPermissionsService,
    private store: ngrxStore.Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.chooseComponent('instrument');

    this._headerService.getDialogComponentMapping()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.chooseComponent(res.componentName);
      });

    this.connectivityMapService.resetData(this.labLocationId);

    this.connectivityMapService.getFullTree(EntityType.LabLocation, this.labLocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fullTree: TreePill) => {
        const filteredFullTree = cloneDeep(fullTree);
        filteredFullTree.children = fullTree.children;
        const hierarchyNode = hierarchy(filteredFullTree);
        this.store.dispatch(fromNavActions.updateConnectivityTreeState({ connectivityFullTree: hierarchyNode }));
      });

    this.connectivityMapService.createConnectivityMapTrees(this.labLocationId);
    this.connectivityMapService.createCardAndDropdownLabData();

    this.connectivityMapService.currentConnectivityMapTrees
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        this.updateConnectivityMapTrees
      );

    this.connectivityMapService.currentMapCardsData
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        this.updateConnectivityMapData
      );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.connectivityMapService.clearSelectionStates();
  }

  reset() {
    this.renderInstrumentMap = false;
    this.renderProductMap = false;
    this.renderTestMap = false;
  }

  chooseComponent(path) {

    this.reset();

    if (path === 'instrument') {
      this.renderInstrumentMap = true;
    } else if (path === 'product') {
      this.renderProductMap = true;
    } else if (path === 'test') {
      this.renderTestMap = true;
    }
  }

  private updateConnectivityMapTrees = trees => {
    if (trees != null) {
      this.trees = trees;
      this.extractChips(trees);
      this.processConnectivityMapData();

      this.connectivityMapService.triggerDataRefresh.next();
    }
  }

  private updateConnectivityMapData = cards => {
    if (cards != null) {
      this.instrumentCards = cards.instrumentCards;
      this.productCards = cards.productCards;
      this.testCards = cards.testCards;
      this.processConnectivityMapData();
    }
  }

  private extractChips(trees: ConnectivityMapTree[]): void {
    this.instrumentChips = new Array<Chip>();
    this.productChips = new Array<Chip>();
    this.testChips = new Array<Chip>();

    this.extractInstrumentChips(trees);

    this.mappedInstrumentChips = this.instrumentChips.filter(
      chip => chip.entityId != null
    );
    this.mappedProductChips = this.productChips.filter(
      chip => chip.entityId != null
    );
    this.mappedTestChips = this.testChips.filter(chip => chip.entityId != null);

    const unmappedInstrumentChips = this.instrumentChips.filter(
      chip => chip.entityId == null
    );

    const unmappedProductChips = this.productChips.filter(
      chip => chip.entityId == null
    );

    const unmappedTestChips = this.testChips.filter(
      chip => chip.entityId == null
    );

    this.connectivityMapService.updateInstrumentUnmappedChips(
      unmappedInstrumentChips
    );
    this.connectivityMapService.updateProductUnmappedChips(
      unmappedProductChips
    );
    this.connectivityMapService.updateTestUnmappedChips(unmappedTestChips);

    this.connectivityMapService.updateProductMappedChips(this.mappedProductChips);
    this.connectivityMapService.updateTestMappedChips(this.mappedTestChips);
  }

  private extractInstrumentChips(trees: Array<ConnectivityMapTree>): void {
    trees.forEach(instrument => {
      instrument.codes.forEach(instrumentCode => {
        const instrumentChip: Chip = {
          documentId: instrument.id,
          entityId: instrument.instrumentId,
          parentId: instrument.departmentId,
          levelId: null,
          code: instrumentCode.code,
          disabled: instrumentCode.disabled,
          id: instrumentCode.id,
          parsingJobConfigId: instrumentCode.parsingJobConfigId,
          calibratorLotCodes: null,
          reagentLotCodes: null
        };
        this.instrumentChips.push(instrumentChip);
      });

      if (instrument.instrumentId && instrument.product) {
        this.extractProductChips(instrument);
      }
    });
  }

  private extractProductChips(instrument: ConnectivityMapTree): void {
    instrument.product.forEach(product => {
      product.levelCodes.forEach(productLevels => {
        productLevels.codes.forEach(productCode => {
          const productChip: Chip = {
            documentId: instrument.id,
            entityId: product.id,
            parentId: instrument.instrumentId,
            levelId: productLevels.id,
            lotLevel: productLevels.lotLevel,
            code: productCode.code,
            disabled: productCode.disabled,
            id: productCode.id,
            parsingJobConfigId: null,
            calibratorLotCodes: null,
            reagentLotCodes: null
          };
          this.productChips.push(productChip);
        });
      });

      if (product.id) {
        this.extractTestChips(instrument, product);
      }
    });
  }

  private extractTestChips(
    instrument: ConnectivityMapTree,
    product: any
  ): void {
    const testCodes = new Array<string>();
    product.levelCodes.forEach(level => {
      if (level.test) {
        level.test.forEach(test => {
          const testChip = new Chip();
          testChip.documentId = instrument.id;
          testChip.entityId = test.id;
          testChip.parentId = product.id;
          testChip.levelId = null;
          testChip.reagentLotCodes = new Array<Codes>();
          testChip.calibratorLotCodes = new Array<Codes>();
          // get test code(s)
          test.codes.forEach(testCode => {
            testChip.code = testCode.code;
            testChip.disabled = testCode.disabled;
            if (!testCodes.includes(testCode)) {
              testCodes.push(testCode);
            }
          });
          // get calibrator lot code(s)
          if (test.calibratorLot != null) {
            test.calibratorLot.forEach(calibratorLot => {
              calibratorLot.codes.forEach(calLotCode => {
                testChip.calibratorLotCodes.push(calLotCode);
                if (!testCodes.includes(calLotCode)) {
                  testCodes.push(calLotCode);
                }
              });
            });
          }
          // get reagent lot code(s)

          if (test.reagentLot != null) {
            test.reagentLot.forEach(reagentLot => {
              reagentLot.codes.forEach(reagentLotCode => {
                reagentLotCode.id = reagentLot.id;
                testChip.reagentLotCodes.push(reagentLotCode);
                if (!testCodes.includes(reagentLotCode)) {
                  testCodes.push(reagentLotCode);
                }
              });
            });
          }

          // prevent duplicate chips
          let duplicateExists = false;
          this.testChips.forEach(appliedTestChip => {
            if (
              appliedTestChip.code === testChip.code &&
              appliedTestChip.parentId === testChip.parentId &&
              appliedTestChip.documentId === testChip.documentId) {
              duplicateExists = true;
            }
          });

          if (!duplicateExists) {
            this.testChips.push(testChip);
          }
        });
      }
    });
  }

  public processConnectivityMapData(): void {
    if (
      this.trees == null ||
      this.instrumentCards == null ||
      this.productCards == null ||
      this.testCards == null
    ) {
      return;
    }

    if (!this.checkMappingStatus()) {
      return;
    }

    this.extractNavigationEntities(this.trees);
    this.clearCards();
    this.mapBadgeCountsToCards();
    this.mapCodesToCards();

    this.updateCards(this.instrumentCards, this.productCards, this.testCards);

    this.updateNavigations(this.instrumentNav, this.productNav, this.testNav);

    this.testNav.unmappedLotCount = 0;
    this.testCards.forEach(card => {
      if (card && Array.isArray(card.linkedReagentLotCodes)) {
        this.testNav.unmappedLotCount += card.linkedReagentLotCodes.filter((el) => el.id === null).length;
      }
    }
    );
  }

  private clearCards(): void {
    this.instrumentCards.forEach(card => {
      card.codes = [];
      card.badgeCount = 0;
    });
    this.productCards.forEach(card => {
      if (card.productLevels != null) {
        card.productLevels.forEach(lv => {
          lv.codes = [];
        });
        card.badgeCount = 0;
      }
    });
    this.testCards.forEach(card => {
      card.codes = [];
    });
  }

  private mapBadgeCountsToCards(): void {
    this.productNav.children.forEach(inst => {
      this.instrumentCards.find(
        card => card.instrumentId === inst.entityId
      ).badgeCount += inst.unmappedCount;
    });

    this.testNav.children.forEach(prod => {
      this.productCards.find(
        card => card.productId === prod.entityId
      ).badgeCount += prod.unmappedCount;
    });
  }

  private checkMappingStatus(): boolean {
    let isTestMappable = true;
    for (let i = 0; i < this.mappedTestChips.length; i++) {
      const testChip = this.mappedTestChips[i];
      isTestMappable = this.checkTestMap(testChip);
      if (!isTestMappable) {
        return false;
      }
    }

    let isProductMappable = true;
    for (let i = 0; i < this.mappedProductChips.length; i++) {
      const productChip = this.mappedProductChips[i];
      isProductMappable = this.checkProductMap(productChip);
      if (!isProductMappable) {
        return false;
      }
    }

    let isInstrumentMappable = true;
    for (let i = 0; i < this.mappedInstrumentChips.length; i++) {
      const instrumentChip = this.mappedInstrumentChips[i];
      isInstrumentMappable = this.checkInstrumentMap(instrumentChip);
      if (!isInstrumentMappable) {
        return false;
      }
    }

    return isInstrumentMappable && isProductMappable && isTestMappable;
  }

  private checkInstrumentMap(instrumentChip: Chip): boolean {
    const index = this.instrumentCards.findIndex(
      card => card.instrumentId === instrumentChip.entityId
    );

    if (index === -1 && this.hasPermissionToAccess([Permissions.ConnectivityMapping])) {
      this.unmapInstrument(instrumentChip);
      return false;
    }
    return true;
  }

  private checkProductMap(productChip: Chip): boolean {
    const productIndex = this.productCards.findIndex(
      card => card.productId === productChip.entityId
    );

    if (productIndex === -1 && this.hasPermissionToAccess([Permissions.ConnectivityMapping])) {
      this.unmapProduct(productChip);
      return false;
    }

    const levelIndex = this.productCards[productIndex].productLevels.findIndex(
      level => +level.controlLotLevelId === +productChip.levelId
    );

    if (levelIndex === -1 && this.hasPermissionToAccess([Permissions.ConnectivityMapping])) {
      this.unmapProduct(productChip);
      return false;
    }

    return true;
  }

  private checkTestMap(testChip: Chip): boolean {
    const index = this.testCards.findIndex(
      card => card.labTestId === testChip.entityId
    );

    if (index === -1 && this.hasPermissionToAccess([Permissions.ConnectivityMapping])) {
      this.unmapTest(testChip);
      return false;
    }
    return true;
  }

  private mapCodesToCards(): void {
    this.mappedInstrumentIds = new Array<string>();
    this.mappedProductIds = new Array<string>();

    this.mappedInstrumentChips.forEach(instrumentChip => {
      this.mapIntrumentCodesToInstrumentCards(instrumentChip);
    });

    this.mappedProductChips.forEach(productChip => {
      this.mapProductCodesToProductCards(productChip);
    });

    this.mappedTestChips.forEach(testChip => {
      this.mapTestCodesToTestChips(testChip);
    });

    this.connectivityMapService.updateMappedInstrumentIds(
      this.mappedInstrumentIds
    );
    this.connectivityMapService.updateMappedProductIds(this.mappedProductIds);
  }

  private mapIntrumentCodesToInstrumentCards(instrumentChip: Chip): void {
    const index = this.instrumentCards.findIndex(
      card => card.instrumentId === instrumentChip.entityId
    );

    if (index !== null && index !== -1) {
      const code = {
        code: instrumentChip.code,
        documentId: instrumentChip.documentId
      };
      this.instrumentCards[index].codes.push(code);

      this.mappedInstrumentIds.push(instrumentChip.entityId);
    }
  }

  private mapProductCodesToProductCards(productChip: Chip): void {
    const index = this.productCards.findIndex(
      card => card.productId === productChip.entityId && card.instrumentId === productChip.parentId
    );

    if (index !== null && index !== -1) {
      const code = {
        code: productChip.code,
        documentId: productChip.documentId
      };
      const productCard = this.productCards[index];

      const levelIndex = productCard?.productLevels?.findIndex(
        level => +level.controlLotLevelId === +productChip.levelId
      );

      if (levelIndex != null) {
        productCard?.productLevels[levelIndex]?.codes?.push(code);

        if (!this.mappedProductIds.includes(productChip.entityId)) {
          this.mappedProductIds.push(productChip.entityId);
        }
      }
    }
  }

  private mapTestCodesToTestChips(testChip: Chip): void {
    const index = this.testCards.findIndex(
      card => card.labTestId === testChip.entityId && card.productId === testChip.parentId
    );

    if (index !== null && index !== -1) {
      const code = {
        code: testChip.code,
        documentId: testChip.documentId
      };
      this.testCards[index].codes.push(code);
      this.testCards[index].linkedCalibratorLotCodes = testChip.calibratorLotCodes;
      this.testCards[index].linkedReagentLotCodes = testChip.reagentLotCodes;
    }
  }

  private extractNavigationEntities(trees: Array<ConnectivityMapTree>): void {
    this.instrumentNav = new NavigationEntity();
    this.productNav = new NavigationEntity();
    this.productNav.children = new Array<ChildNavigationEntity>();
    this.testNav = new TestNavigationEntity();
    this.testNav.children = new Array<ChildNavigationEntity>();
    this.instrumentNav.unmappedCount = 0;
    this.productNav.unmappedCount = 0;
    this.testNav.unmappedCount = 0;

    this.clearHelperArrays();

    this.extractInstrumentNavigation(trees);

    this.productNav.children.sort((child1, child2) =>
      this.sortNavigationChildAlphabetically(child1, child2)
    );
    this.testNav.children.sort((child1, child2) =>
      this.sortNavigationChildAlphabetically(child1, child2)
    );

    this.clearHelperArrays();
  }

  private clearHelperArrays() {
    // those lists are here to help parse the tree structure and used to avoid duplicates.
    // Better to reset one tree is parsed.
    this.allProductCodes = [];
    this.allTestCodes = [];
    this.allInstCodes = [];
  }

  private extractInstrumentNavigation(trees: Array<ConnectivityMapTree>): void {
    trees.forEach(instrument => {
      instrument.codes.forEach(code => {
        if (!instrument.instrumentId) {
          this.allInstCodes.push({ code: code.code });
          if (code.disabled === false) {
            this.instrumentNav.unmappedCount += instrument.codes.length;
          }
        }
      });

      if (instrument.instrumentId) {
        const prodNavChild = this.extractProductNavigation(instrument);

        if (prodNavChild.unmappedCount > 0) {
          this.productNav.unmappedCount += prodNavChild.unmappedCount;
          const index = this.productNav.children.findIndex((child: ChildNavigationEntity) => child.entityId === prodNavChild.entityId);
          if (index === -1) {
            this.productNav.children.push(prodNavChild);
          } else {
            this.productNav.children[index].unmappedCount += prodNavChild.unmappedCount;
          }
        }
      }
    });
  }

  private extractProductNavigation(
    instrument: ConnectivityMapTree
  ): ChildNavigationEntity {
    const prodNavChild = this.getProductNavChild(instrument.instrumentId);
    if (instrument.product) {
      instrument.product.forEach(product => {
        product.levelCodes.forEach(level => {
          level.codes.forEach(code => {
            if (!product.id) {
              if (!this.allProductCodes.some(_code => _code.instrumentId === instrument.instrumentId && _code.code === code.code)) {
                this.allProductCodes.push({ code: code.code, instrumentId: instrument.instrumentId });
                if (code.disabled === false) {
                  prodNavChild.unmappedCount += level.codes.length;
                }
              }
            }
          });
        });

        if (product.id) {
          const testNavChild = this.extractTestNavigation(product);

          if (testNavChild.unmappedCount > 0) {
            this.testNav.unmappedCount += testNavChild.unmappedCount;
            const index = this.testNav.children.findIndex((child: ChildNavigationEntity) => child.entityId === testNavChild.entityId);
            if (index === -1) {
              this.testNav.children.push(testNavChild);
            } else {
              this.testNav.children[index].unmappedCount += testNavChild.unmappedCount;
            }
          }
        }
      });
    }

    return prodNavChild;
  }

  private extractTestNavigation(product: Product): ChildNavigationEntity {
    const testNavChild = this.getTestNavChild(product.id);

    const codesSet = new Set<string>();

    product.levelCodes.forEach(level => {
      if (level.test) {
        level.test.forEach(test => {
          test.codes.forEach(code => {
            if (!test.id) {
              const availableCodes = test.codes.filter(item => item.code.length > 0);
              availableCodes.forEach(item => {
                if (!this.allTestCodes.some(_code => _code.productId === product.id && _code.code === code.code)) {
                  this.allTestCodes.push({ code: code.code, productId: product.id });
                  if (code.disabled === false) {
                    codesSet.add(item.code);
                  }
                }
              });
            }
          });
        });
      }
    });

    let codes = Array.from(codesSet);
    codes = codes.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    testNavChild.unmappedCount = codes.length;
    return testNavChild;
  }

  private sortNavigationChildAlphabetically(
    entity1: ChildNavigationEntity,
    entity2: ChildNavigationEntity
  ): number {
    if (entity1.title < entity2.title) {
      return -1;
    }
    if (entity1.title > entity2.title) {
      return 1;
    }
    return 0;
  }

  private getProductNavChild(instrumentId: string): ChildNavigationEntity {
    const instrument = this.instrumentCards.find(
      inst => inst.instrumentId === instrumentId
    );

    if (instrument == null) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, null, null,
          componentInfo.MappingComponent + blankSpace + Operations.GetProductNavigationChild + instrumentId));
    }

    const childNav: ChildNavigationEntity = {
      title: instrument.instrumentModelName || instrument.instrumentAlias,
      subTitle: `${instrument.locationName} -> ${instrument.departmentName}`,
      unmappedCount: 0,
      displayState: false,
      entityId: instrument.instrumentId
    };

    return childNav;
  }

  private getTestNavChild(productId: string): ChildNavigationEntity {
    const product = this.productCards.find(
      prod => prod.productId === productId
    );

    if (product == null) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, null, null,
          componentInfo.MappingComponent + blankSpace + Operations.GetTestNavigationChild + productId));
    }

    let levels = '';
    product.productLevels.forEach((lv, index) => {
      levels = levels.concat(this.getTranslation('TRANSLATION.LEVEL') + lv.level);
      if (index < product.productLevels.length - 1) {
        levels = levels.concat(', ');
      }
    });

    const childNav: ChildNavigationEntity = {
      title: product.productName,
      subTitle: `Lot ${product.productMasterLotNumber} | ${levels}`,
      unmappedCount: 0,
      displayState: false,
      entityId: product.productId
    };
    return childNav;
  }

  private updateCards(
    instrumentCards: Array<InstrumentCard>,
    productCards: Array<ProductCard>,
    testCards: Array<TestCard>
  ): void {
    this.connectivityMapService.updateInstrumentCards(instrumentCards);
    this.connectivityMapService.updateProductCards(productCards);
    this.connectivityMapService.updateTestCards(testCards);
  }

  private updateNavigations(
    instrumentNav: NavigationEntity,
    productNav: NavigationEntity,
    testNav: TestNavigationEntity
  ): void {
    this.connectivityMapService.updateInstrumentNavigation(instrumentNav);
    this.connectivityMapService.updateProductNavigation(productNav);
    this.connectivityMapService.updateTestNavigation(testNav);
  }

  private unmapInstrument(instrumentChip: Chip): void {
    const mapInstrument: InstrumentMap = {
      locationId: null,
      departmentId: null,
      documentId: instrumentChip.documentId,
      code: instrumentChip.code,
      entityId: instrumentChip.entityId
    };
    this.connectivityMapService
      .unmapInstrument(mapInstrument)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tree => {
        this.connectivityMapService.updateDocument(tree);
        this.messageSnackBar.showMessageSnackBar(
          this.getTranslation('TRANSLATION.INSTRUMENTCODEUNLINKED')
        );
      });
  }

  public constructProductUnmap(productChip: Chip) {
    const mapProduct: ProductMap = {
      code: productChip.code,
      lotNumber: productChip.levelId,
      lotLevel: productChip.lotLevel,
      entityId: productChip.entityId,
      entityDetails: [{
        documentId: productChip.documentId,
      }]
    };
    this.connectivityMapService.currentMappedProdChips.pipe(take(1))
      .subscribe((mappedProdChips: Array<Chip>) => {
        const chipsToUnmap = [];
        mappedProdChips.forEach((el, i) => {
          mappedProdChips.forEach((element, index) => {
            if (i === index) { return null; }
            if (element.code === productChip.code) {
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

  public constructTestUnmap(testChip: Chip) {
    const mapTest: TestMap = {
      code: testChip.code,
      productId: testChip.parentId,
      calibratorLotCode: null,
      calibratorLotId: null,
      reagentLots: null,
      isSlideGen: false,
      entityId: testChip.entityId,
      entityDetails: [{
        documentId: testChip.documentId,
      }]
    };
    this.connectivityMapService.currentMappedTestChips.pipe(take(1))
      .subscribe((mappedTestChips: Array<Chip>) => {
        const chipsToUnmap = [];
        mappedTestChips.forEach((el, i) => {
          mappedTestChips.forEach((element, index) => {
            if (i === index) { return null; }
            if (element.code === testChip.code) {
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

  private unmapProduct(productChip: Chip): void {
    const mapProduct = this.constructProductUnmap(productChip);
    this.connectivityMapService.unmapProduct(mapProduct).pipe(takeUntil(this.destroy$))
      .subscribe(tree => {
        this.connectivityMapService.updateDocument(tree);
        this.messageSnackBar.showMessageSnackBar(
          this.getTranslation('TRANSLATION.PRODUCTCODEUNLINKED')
        );
      });
  }

  private unmapTest(testChip: Chip): void {
    const mapTest = this.constructTestUnmap(testChip);
    this.connectivityMapService.unmapTest(mapTest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tree => {
        // TODO: if code is unlinked, remove associated calibrator/reagent lot codes too
        this.connectivityMapService.updateDocument(tree);
        this.messageSnackBar.showMessageSnackBar(
          this.getTranslation('TRANSLATION.TESTCODEUNLINKED')
        );
      });
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
