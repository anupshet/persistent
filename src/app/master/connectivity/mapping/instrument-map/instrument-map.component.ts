// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { orderBy } from 'lodash';

import { MappingService } from '../mapping.service';
import { EntityMapComponent } from '../shared/entity-map/entity-map.component';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { HeaderService } from '../../shared/header/header.service';
import { ReagentCalibratorDialogService } from '../test-map/reagent-calibrator-dialog/reagent-calibrator-dialog.service';
import { LabConfigurationApiService } from '../../../../shared/services/lab-configuration.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';

@Component({
  selector: 'unext-instrument-map',
  templateUrl: '../shared/entity-map/entity-map.component.html',
  styleUrls: ['../shared/entity-map/entity-map.component.scss']
})
export class InstrumentMapComponent extends EntityMapComponent
  implements OnInit, OnDestroy {

  constructor(
    public connectivityMapService: MappingService,
    public router: Router,
    public route: ActivatedRoute,
    public messageSnackBar: MessageSnackBarService,
    public _headerService: HeaderService,
    public location: Location,
    public reagentCalibratorDialogService: ReagentCalibratorDialogService,
    public reagentCalibratorDialog: MatDialog,
    public brPermissionsService: BrPermissionsService,
    public labConfigurationApiService: LabConfigurationApiService,
    public translate: TranslateService
  ) {
    super(connectivityMapService, router, messageSnackBar, _headerService,
      location, reagentCalibratorDialogService, reagentCalibratorDialog, brPermissionsService, labConfigurationApiService, translate);
  }

  ngOnInit(): void {
    const url = window.location.toString();
    const urlSegment = /labs\/([^\/]+)/.exec(url)[1];
    this.labId = urlSegment;

    this.connectivityMapService.currentInstrumentCards
      .pipe(takeUntil(this.destroy$))
      .subscribe(instCards => {
        this.cards = instCards;
        this.filteredCards = instCards;
        this.filteredCards = orderBy(this.cards, [el => el.instrumentModelName.replace(/\s/g, '').toLocaleLowerCase()], ['asc']);
        if (this.filterData) {
          this.filterCardsByDropdown(this.filterData);
        }
      });

    this.entityType = EntityType.LabInstrument;
    this.connectivityMapService.updateEntityType(this.entityType);
    this.connectivityMapService.updateEntityId(null);

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
