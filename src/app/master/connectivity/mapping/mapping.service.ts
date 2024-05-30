// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { Chip } from '../../../contracts/models/connectivity-map/chip.model';
import {
  ConnectivityMapDropdowns,
  DropdownContents,
} from '../../../contracts/models/connectivity-map/connectivity-map-dropdowns.model';
import {
  ConnectivityMapCards,
  ConnectivityMapLabData,
} from '../../../contracts/models/connectivity-map/connectivity-map-lab.model';
import { ConnectivityMapTree } from '../../../contracts/models/connectivity-map/connectivity-map-tree.model';
import { InstrumentMap } from '../../../contracts/models/connectivity-map/instrument-map-put.model';
import {
  InstrumentCard,
  ProductCard,
  ProductLevel,
  TestCard,
} from '../../../contracts/models/connectivity-map/map-card.model';
import { NavigationEntity, TestNavigationEntity } from '../../../contracts/models/connectivity-map/navigation-entity.model';
import { ProductMap } from '../../../contracts/models/connectivity-map/product-map-put.model';
import { TestMap } from '../../../contracts/models/connectivity-map/test-map-put.model';
import { Department, LabInstrument, LabLocation, LabProduct, LabTest, TreePill } from '../../../contracts/models/lab-setup';
import { CalibratorLot } from '../../../contracts/models/lab-setup/calibrator-lot.model';
import { ReagentLot } from '../../../contracts/models/lab-setup/reagent-lot.model';
import { BaseEnableDisableDelete, ProductEnableDisableDelete, TestEnableDisableDelete } from '../../../contracts/models/connectivity-map/base-enable-disable.model';
import { unApi } from '../../../core/config/constants/un-api-methods.const';
import { urlPlaceholders } from '../../../core/config/constants/un-url-placeholder.const';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { ConnectivityMappingApiService } from '../../../shared/api/connectivityMappingApi.service';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../../shared/icons/icons.service';
import * as fromRoot from '../../../state/app.state';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';
import { ApiService } from '../../../shared/api/api.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../core/config/constants/error-logging.const';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { nodeTypeNames } from '../../../core/config/constants/general.const';
import { AppNavigationTracking } from '../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { ParsingJobConfig } from '../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';

@Injectable({ providedIn: 'root' })
export class MappingService implements OnDestroy {

  private labLocationId: string | undefined;

  private entityType = new BehaviorSubject<EntityType>(null);
  public currentEntityType = this.entityType.asObservable();

  private entityId = new BehaviorSubject<string>(null);
  public currentEntityId = this.entityId.asObservable();

  private configurationId = new BehaviorSubject<string>(null);
  public selectedConfigurationId = this.configurationId.asObservable();

  private configurationsList = new BehaviorSubject<Array<ParsingJobConfig>>(null);
  public configurations = this.configurationsList.asObservable();

  private connectivityMapTrees = new BehaviorSubject<
    Array<ConnectivityMapTree>
  >([]);
  public currentConnectivityMapTrees = this.connectivityMapTrees.asObservable();

  private unmappedInstChips = new BehaviorSubject<Array<Chip>>([]);
  public currentUnmappedInstChips = this.unmappedInstChips.asObservable();

  private unmappedProdChips = new BehaviorSubject<Array<Chip>>([]);
  public currentUnmappedProdChips = this.unmappedProdChips.asObservable();

  private unmappedTestChips = new BehaviorSubject<Array<Chip>>([]);
  public currentUnmappedTestChips = this.unmappedTestChips.asObservable();


  private mappedProdChips = new BehaviorSubject<Array<Chip>>([]);
  public currentMappedProdChips = this.mappedProdChips.asObservable();

  private mappedTestChips = new BehaviorSubject<Array<Chip>>([]);
  public currentMappedTestChips = this.mappedTestChips.asObservable();

  private mappedInstrumentIds = new BehaviorSubject<Array<string>>([]);
  public currentMappedInstrumentIds = this.mappedInstrumentIds.asObservable();

  private mappedProductIds = new BehaviorSubject<Array<string>>([]);
  public currentMappedProductIds = this.mappedProductIds.asObservable();

  private instCards = new BehaviorSubject<Array<InstrumentCard>>([]);
  public currentInstrumentCards = this.instCards.asObservable();

  private prodCards = new BehaviorSubject<Array<ProductCard>>([]);
  public currentProductCards = this.prodCards.asObservable();

  private testCards = new BehaviorSubject<Array<TestCard>>([]);
  public currentTestCards = this.testCards.asObservable();

  private dropdownData = new BehaviorSubject<ConnectivityMapDropdowns>(
    new ConnectivityMapDropdowns()
  );
  public currentDropdownData = this.dropdownData.asObservable();

  private mapCardsData = new BehaviorSubject<ConnectivityMapCards>(
    new ConnectivityMapCards()
  );
  public currentMapCardsData = this.mapCardsData.asObservable();

  private instNav = new BehaviorSubject<NavigationEntity>(
    new NavigationEntity()
  );
  public currentInstrumentNavigation = this.instNav.asObservable();

  private prodNav = new BehaviorSubject<NavigationEntity>(
    new NavigationEntity()
  );
  public currentProductNavigation = this.prodNav.asObservable();

  private testNav = new BehaviorSubject<TestNavigationEntity>(
    new TestNavigationEntity()
  );
  public currentTestNavigation = this.testNav.asObservable();

  private selectedChip = new BehaviorSubject<Chip>(null);
  public currentSelectedChip = this.selectedChip.asObservable();

  private selectedChipIndex = new BehaviorSubject<number>(-1);
  public currentSelectedChipIndex = this.selectedChipIndex.asObservable();

  private selectedCard = new BehaviorSubject<any>(null);
  public currentSelectedCard = this.selectedCard.asObservable();

  private selectedCardIndex = new BehaviorSubject<number>(-1);
  public currentSelectedCardIndex = this.selectedCardIndex.asObservable();

  private selectedProductLevel = new BehaviorSubject<ProductLevel>(null);
  public currentSelectedProductLevel = this.selectedProductLevel.asObservable();

  private dialogOpenState = new BehaviorSubject<boolean>(false);
  public currentDialogOpenState = this.dialogOpenState.asObservable();

  private unlinkedCodes = new BehaviorSubject<Array<string>>([]);
  public currentUnlinkedCodes = this.unlinkedCodes.asObservable();
  private localUnlinkedCodes = new Array<string>();

  public closeLinkDialog = new Subject();

  public triggerDataRefresh = new Subject();
  private destroy$ = new Subject<boolean>();

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.linkChain[32]
  ];

  hasDepartments: boolean;

  constructor(
    private api: ApiService,
    private connectivityMappingApi: ConnectivityMappingApiService,
    private codeListService: CodelistApiService,
    private store: ngrxStore.Store<fromRoot.State>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private dateTimeHelper: DateTimeHelper,
    private appNavigationService: AppNavigationTrackingService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  getFullTree(nodeType: EntityType, locationId: string): Observable<any> {
    const nodeId = locationId;
    const data = {
      nodeId
    };
    const url = unApi.connectivity.loadFullTree.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.api.post(`${url}`, data, true);
  }

  public createCardAndDropdownLabData() {
    this.getCardAndDropdownLabData().pipe(take(1)).subscribe(labData => {
      this.mapCardsData.next(labData.connectivityMapCards);
      this.updateConnectivityMapDropdowns(labData.connectivityMapDropdowns);
    });
  }

  private getCardAndDropdownLabData(): Observable<ConnectivityMapLabData> {
    // cards
    let instrumentCards: InstrumentCard[];
    let productCards: ProductCard[];
    let testCards: TestCard[];

    // dropdowns
    let locationDropdown: DropdownContents[];
    let departmentDropdowns: DropdownContents[];
    let instrumentDropdowns: DropdownContents[];
    let productDropdowns: DropdownContents[];

    const mapLabData$ = this.store.pipe(ngrxStore.select(fromNavigationSelector.getConnectivityFullTree))
      .pipe(filter(currentBranch => currentBranch ? true : false))
      .pipe(switchMap(currentBranch => {

        const labLocation = <LabLocation><unknown>currentBranch.data;

        // instantiate cards/dropdowns inside here in case there is a race condition
        instrumentCards = [];
        productCards = [];
        testCards = [];

        locationDropdown = [];
        departmentDropdowns = [];
        instrumentDropdowns = [];
        productDropdowns = [];

        // gather CodeList TestID's for Reagent and Calibrator Lot data
        const codeListTestIdsSet = new Set<string>(); // Using Set because we don't want duplicates

        if (labLocation) {
          // add any lab locations
          locationDropdown.push(this.getLocationDropdownContents(labLocation));
          const children = labLocation.children as any[];
          // check if labLocation has nodeType departments
          const departmentsList = children.filter((department: TreePill) => department.nodeType === EntityType.LabDepartment);
          // check if labLocation has nodeType instruments
          const instrumentsList = children.filter((instrument: TreePill) => instrument.nodeType === EntityType.LabInstrument);

          if (departmentsList.length > 0) {
            this.hasDepartments = true;
            departmentsList.forEach(department => {
              const departmentDropdown = this.getDepartmentDropdownContents(labLocation, department);
              departmentDropdowns.push(departmentDropdown);
              if (department.children) {
                // add any instruments
                department.children.forEach(instrument => {
                  // instrument cards
                  const instrumentCard = this.getInstrumentCard(labLocation, instrument, department);
                  instrumentCards.push(instrumentCard);
                  // instrument dropdowns
                  const instrumentDropdown = this.getInstrumentDropdownContents(labLocation, instrument, department);
                  instrumentDropdowns.push(instrumentDropdown);
                  if (instrument.children) {
                    // add any products
                    this.getProductTestCards(labLocation, instrument, productCards, testCards,
                      productDropdowns, codeListTestIdsSet, department);
                  }
                });
              }
            });
          } else if (instrumentsList) {
            instrumentsList.forEach(instrument => {
              // generate instrument cards without departments
              const instrumentCard = this.getInstrumentCard(labLocation, instrument, undefined);
              instrumentCards.push(instrumentCard);
              // instrument dropdowns
              const instrumentDropdown = this.getInstrumentDropdownContents(labLocation, instrument, undefined);
              instrumentDropdowns.push(instrumentDropdown);
              if (instrument.children) {
                // add any products
                this.getProductTestCards(labLocation, instrument, productCards, testCards, productDropdowns, codeListTestIdsSet);
              }
            });
          }
        }
        return of(Array.from(codeListTestIdsSet));
      }),
        filter(codeListTestIds => !!(codeListTestIds && codeListTestIds.length)), // prevent unnecessary calls before data is ready
        switchMap(codeListTestIds => {
          return forkJoin(
            this.codeListService.getCalibratorLotsMapByTestIds(codeListTestIds),
            this.codeListService.getReagentLotsMapByTestIds(codeListTestIds)
          );
        }),
        map(([calibratorLots, reagentLots]) => {
          // populate reagent/calibrator lots from CodeList
          testCards.forEach(testCard => {
            testCard.calibratorLots = calibratorLots[testCard.codeListTestId];
            testCard.reagentLots = reagentLots[testCard.codeListTestId];
          });

          const mapLabData: ConnectivityMapLabData = {
            connectivityMapCards: new ConnectivityMapCards(),
            connectivityMapDropdowns: new ConnectivityMapDropdowns()
          };

          // add cards
          mapLabData.connectivityMapCards.instrumentCards = instrumentCards;
          mapLabData.connectivityMapCards.productCards = productCards;
          mapLabData.connectivityMapCards.testCards = testCards;

          // add dropdowns
          mapLabData.connectivityMapDropdowns.locationDropdown = locationDropdown;
          mapLabData.connectivityMapDropdowns.departmentDropdown = departmentDropdowns;
          mapLabData.connectivityMapDropdowns.instrumentDropdown = instrumentDropdowns;
          mapLabData.connectivityMapDropdowns.productDropdown = productDropdowns;
          return mapLabData;
        }),
        take(1));
    return mapLabData$;
  }

  public getProductTestCards(labLocation, instrument, productCards, testCards,
    productDropdowns, codeListTestIdsSet, department?: Department) {
    if (this.hasDepartments) {
      instrument.children.forEach(product => {
        // product cards
        const productCard = this.getProductCard(labLocation, instrument, product, department);
        productCards.push(productCard);
        // product dropdowns
        const productDropdown = this.getProductDropdownContents(labLocation, instrument, product, department);
        productDropdowns.push(productDropdown);
        if (product.children) {
          // tests
          const list = product.children as LabTest[];
          list.forEach((test: LabTest) => {
            // test cards
            // need to query CodeList and set calibrator/reagent lots after, so passing in undefined
            const testCard = this.getTestCard(labLocation, instrument, product, test, undefined, undefined, department);
            testCards.push(testCard);
            // aggregate CodeList TestID's
            codeListTestIdsSet.add(test.testId);
          });
        }
      });
    } else {
      instrument.children.forEach(product => {
        // product cards
        const productCard = this.getProductCard(labLocation, instrument, product, undefined);
        productCards.push(productCard);
        // product dropdowns
        const productDropdown = this.getProductDropdownContents(labLocation, instrument, product, undefined);
        productDropdowns.push(productDropdown);
        if (product.children) {
          // tests
          const list = product.children as LabTest[];
          list.forEach((test: LabTest) => {
            // test cards
            // need to query CodeList and set calibrator/reagent lots after, so passing in undefined
            const testCard = this.getTestCard(labLocation, instrument, product, test, undefined, undefined, undefined);
            testCards.push(testCard);
            // aggregate CodeList TestID's
            codeListTestIdsSet.add(test.testId);
          });
        }
      });
    }
  }

  public createConnectivityMapTrees(locationId: string) {
    this.getConnectivityMapTrees(locationId).pipe(take(1)).subscribe(tree => {
      this.updateConnectivityMapTrees(tree);
    });
  }

  private getConnectivityMapTrees(locationId: string): Observable<ConnectivityMapTree[]> {
    const data = {
      locationId
    };
    const url = unApi.connectivity.codemapping;
    return this.connectivityMappingApi.post<Array<ConnectivityMapTree>>(url, data, true);
  }

  public mapInstrument(
    instrumentMap: InstrumentMap
  ): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.mapInstrument;
    return this.connectivityMappingApi.put(url, instrumentMap, true);
  }

  public unmapInstrument(
    instrumentMap: InstrumentMap
  ): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.unMapInstrument;
    return this.connectivityMappingApi.put(url, instrumentMap, true);
  }

  public mapProduct(productMap: ProductMap): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.mapProduct;
    return this.connectivityMappingApi.put(url, productMap, true);
  }

  public unmapProduct(productMap: ProductMap): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.unMapProduct;
    return this.connectivityMappingApi.put(url, productMap, true);
  }

  public mapTest(testMap: TestMap): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.mapTest;
    return this.connectivityMappingApi.put(url, testMap, true);
  }

  public unmapTest(testMap: TestMap): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.unMapTest;
    return this.connectivityMappingApi.put(url, testMap, true);
  }

  // Behavior Subject Methods

  updateEntityType(entityType: EntityType) {
    this.entityType.next(entityType);
  }

  updateEntityId(entityId: string) {
    this.entityId.next(entityId);
  }

  updateSelectedConfigurationId(configurationId: string) {
    this.configurationId.next(configurationId);
  }

  updateConfigurations(configurationsList: Array<ParsingJobConfig>) {
    this.configurationsList.next(configurationsList);
  }

  updateInstrumentUnmappedChips(unmappedInstChips: Array<Chip>) {
    this.unmappedInstChips.next(unmappedInstChips);
  }

  updateProductUnmappedChips(unmappedProdChips: Array<Chip>) {
    this.unmappedProdChips.next(unmappedProdChips);
  }

  updateTestUnmappedChips(unmappedTestChips: Array<Chip>) {
    this.unmappedTestChips.next(unmappedTestChips);
  }

  updateProductMappedChips(mappedProdChips: Array<Chip>) {
    this.mappedProdChips.next(mappedProdChips);
  }

  updateTestMappedChips(mappedTestChips: Array<Chip>) {
    this.mappedTestChips.next(mappedTestChips);
  }

  updateMappedInstrumentIds(instrumentIds: Array<string>) {
    this.mappedInstrumentIds.next(instrumentIds);
  }

  updateMappedProductIds(productIds: Array<string>) {
    this.mappedProductIds.next(productIds);
  }

  updateInstrumentCards(instCards: Array<InstrumentCard>) {
    this.instCards.next(instCards);
  }

  updateProductCards(prodCards: Array<ProductCard>) {
    this.prodCards.next(prodCards);
  }

  updateTestCards(testCards: Array<TestCard>) {
    this.testCards.next(testCards);
  }

  updateConnectivityMapDropdowns(
    connectivityMapDropdowns: ConnectivityMapDropdowns
  ) {
    this.dropdownData.next(connectivityMapDropdowns);
  }

  updateInstrumentNavigation(instNav: NavigationEntity) {
    this.instNav.next(instNav);
  }

  updateProductNavigation(prodNav: NavigationEntity) {
    this.prodNav.next(prodNav);
  }

  updateTestNavigation(testNav: TestNavigationEntity) {
    this.testNav.next(testNav);
  }

  updateSelectedChip(selectedChip: Chip) {
    this.selectedChip.next(selectedChip);
  }

  updateSelectedChipIndex(selectedChipIndex: number) {
    this.selectedChipIndex.next(selectedChipIndex);
  }

  updateSelectedCard(selectedCard: any) {
    this.selectedCard.next(selectedCard);
  }

  public updateSelectedCardIndex(selectedCardIndex: number) {
    this.selectedCardIndex.next(selectedCardIndex);
  }

  public updateConnectivityMapTrees(trees: Array<ConnectivityMapTree>) {
    this.connectivityMapTrees.next(trees);
  }

  public updateDocument(document: Array<ConnectivityMapTree>) {
    let connectivityMapTreesObj = new Array<ConnectivityMapTree>();
    connectivityMapTreesObj = this.connectivityMapTrees.value;

    document.forEach(doc => {
      const index = connectivityMapTreesObj.findIndex(
        tree => tree.id === doc.id
      );
      connectivityMapTreesObj[index] = doc;
      this.updateConnectivityMapTrees(connectivityMapTreesObj);
    });
  }

  public updateSelectedProductLevel(selectedProductLevel: ProductLevel) {
    this.selectedProductLevel.next(selectedProductLevel);
  }

  public updateDialogOpenState(dialogOpenState: boolean) {
    this.dialogOpenState.next(dialogOpenState);
  }

  public updateUnlinkedCodes(unlinkedCode: string) {
    this.localUnlinkedCodes.push(unlinkedCode);
    this.unlinkedCodes.next(this.localUnlinkedCodes);
  }

  public unlinkLotCodes(card: TestCard): void {
    if (card) {
      card.linkedReagentLotCodes = [];
      card.linkedCalibratorLotCodes = [];
    }
  }

  public clearUnlinkedCodes() {
    this.localUnlinkedCodes = [];
    this.unlinkedCodes.next([]);
  }

  public clearSelectionStates() {
    this.updateSelectedChip(null);
    this.updateSelectedCard(null);
    this.updateSelectedChipIndex(-1);
    this.updateSelectedCardIndex(-1);
    this.updateDialogOpenState(false);
    this.closeLinkDialog.next();
  }

  public resetData(currentLocationId: string) {
    if (this.labLocationId == undefined) {
      this.labLocationId = currentLocationId;
    } else if (this.labLocationId != currentLocationId) {
      this.entityType = new BehaviorSubject<EntityType>(null);
      this.currentEntityType = this.entityType.asObservable();

      this.entityId = new BehaviorSubject<string>(null);
      this.currentEntityId = this.entityId.asObservable();

      this.connectivityMapTrees = new BehaviorSubject<Array<ConnectivityMapTree>>([]);
      this.currentConnectivityMapTrees = this.connectivityMapTrees.asObservable();

      this.unmappedInstChips = new BehaviorSubject<Array<Chip>>([]);
      this.currentUnmappedInstChips = this.unmappedInstChips.asObservable();

      this.unmappedProdChips = new BehaviorSubject<Array<Chip>>([]);
      this.currentUnmappedProdChips = this.unmappedProdChips.asObservable();

      this.unmappedTestChips = new BehaviorSubject<Array<Chip>>([]);
      this.currentUnmappedTestChips = this.unmappedTestChips.asObservable();

      this.mappedInstrumentIds = new BehaviorSubject<Array<string>>([]);
      this.currentMappedInstrumentIds = this.mappedInstrumentIds.asObservable();

      this.mappedProductIds = new BehaviorSubject<Array<string>>([]);
      this.currentMappedProductIds = this.mappedProductIds.asObservable();

      this.mappedProdChips = new BehaviorSubject<Array<Chip>>([]);
      this.currentMappedProdChips = this.mappedProdChips.asObservable();

      this.mappedTestChips = new BehaviorSubject<Array<Chip>>([]);
      this.currentMappedTestChips = this.mappedTestChips.asObservable();

      this.instCards = new BehaviorSubject<Array<InstrumentCard>>([]);
      this.currentInstrumentCards = this.instCards.asObservable();

      this.prodCards = new BehaviorSubject<Array<ProductCard>>([]);
      this.currentProductCards = this.prodCards.asObservable();

      this.testCards = new BehaviorSubject<Array<TestCard>>([]);
      this.currentTestCards = this.testCards.asObservable();

      this.mapCardsData = new BehaviorSubject<ConnectivityMapCards>(new ConnectivityMapCards());
      this.currentMapCardsData = this.mapCardsData.asObservable();

      this.dropdownData = new BehaviorSubject<ConnectivityMapDropdowns>(new ConnectivityMapDropdowns());
      this.currentDropdownData = this.dropdownData.asObservable();

      this.instNav = new BehaviorSubject<NavigationEntity>(new NavigationEntity());
      this.currentInstrumentNavigation = this.instNav.asObservable();

      this.prodNav = new BehaviorSubject<NavigationEntity>(new NavigationEntity());
      this.currentProductNavigation = this.prodNav.asObservable();

      this.testNav = new BehaviorSubject<TestNavigationEntity>(new TestNavigationEntity());
      this.currentTestNavigation = this.testNav.asObservable();

      this.selectedChip = new BehaviorSubject<Chip>(null);
      this.currentSelectedChip = this.selectedChip.asObservable();

      this.selectedChipIndex = new BehaviorSubject<number>(-1);
      this.currentSelectedChipIndex = this.selectedChipIndex.asObservable();

      this.selectedCard = new BehaviorSubject<any>(null);
      this.currentSelectedCard = this.selectedCard.asObservable();

      this.selectedCardIndex = new BehaviorSubject<number>(-1);
      this.currentSelectedCardIndex = this.selectedCardIndex.asObservable();

      this.selectedProductLevel = new BehaviorSubject<ProductLevel>(null);
      this.currentSelectedProductLevel = this.selectedProductLevel.asObservable();

      this.dialogOpenState = new BehaviorSubject<boolean>(false);
      this.currentDialogOpenState = this.dialogOpenState.asObservable();

      this.unlinkedCodes = new BehaviorSubject<Array<string>>([]);
      this.currentUnlinkedCodes = this.unlinkedCodes.asObservable();
      this.localUnlinkedCodes = new Array<string>();

      this.labLocationId = currentLocationId;
    }
  }

  private arrayIsNotEmpty(array: Array<any>): boolean {
    return Array.isArray(array) && array.length > 0;
  }

  private getTestCard(
    labLocation: LabLocation,
    instrument: LabInstrument,
    product: LabProduct,
    test: LabTest,
    calibratorLots: CalibratorLot[],
    reagentLots: ReagentLot[],
    department?: Department
  ): TestCard {
    return {
      locationId: labLocation.id,
      departmentId: department ? department.id : undefined,
      instrumentId: instrument.id,
      productId: product.id,
      labTestId: test.id,
      codeListTestId: test.testId,
      analyteName: test?.testSpecInfo?.analyteName,
      calibratorLots: calibratorLots,
      reagentLots: reagentLots,
      codes: [],
      linkedCalibratorLotCodes: undefined,
      linkedReagentLotCodes: undefined,
      methodName: test?.testSpecInfo?.methodName
    };
  }

  private getProductDropdownContents(
    labLocation: LabLocation,
    instrument: LabInstrument,
    product: LabProduct,
    department?: Department,
  ): DropdownContents {
    return {
      name: product.productInfo.name,
      locationId: labLocation.id,
      productId: product.id,
      instrumentId: instrument.id,
      departmentId: department ? department.id : undefined
    };
  }

  private getProductCard(
    labLocation: LabLocation,
    instrument: LabInstrument,
    product: LabProduct,
    department?: Department
  ): ProductCard {
    // verify we have productLotLevels or this won't work
    if (!product) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, null, null,
          componentInfo.MappingService + blankSpace + Operations.GetProductCardInfo));
    }
    if (!product.productLotLevels) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, null, null,
          componentInfo.MappingService + blankSpace + Operations.GetProductLotLevels));
    }

    const productCard: ProductCard = {
      locationId: labLocation.id,
      departmentId: department ? department.id : undefined,
      instrumentId: instrument.id,
      productId: product.id,
      productName: product.productInfo.name,
      productMasterLotNumber: product.lotInfo.lotNumber,
      badgeCount: undefined,
      // set levels in use data after so we only have to iterate once
      controlLotLevelIds: [],
      levels: [],
      productLevels: []
    };

    // set levels in use data using ProductLotLevels
    for (let testSettingIdx = 0; testSettingIdx < product.productLotLevels.length; ++testSettingIdx) {
      if (product.productLotLevels[testSettingIdx]) {
        const controlLotId = product.productLotLevels[testSettingIdx].id;
        const level = product.productLotLevels[testSettingIdx].level;
        productCard.controlLotLevelIds.push(controlLotId);
        productCard.levels.push(level);
        productCard.productLevels.push({ controlLotLevelId: controlLotId, level: level, codes: [] });
      }
    }
    return productCard;
  }

  private getInstrumentDropdownContents(
    labLocation: LabLocation,
    instrument: LabInstrument,
    department?: Department
  ): DropdownContents {
    return {
      name: instrument.instrumentCustomName && instrument.instrumentSerial ? instrument.instrumentInfo.name + " - " +
        instrument.instrumentCustomName : instrument.instrumentCustomName ? instrument.instrumentInfo.name + " - " +
          instrument.instrumentCustomName : instrument.instrumentSerial ? instrument.instrumentInfo.name + " - " +
            instrument.instrumentSerial : instrument.instrumentInfo?.name,
      locationId: labLocation.id,
      productId: null,
      instrumentId: instrument.id,
      departmentId: department ? department.id : undefined
    };
  }

  private getInstrumentCard(
    labLocation: LabLocation,
    instrument: LabInstrument,
    department?: Department
  ): InstrumentCard {
    return {
      locationName: labLocation.labLocationName,
      locationId: labLocation.id,
      instrumentModelName: instrument.instrumentCustomName && instrument.instrumentSerial ? instrument.instrumentInfo.name + " - " +
        instrument.instrumentCustomName : instrument.instrumentCustomName ? instrument.instrumentInfo.name + " - " +
          instrument.instrumentCustomName : instrument.instrumentSerial ? instrument.instrumentInfo.name + " - " +
            instrument.instrumentSerial : instrument.instrumentInfo?.name,
      instrumentId: instrument.id,
      instrumentAlias: instrument.instrumentCustomName,
      departmentName: department ? department.departmentName : undefined,
      departmentId: department ? department.id : undefined,
      badgeCount: undefined,
      codes: []
    };
  }

  private getDepartmentDropdownContents(
    labLocation: LabLocation,
    department: Department
  ): DropdownContents {
    return {
      name: department.departmentName,
      locationId: labLocation.id,
      productId: null,
      instrumentId: null,
      departmentId: department.id
    };
  }

  private getLocationDropdownContents(
    labLocation: LabLocation
  ): DropdownContents {
    return {
      name: labLocation.labLocationName,
      locationId: labLocation.id,
      productId: null,
      instrumentId: null,
      departmentId: null
    };
  }

  public enableInstrument(instrumentEnable: BaseEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.enableInstrument;
    return this.connectivityMappingApi.put(url, instrumentEnable);
  }

  public disableInstrument(instrumentDisable: BaseEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.disableInstrument;
    return this.connectivityMappingApi.put(url, instrumentDisable);
  }

  public enableProduct(productEnable: ProductEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.enableProduct;
    return this.connectivityMappingApi.put(url, productEnable);
  }

  public disableProduct(productDisable: ProductEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.disableProduct;
    return this.connectivityMappingApi.put(url, productDisable);
  }

  public deleteInstrumentCode(instrumentDelete: BaseEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.deleteInstrument;
    return this.connectivityMappingApi.delWithData(url, instrumentDelete, true);
  }

  public deleteTestCode(testDelete: TestEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.deleteTest;
    return this.connectivityMappingApi.delWithData(url, testDelete, true);
  }

  public deleteProductCode(productDelete: ProductEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.deleteProduct;
    return this.connectivityMappingApi.delWithData(url, productDelete, true);
  }

  public enableTest(testEnable: TestEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.enableTest;
    return this.connectivityMappingApi.put(url, testEnable);
  }

  public disableTest(testDisable: TestEnableDisableDelete): Observable<Array<ConnectivityMapTree>> {
    const url = unApi.connectivity.disableTest;
    return this.connectivityMappingApi.put(url, testDisable);
  }

  public sendAuditTrailPayload(auditTrailCurrentPayload: ProductMap | InstrumentMap | TestMap
    | BaseEnableDisableDelete | ProductEnableDisableDelete | TestEnableDisableDelete,
    nodeType: string, eventType: string, action: string, actionStatus: string): void {
    const auditTrailFinalPayload = this.prepareAuditTrailPayload(auditTrailCurrentPayload, nodeType, eventType, action, actionStatus);
    this.appNavigationService.logAuditTracking(auditTrailFinalPayload, true);
  }

  public prepareAuditTrailPayload(auditTrailCurrentPayload: any, nodeType: string,
    eventType: string, action: string, actionStatus: string): AppNavigationTracking {
    const auditPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: eventType,
        action: action,
        actionStatus: actionStatus,
        currentValue: { ...auditTrailCurrentPayload, nodeTypeName: nodeType },
      }
    };
    return auditPayload;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
