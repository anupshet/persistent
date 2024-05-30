// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { ChildNavigationEntity, NavigationEntity, TestNavigationEntity } from '../../../../contracts/models/connectivity-map/navigation-entity.model';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { MappingService } from '../mapping.service';
import { HeaderService } from '../../shared/header/header.service';

@Component({
  selector: 'unext-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit, OnDestroy {
  labId: string;
  entityId: string;
  entityType: EntityType;

  instrumentNav: NavigationEntity;
  productNav: NavigationEntity;
  testNav: TestNavigationEntity;

  productPanelExpansionState: boolean;
  testPanelExpansionState: boolean;

  entityTypeLabInstrument = EntityType.LabInstrument;
  entityTypeLabProduct = EntityType.LabProduct;
  entityTypeLabTest = EntityType.LabTest;

  @ViewChild('perfectscroll')
  ps: PerfectScrollbarComponent;

  private destroy$ = new Subject<boolean>();
  constructor(
    private connectivityMapService: MappingService,
    private router: Router,
    private location: Location,
    private _headerService: HeaderService,
  ) { }

  ngOnInit() {
    const url = window.location.toString();
    this.labId = /labs\/([^\/]+)/.exec(url) && /labs\/([^\/]+)/.exec(url).length > 0 ? /labs\/([^\/]+)/.exec(url)[1] : null;

    this.connectivityMapService.currentEntityId
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        entityId => {
          this.entityId = entityId;
        }
      );

    this.connectivityMapService.currentEntityType
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        entityType => {
          this.entityType = entityType;

          this.collapseUnforcusAccordion();
        }
      );

    this.connectivityMapService.currentEntityId.subscribe(entityId => {
      this.entityId = entityId;
    });

    this.connectivityMapService.currentInstrumentNavigation
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        instNav => {
          this.instrumentNav = instNav;
        }
      );

    this.connectivityMapService.currentProductNavigation
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        prodNav => {
          this.productNav = prodNav;
        }
      );

    this.connectivityMapService.currentTestNavigation
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        testNav => {
          this.testNav = testNav;
        }
      );

    this.productPanelExpansionState = false;
    this.testPanelExpansionState = false;
  }

  routeTo(entityType: string, entityId?: string) {
    this.connectivityMapService.clearSelectionStates();
    const labSegment = unRouting.connectivity.labs.replace(':id', this.labId);
    const prefix = `/${unRouting.connectivity.connectivity}/${labSegment}/${
      unRouting.connectivity.mapping
      }`;

    switch (entityId) {
      case undefined:
        if (entityType === 'instrument') {
          this.location.go(
            this.router.createUrlTree([`/${prefix}/${entityType}`]).toString()
          );
          this._headerService.setDialogComponentMapping('instrument');
        }
        break;
      case '-1':
        switch (entityType) {
          case 'product':
            if (this.productPanelExpansionState) {
              return;
            }
            if (this.productNav.children && this.productNav.children.length > 0) {
              entityId = this.productNav.children[0].entityId;
              this.connectivityMapService.updateEntityId(entityId);
              this.location.go(
                this.router.createUrlTree([`/${prefix}/${entityId}/${entityType}`]).toString()
              );
              this._headerService.setDialogComponentMapping('product');
            } else {
              this.location.go(
                this.router.createUrlTree([`/${prefix}/${entityType}`]).toString()
              );
              this.connectivityMapService.updateEntityId(null);
              this._headerService.setDialogComponentMapping('product');
            }
            break;
          case 'test':
            if (this.testPanelExpansionState) {
              return;
            }

            if (
              this.testNav.children !== undefined &&
              this.testNav.children.length > 0
            ) {
              entityId = this.testNav.children[0].entityId;
              this.connectivityMapService.updateEntityId(entityId);
              this.location.go(
                this.router.createUrlTree([`/${prefix}/${entityId}/${entityType}`]).toString()
              );
              this._headerService.setDialogComponentMapping('test');
            } else {
              this.location.go(
                this.router.createUrlTree([`/${prefix}/${entityType}`]).toString()
              );
              this._headerService.setDialogComponentMapping('test');
            }
            break;
          default:
            this.location.go(
              this.router.createUrlTree([`/${prefix}/${entityType}`]).toString()
            );
            break;
        }
        break;
      default:
        this.location.go(
          this.router.createUrlTree([`/${prefix}/${entityId}/${entityType}`]).toString()
        );
        this.connectivityMapService.updateEntityId(entityId);
        this._headerService.setDialogComponentMapping(entityType);
        break;
    }
  }

  hasFocus(navChild: ChildNavigationEntity, entityType: number): boolean {
    if (this.entityType === entityType && this.entityId === navChild.entityId) {
      return true;
    }
  }

  productHasUnmappedChip(navChild: ChildNavigationEntity): boolean {
    if (
      navChild.unmappedCount === 0 &&
      (this.entityType !== EntityType.LabProduct ||
        this.entityId !== navChild.entityId)
    ) {
      return true;
    }
  }

  testHasUnmappedChip(navChild: ChildNavigationEntity): boolean {
    if (
      navChild.unmappedCount === 0 &&
      (this.entityType !== EntityType.LabTest ||
        this.entityId !== navChild.entityId)
    ) {
      return true;
    }
  }

  collapseUnforcusAccordion() {
    switch (this.entityType) {
      case EntityType.LabInstrument:
        break;
      case EntityType.LabProduct:
        this.productPanelExpansionState = true;
        break;
      case EntityType.LabTest:
        this.testPanelExpansionState = true;
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
