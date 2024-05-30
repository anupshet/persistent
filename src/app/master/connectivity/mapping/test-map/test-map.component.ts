// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { combineLatest as observableCombineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { orderBy, uniqBy } from 'lodash';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { MappingService } from '../mapping.service';
import { EntityMapComponent } from '../shared/entity-map/entity-map.component';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { HeaderService } from '../../shared/header/header.service';
import { code } from '../../../../core/config/constants/general.const';
import { ReagentCalibratorDialogService } from './reagent-calibrator-dialog/reagent-calibrator-dialog.service';
import { LabConfigurationApiService } from '../../../../shared/services/lab-configuration.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';

@Component({
  selector: 'unext-test-map',
  templateUrl: '../shared/entity-map/entity-map.component.html',
  styleUrls: ['../shared/entity-map/entity-map.component.scss']
})
export class TestMapComponent extends EntityMapComponent implements OnInit, OnDestroy, AfterViewInit {
  mappedProductIds: Array<string>;

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
            this.setupSingleTestScreen();
          }
        });

    this.entityType = EntityType.LabTest;
    this.connectivityMapService.updateEntityType(this.entityType);

    this.isAllProductsScreen = false;
    this.isAllTestsScreen = false;

    super.ngOnInit();
  }

  ngAfterViewInit() {
    observableCombineLatest(
      this.connectivityMapService.currentTestCards,
      this.connectivityMapService.currentMappedProductIds
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        this.prepareTestCards
      );
  }

  private prepareTestCards = data => {
    this.cards = data[0];
    this.cards.forEach(card => {
      card.codes = uniqBy(card.codes, code);
    });
    this.filteredCards = this.cards;
    this.mappedProductIds = data[1];
    if (this.cards != null && this.mappedProductIds != null) {
      this.setupTestsScreen();
    }
  }

  private setupTestsScreen(): void {
    this.entityId == null
      ? this.setupAllTestsScreen()
      : this.setupSingleTestScreen();
  }

  private setupAllTestsScreen(): void {
    this.isAllTestsScreen = true;
    this.filterTestCardsByMappedProductIds();
  }

  private setupSingleTestScreen(): void {
    this.isAllTestsScreen = false;
    this.filterTestCardsByEntityId(this.entityId);
    this.dropdownComponent.populateDropdownSelectionsByProductId(this.entityId);
  }

  private filterTestCardsByEntityId(entityId: string): void {
    this.filteredCards = this.cards.filter(
      card => card.productId === this.entityId
    );
    this.filteredCards = orderBy(this.filteredCards, [el => el.analyteName.replace(/\s/g, '').toLocaleLowerCase()], ['asc']);
  }

  private filterTestCardsByMappedProductIds(): void {
    this.cards = this.cards.filter(card =>
      this.mappedProductIds.includes(card.productId)
    );
    this.filteredCards = this.cards;
    this.filteredCards = orderBy(this.filteredCards, [el => el.analyteName.replace(/\s/g, '').toLocaleLowerCase()], ['asc']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
