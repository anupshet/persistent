// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { TranslateService, DefaultLangChangeEvent } from '@ngx-translate/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SortedListItem } from '../../../../../contracts/models/actionable-dashboard/actionableItem.model';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../../core/config/constants/error-logging.const';
import { ExpiredLots } from '../../../../../contracts/models/actionable-dashboard/expired-lots.model';
import { select } from '@ngrx/store';
import * as ngrxSelector from '@ngrx/store';
import * as fromRoot from './../../../../../state/app.state';
import * as navigationStateSelector from '../../../../../shared/navigation/state/selectors';


@Component({
  selector: 'unext-expiring-lots-list',
  templateUrl: './expiring-lots-list.component.html',
  styleUrls: ['./expiring-lots-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExpiringLotsListComponent implements OnInit, OnChanges {
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));

  constructor(
    private errorLoggerService: ErrorLoggerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private store: ngrxSelector.Store<fromRoot.State>,
  ) { }

  @Output() actionableItem = new EventEmitter<ExpiredLots>();
  @Input() expiredItems: Array<ExpiredLots> = [];

  multipleItems: string;
  selectedItem: ExpiredLots;

  sortedItemList: SortedListItem[] = [];
  sortedItemListExpired: SortedListItem[] = [];
  private destroy$ = new Subject<void>();

  ngOnChanges() {
    this.translate.onLangChange.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: DefaultLangChangeEvent) => {
      this.cdr.markForCheck();
    });
    this.getExpiringAndExpiredLotFilteredList();
    try {
      this.sortedItemList.sort((a, b) => (new Date(a.sortedExpirationDate).getTime() - new Date(b.sortedExpirationDate).getTime()));
      this.sortedItemListExpired.sort((a, b) => (new Date(a.sortedExpirationDate).getTime() - new Date(b.sortedExpirationDate).getTime()));
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.ExpiringLotsListComponent + blankSpace + Operations.Sorting));
    }
  }

  ngOnInit() {

    this.navigationGetLocale$
    .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
    .subscribe(() => {
      this.cdr.markForCheck();
    });

    this.translate.onLangChange.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: DefaultLangChangeEvent) => {
      this.cdr.markForCheck();
    });
    this.getExpiringAndExpiredLotFilteredList();
    try {
      this.sortedItemList.sort((a, b) => (new Date(a.sortedExpirationDate).getTime() - new Date(b.sortedExpirationDate).getTime()));
      this.sortedItemListExpired.sort((a, b) => (new Date(a.sortedExpirationDate).getTime() - new Date(b.sortedExpirationDate).getTime()));
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.ExpiringLotsListComponent + blankSpace + Operations.Sorting));
    }
  }

  getSortedExpiredItems(expiredItems: Array<ExpiredLots>) {
    expiredItems.sort((a, b) => (new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()));
    return expiredItems;
  }

  getSortedExpiredItemsByName(expiredItems: Array<ExpiredLots>) {
    expiredItems.sort((a, b) =>
      (a.productCustomName ? a.productCustomName : a.productName)
        .localeCompare(b.productCustomName ? b.productCustomName : b.productName)
    );
    return expiredItems;
  }

  getExpiringAndExpiredLotFilteredList() {
    try {
      this.sortedItemList = [];
      this.sortedItemListExpired = [];
      let dateRepeated: string = null;
      this.expiredItems = this.getSortedExpiredItems(this.expiredItems);
      this.expiredItems = this.getSortedExpiredItemsByName(this.expiredItems);
      this.expiredItems.forEach((item: ExpiredLots) => {
        dateRepeated = (item.expirationDate).toString();
        const itemIndex = this.sortedItemList
          .findIndex((i: SortedListItem) =>
            i.sortedExpirationDate === dateRepeated && !item.isExpired);
        const itemIndexExpired = this.sortedItemListExpired
          .findIndex((i: SortedListItem) =>
            i.sortedExpirationDate === dateRepeated && item.isExpired);

        // if same date update index to the same array
        if (itemIndex > -1) {
          const indexRepeatedLot = this.sortedItemList[itemIndex].sortedDisplayNameItemList.findIndex(element => {
            return element.productMasterLotId === item.productMasterLotId;
          });
          if (indexRepeatedLot > -1) {
            this.sortedItemList[itemIndex].sortedDisplayNameItemList[indexRepeatedLot].count += 1;
          } else {
            const itemData = {
              name: (item.productCustomName) ? item.productCustomName : item.productName,
              id: item.labProductId,
              productMasterLotId: item.productMasterLotId,
              count: 1
            };
            this.sortedItemList[itemIndex].sortedDisplayNameItemList.push(itemData);
          }
          return;
        }

        if (itemIndexExpired > -1) {
          const indexRepeatedLot = this.sortedItemListExpired[itemIndexExpired].sortedDisplayNameItemList.findIndex(element => {
            return element.productMasterLotId === item.productMasterLotId;
          });
          if (indexRepeatedLot > -1) {
            this.sortedItemListExpired[itemIndexExpired].sortedDisplayNameItemList[indexRepeatedLot].count += 1;
          } else {
            const itemData = {
              name: (item.productCustomName) ? item.productCustomName : item.productName,
              id: item.labProductId,
              productMasterLotId: item.productMasterLotId,
              count: 1
            };
            this.sortedItemListExpired[itemIndexExpired].sortedDisplayNameItemList.push(itemData);
          }
          return;
        }

        // If date is not matching then push to the same array
        if (!item.isExpired) {
          this.sortedItemList.push({
            sortedExpirationDate: dateRepeated,
            sortedDisplayNameItemList: [{
              name: (item.productCustomName) ? item.productCustomName : item.productName,
              id: item.labProductId,
              productMasterLotId: item.productMasterLotId,
              count: 1
            }]
          });
        } else {
          this.sortedItemListExpired.push({
            sortedExpirationDate: dateRepeated,
            sortedDisplayNameItemList: [{
              name: (item.productCustomName) ? item.productCustomName : item.productName,
              id: item.labProductId,
              productMasterLotId: item.productMasterLotId,
              count: 1
            }]
          });
        }
      });
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.ExpiringLotsListComponent + blankSpace + Operations.GetExpiringAndExpiredLotFilteredList));
    }
  }

  getLotinfofromLotlist(id: string): void {
    const index = this.expiredItems.findIndex(
      item => item.labProductId === id);

    if (index > -1) {
      this.selectedItem = this.expiredItems[index];
      this.actionableItem.emit(this.selectedItem);
    }
  }

  isExpiringTodayorTomorrow(sortedExpirationDate: string): boolean {
    const sortedExpirationDateConversion = new Date(sortedExpirationDate),
      differenceInDate = (((new Date()).getTime() - sortedExpirationDateConversion.getTime()) / 1000),
      dayDifference = Math.floor(differenceInDate / 86400);
    return dayDifference === 0 || dayDifference === -1;
  }
}
