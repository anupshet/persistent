//  © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { takeUntil, filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';

import * as fromRoot from '../../../../state/app.state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import * as fromConnectivity from '../../state';
import { ImportStatus, StatusPage, StatusesPaginationRequest } from '../../shared/models/connectivity-status.model';
import { CheckForTloaderService } from '../../../../shared/services/check-for-tloader.service';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { paginationItemsPerPage, paginationStatus } from '../../../../core/config/constants/general.const';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';

@Component({
  selector: 'unext-connectivity-status',
  templateUrl: './connectivity-status.component.html',
  styleUrls: ['./connectivity-status.component.scss']
})
export class ConnectivityStatusComponent implements OnInit, OnDestroy {
  public statusList: Array<ImportStatus>;
  public labTimeZone: string;
  readonly maxSize = 5;
  totalPages: Number;
  paginationConfig: PaginationInstance = {
    id: paginationStatus,
    itemsPerPage: paginationItemsPerPage,
    currentPage: 1,
    totalItems: 1,
  };
  statusesPaginationRequest: StatusesPaginationRequest = {
    locationId: '',
    pageIndex: 1,
    pageSize: paginationItemsPerPage
  };
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.arrowBack[48],
    icons.arrowBack[24]
  ];
  protected destroy$ = new Subject<boolean>();
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));

  constructor(
    protected store: Store<fromRoot.State>,
    private subStore: Store<fromConnectivity.ConnectivityStates>,
    private orchestratorApiService: OrchestratorApiService,
    public checkForTloaderService: CheckForTloaderService,
    private iconService: IconService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.checkForTloaderService.tloaderSubject.next(true);

    this.getCurrentLabLocation$.pipe(filter(labLocation => !!labLocation),
    takeUntil(this.destroy$)).subscribe(labLocation => {
      if (labLocation) {
        this.paginationConfig.currentPage = 1;
        this.statusesPaginationRequest.locationId = labLocation.id;
        this.labTimeZone = labLocation.locationTimeZone;
      }
    });

    this.loadStatusesWithPagination(this.statusesPaginationRequest);
  }

  refreshStatuses() {
    this.loadStatusesWithPagination(this.statusesPaginationRequest);
  }

  loadStatusesWithPagination(statusesPaginationRequest: StatusesPaginationRequest) {
    this.totalPages = 0;
    this.orchestratorApiService.getStatusPages(statusesPaginationRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe((statuses: StatusPage) => {
        this.statusList = statuses.statuses;
        this.totalPages = statuses.totalPages;
        this.paginationConfig.totalItems = statuses.totalItems;
      });
  }

  onStatusPageChange(pageIndex: number) {
    this.paginationConfig.currentPage = pageIndex;
    this.statusesPaginationRequest.pageIndex = pageIndex;
    this.loadStatusesWithPagination(this.statusesPaginationRequest);
  }

  ngOnDestroy(): void {
    this.checkForTloaderService.tloaderSubject.next(false);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
