// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { combineLatest as observableCombineLatest, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { unsubscribe } from '../../../../../core/helpers/rxjs-helper';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import {
  DropdownContents,
  FilterData
} from '../../../../../contracts/models/connectivity-map/connectivity-map-dropdowns.model';
import { MappingService } from '../../mapping.service';

@Component({
  selector: 'unext-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.scss']
})
export class DropdownFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() entityType: EntityType;
  @Input() entityId: string;
  @Output() filterCardsEvent = new EventEmitter<FilterData>();

  isResetDisabled = false;
  isAllProductsScreen: boolean;
  isAllTestsScreen: boolean;

  locationForm = new FormControl();
  departmentForm = new FormControl();
  instrumentForm = new FormControl();

  selectedLocations: Array<DropdownContents> = [];
  selectedDepartments: Array<DropdownContents> = [];
  selectedInstruments: Array<DropdownContents> = [];
  selectedProducts: Array<DropdownContents> = [];

  initLocationDropdown: Array<DropdownContents>;
  initDepartmentDropdown: Array<DropdownContents>;
  initInstrumentDropdown: Array<DropdownContents>;
  initProductDropdown: Array<DropdownContents>;

  locationDropdown: Array<DropdownContents>;
  departmentDropdown: Array<DropdownContents>;
  instrumentDropdown: Array<DropdownContents>;

  prevSelectedLocations: Array<DropdownContents> = [];
  prevSelectedDepartments: Array<DropdownContents> = [];
  prevSelectedInstruments: Array<DropdownContents> = [];
  prevSelectedProducts: Array<DropdownContents> = [];

  productIdDropdownsSubscription$: Subscription;
  instrumentIdDropdownsSubscription$: Subscription;

  private destroy$ = new Subject<boolean>();

  constructor(private connectivityMapService: MappingService) { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    this.findCurrentPage();
    this.setupDropdownFilters();
    this.disableDropdowns();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    unsubscribe(this.instrumentIdDropdownsSubscription$);
    unsubscribe(this.productIdDropdownsSubscription$);
  }

  private findCurrentPage(): void {
    this.isAllProductsScreen = false;
    this.isAllTestsScreen = false;
    switch (this.entityType) {
      case EntityType.LabInstrument:
        break;
      case EntityType.LabProduct:
        if (this.entityId == null) {
          this.isAllProductsScreen = true;
        }
        break;
      case EntityType.LabTest:
        if (this.entityId == null) {
          this.isAllTestsScreen = true;
        }
        break;
      default:
        break;
    }
  }

  private setupDropdownFilters(): void {
    switch (this.entityType) {
      case EntityType.LabInstrument:
        this.loadDropdownData();
        break;
      case EntityType.LabProduct:
        if (this.isAllProductsScreen) {
          this.setupDropdownsForAllProducts();
          this.populateDropdownsOnProductChipSelection();
        } else {
          this.populateDropdownSelectionsByInstrumentId(this.entityId);
        }
        break;
      case EntityType.LabTest:
        if (this.isAllTestsScreen) {
          this.setupDropdownsForAllTests();
          this.populateDropdownsOnTestChipSelection();
        } else {
          this.populateDropdownSelectionsByProductId(this.entityId);
        }
        break;
    }
  }

  private loadDropdownData(): void {
    this.connectivityMapService.currentDropdownData
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        dropdowns => {
          if (dropdowns.locationDropdown != null) {
            this.initLocationDropdown = dropdowns.locationDropdown;
            this.initDepartmentDropdown = dropdowns.departmentDropdown;
            this.initInstrumentDropdown = dropdowns.instrumentDropdown;
            this.initProductDropdown = dropdowns.productDropdown;

            this.sortDropdowns();

            this.locationDropdown = this.initLocationDropdown;
            this.departmentDropdown = this.initDepartmentDropdown;
            this.instrumentDropdown = this.initInstrumentDropdown;

            this.updateLocationSelection(this.initLocationDropdown);
          }
        }
      );
  }

  private disableDropdowns(): void {
    switch (this.entityType) {
      case EntityType.LabInstrument:
        break;
      case EntityType.LabProduct:
        if (!this.isAllProductsScreen) {
          this.locationForm.disable();
          this.departmentForm.disable();
          this.instrumentForm.disable();
          this.isResetDisabled = true;
        }
        break;
      case EntityType.LabTest:
        if (!this.isAllTestsScreen) {
          this.locationForm.disable();
          this.departmentForm.disable();
          this.instrumentForm.disable();
          this.isResetDisabled = true;
        }
        break;
      default:
        break;
    }
  }

  public changeLocationDropdown(selectedLocations: Array<DropdownContents>): void {
    this.updateLocationSelection(selectedLocations);
    this.initializeDropdownContentsIfNothingSelected();
    this.filterCards();
    this.connectivityMapService.clearSelectionStates();
  }

  public changeDepartmentDropdown(selectedDepartments: Array<DropdownContents>): void {
    this.updateDepartmentSelection(selectedDepartments);
    this.initializeDropdownContentsIfNothingSelected();
    this.filterCards();
    this.connectivityMapService.clearSelectionStates();
  }

  public changeInstrumentDropdown(selectedInstruments: Array<DropdownContents>): void {
    this.updateInstrumentSelection(selectedInstruments);
    this.initializeDropdownContentsIfNothingSelected();
    this.filterCards();
    this.connectivityMapService.clearSelectionStates();
  }

  private updateLocationSelection(selectedLocations: Array<DropdownContents>): void {
    this.prevSelectedLocations = selectedLocations;

    if (this.locationDropdown.length === 1) {
      this.showSingleLocationResult(selectedLocations);
    }
    this.departmentDropdown = this.filterDepartmentsWithSelectedLocations(selectedLocations);

    selectedLocations.length === 0 ?
      this.departmentForm.disable() :
      this.departmentForm.enable();

    if (this.locationDropdown.length === 1 && this.departmentDropdown.length === 1) {
      this.prevSelectedDepartments = this.departmentDropdown;
    }

    const departmentIds = this.prevSelectedDepartments.map(de => de.departmentId);
    const filteredSelectedDepartments = this.filterDepartmentDropdownWithDepartmentIds(departmentIds);

    this.selectedDepartments = [];

    this.updateDepartmentSelection(filteredSelectedDepartments);
  }

  private updateDepartmentSelection(selectedDepartments: Array<DropdownContents>): void {
    this.prevSelectedDepartments = selectedDepartments;

    if (this.departmentDropdown.length === 1) {
      this.showSingleDepartmentResult(this.departmentDropdown);
    }

    if (this.departmentDropdown.length > 0) {
      this.instrumentDropdown = this.filterInstrumentsWithSelectedDepartments(selectedDepartments);
      selectedDepartments.length === 0 ? this.instrumentForm.disable() : this.instrumentForm.enable();
    }

    if (this.departmentDropdown.length === 1 && this.instrumentDropdown.length === 1) {
      this.prevSelectedInstruments = this.instrumentDropdown;
    }

    const instrumentIds = this.prevSelectedInstruments.map(inst => inst.instrumentId);
    const filteredSelectedInstruments = this.filterInstrumentDropdownWithInstrumentIds(instrumentIds);

    this.selectedInstruments = [];

    this.updateInstrumentSelection(filteredSelectedInstruments);
  }

  private updateInstrumentSelection(selectedInstruments: Array<DropdownContents>): void {
    this.prevSelectedInstruments = selectedInstruments;

    if (this.instrumentDropdown.length === 1) {
      this.showSingleInstrumentResult(this.instrumentDropdown);
    }
  }

  private initializeDropdownContentsIfNothingSelected() {
    if (this.isAllProductsScreen || this.isAllTestsScreen) {
      if (this.prevSelectedLocations.length === 0) {
        this.prevSelectedLocations = this.initLocationDropdown;
      }
      if (this.prevSelectedDepartments.length === 0) {
        this.prevSelectedDepartments = this.initDepartmentDropdown;
      }
      if (this.prevSelectedInstruments.length === 0) {
        this.prevSelectedInstruments = this.initInstrumentDropdown;
      }
    }
  }

  private filterCards(): void {
    const filterData: FilterData = {
      selectedLocationIds: this.prevSelectedLocations.map(lo => lo.locationId),
      selectedDepartmentIds: this.prevSelectedDepartments.map(de => de.departmentId),
      selectedInstrumentIds: this.prevSelectedInstruments.map(inst => inst.instrumentId),
      selectedProductIds: this.prevSelectedProducts.map(prod => prod.productId)
    };

    this.filterCardsEvent.next(filterData);
  }

  public populateDropdownSelectionsByInstrumentId(instrumentId): void {
    if (this.instrumentIdDropdownsSubscription$) {
      return;
    }

    this.instrumentIdDropdownsSubscription$ = this.connectivityMapService.currentDropdownData.subscribe(
      dropdowns => {
        if (dropdowns.locationDropdown != null) {
          this.initLocationDropdown = dropdowns.locationDropdown;
          this.initDepartmentDropdown = dropdowns.departmentDropdown;
          this.initInstrumentDropdown = dropdowns.instrumentDropdown;

          this.selectedInstruments = this.filterInstrumentDropdownWithInstrumentId(instrumentId);

          const departmentId = this.selectedInstruments[0].departmentId;
          this.selectedDepartments = this.filterDepartmentDropdownWithDepartmentId(departmentId);

          const locationId = this.selectedInstruments[0].locationId;
          this.selectedLocations = this.filterLocationDropdownWithLocationId(locationId);

          this.locationDropdown = this.selectedLocations;
          this.departmentDropdown = this.selectedDepartments;
          this.instrumentDropdown = this.selectedInstruments;
        }
      }
    );
  }

  public populateDropdownSelectionsByProductId(productId): void {
    this.productIdDropdownsSubscription$ = this.connectivityMapService.currentDropdownData.pipe(takeUntil(this.destroy$)).subscribe(
      dropdowns => {
        if (dropdowns.locationDropdown != null) {
          this.initLocationDropdown = dropdowns.locationDropdown;
          this.initDepartmentDropdown = dropdowns.departmentDropdown;
          this.initInstrumentDropdown = dropdowns.instrumentDropdown;
          this.initProductDropdown = dropdowns.productDropdown;

          this.selectedProducts = this.filterProductDropdownWithProductId(productId);

          const instrumentId = this.selectedProducts[0].instrumentId;
          this.selectedInstruments = this.filterInstrumentDropdownWithInstrumentId(instrumentId);

          const departmentId = this.selectedInstruments[0].departmentId;
          this.selectedDepartments = this.filterDepartmentDropdownWithDepartmentId(departmentId);

          const locationId = this.selectedInstruments[0].locationId;
          this.selectedLocations = this.filterLocationDropdownWithLocationId(locationId);

          this.locationDropdown = this.selectedLocations;
          this.departmentDropdown = this.selectedDepartments;
          this.instrumentDropdown = this.selectedInstruments;
        }
      }
    );
  }

  public populateDropdownsOnProductChipSelection(): void {
    this.connectivityMapService.currentSelectedChip
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        selectedChip => {
          if (selectedChip != null) {
            this.locationForm.enable();
            this.departmentForm.enable();
            this.instrumentForm.enable();

            const instrumentId = selectedChip.parentId;
            this.selectedInstruments = this.filterInstrumentDropdownWithInstrumentId(instrumentId);
            this.prevSelectedInstruments = this.selectedInstruments;

            const departmentId = this.selectedInstruments[0].departmentId;
            this.selectedDepartments = this.filterDepartmentDropdownWithDepartmentId(departmentId);
            this.prevSelectedDepartments = this.selectedDepartments;

            const locationId = this.selectedInstruments[0].locationId;
            this.selectedLocations = this.filterLocationDropdownWithLocationId(locationId);
            this.prevSelectedLocations = this.selectedLocations;

            this.locationDropdown = this.initLocationDropdown;
            this.departmentDropdown = this.filterDepartmentsWithSelectedLocations(this.selectedLocations);
            this.instrumentDropdown = this.filterInstrumentsWithSelectedDepartments(this.selectedDepartments);

            if (this.locationDropdown.length === 1) {
              this.showSingleLocationResult(this.locationDropdown);
            }
            if (this.departmentDropdown.length === 1) {
              this.showSingleDepartmentResult(this.departmentDropdown);
            }
            if (this.instrumentDropdown.length === 1) {
              this.showSingleInstrumentResult(this.instrumentDropdown);
            }

            this.filterCards();
          }
        }
      );
  }

  public populateDropdownsOnTestChipSelection(): void {
    this.connectivityMapService.currentSelectedChip
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        selectedChip => {
          if (selectedChip != null) {
            this.locationForm.enable();
            this.departmentForm.enable();
            this.instrumentForm.enable();

            const productId = selectedChip.parentId;
            this.selectedProducts = this.filterProductDropdownWithProductId(productId);
            this.prevSelectedProducts = this.selectedProducts;

            const instrumentId = this.selectedProducts[0].instrumentId;
            this.selectedInstruments = this.filterInstrumentDropdownWithInstrumentId(instrumentId);
            this.prevSelectedInstruments = this.selectedInstruments;

            const departmentId = this.selectedInstruments[0].departmentId;
            this.selectedDepartments = this.filterDepartmentDropdownWithDepartmentId(departmentId);
            this.prevSelectedDepartments = this.selectedDepartments;

            const locationId = this.selectedInstruments[0].locationId;
            this.selectedLocations = this.filterLocationDropdownWithLocationId(locationId);
            this.prevSelectedLocations = this.selectedLocations;

            this.departmentDropdown = this.filterDepartmentsWithSelectedLocations(this.selectedLocations);
            this.instrumentDropdown = this.filterInstrumentsWithSelectedDepartments(this.selectedDepartments);

            this.showSingleLocationResult(this.locationDropdown);
            this.showSingleDepartmentResult(this.departmentDropdown);
            this.showSingleInstrumentResult(this.instrumentDropdown);

            this.filterCards();
          }
        }
      );
  }

  private setupDropdownsForAllProducts(): void {
    observableCombineLatest(
      this.connectivityMapService.currentDropdownData,
      this.connectivityMapService.currentMappedInstrumentIds
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const dropdownData = data[0];
        const mappedInstrumentIds = data[1];
        const instrumentIsAvailable = dropdownData.instrumentDropdown != null &&
          mappedInstrumentIds.length !== 0;
        if (
          instrumentIsAvailable
        ) {
          this.initLocationDropdown = dropdownData.locationDropdown;
          this.initDepartmentDropdown = dropdownData.departmentDropdown;
          this.initInstrumentDropdown = dropdownData.instrumentDropdown;

          this.initInstrumentDropdown = this.filterInstrumentDropdownWithInstrumentIds(mappedInstrumentIds);

          const mappedDepartmentIds = this.initInstrumentDropdown.map(inst => inst.departmentId);
          this.initDepartmentDropdown = this.filterDepartmentDropdownWithDepartmentIds(mappedDepartmentIds);

          const mappedLocationIds = this.initDepartmentDropdown.map(dp => dp.locationId);
          this.initLocationDropdown = this.filterLocationDropdownWithLocationIds(mappedLocationIds);

          this.locationDropdown = this.initLocationDropdown;
          this.departmentDropdown = this.initDepartmentDropdown;
          this.instrumentDropdown = this.initInstrumentDropdown;

          this.selectedLocations = this.initLocationDropdown;
          this.selectedDepartments = this.initDepartmentDropdown;
          this.selectedInstruments = this.initInstrumentDropdown;

          this.updateLocationSelection(this.initLocationDropdown);
          this.filterCards();
        }
      });
  }

  private setupDropdownsForAllTests(): void {
    observableCombineLatest(
      this.connectivityMapService.currentDropdownData,
      this.connectivityMapService.currentMappedProductIds
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const dropdownData = data[0];
        const mappedProductIds = data[1];

        if (
          dropdownData.instrumentDropdown != null &&
          mappedProductIds.length !== 0
        ) {
          this.initLocationDropdown = dropdownData.locationDropdown;
          this.initDepartmentDropdown = dropdownData.departmentDropdown;
          this.initInstrumentDropdown = dropdownData.instrumentDropdown;
          this.initProductDropdown = dropdownData.productDropdown;

          this.initProductDropdown = this.filterProductDropdownWithProductIds(mappedProductIds);

          const mappedInstrumentIds = this.initProductDropdown.map(prod => prod.instrumentId);
          this.initInstrumentDropdown = this.filterInstrumentDropdownWithInstrumentIds(mappedInstrumentIds);

          const mappedDepartmentIds = this.initInstrumentDropdown.map(inst => inst.departmentId);
          this.initDepartmentDropdown = this.filterDepartmentDropdownWithDepartmentIds(mappedDepartmentIds);

          const mappedLocationIds = this.initDepartmentDropdown.map(dp => dp.locationId);
          this.initLocationDropdown = this.filterLocationDropdownWithLocationIds(mappedLocationIds);

          this.locationDropdown = this.initLocationDropdown;
          this.departmentDropdown = this.initDepartmentDropdown;
          this.instrumentDropdown = this.initInstrumentDropdown;

          this.selectedLocations = this.initLocationDropdown;
          this.selectedDepartments = this.initDepartmentDropdown;
          this.selectedInstruments = this.initInstrumentDropdown;

          this.updateLocationSelection(this.initLocationDropdown);
          this.filterCards();
        }
      });
  }

  private filterDepartmentsWithSelectedLocations(selectedLocations: Array<DropdownContents>): Array<DropdownContents> {
    const selectedLocationIds = selectedLocations.map(lo => lo.locationId);
    return this.initDepartmentDropdown.filter(de => selectedLocationIds.includes(de.locationId));
  }

  private filterInstrumentsWithSelectedDepartments(selectedDepartments: Array<DropdownContents>): Array<DropdownContents> {
    const selectedDepartmentIds = selectedDepartments.map(de => de.departmentId);
    return this.initInstrumentDropdown.filter(inst => selectedDepartmentIds.includes(inst.departmentId));
  }

  // Filter with entity id
  private filterProductDropdownWithProductId(productId: string): Array<DropdownContents> {
    return this.initProductDropdown.filter(prod => prod.productId === productId);
  }

  private filterInstrumentDropdownWithInstrumentId(instrumentId: string): Array<DropdownContents> {
    return this.initInstrumentDropdown.filter(inst => inst.instrumentId === instrumentId);
  }

  private filterDepartmentDropdownWithDepartmentId(departmentId: string): Array<DropdownContents> {
    return this.initDepartmentDropdown.filter(de => de.departmentId === departmentId);
  }

  private filterLocationDropdownWithLocationId(locationId: string): Array<DropdownContents> {
    return this.initLocationDropdown.filter(lo => lo.locationId === locationId);
  }

  // Filter with entity ids
  private filterProductDropdownWithProductIds(productIds: Array<string>): Array<DropdownContents> {
    return this.initProductDropdown.filter(prod => productIds.includes(prod.productId));
  }

  private filterInstrumentDropdownWithInstrumentIds(instrumentIds: Array<string>): Array<DropdownContents> {
    return this.initInstrumentDropdown.filter(inst => instrumentIds.includes(inst.instrumentId));
  }

  private filterDepartmentDropdownWithDepartmentIds(departmentIds: Array<string>): Array<DropdownContents> {
    return this.initDepartmentDropdown.filter(de => departmentIds.includes(de.departmentId));
  }

  private filterLocationDropdownWithLocationIds(locationIds: Array<string>): Array<DropdownContents> {
    return this.initLocationDropdown.filter(lo => locationIds.includes(lo.locationId));
  }

  private showSingleLocationResult(locationDropdown: Array<DropdownContents>) {
    const singleLocation = locationDropdown[0];
    this.locationForm.disable();
    this.selectedLocations = [singleLocation];
  }

  private showSingleDepartmentResult(departmentDropdown: Array<DropdownContents>) {
    const singleDepartment = departmentDropdown[0];
    this.departmentForm.disable();
    this.selectedDepartments = [singleDepartment];
  }

  private showSingleInstrumentResult(instrumentDropdown: Array<DropdownContents>) {
    const singleInstrument = instrumentDropdown[0];
    this.instrumentForm.disable();
    this.selectedInstruments = [singleInstrument];
  }

  private sortDropdowns(): void {
    this.initLocationDropdown = this.initLocationDropdown.sort(
      (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    );
    this.initDepartmentDropdown = this.initDepartmentDropdown.sort(
      (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    );
    this.initInstrumentDropdown = this.initInstrumentDropdown.sort(
      (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    );
  }

  public clearDropdownSelections(): void {
    if (
      this.entityType === EntityType.LabInstrument ||
      this.isAllProductsScreen ||
      this.isAllTestsScreen
    ) {
      this.selectedLocations = [];
      this.selectedDepartments = [];
      this.selectedInstruments = [];
      this.selectedProducts = [];
      this.departmentForm.disable();
      this.prevSelectedLocations = [];
      this.prevSelectedDepartments = [];
      this.prevSelectedInstruments = [];
      this.prevSelectedProducts = [];
      this.connectivityMapService.clearSelectionStates();

      this.updateLocationSelection(this.initLocationDropdown);
      this.filterCards();
    }
  }
}
