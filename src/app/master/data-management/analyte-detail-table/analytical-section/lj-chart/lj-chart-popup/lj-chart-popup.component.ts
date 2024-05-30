import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as ngrxStore from '@ngrx/store';

import { Subscription, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Level } from '../../../../../../contracts/models/data-management/runs-result.model';
import { unsubscribe } from '../../../../../../core/helpers/rxjs-helper';
import { LJChartConfig } from '../lj-chart.config';
import { LjChartPopupService } from './lj-chart-popup.service';
import * as fromRoot from '../../../../../../state/app.state';
import * as fromDataManagement from '../../../../state/selectors';
import { ErrorLoggerService } from '../../../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-lj-chart-popup',
  templateUrl: './lj-chart-popup.component.html',
  styleUrls: ['./lj-chart-popup.component.scss']
})
export class LjChartPopupComponent implements OnInit, OnDestroy {
  @ViewChild('popup')
  el: ElementRef;
  timer: any;
  dataPoint: Level;
  levelIndex: number;
  public decimalLevels: Array<number>;

  private ljChartSubscription: Subscription;
  private destroy$ = new Subject<boolean>();

  constructor(
    private ljChartPopupService: LjChartPopupService,
    private store: ngrxStore.Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService
  ) { }

  ngOnInit() {
    this.store.pipe(ngrxStore.select(fromDataManagement.getDataManagementState))
      .pipe(filter(dataManagementState => !!dataManagementState && dataManagementState.cumulativeAnalyteInfo.length > 0),
        takeUntil(this.destroy$))
      .subscribe(dataManagementState => {
        try {
          if (dataManagementState.dataPointPopup) {
            this.dataPoint = dataManagementState.dataPointPopup;
          }
          this.decimalLevels = dataManagementState.cumulativeAnalyteInfo[0].decimalPlaces;
          if (this.dataPoint) {
            this.levelIndex = dataManagementState.cumulativeAnalyteInfo[0].levelsInUse.findIndex(
              lv => lv === this.dataPoint.level
            );
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.LjChartPopupComponent + blankSpace + Operations.FetchDataManagement)));
        }
      });

    this.ljChartSubscription = this.ljChartPopupService
      .getCoordinates()
      .subscribe(coordinates => {
        try {
          if (!coordinates) {
            this.timer = setTimeout(() => {
              this.hide();
            }, 200);
          } else {

            const height = this.el.nativeElement.offsetHeight;
            let left = Math.round(coordinates.x);
            let top = (coordinates.score <= 1.2) ? Math.round(coordinates.y) - height : Math.round(coordinates.y) + 25;

            if (coordinates.score >= 3) {
              top = 25;
            }

            if (left > LJChartConfig.width - 150) {
              left = LJChartConfig.width - 200;
            } else if (left < 150) {
              left = 10;
            } else {
              left = left - 105;
            }

            const str = 'top:' + top + 'px;left:' + left + 'px;display:block;';
            this.el.nativeElement.setAttribute('style', str);
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.LjChartPopupComponent + blankSpace + Operations.FetchCoordinates)));
        }
      });
  }

  hide(): void {
    this.el.nativeElement.setAttribute(
      'style',
      'top:' + -1000 + 'px;left:' + -1000 + 'px;'
    );
  }

  ngOnDestroy() {
    unsubscribe(this.ljChartSubscription);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
