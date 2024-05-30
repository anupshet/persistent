// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { combineLatest as observableCombineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { orderBy, uniqBy } from 'lodash';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { MappingService } from '../mapping.service';
import { EntityMapComponent } from '../shared/entity-map/entity-map.component';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { HeaderService } from '../../shared/header/header.service';
import { ProductLevel } from '../../../../contracts/models/connectivity-map/map-card.model';
import { code } from '../../../../core/config/constants/general.const';
import { ReagentCalibratorDialogService } from '../test-map/reagent-calibrator-dialog/reagent-calibrator-dialog.service';
import { LabConfigurationApiService } from '../../../../shared/services/lab-configuration.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';

@Component({
  selector: 'unext-product-map',
  templateUrl: '../shared/entity-map/entity-map.component.html',
  styleUrls: ['../shared/entity-map/entity-map.component.scss']
})
export class ProductMapComponent extends EntityMapComponent implements OnInit, OnDestroy, AfterViewInit {
  mappedInstrumentIds: Array<string>;

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
  ) {
    super(connectivityMapService, router, messageSnackBar,
      _headerService, location, reagentCalibratorDialogService, reagentCalibratorDialog, brPermissionsService, labConfigurationApiService, translate);
  }

  ngOnInit(): void {
    const url = window.location.toString();
    this.labId = /labs\/([^\/]+)/.exec(url)[1];
    this.connectivityMapService.currentEntityId
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        entityId => {
          this.entityId = entityId;
          if (this.cards != null) {
            this.setupSingleProductScreen();
          }
        });

    this.entityType = EntityType.LabProduct;
    this.connectivityMapService.updateEntityType(this.entityType);
    this.isAllProductsScreen = false;
    this.isAllTestsScreen = false;

    super.ngOnInit();
  }

  ngAfterViewInit() {
    observableCombineLatest(
      this.connectivityMapService.currentProductCards,
      this.connectivityMapService.currentMappedInstrumentIds
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.prepareProductCards);
  }

  private prepareProductCards = data => {
    this.cards = data[0];
    this.cards = orderBy(this.cards, [el => el.productName.replace(/\s/g, '').toLocaleLowerCase()], ['asc']);
    this.cards.forEach(card => {
      card.productLevels.forEach((level: ProductLevel) => {
        level.codes = uniqBy(level.codes, code);
      });
    });
    this.filteredCards = this.cards;
    this.mappedInstrumentIds = data[1];
    if (this.cards != null && this.mappedInstrumentIds != null) {
      this.setupProductsScreen();
    }
  }

  private setupProductsScreen(): void {
    this.entityId === null
      ? this.setupAllProductsScreen()
      : this.setupSingleProductScreen();
  }

  private setupAllProductsScreen(): void {
    this.isAllProductsScreen = true;
    this.filterProductCardsByMappedInstrumentIds();
  }

  private setupSingleProductScreen(): void {
    this.isAllProductsScreen = false;
    this.filterProductCardsByEntityId(this.entityId);
    this.dropdownComponent.populateDropdownSelectionsByInstrumentId(
      this.entityId
    );
  }

  private filterProductCardsByEntityId(entityId: string): void {
    this.filteredCards = this.cards.filter(
      card => card.instrumentId === this.entityId
    );
  }

  private filterProductCardsByMappedInstrumentIds(): void {
    this.cards = this.cards.filter(card =>
      this.mappedInstrumentIds.includes(card.instrumentId)
    );
    this.filteredCards = this.cards;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
